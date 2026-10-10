import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fs from "fs";
import axios from "axios";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { verifyUserSuppliedEvidence } from "./assetshakti/phase1/user-evidence-verification.js";

// Production must never generate ephemeral auth keys or silently use local-only evidence storage.
const IS_PRODUCTION = process.env.NODE_ENV === "production";
if (IS_PRODUCTION) {
  const required = ["JWT_PRIVATE_KEY", "JWT_PUBLIC_KEY", "MONGO_URI", "ASSETSHAKTI_EVIDENCE_DIR"];
  const missing = required.filter(name => !process.env[name]);
  if (missing.length) throw new Error(`Production startup blocked; missing required environment variables: ${missing.join(", ")}`);
  if (process.env.ASSETSHAKTI_EVIDENCE_STORAGE_MODE !== "persistent-volume" || process.env.ASSETSHAKTI_EVIDENCE_STORAGE_CONFIRMED !== "true") {
    throw new Error("Production startup blocked; configure and verify a durable persistent evidence volume before enabling evidence intake.");
  }
  if (!path.isAbsolute(process.env.ASSETSHAKTI_EVIDENCE_DIR || "")) {
    throw new Error("Production startup blocked; ASSETSHAKTI_EVIDENCE_DIR must be an absolute path on the verified persistent volume.");
  }
}

if (!IS_PRODUCTION && (!fs.existsSync("./private.pem") || !fs.existsSync("./public.pem"))) {
  console.log("Generating RSA keys...");
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });
  fs.writeFileSync("./public.pem", publicKey);
  fs.writeFileSync("./private.pem", privateKey);
  console.log("Keys generated successfully.");
}

const app = express();
app.use(express.json({ limit: "15mb" }));

const PORT = parseInt(process.env.PORT || "3000", 10);
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/allianceventures";
const INTERNAL_TOKEN = process.env.INTERNAL_SERVICE_TOKEN;

const VK_URL = process.env.VK_URL;
const RK_URL = process.env.RK_URL;
const AK_URL = process.env.AK_URL;

// ------------------- KEYS -------------------

const privateKey = IS_PRODUCTION
  ? Buffer.from((process.env.JWT_PRIVATE_KEY || "").split(String.fromCharCode(92) + "n").join(String.fromCharCode(10)))
  : fs.readFileSync("./private.pem");
const publicKey = IS_PRODUCTION
  ? Buffer.from((process.env.JWT_PUBLIC_KEY || "").split(String.fromCharCode(92) + "n").join(String.fromCharCode(10)))
  : fs.readFileSync("./public.pem");

// ------------------- DATABASE -------------------

if (process.env.MONGO_URI) {
  mongoose.connect(MONGO_URI).catch(err => console.error("MongoDB connection error:", err));
} else {
  console.warn("MONGO_URI not provided. Skipping MongoDB connection for demo purposes.");
}

const User = mongoose.model("User", new mongoose.Schema({
  email: String,
  password: String,
  role: String
}));

// ------------------- AUTH -------------------

function auth(roles: string[] = []) {
  return (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.redirect("/login");

    try {
      const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] }) as any;
      if (roles.length && !roles.includes(decoded.role))
        return res.status(403).send("Forbidden");
      req.user = decoded;
      next();
    } catch {
      res.redirect("/login");
    }
  }
}

app.get("/init-admin", async (req, res) => {
  if (!process.env.MONGO_URI) return res.send("MongoDB not configured. Set MONGO_URI.");
  const exists = await User.findOne({ email: "admin@allianceventures.com" });
  if (exists) return res.send("Admin Exists");

  const hash = await bcrypt.hash("Admin@123", 10);
  await User.create({
    email: "admin@allianceventures.com",
    password: hash,
    role: "admin"
  });
  res.send("Admin Created");
});

app.post("/login", async (req, res) => {
  if (!process.env.MONGO_URI) {
    // Mock login for demo if no DB
    const token = jwt.sign({
      sub: "mock_id",
      role: "admin",
      iss: "ALLIANCEVENTURES"
    }, privateKey, {
      algorithm: "RS256",
      expiresIn: "2h"
    });

    return res.send(`
      <script>
        localStorage.setItem("token","${token}");
        window.location="/investor";
      </script>
    `);
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.send("Invalid credentials. <a href='/login' style='color:white'>Try again</a>");

  const match = await bcrypt.compare(password, user.password!);
  if (!match) return res.send("Invalid credentials. <a href='/login' style='color:white'>Try again</a>");

  const token = jwt.sign({
    sub: user._id,
    role: user.role,
    iss: "ALLIANCEVENTURES"
  }, privateKey, {
    algorithm: "RS256",
    expiresIn: "2h"
  });

  res.send(`
    <script>
      localStorage.setItem("token","${token}");
      window.location="/investor";
    </script>
  `);
});

// ------------------- ASSETSHAKTI USER EVIDENCE INTAKE -------------------

const ASSETSHAKTI_EVIDENCE_DIR = process.env.ASSETSHAKTI_EVIDENCE_DIR || "./data/assetshakti/evidence";

app.post("/api/assetshakti/evidence-intake", auth(), (req, res) => {
  try {
    const { caseId, documentType, auctionRound, sourceReference, observedAt, fileName, contentType, contentBase64 } = req.body || {};
    if (!caseId || !documentType || !auctionRound || !sourceReference || !observedAt || !fileName || !contentBase64) {
      return res.status(400).json({ error: "caseId, documentType, auctionRound, sourceReference, observedAt and PDF are required." });
    }
    if (contentType !== "application/pdf" && !String(fileName).toLowerCase().endsWith(".pdf")) {
      return res.status(415).json({ error: "Only PDF evidence is accepted." });
    }
    if (typeof contentBase64 !== "string" || contentBase64.length > 14 * 1024 * 1024) {
      return res.status(413).json({ error: "Evidence file exceeds the configured intake limit." });
    }
    const buffer = Buffer.from(contentBase64, "base64");
    if (buffer.length === 0 || buffer.length > 10 * 1024 * 1024) {
      return res.status(413).json({ error: "Evidence file exceeds the 10 MB limit." });
    }
    if (buffer.subarray(0, 4).toString() !== "%PDF") {
      return res.status(400).json({ error: "Uploaded content is not a valid PDF." });
    }

    fs.mkdirSync(ASSETSHAKTI_EVIDENCE_DIR, { recursive: true });
    const contentSha256 = crypto.createHash("sha256").update(buffer).digest("hex");
    const safeCase = String(caseId).replace(/[^a-zA-Z0-9_-]/g, "_");
    const safeHash = contentSha256.slice(0, 16);
    const storedFile = path.join(ASSETSHAKTI_EVIDENCE_DIR, safeCase + "-" + safeHash + ".pdf");
    fs.writeFileSync(storedFile, buffer, { flag: "wx" });

    const intake = {
      intakeId: "ASI-" + Date.now() + "-" + safeHash,
      caseId,
      documentType,
      auctionRound,
      sourceReference,
      observedAt,
      fileName: String(fileName).replace(/[^a-zA-Z0-9._-]/g, "_"),
      contentSha256,
      uploadedAt: new Date().toISOString(),
      uploaderId: (req as any).user?.sub || "unknown",
      provenanceStatus: "USER_SUPPLIED_PENDING_VERIFICATION",
      storedFile
    };
    const metaPath = storedFile.replace(/\.pdf$/, ".json");
    fs.writeFileSync(metaPath, JSON.stringify(intake, null, 2), { flag: "wx" });

    return res.status(201).json({
      intakeId: intake.intakeId,
      provenanceStatus: intake.provenanceStatus,
      contentSha256,
      message: "Evidence accepted for verification. It cannot satisfy G16 until verified."
    });
  } catch (err: any) {
    if (err?.code === "EEXIST") return res.status(409).json({ error: "This document has already been uploaded for this case." });
    console.error("AssetShakti evidence intake error:", err);
    return res.status(500).json({ error: "Evidence intake failed." });
  }
});

// ------------------- ASSETSHAKTI USER EVIDENCE VERIFICATION -------------------

app.post("/api/assetshakti/evidence-intake/verify", auth(["admin", "evidence_verifier"]), (req, res) => {
  try {
    const { intakeId, documentIdentityConfirmed, authoritativeSourceConfirmed, applicableRoundConfirmed, currentOrSupersededStatusConfirmed, corrigendaConsistencyConfirmed, hashIntegrityConfirmed, materialAssertionsHavePageReferences, verifierNote } = req.body || {};
    if (!intakeId) return res.status(400).json({ error: "intakeId is required." });

    const files = fs.existsSync(ASSETSHAKTI_EVIDENCE_DIR) ? fs.readdirSync(ASSETSHAKTI_EVIDENCE_DIR) : [];

    let intake: any = null;
    for (const name of files.filter(n => n.endsWith(".json") && !n.endsWith(".verification.json"))) {
      try {
        const candidate = JSON.parse(fs.readFileSync(path.join(ASSETSHAKTI_EVIDENCE_DIR, name), "utf8"));
        if (candidate.intakeId === intakeId) { intake = candidate; break; }
      } catch { /* ignore unrelated/corrupt metadata; audit failure is handled below */ }
    }
    if (!intake) return res.status(404).json({ error: "Evidence intake not found." });
    if (intake.provenanceStatus !== "USER_SUPPLIED_PENDING_VERIFICATION") {
      return res.status(409).json({ error: "Evidence is not pending verification." });
    }
    if (!intake.storedFile || !fs.existsSync(intake.storedFile)) {
      return res.status(409).json({ error: "Stored evidence file is missing." });
    }
    const storedBuffer = fs.readFileSync(intake.storedFile);
    const storedHash = crypto.createHash("sha256").update(storedBuffer).digest("hex");
    if (storedHash !== intake.contentSha256) {
      return res.status(409).json({ error: "Stored evidence hash does not match intake metadata." });
    }

    const result = verifyUserSuppliedEvidence({
      documentIdentityConfirmed: documentIdentityConfirmed === true,
      authoritativeSourceConfirmed: authoritativeSourceConfirmed === true,
      applicableRoundConfirmed: applicableRoundConfirmed === true,
      currentOrSupersededStatusConfirmed: currentOrSupersededStatusConfirmed === true,
      corrigendaConsistencyConfirmed: corrigendaConsistencyConfirmed === true,
      hashIntegrityConfirmed: storedHash === intake.contentSha256 && hashIntegrityConfirmed === true,
      materialAssertionsHavePageReferences: materialAssertionsHavePageReferences === true,
      verifierNote: typeof verifierNote === "string" ? verifierNote : "",
    });

    const verifierId = (req as any).user?.sub || "unknown";
    const updated = {
      ...intake,
      provenanceStatus: result.outcome,
      verifiedAt: new Date().toISOString(),
      verifierId,
      verificationReasons: result.reasons,
      verificationChecks: {
        documentIdentityConfirmed: documentIdentityConfirmed === true,
        authoritativeSourceConfirmed: authoritativeSourceConfirmed === true,
        applicableRoundConfirmed: applicableRoundConfirmed === true,
        currentOrSupersededStatusConfirmed: currentOrSupersededStatusConfirmed === true,
        corrigendaConsistencyConfirmed: corrigendaConsistencyConfirmed === true,
        hashIntegrityConfirmed: storedHash === intake.contentSha256 && hashIntegrityConfirmed === true,
        materialAssertionsHavePageReferences: materialAssertionsHavePageReferences === true,
      },
      verificationNotes: verifierNote || "",
    };
    const metadataPath = intake.storedFile.replace(/\\.pdf$/, ".json");
    const verificationAuditPath = metadataPath.replace(/\\.json$/, ".verification.json");
    const tmpMetadataPath = metadataPath + ".tmp";
    fs.writeFileSync(tmpMetadataPath, JSON.stringify(updated, null, 2), { flag: "wx" });
    fs.renameSync(tmpMetadataPath, metadataPath);
    fs.writeFileSync(verificationAuditPath, JSON.stringify(updated, null, 2), { flag: "wx" });

    return res.status(result.outcome === "VERIFIED" ? 200 : 422).json({
      intakeId,
      provenanceStatus: result.outcome,
      reasons: result.reasons,
      message: result.outcome === "VERIFIED"
        ? "Evidence verified. Reconciliation and decision evaluation must still run before any critical gate is satisfied."
        : "Evidence remains rejected and cannot satisfy a critical gate.",
    });
  } catch (err: any) {
    if (err?.code === "EEXIST") return res.status(409).json({ error: "Verification record already exists for this intake." });
    console.error("AssetShakti evidence verification error:", err);
    return res.status(500).json({ error: "Evidence verification failed." });
  }
});

// Admin verification endpoint: upload never promotes evidence; this endpoint performs the explicit verification gate.
app.post("/api/assetshakti/evidence-intake/:intakeId/verify", auth(["admin"]), (req, res) => {
  try {
    const { intakeId } = req.params;
    const directoryEntries = fs.existsSync(ASSETSHAKTI_EVIDENCE_DIR)
      ? fs.readdirSync(ASSETSHAKTI_EVIDENCE_DIR)
      : [];
    let intake: any = null;
    for (const name of directoryEntries.filter(name => name.endsWith(".json") && !name.endsWith(".verification.json"))) {
      try {
        const candidate = JSON.parse(fs.readFileSync(path.join(ASSETSHAKTI_EVIDENCE_DIR, name), "utf8"));
        if (candidate.intakeId === intakeId) {
          intake = candidate;
          break;
        }
      } catch {
        // Ignore malformed sidecars; they are not accepted as evidence.
      }
    }
    if (!intake) return res.status(404).json({ error: "Evidence intake not found." });
    if (intake.provenanceStatus !== "USER_SUPPLIED_PENDING_VERIFICATION") {
      return res.status(409).json({ error: "Evidence is not pending verification." });
    }

    const storedBuffer = fs.readFileSync(intake.storedFile);
    const storedHash = crypto.createHash("sha256").update(storedBuffer).digest("hex");
    if (storedHash !== intake.contentSha256) {
      return res.status(409).json({ error: "Stored evidence hash does not match intake metadata." });
    }
    const body = req.body || {};
    const verification = verifyUserSuppliedEvidence({
      documentIdentityConfirmed: body.documentIdentityConfirmed === true,
      authoritativeSourceConfirmed: body.authoritativeSourceConfirmed === true,
      applicableRoundConfirmed: body.applicableRoundConfirmed === true,
      currentOrSupersededStatusConfirmed: body.currentOrSupersededStatusConfirmed === true,
      corrigendaConsistencyConfirmed: body.corrigendaConsistencyConfirmed === true,
      hashIntegrityConfirmed: storedHash === intake.contentSha256 && body.hashIntegrityConfirmed === true,
      materialAssertionsHavePageReferences: body.materialAssertionsHavePageReferences === true,
      verifierNote: typeof body.verifierNote === "string" ? body.verifierNote : "",
    });
    if (body.contentSha256 && body.contentSha256 !== storedHash) {
      return res.status(409).json({ error: "Verification hash does not match stored evidence." });
    }

    const updated = {
      ...intake,
      provenanceStatus: verification.outcome,
      verification: {
        verifiedAt: new Date().toISOString(),
        verifier: "authenticated-verifier",
        auctionRound: intake.auctionRound,
        sourceReference: intake.sourceReference,
        reasons: verification.reasons,
        contentSha256: storedHash
      }
    };
    const metaPath = intake.storedFile.replace(/\.pdf$/, ".json");
    const tmpPath = metaPath + ".tmp";
    fs.writeFileSync(tmpPath, JSON.stringify(updated, null, 2), { flag: "wx" });
    fs.renameSync(tmpPath, metaPath);

    return res.status(verification.outcome === "VERIFIED" ? 200 : 422).json({
      intakeId,
      provenanceStatus: verification.outcome,
      reasons: verification.reasons,
      message: verification.outcome === "VERIFIED"
        ? "Evidence verified. Decision gates may be re-evaluated against this exact source/version."
        : "Evidence rejected. Critical gates remain fail-closed."
    });
  } catch (err) {
    console.error("AssetShakti evidence verification error:", err);
    return res.status(500).json({ error: "Evidence verification failed." });
  }
});

// ------------------- LIVE ANALYTICS CONNECTOR -------------------

async function fetchMetrics() {
  const headers = { "x-service-token": INTERNAL_TOKEN };

  try {
    const [vk, rk, ak] = await Promise.all([
      VK_URL ? axios.get(VK_URL + "/internal/metrics", { headers }) : { data: { totalRevenue: 1500000, totalUsers: 1200 } },
      RK_URL ? axios.get(RK_URL + "/internal/metrics", { headers }) : { data: { totalRevenue: 850000, totalUsers: 4500 } },
      AK_URL ? axios.get(AK_URL + "/internal/metrics", { headers }) : { data: { totalRevenue: 2100000, totalUsers: 850 } }
    ]);

    return {
      vyaparkendra: vk.data,
      rupaykg: rk.data,
      ayushkendra: ak.data
    };
  } catch (err) {
    console.error("Error fetching metrics:", err);
    // Fallback mock data
    return {
      vyaparkendra: { totalRevenue: 1500000, totalUsers: 1200 },
      rupaykg: { totalRevenue: 850000, totalUsers: 4500 },
      ayushkendra: { totalRevenue: 2100000, totalUsers: 850 }
    };
  }
}

// ------------------- INVESTOR DASHBOARD -------------------

app.get("/investor", async (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html>
  <head>
    <title>ALLIANCEVENTURES Investor Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
      body{font-family:'Inter', system-ui, sans-serif;background:#050505;color:white;padding:40px;margin:0;}
      .header{display:flex;justify-content:space-between;align-items:center;margin-bottom:40px;max-width:1200px;margin-left:auto;margin-right:auto;}
      .header h1{margin:0;font-size:24px;font-weight:600;letter-spacing:-0.5px;}
      .logout-btn{background:#222;color:white;border:1px solid #333;padding:8px 16px;border-radius:6px;cursor:pointer;text-decoration:none;font-size:14px;transition:background 0.2s;}
      .logout-btn:hover{background:#333;}
      .container{max-width:1200px;margin:0 auto;}
      .card{background:#111;padding:24px;border:1px solid #222;border-radius:12px;}
      .card h3{margin-top:0;color:#888;font-size:14px;text-transform:uppercase;letter-spacing:1px;}
      .card .value{font-size:32px;font-weight:600;margin:10px 0 0 0;}
      .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;margin-bottom:40px;}
      .chart-container{background:#111;padding:24px;border:1px solid #222;border-radius:12px;margin-bottom:40px;}
      .models-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;}
      .model-card{background:#111;padding:24px;border:1px solid #222;border-radius:12px;}
      .model-card h3{margin-top:0;font-size:18px;margin-bottom:12px;}
      .model-card p{color:#888;margin:0;line-height:1.5;}
    </style>
  </head>
  <body>

  <div class="header">
    <h1>ALLIANCEVENTURES – Investor Dashboard</h1>
    <a href="#" onclick="logout()" class="logout-btn">Logout</a>
  </div>

  <div class="container">
    <div id="kpi" class="grid"></div>

    <div class="chart-container">
      <h2 style="margin-top:0;margin-bottom:20px;font-size:18px;">Revenue Growth</h2>
      <canvas id="revenueChart" height="80"></canvas>
    </div>

    <h2 style="font-size:18px;margin-bottom:20px;">Monetization Models</h2>
    <div class="models-grid">
      <div class="model-card">
        <h3>VyaparKendra</h3>
        <p>SaaS Subscription + Credit API Fees</p>
      </div>
      <div class="model-card">
        <h3>RupayKg</h3>
        <p>Carbon Credit Fees + CSR Rail + EPR Revenue</p>
      </div>
      <div class="model-card">
        <h3>AyushKendra</h3>
        <p>Marketplace Commission + Vendor SaaS</p>
      </div>
    </div>
  </div>

  <script>
    function logout() {
      localStorage.removeItem("token");
      window.location = "/login";
    }

    const token = localStorage.getItem("token");
    if (!token) window.location = "/login";

    fetch("/analytics",{
      headers:{ Authorization:"Bearer "+token }
    })
    .then(res=>res.json())
    .then(data=>{
      if (data.error) {
        logout();
        return;
      }

      const container=document.getElementById("kpi");

      const totalRevenue =
        (data.vyaparkendra.totalRevenue || 0) +
        (data.rupaykg.totalRevenue || 0) +
        (data.ayushkendra.totalRevenue || 0);

      container.innerHTML += 
        '<div class="card"><h3>Total Revenue</h3><div class="value">₹'+totalRevenue.toLocaleString()+'</div></div>';

      container.innerHTML += 
        '<div class="card"><h3>MSMEs</h3><div class="value">'+(data.vyaparkendra.totalUsers || 0).toLocaleString()+'</div></div>';

      container.innerHTML += 
        '<div class="card"><h3>Carbon Credits</h3><div class="value">'+(data.rupaykg.totalUsers || 0).toLocaleString()+'</div></div>';

      container.innerHTML += 
        '<div class="card"><h3>Healthcare Orders</h3><div class="value">'+(data.ayushkendra.totalUsers || 0).toLocaleString()+'</div></div>';

      const ctx=document.getElementById("revenueChart");

      new Chart(ctx,{
        type:"bar",
        data:{
          labels:["VyaparKendra","RupayKg","AyushKendra"],
          datasets:[{
            label:"Revenue (₹)",
            data:[
              data.vyaparkendra.totalRevenue,
              data.rupaykg.totalRevenue,
              data.ayushkendra.totalRevenue
            ],
            backgroundColor:["#3b82f6", "#10b981", "#f43f5e"],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: '#222' },
              ticks: { color: '#888' }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#888' }
            }
          }
        }
      });
    })
    .catch(() => {
      logout();
    });
  </script>

  </body>
  </html>
  `);
});

// ------------------- ANALYTICS API -------------------

app.get("/analytics", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    jwt.verify(token, publicKey, { algorithms: ["RS256"] });
    const data = await fetchMetrics();
    res.json(data);
  } catch {
    res.status(401).json({ error: "Invalid" });
  }
});

// ------------------- LOGIN PAGE -------------------

app.get("/login", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html>
  <head>
    <title>ALLIANCEVENTURES Login</title>
    <style>
      body{font-family:Arial;background:#050505;color:white;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;}
      .login-box{background:#111;padding:40px;border-radius:12px;border:1px solid #333;width:100%;max-width:400px;text-align:center;}
      input{width:100%;padding:12px;margin:10px 0;border-radius:6px;border:1px solid #444;background:#222;color:white;box-sizing:border-box;}
      button{width:100%;padding:12px;background:white;color:black;border:none;border-radius:6px;font-weight:bold;cursor:pointer;margin-top:10px;}
      button:hover{background:#eee;}
    </style>
  </head>
  <body>
    <div class="login-box">
      <h2>ALLIANCEVENTURES</h2>
      <p style="color:#888;margin-bottom:20px;">Investor Portal Login</p>
      <form method="POST" action="/login">
        <input name="email" placeholder="Email" required/>
        <input name="password" type="password" placeholder="Password" required/>
        <button type="submit">Login</button>
      </form>
    </div>
  </body>
  </html>
  `);
});

// ------------------- VITE MIDDLEWARE -------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log("ALLIANCEVENTURES Seed Demo Running on http://localhost:" + PORT);
  });
}

startServer();

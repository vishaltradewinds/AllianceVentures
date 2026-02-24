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

// Generate keys if they don't exist
if (!fs.existsSync("./private.pem") || !fs.existsSync("./public.pem")) {
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
app.use(express.json());

const PORT = parseInt(process.env.PORT || "3000", 10);
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/allianceventures";
const INTERNAL_TOKEN = process.env.INTERNAL_SERVICE_TOKEN;

const VK_URL = process.env.VK_URL;
const RK_URL = process.env.RK_URL;
const AK_URL = process.env.AK_URL;

// ------------------- KEYS -------------------

const privateKey = fs.readFileSync("./private.pem");
const publicKey = fs.readFileSync("./public.pem");

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

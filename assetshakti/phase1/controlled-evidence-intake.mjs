import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

function auctionRoundMatches(text, targetDate) {
  const value = String(targetDate ?? "").trim();
  let dayText, monthText, yearText;
  let match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
  if (match) [, dayText, monthText, yearText] = match;
  else {
    match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return false;
    [, yearText, monthText, dayText] = match;
  }
  const day = Number(dayText), monthNumber = Number(monthText), year = Number(yearText);
  if (day < 1 || day > 31 || monthNumber < 1 || monthNumber > 12 || year < 1900) return false;
  const months = ["january","february","march","april","may","june","july","august","september","october","november","december"];
  const shortMonths = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
  const month = months[monthNumber - 1], shortMonth = shortMonths[monthNumber - 1];
  const suffix = day % 100 >= 11 && day % 100 <= 13 ? "th" : day % 10 === 1 ? "st" : day % 10 === 2 ? "nd" : day % 10 === 3 ? "rd" : "th";
  const normalized = String(text ?? "").normalize("NFKC").toLowerCase()
    .replace(/[\u2010-\u2015\u2212]/g, "-").replace(/[\u00a0\s]+/g, " ");
  const candidates = [
    `${dayText}-${monthText}-${yearText}`, `${dayText}/${monthText}/${yearText}`,
    `${dayText}.${monthText}.${yearText}`, `${yearText}-${monthText}-${dayText}`,
    `${yearText}/${monthText}/${dayText}`, `${yearText}.${monthText}.${dayText}`,
    `${day} ${month} ${year}`, `${day} ${month}, ${year}`,
    `${day}${suffix} ${month} ${year}`, `${day}${suffix} ${month}, ${year}`,
    `${month} ${day} ${year}`, `${month} ${day}, ${year}`,
    `${month} ${day}${suffix} ${year}`, `${month} ${day}${suffix}, ${year}`,
    `${day} ${shortMonth} ${year}`, `${day}${suffix} ${shortMonth} ${year}`,
    `${shortMonth} ${day}, ${year}`
  ];
  return candidates.some(candidate => normalized.includes(candidate.toLowerCase()));
}

const [metadataPath, inputDir, outputDir = ".assetshakti-controlled-intake"] = process.argv.slice(2);

// Whole-lot rule: acquisition metadata may identify an authoritative object, but
// only the actual bytes may become evidence. Network failures are recorded as
// ACQUISITION_BLOCKED and never downgraded into a successful evidence state.
if (!metadataPath || !inputDir) {
  console.error("Usage: node controlled-evidence-intake.mjs <metadata.json> <input-dir> [output-dir]");
  process.exit(2);
}

const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
if (!Array.isArray(metadata.records) || metadata.records.length === 0) {
  throw new Error("FAIL-CLOSED: metadata.records must contain at least one evidence record");
}

fs.mkdirSync(outputDir, { recursive: true });

const results = metadata.records.map((record) => {
  if (!record.caseId || !record.documentType || !record.expectedDebtor || !record.auctionDate || !record.sourceReference || !record.fileName) {
    throw new Error("FAIL-CLOSED: every record requires caseId, documentType, expectedDebtor, auctionDate, sourceReference and fileName");
  }

  const localPath = path.resolve(inputDir, record.fileName);
  const bytes = fs.readFileSync(localPath);
  const sha256 = crypto.createHash("sha256").update(bytes).digest("hex");
  const isPdf = bytes.subarray(0, 5).toString() === "%PDF-";

  let text = "";
  let extractionError = null;
  try {
    text = execFileSync("pdftotext", ["-layout", "-enc", "UTF-8", localPath, "-"], { encoding: "utf8" });
  } catch (error) {
    extractionError = String(error?.message ?? error);
  }

  const normalized = text.toLowerCase();
  const debtorFound = normalized.includes(record.expectedDebtor.toLowerCase());
  const auctionRoundFound = auctionRoundMatches(text, record.auctionDate);
  const readable = text.trim().length > 20;

  return {
    ...record,
    localPath,
    contentSha256: sha256,
    verification: {
      pdfSignatureValid: isPdf,
      textReadable: readable,
      debtorIdentityFound: debtorFound,
      auctionRoundFound,
      sourceIdentityVerified: isPdf && readable && debtorFound && auctionRoundFound,
      extractionError,
    },
    decisionEvidenceProjection: false,
  };
});

const report = {
  schemaVersion: "1.0",
  generatedAt: new Date().toISOString(),
  status: "CONTROLLED_INTAKE_ONLY",
  productionCertification: "OFF",
  records: results,
  summary: {
    total: results.length,
    sourceIdentityVerified: results.filter((r) => r.verification.sourceIdentityVerified).length,
    failed: results.filter((r) => !r.verification.sourceIdentityVerified).length,
  },
  failClosed: {
    required: true,
    rule: "User-supplied evidence is never trusted merely because it was uploaded. Exact bytes are SHA-256 bound and the PDF must be readable and contain the expected debtor and current auction round.",
    consequence: "Any failed record remains blocked and cannot enter decision evidence.",
  },
};

const manifest = {
  schemaVersion: "1.0",
  generatedAt: report.generatedAt,
  records: results.map((r) => ({
    caseId: r.caseId,
    documentType: r.documentType,
    documentRole: r.documentRole ?? "UNCLASSIFIED",
    sourceReference: r.sourceReference,
    publicationDate: r.publicationDate ?? null,
    auctionDate: r.auctionDate,
    expectedDebtor: r.expectedDebtor,
    fileName: r.fileName,
    localPath: r.localPath,
    contentSha256: r.contentSha256,
    sourceIdentityVerified: r.verification.sourceIdentityVerified,
  })),
};

fs.writeFileSync(path.join(outputDir, "manifest.json"), JSON.stringify(manifest, null, 2));
fs.writeFileSync(path.join(outputDir, "verification-report.json"), JSON.stringify(report, null, 2));

console.log(JSON.stringify(report.summary));

if (report.summary.failed > 0) {
  console.error("FAIL-CLOSED: one or more controlled-intake documents failed identity verification.");
  process.exit(1);
}

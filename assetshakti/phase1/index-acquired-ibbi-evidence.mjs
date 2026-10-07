import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const OUT = process.argv[2] ?? ".assetshakti-acquisition";
const manifestPath = path.join(OUT, "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const keywords = [
  "EMD",
  "eligibility",
  "Section 29A",
  "payment",
  "forfeiture",
  "extension",
  "interest",
  "inspection",
  "as is where is",
  "as is what is",
  "without recourse",
  "possession",
  "lease",
  "assignment",
  "consent",
  "title",
  "encumbrance",
  "valuation",
  "reserve price"
];

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function snippet(text, index, radius = 260) {
  const start = Math.max(0, index - radius);
  const end = Math.min(text.length, index + radius);
  return text.slice(start, end).replace(/\s+/g, " ").trim();
}

const indexed = [];

for (const record of manifest.records) {
  const filePath = record.localPath;
  if (!fs.existsSync(filePath)) {
    throw new Error(`FAIL-CLOSED: acquired file missing: ${filePath}`);
  }

  const pdfInfo = execFileSync("pdfinfo", [filePath], { encoding: "utf8" });
  const pageMatch = pdfInfo.match(/^Pages:\s+(\d+)/m);
  const pageCount = pageMatch ? Number(pageMatch[1]) : 0;
  if (!pageCount) throw new Error(`FAIL-CLOSED: no page count for ${filePath}`);

  const text = execFileSync("pdftotext", ["-layout", "-enc", "UTF-8", filePath, "-"], { encoding: "utf8" });
  const pages = text.split("\f");
  const hits = [];

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const lower = page.toLowerCase();
    for (const keyword of keywords) {
      const index = lower.indexOf(keyword.toLowerCase());
      if (index >= 0) {
        hits.push({
          keyword,
          page: i + 1,
          snippet: snippet(page, index)
        });
      }
    }
  }

  indexed.push({
    caseId: record.caseId,
    corporateDebtor: record.corporateDebtor,
    auctionDate: record.auctionDate,
    documentType: record.documentType,
    sourceReference: record.sourceReference,
    contentSha256: record.contentSha256,
    textSha256: sha256(text),
    pageCount,
    keywordHits: hits
  });
}

const output = {
  schemaVersion: "1.0",
  generatedAt: new Date().toISOString(),
  purpose: "page-level evidence discovery only; not verification and not decision evidence",
  productionCertification: "OFF",
  records: indexed,
  rules: [
    "Page hits are discovery aids and require human/verifier confirmation.",
    "Text extraction does not establish legal title, possession, valuation or bidder eligibility.",
    "No extracted assertion is projected into decision evidence automatically.",
    "The source PDF SHA-256 remains the authoritative file identity."
  ]
};

fs.writeFileSync(
  path.join(OUT, "page-evidence-index.json"),
  JSON.stringify(output, null, 2)
);

console.log(JSON.stringify({
  indexedRecords: indexed.length,
  totalKeywordHits: indexed.reduce((n, r) => n + r.keywordHits.length, 0),
  output: path.join(OUT, "page-evidence-index.json")
}));

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

// Shakti evidence acquisition: acquisition is never verification.
const OUT = process.argv[2] ?? ".assetshakti-acquisition";
fs.mkdirSync(OUT, { recursive: true });

const IBBI_LIST = "https://ibbi.gov.in/liquidation-auction-notices/lists";

function curl(url, output, timeout = "90") {
  execFileSync("curl", [
    "-fsSL",
    "--retry", "3",
    "--retry-delay", "2",
    "--max-time", timeout,
    "-A", "Mozilla/5.0 (AssetShakti evidence acquisition)",
    "-H", "Accept: text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8",
    "-o", output,
    url
  ]);
}

function clean(s) {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function dateToKey(s) {
  const m = s.match(/(\d{2})-(\d{2})-(\d{4})/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : "";
}

function extractDates(row) {
  return [...clean(row).matchAll(/\b\d{2}-\d{2}-\d{4}\b/g)].map(m => m[0]);
}

function extractPdfLinks(row) {
  const candidates = [
    ...row.matchAll(/href\s*=\s*["']([^"']+?\.pdf(?:\?[^"']*)?)["']/gi),
    ...row.matchAll(/["']([^"']*\/uploads\/auction_notice_liquidation\/[^"']+\.pdf(?:\?[^"']*)?)["']/gi)
  ];
  return [...new Set(candidates.map(m => {
    try { return new URL(m[1], IBBI_LIST).href; } catch { return null; }
  }).filter(Boolean))];
}

const targets = [
  { caseId: "P1-PILOT-001", name: "GENERAL COMPOSITES PRIVATE LIMITED", round: "07-10-2026" },
  { caseId: "P1-PILOT-002", name: "HALLMARK LIVING SPACE PRIVATE LIMITED", round: "15-10-2026" },
  { caseId: "P1-PILOT-003", name: "Vysali Pharmaceuticals Limited", round: "10-10-2026" },
  { caseId: "P1-PILOT-004", name: "PARAKKOTT INVESTMENTS INDIA PRIVATE LIMITED", round: "01-10-2026" },
  { caseId: "P1-PILOT-005", name: "JOSAN FOODS PRIVATE LIMITED", round: "23-09-2026" },
  { caseId: "P1-PILOT-006", name: "Silverton Spinners Limited", round: "22-05-2026" }
];

const acquired = [];
const matchedTargets = [];

for (const target of targets) {
  const queryUrl = `${IBBI_LIST}?filter_by=all&title=${encodeURIComponent(target.name)}`;
  const htmlPath = path.join(OUT, `${target.caseId}-ibbi.html`);

  curl(queryUrl, htmlPath, "60");

  const html = fs.readFileSync(htmlPath, "utf8");
  const rows = [...html.matchAll(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi)].map(m => m[0]);
  const normalizedName = target.name.toLowerCase();
  const matchedRows = rows.filter(row =>
    clean(row).toLowerCase().includes(normalizedName) &&
    extractDates(row).includes(target.round)
  );

  console.log(JSON.stringify({
    caseId: target.caseId,
    source: queryUrl,
    htmlBytes: Buffer.byteLength(html),
    rowCount: rows.length,
    nameOccurrences: (html.toLowerCase().match(new RegExp(target.name.toLowerCase().replace(/[.*+?^{}()|[\]\\]/g, "\\$&"), "g")) || []).length,
    matchingRows: matchedRows.length
  }));

  if (!matchedRows.length) {
    throw new Error(`FAIL-CLOSED: no authoritative IBBI row found for ${target.caseId} / ${target.round}`);
  }

  const allPdfs = [...new Set(matchedRows.flatMap(extractPdfLinks))];
  if (!allPdfs.length) {
    throw new Error(`FAIL-CLOSED: authoritative row found but no PDF source link exposed for ${target.caseId} / ${target.round}`);
  }

  const dates = extractDates(matchedRows[0]);
  matchedTargets.push({
    caseId: target.caseId,
    corporateDebtor: target.name,
    issueDate: dates[0] ?? "",
    auctionDate: target.round,
    pdfCount: allPdfs.length,
    sourceQuery: queryUrl
  });

  const dir = path.join(OUT, target.caseId, dateToKey(target.round));
  fs.mkdirSync(dir, { recursive: true });

  for (let i = 0; i < Math.min(2, allPdfs.length); i++) {
    const fileName = i === 0 ? "auction-notice.pdf" : "details.pdf";
    const filePath = path.join(dir, fileName);
    curl(allPdfs[i], filePath);

    const bytes = fs.readFileSync(filePath);
    const sha256 = crypto.createHash("sha256").update(bytes).digest("hex");

    acquired.push({
      caseId: target.caseId,
      corporateDebtor: target.name,
      auctionDate: target.round,
      documentType: i === 0 ? "AUCTION_NOTICE" : "DETAILS",
      sourceReference: allPdfs[i],
      contentSha256: sha256,
      bytes: bytes.length,
      localPath: filePath
    });
  }
}

if (new Set(acquired.map(x => x.caseId)).size !== targets.length) {
  throw new Error("FAIL-CLOSED: not all six pilot case IDs produced acquired records");
}

const manifest = {
  schemaVersion: "1.2",
  acquiredAt: new Date().toISOString(),
  source: IBBI_LIST,
  authoritativeSource: "IBBI Liquidation Auction Notices",
  acquisitionMode: "AUTHORITATIVE_SOURCE_DIRECT_FILTERED",
  productionCertification: "OFF",
  targetRounds: targets,
  matchedTargets,
  records: acquired,
  failClosedRules: [
    "Acquisition does not equal verification.",
    "Exact auction round is preserved.",
    "PDF SHA-256 is computed from downloaded bytes.",
    "Title, possession, valuation and bidder eligibility are not inferred from an auction index.",
    "A record cannot enter decision evidence until the existing verification and reconciliation gates pass.",
    "Missing pilot rows or missing PDF links fail the acquisition job rather than producing a partial success."
  ]
};

fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(JSON.stringify({
  records: acquired.length,
  pilots: new Set(acquired.map(x => x.caseId)).size,
  manifest: path.join(OUT, "manifest.json")
}));

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

async function extractPdfText(bytes) {
  const pdf = await getDocument({ data: new Uint8Array(bytes), useSystemFonts: true }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map(item => typeof item.str === "string" ? item.str : "").join(" "));
  }
  return pages.join("\\n");
}

// Shakti evidence acquisition: acquisition is never verification.
const OUT = process.argv[2] ?? ".assetshakti-acquisition";
fs.mkdirSync(OUT, { recursive: true });

const IBBI_LIST = "https://ibbi.gov.in/liquidation-auction-notices/lists";

function curl(url, output, timeout = "45") {
  execFileSync("curl", [
    "-fsSL",
    "--retry", "1",
    "--retry-delay", "1",
    "--connect-timeout", "10",
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

function extractSourceLinks(row) {
  const tokens = row
    .split(/["'\s=<>]+/)
    .map(s => s.trim())
    .filter(Boolean);

  return [...new Set(tokens
    .filter(token => {
      const lower = token.toLowerCase();
      return lower.includes("/uploads/auction_notice_liquidation/") || lower.includes(".pdf");
    })
    .map(raw => raw.replace(/&amp;/g, "&"))
    .map(raw => {
      try { return new URL(raw, IBBI_LIST).href; } catch { return null; }
    })
    .filter(Boolean)
  )];
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

function hasExactRoundDate(text, targetRound) {
  const normalise = value => value.replace(/[./]/g, "-");
  const expected = normalise(targetRound);
  return [...text.matchAll(/(?:^|[^0-9])([0-9]{2})[./-]([0-9]{2})[./-]([0-9]{4})(?:$|[^0-9])/g)]
    .some(match => normalise(`${match[1]}-${match[2]}-${match[3]}`) === expected);
}

function classifyDocument(text, target) {
  const lower = text.toLowerCase();
  const hasDebtor = lower.includes(target.name.toLowerCase());
  const hasRound = hasExactRoundDate(text, target.round);
  const saleNotice = /e-?auction|auction sale notice|sale notice under insolvency/i.test(text);
  const metadata = /unique number|form is being filed for|nature of assets to be auctioned|date of auction/i.test(text);
  if (hasDebtor && hasRound && saleNotice && metadata) return "IBBI_AUCTION_RECORD";
  if (hasDebtor && hasRound && saleNotice) return "AUCTION_SALE_NOTICE";
  if (hasDebtor && hasRound) return "SOURCE_DOCUMENT_UNCLASSIFIED";
  return "IDENTITY_MISMATCH_OR_UNREADABLE";
}


for (const target of targets) {
  const queryUrl = `${IBBI_LIST}?filter_by=all&title=${encodeURIComponent(target.name)}`;
  const htmlPath = path.join(OUT, `${target.caseId}-ibbi.html`);

  curl(queryUrl, htmlPath, "45");

  const html = fs.readFileSync(htmlPath, "utf8");
  const rows = [...html.matchAll(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi)].map(m => m[0]);
  const matchedRows = rows.filter(row =>
    clean(row).toLowerCase().includes(target.name.toLowerCase()) &&
    extractDates(row).includes(target.round)
  );

  console.log(JSON.stringify({
    caseId: target.caseId,
    source: queryUrl,
    htmlBytes: Buffer.byteLength(html),
    rowCount: rows.length,
    matchingRows: matchedRows.length
  }));

  if (!matchedRows.length) {
    throw new Error(`FAIL-CLOSED: no authoritative IBBI row found for ${target.caseId} / ${target.round}`);
  }

  const sourceLinks = [...new Set(matchedRows.flatMap(extractSourceLinks))];

  if (!sourceLinks.length) {
    console.log("NO_SOURCE_LINKS_ROW=" + matchedRows[0].slice(0, 16000));
    throw new Error(`FAIL-CLOSED: authoritative row found but no downloadable source link exposed for ${target.caseId} / ${target.round}`);
  }

  console.log(JSON.stringify({
    caseId: target.caseId,
    auctionDate: target.round,
    sourceLinks
  }));

  const dates = extractDates(matchedRows[0]);
  matchedTargets.push({
    caseId: target.caseId,
    corporateDebtor: target.name,
    issueDate: dates[0] ?? "",
    auctionDate: target.round,
    sourceLinkCount: sourceLinks.length,
    sourceQuery: queryUrl
  });

  const dir = path.join(OUT, target.caseId, dateToKey(target.round));
  fs.mkdirSync(dir, { recursive: true });

  for (let i = 0; i < Math.min(2, sourceLinks.length); i++) {
    const fileName = i === 0 ? "auction-notice.pdf" : "details.pdf";
    const filePath = path.join(dir, fileName);
    curl(sourceLinks[i], filePath);

    const bytes = fs.readFileSync(filePath);
    const sha256 = crypto.createHash("sha256").update(bytes).digest("hex");
    const extractedText = await extractPdfText(bytes);
    const documentRole = classifyDocument(extractedText, target);

    acquired.push({
      caseId: target.caseId,
      corporateDebtor: target.name,
      auctionDate: target.round,
      documentType: i === 0 ? "IBBI_LINKED_AUCTION_NOTICE_PDF_PENDING_VERIFICATION" : "IBBI_REGISTER_DETAILS_PDF",
      sourceReference: sourceLinks[i],
      contentSha256: sha256,
      bytes: bytes.length,
      localPath: filePath,
      documentRole,
      identityMatch: extractedText.toLowerCase().includes(target.name.toLowerCase()),
      auctionRoundMatch: hasExactRoundDate(extractedText, target.round),
      verificationStatus: "PENDING_MANUAL_SOURCE_AND_VERSION_REVIEW",
      decisionEvidenceEligible: false
    });
  }
}

if (new Set(acquired.map(x => x.caseId)).size !== targets.length) {
  throw new Error("FAIL-CLOSED: not all six pilot case IDs produced acquired records");
}

const integrityFailures = acquired.filter(record =>
  !record.identityMatch || !record.auctionRoundMatch || record.documentRole === "IDENTITY_MISMATCH_OR_UNREADABLE"
);

const manifest = {
  schemaVersion: "1.4",
  acquisitionGate: integrityFailures.length === 0 ? "PENDING_MANUAL_VERIFICATION" : "BLOCKED_IDENTITY_OR_ROUND_MISMATCH",
  integrityFailureCount: integrityFailures.length,
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
    "Missing pilot rows or missing downloadable source links fail the acquisition job."
  ]
};

fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(JSON.stringify({
  records: acquired.length,
  pilots: new Set(acquired.map(x => x.caseId)).size,
  manifest: path.join(OUT, "manifest.json"),
  acquisitionGate: manifest.acquisitionGate,
  integrityFailureCount: integrityFailures.length
}));
if (integrityFailures.length > 0) {
  throw new Error(`FAIL-CLOSED: ${integrityFailures.length} acquired PDF records failed debtor/auction-round identity checks; manifest retained for review.`);
}

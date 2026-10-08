import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const OUT = process.argv[2] ?? ".assetshakti-acquisition";
const manifest = JSON.parse(fs.readFileSync(path.join(OUT, "manifest.json"), "utf8"));

const results = [];
for (const r of manifest.records) {
  const bytes = fs.readFileSync(r.localPath);
  const actualHash = crypto.createHash("sha256").update(bytes).digest("hex");
  const text = execFileSync("pdftotext", ["-layout", "-enc", "UTF-8", r.localPath, "-"], { encoding: "utf8" });
  const debtor = r.corporateDebtor.toLowerCase();
  const date = r.auctionDate;
  const identity = text.toLowerCase().includes(debtor);
  const round = [date, date.split("-").reverse().join("/"), date.split("-").reverse().join("."), date.split("-").reverse().join("-")].some(v => text.includes(v));
  const isPdf = bytes.slice(0, 5).toString() === "%PDF-";
  const readable = text.trim().length > 20;
  const sourceIdentityVerified = isPdf && readable && identity && round && actualHash === r.contentSha256;
  results.push({
    caseId: r.caseId,
    auctionDate: r.auctionDate,
    documentType: r.documentType,
    documentRole: r.documentRole ?? "UNCLASSIFIED",
    sourceReference: r.sourceReference,
    sha256Expected: r.contentSha256,
    sha256Actual: actualHash,
    hashIntegrity: actualHash === r.contentSha256,
    pdfSignatureValid: isPdf,
    textReadable: readable,
    debtorIdentityFound: identity,
    auctionRoundFound: round,
    sourceIdentityVerified,
    expectedDocumentRole: r.documentRole ?? "UNCLASSIFIED",
    documentRoleConsistent: Boolean(r.documentRole),
    decisionEvidenceProjection: false,
    notes: sourceIdentityVerified
      ? "Objective source-document verification only; title, possession, valuation, bidder eligibility and corrigenda remain unverified."
      : "FAIL-CLOSED: downloaded bytes do not prove identity/round/hash integrity for this target; the record cannot enter decision evidence."
  });
}

const report = {
  schemaVersion: "1.1",
  generatedAt: new Date().toISOString(),
  status: "SOURCE_DOCUMENT_VERIFICATION_ONLY",
  productionCertification: "OFF",
  records: results,
  summary: {
    total: results.length,
    sourceIdentityVerified: results.filter(x => x.sourceIdentityVerified).length,
    hashFailures: results.filter(x => !x.hashIntegrity).length,
    identityFailures: results.filter(x => !x.debtorIdentityFound || !x.auctionRoundFound).length,
    documentRoleCounts: Object.fromEntries([...new Set(results.map(x => x.documentRole))].map(role => [role, results.filter(x => x.documentRole === role).length])),
    decisionEvidenceEligible: 0
  },
  failClosed: {
    required: true,
    rule: "Every acquired source document must be cryptographically intact, readable, and contain the exact target debtor and current auction round before acquisition can be treated as verified source evidence.",
    consequence: "Any failure exits non-zero and blocks downstream evidence promotion."
  }
};

fs.writeFileSync(path.join(OUT, "document-verification-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.summary));

const failures = results.filter(x => !x.sourceIdentityVerified);
if (failures.length) {
  console.error(JSON.stringify({
    error: "FAIL-CLOSED: source-document identity/integrity verification failed",
    failures: failures.map(x => ({
      caseId: x.caseId,
      documentType: x.documentType,
      sourceReference: x.sourceReference,
      debtorIdentityFound: x.debtorIdentityFound,
      auctionRoundFound: x.auctionRoundFound,
      hashIntegrity: x.hashIntegrity,
      textReadable: x.textReadable,
      expectedDocumentRole: x.expectedDocumentRole
    }))
  }, null, 2));
  process.exit(1);
}

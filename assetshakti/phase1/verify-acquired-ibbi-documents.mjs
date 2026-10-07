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
  const text = execFileSync("pdftotext", ["-layout", "-enc", "UTF-8", r.localPath, "-"], {encoding:"utf8"});
  const debtor = r.corporateDebtor.toLowerCase();
  const date = r.auctionDate;
  const identity = text.toLowerCase().includes(debtor);
  const round = text.includes(date);
  const isPdf = bytes.slice(0,5).toString() === "%PDF-";
  const readable = text.trim().length > 20;
  results.push({
    caseId:r.caseId,
    auctionDate:r.auctionDate,
    documentType:r.documentType,
    documentRole:r.documentRole ?? "UNCLASSIFIED",
    sourceReference:r.sourceReference,
    sha256Expected:r.contentSha256,
    sha256Actual:actualHash,
    hashIntegrity:actualHash===r.contentSha256,
    pdfSignatureValid:isPdf,
    textReadable:readable,
    debtorIdentityFound:identity,
    auctionRoundFound:round,
    sourceIdentityVerified:isPdf && readable && identity && round && actualHash===r.contentSha256,
    decisionEvidenceProjection:false,
    notes:"Objective source-document verification only; this does not verify title, possession, valuation, bidder eligibility, or corrigenda reconciliation."
  });
}
const report={
  schemaVersion:"1.0",
  generatedAt:new Date().toISOString(),
  status:"SOURCE_DOCUMENT_VERIFICATION_ONLY",
  productionCertification:"OFF",
  records:results,
  summary:{
    total:results.length,
    sourceIdentityVerified:results.filter(x=>x.sourceIdentityVerified).length,
    hashFailures:results.filter(x=>!x.hashIntegrity).length,
    identityFailures:results.filter(x=>!x.debtorIdentityFound||!x.auctionRoundFound).length
  }
};
fs.writeFileSync(path.join(OUT,"document-verification-report.json"),JSON.stringify(report,null,2));
console.log(JSON.stringify(report.summary));

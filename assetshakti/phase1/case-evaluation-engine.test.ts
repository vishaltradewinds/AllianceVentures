import assert from "node:assert/strict";
import { evaluateCase } from "./case-evaluation-engine";

const source = {
  authority: "IBBI",
  sourceReference: "https://ibbi.gov.in/example-auction-notice.pdf",
  observedAt: "2026-10-06",
};

const fullEvidence = [
  "IDENTITY", "TITLE", "AUTHORITY", "POSSESSION", "PHYSICAL",
  "LOCATION", "VALUATION", "AUCTION", "BIDDER_OBLIGATION",
].map((category) => ({
  category,
  status: "VERIFIED",
  assertion: `Verified ${category} evidence.`,
}));

const ready = evaluateCase({
  caseId: "ENGINE-POSITIVE-001",
  source,
  expectedDecision: "BID_READY",
  asset: { class: "INDUSTRIAL", subtype: "INDUSTRIAL_LAND_BUILDING" },
  evidence: fullEvidence,
});
assert.equal(ready.actualDecision, "BID_READY");
assert.equal(ready.passed, true);
assert.equal(ready.criticalGatePassed, true);

const missingTitle = evaluateCase({
  caseId: "ENGINE-NEG-TITLE-001",
  source,
  expectedDecision: "DO_NOT_BID",
  asset: { class: "INDUSTRIAL", subtype: "INDUSTRIAL_LAND_BUILDING" },
  evidence: fullEvidence.filter((e) => e.category !== "TITLE"),
});
assert.equal(missingTitle.actualDecision, "DO_NOT_BID");
assert.equal(missingTitle.passed, true);

const contradictedAuctionTerms = evaluateCase({
  caseId: "ENGINE-NEG-AUCTION-001",
  source,
  expectedDecision: "DO_NOT_BID",
  asset: { class: "INDUSTRIAL", subtype: "INDUSTRIAL_LAND_BUILDING" },
  evidence: fullEvidence.map((e) =>
    e.category === "BIDDER_OBLIGATION"
      ? { ...e, status: "CONTRADICTED", assertion: "Auction terms are contradictory and unresolved." }
      : e
  ),
});
assert.equal(contradictedAuctionTerms.actualDecision, "DO_NOT_BID");
assert.equal(contradictedAuctionTerms.passed, true);

const unresolvedDocs = evaluateCase({
  caseId: "ENGINE-NEG-DOCS-001",
  source,
  expectedDecision: "DO_NOT_BID",
  asset: { class: "INDUSTRIAL", subtype: "INDUSTRIAL_LAND_BUILDING" },
  evidence: fullEvidence,
  documentVersions: [{
    documentType: "AUCTION_NOTICE",
    sourceReference: "https://ibbi.gov.in/original.pdf",
    observedAt: "2026-10-06",
    versionStatus: "UNRESOLVED",
  }],
});
assert.equal(unresolvedDocs.actualDecision, "DO_NOT_BID");
assert.equal(unresolvedDocs.passed, true);
assert.equal(unresolvedDocs.documentReconciliation?.status, "UNRESOLVED");

console.log("PASS: Phase 1 case-evaluation engine uses the production decision engine and document reconciliation");


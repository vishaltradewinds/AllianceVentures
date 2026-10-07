import assert from "node:assert/strict";
import { evaluateCase } from "./case-evaluation-engine";
import type { EvidenceItem } from "./property-schema";

const source = {
  authority: "IBBI",
  sourceReference: "https://ibbi.gov.in/example-auction-notice.pdf",
  observedAt: "2026-10-06",
};

const fullEvidence: Pick<EvidenceItem, "category" | "status" | "assertion">[] = [
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

const compositePackage = evaluateCase({
  caseId: "ENGINE-NEG-PACKAGE-001",
  source,
  expectedDecision: "DO_NOT_BID",
  asset: { class: "COMPOSITE", subtype: "COMPOSITE_PACKAGE", description: "Composite sale of leasehold rights of Land & Building, Plant & Machinery and Securities & Financial Assets." },
  evidence: fullEvidence,
});
assert.equal(compositePackage.actualDecision, "DO_NOT_BID");
assert.equal(compositePackage.passed, true);
assert.equal(compositePackage.assetPackageAssessment?.propertyOnlyDecisionAllowed, false);

console.log("PASS: Phase 1 case-evaluation engine uses decision, package decomposition and document reconciliation gates");



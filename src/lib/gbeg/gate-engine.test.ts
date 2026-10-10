import { evaluateGbegCase, type EvidenceRecord, type GateInput, type RequiredControl } from "./gate-engine";

const controls: RequiredControl[] = [
  { gateId: "G0-IDENTITY", claimKey: "company.identity", label: "Company identity", mandatory: true, legalControl: false, applicability: "APPLICABLE", professionalReview: "NOT_REQUIRED", maxEvidenceAgeDays: 365 },
  { gateId: "G1-INDIA-OI", claimKey: "india.outbound-investment", label: "India-side outbound investment route", mandatory: true, legalControl: true, applicability: "APPLICABLE", professionalReview: "APPROVED", professionalReviewer: "Qualified counsel", professionalReviewEvidenceId: "EV-003", maxEvidenceAgeDays: 90 },
];

const goodEvidence: EvidenceRecord[] = [
  { id: "EV-001", claimKey: "company.identity", status: "VERIFIED", sourceKind: "OFFICIAL_AUTHORITY", sourceName: "Official company registry", sourceUrl: "https://example.gov/registry", assertion: "Test company record", observedAt: "2026-10-01T00:00:00Z" },
  { id: "EV-002", claimKey: "india.outbound-investment", status: "VERIFIED", sourceKind: "LEGISLATION", sourceName: "Official legal instrument", sourceUrl: "https://example.gov/law", assertion: "Reviewed rule extract", observedAt: "2026-10-01T00:00:00Z" },
  { id: "EV-003", claimKey: "india.outbound-investment.review", status: "VERIFIED", sourceKind: "QUALIFIED_PROFESSIONAL", sourceName: "Qualified counsel review record", sourceUrl: "https://example.com/review-record", assertion: "Review record for test case", observedAt: "2026-10-02T00:00:00Z", reviewer: "Qualified counsel" },
];

const base: GateInput = {
  caseId: "TEST-GBEG-001",
  asOf: "2026-10-10T00:00:00Z",
  jurisdictionCoverage: { status: "COVERED", jurisdictionPath: ["IN", "IN-MP"], moduleVersion: "test-0.1.0", reviewedAt: "2026-10-01T00:00:00Z", exclusions: [] },
  controls,
  evidence: goodEvidence,
};

function expect(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const ready = evaluateGbegCase(base);
expect(ready.outcome === "EVIDENCE_COMPLETE_FOR_HUMAN_REVIEW", "Complete reviewed evidence should permit human review.");
expect(ready.isLegalEligibilityDecision === false, "Engine must never claim a legal eligibility decision.");
expect(ready.evidenceIdsUsed.includes("EV-003"), "Professional-review evidence must be included in the audit trail.");

const missing = evaluateGbegCase({ ...base, evidence: goodEvidence.filter(e => e.claimKey !== "india.outbound-investment") });
expect(missing.outcome === "BLOCKED", "Missing mandatory legal evidence must block.");

const contradiction = evaluateGbegCase({ ...base, evidence: [...goodEvidence, { ...goodEvidence[1], id: "EV-004", status: "CONTRADICTED" }] });
expect(contradiction.outcome === "BLOCKED", "Contradictory evidence must block despite a verified record.");

const stale = evaluateGbegCase({ ...base, evidence: goodEvidence.map(e => e.claimKey === "india.outbound-investment" ? { ...e, observedAt: "2025-01-01T00:00:00Z" } : e) });
expect(stale.outcome === "BLOCKED", "Stale evidence must block a time-sensitive legal control.");

const noReview = evaluateGbegCase({ ...base, controls: controls.map(c => c.legalControl ? { ...c, professionalReview: "PENDING" as const, professionalReviewer: undefined } : c) });
expect(noReview.outcome === "PENDING_REVIEW", "Legal control without qualified review must remain pending.");

const partial = evaluateGbegCase({ ...base, jurisdictionCoverage: { ...base.jurisdictionCoverage, status: "PARTIAL", exclusions: ["local licensing"] } });
expect(partial.outcome === "NOT_COVERED", "Partial coverage must not pass a mandatory legal control.");

const unsupportedSource = evaluateGbegCase({ ...base, evidence: goodEvidence.map(e => e.id === "EV-002" ? { ...e, sourceKind: "COMMERCIAL" as const } : e) });
expect(unsupportedSource.outcome === "BLOCKED", "Commercial evidence alone must not satisfy a legal control.");

const futureEvidence = evaluateGbegCase({ ...base, evidence: goodEvidence.map(e => e.claimKey === "india.outbound-investment" ? { ...e, observedAt: "2027-01-01T00:00:00Z" } : e) });
expect(futureEvidence.outcome === "BLOCKED", "Future-dated evidence must not pass.");

const unjustifiedNA = evaluateGbegCase({ ...base, controls: controls.map(c => c.legalControl ? { ...c, applicability: "NOT_APPLICABLE" as const, applicabilityRationale: "" } : c) });
expect(unjustifiedNA.outcome === "PENDING_REVIEW", "Non-applicability without rationale must remain pending.");

const uncovered = evaluateGbegCase({ ...base, jurisdictionCoverage: { ...base.jurisdictionCoverage, status: "NOT_COVERED" } });
expect(uncovered.outcome === "NOT_COVERED", "Uncovered jurisdiction must never be assumed to pass.");

const untraceable = evaluateGbegCase({ ...base, evidence: goodEvidence.map(e => e.id === "EV-002" ? { ...e, sourceUrl: undefined, contentHash: undefined } : e) });
expect(untraceable.outcome === "BLOCKED", "Legal evidence without a URL or content hash must block.");

const unlinkedReview = evaluateGbegCase({ ...base, controls: controls.map(c => c.legalControl ? { ...c, professionalReviewEvidenceId: undefined } : c) });
expect(unlinkedReview.outcome === "PENDING_REVIEW", "Legal review must be linked to traceable review evidence.");

const customerAttested = evaluateGbegCase({ ...base, evidence: goodEvidence.map(e => e.id === "EV-001" ? { ...e, sourceKind: "CUSTOMER" as const, sourceUrl: undefined, contentHash: "sha256:customer-document" } : e) });
expect(customerAttested.outcome === "EVIDENCE_COMPLETE_FOR_HUMAN_REVIEW", "A traceable customer source may support a non-legal control without satisfying legal controls.");

const noControls = evaluateGbegCase({ ...base, controls: [] });
expect(noControls.outcome === "BLOCKED", "An empty control set must not pass vacuously.");

console.log("GBEG gate engine tests passed: 13 fail-closed controls.");

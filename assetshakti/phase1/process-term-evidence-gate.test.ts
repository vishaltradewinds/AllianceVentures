import { evaluateProcessTermEvidence } from "./process-term-evidence-gate";

const base = {
  caseId: "P1-PILOT-003",
  auctionId: "IBBI-2026-10-10-VYSALI",
  lotId: "EDATHALA-LB",
  sourceUrl: "https://ibbi.gov.in/example",
  contentSha256: "abc123",
  pageOrSection: "Page 3 / EMD",
  publicationDate: "2026-10-08",
  termType: "EMD" as const,
  publishedByIbbI: true,
  exactRoundConfirmed: true,
  exactLotConfirmed: true,
  currentProcessBundleAcquired: false,
  currentProcessBundleHashBound: false,
  corrigendaReconciled: false
};

const published = evaluateProcessTermEvidence(base);
if (published.state !== "PUBLISHED_BY_IBBI") throw new Error("published notice must not be treated as verified process evidence");
if (published.decisionUsable) throw new Error("published notice alone must not enter decision evidence");

const verified = evaluateProcessTermEvidence({
  ...base,
  currentProcessBundleAcquired: true,
  currentProcessBundleHashBound: true,
  corrigendaReconciled: true
});
if (verified.state !== "VERIFIED_PROCESS_TERM") throw new Error("complete process bundle should verify the term");
if (!verified.decisionUsable) throw new Error("verified process term should be decision-usable");

const incomplete = evaluateProcessTermEvidence({
  ...base,
  lotId: ""
});
if (incomplete.state !== "REJECTED") throw new Error("missing lot identity must fail closed");
if (incomplete.decisionUsable) throw new Error("incomplete identity must never be decision-usable");

console.log("AssetShakti process-term evidence gate tests passed.");

import { evaluateProviderCertification } from "./provider-certification-gate";

const base = {
  provider: "MSTC" as const,
  currentRealAuctionPilot: true,
  exactAuctionLotIdentityVerified: true,
  currentNoticeOrProcessDocumentAcquired: true,
  sourceVersionHashBound: true,
  corrigendaReconciled: true,
  applicableTitlePossessionOwnershipEvidence: true,
  bidderObligationsVerified: true,
  deterministicEndToEndEvaluation: true,
  ciEvidencePassed: true,
  shaktiSignOff: true
};

const certified = evaluateProviderCertification(base);
if (certified.state !== "PRODUCTION_CERTIFIED" || !certified.passed) throw new Error("FAIL: complete provider gate should certify");

const missingEvidence = evaluateProviderCertification({ ...base, currentNoticeOrProcessDocumentAcquired: false });
if (missingEvidence.state !== "DISCOVERY_READY" || missingEvidence.passed) throw new Error("FAIL: missing current process evidence must remain discovery-ready");

const missingEngineering = evaluateProviderCertification({ ...base, ciEvidencePassed: false });
if (missingEngineering.state !== "EVIDENCE_READY" || missingEngineering.passed) throw new Error("FAIL: evidence-complete but engineering-incomplete provider should remain evidence-ready");

console.log("PASS: provider certification gate fails closed");

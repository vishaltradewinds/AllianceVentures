import { createHash } from "node:crypto";
import { canPromoteToDecisionEvidence, projectVerifiedEvidence, type UserEvidenceRecord } from "./user-evidence-lifecycle";
import { verifyUserSuppliedEvidence } from "./user-evidence-verification";

const uploadedPayload = [
  "TEST-ONLY STAKEHOLDER UPLOAD SIMULATION",
  "caseId=P1-PILOT-001",
  "auctionRound=2026-10-07",
  "documentType=AUCTION_NOTICE",
  "sourceReference=IBBI liquidation auction register",
  "This fixture contains metadata only; it is not substantive legal/property evidence."
].join("\n");

const contentSha256 = createHash("sha256").update(uploadedPayload, "utf8").digest("hex");

const uploaded: UserEvidenceRecord = {
  intakeId: "SIM-STAKEHOLDER-UPLOAD-001",
  caseId: "P1-PILOT-001",
  documentType: "AUCTION_NOTICE",
  auctionRound: "2026-10-07",
  sourceReference: "IBBI liquidation auction register",
  contentSha256,
  state: "UPLOADED_PENDING_VERIFICATION"
};

if (canPromoteToDecisionEvidence(uploaded)) {
  throw new Error("Stakeholder upload must remain blocked until verification.");
}

const verification = verifyUserSuppliedEvidence({
  documentIdentityConfirmed: true,
  authoritativeSourceConfirmed: true,
  applicableRoundConfirmed: true,
  currentOrSupersededStatusConfirmed: true,
  corrigendaConsistencyConfirmed: true,
  hashIntegrityConfirmed: true,
  materialAssertionsHavePageReferences: true,
  verifierNote: "TEST-ONLY: metadata workflow simulation; no substantive property/legal assertion is verified."
});

if (verification.outcome !== "VERIFIED") {
  throw new Error(`Expected simulated metadata verification to pass: ${verification.reasons.join("; ")}`);
}

const promoted: UserEvidenceRecord = {
  ...uploaded,
  state: "VERIFIED",
  verification: {
    currentOrSuperseded: "CURRENT",
    reconciliationStatus: "RECONCILED",
    verifiedAt: "2026-10-07T10:36:18Z",
    verifierId: "TEST-STAKEHOLDER-UPLOAD"
  }
};

if (!canPromoteToDecisionEvidence(promoted)) {
  throw new Error("A fully verified and reconciled simulation should be promotable.");
}

if (!projectVerifiedEvidence(
  promoted,
  "AUCTION",
  "TEST-ONLY metadata projection; substantive evidence remains unavailable.",
  "2026-10-07T10:36:18Z"
)) {
  throw new Error("Verified simulation projection failed.");
}

console.log("stakeholder-upload-simulation: PASS");
console.log(`contentSha256=${contentSha256}`);

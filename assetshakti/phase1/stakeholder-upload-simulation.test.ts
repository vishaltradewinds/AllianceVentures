import { createHash } from "node:crypto";
import { canPromoteToDecisionEvidence, projectVerifiedEvidence, type UserEvidenceRecord } from "./user-evidence-lifecycle";
import { verifyUserSuppliedEvidence } from "./user-evidence-verification";

const pilots = [
  ["P1-PILOT-001","2026-10-07","AUCTION_NOTICE"],
  ["P1-PILOT-002","2026-10-15","AUCTION_NOTICE"],
  ["P1-PILOT-003","2026-10-10","AUCTION_NOTICE"],
  ["P1-PILOT-004","2026-09-29","AUCTION_NOTICE"],
  ["P1-PILOT-005","2026-09-23","AUCTION_NOTICE"],
  ["P1-PILOT-006","MULTIPLE_ROUNDS","AUCTION_NOTICE"]
] as const;

for (const [caseId, auctionRound, documentType] of pilots) {
  const uploadedPayload = [
    "TEST-ONLY STAKEHOLDER UPLOAD SIMULATION",
    `caseId=${caseId}`,
    `auctionRound=${auctionRound}`,
    `documentType=${documentType}`,
    "This fixture contains metadata only; it is not substantive legal/property evidence."
  ].join("\\n");

  const contentSha256 = createHash("sha256").update(uploadedPayload, "utf8").digest("hex");

  const uploaded: UserEvidenceRecord = {
    intakeId: `SIM-STAKEHOLDER-UPLOAD-${caseId}`,
    caseId,
    documentType,
    auctionRound,
    sourceReference: "IBBI liquidation auction register",
    contentSha256,
    state: "UPLOADED_PENDING_VERIFICATION"
  };

  if (canPromoteToDecisionEvidence(uploaded)) {
    throw new Error(`${caseId}: pending evidence must remain blocked until verification.`);
  }

  const verification = verifyUserSuppliedEvidence({
    documentIdentityConfirmed: true,
    authoritativeSourceConfirmed: true,
    applicableRoundConfirmed: true,
    currentOrSupersededStatusConfirmed: true,
    corrigendaConsistencyConfirmed: true,
    hashIntegrityConfirmed: true,
    materialAssertionsHavePageReferences: true,
    verifierNote: `TEST-ONLY metadata workflow simulation for ${caseId}; no substantive property/legal assertion is verified.`
  });

  if (verification.outcome !== "VERIFIED") {
    throw new Error(`${caseId}: expected simulated metadata verification to pass.`);
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
    throw new Error(`${caseId}: verified simulation should be promotable.`);
  }

  if (!projectVerifiedEvidence(
    promoted,
    "AUCTION",
    "TEST-ONLY metadata projection; substantive evidence remains unavailable.",
    "2026-10-07T10:36:18Z"
  )) {
    throw new Error(`${caseId}: verified simulation projection failed.`);
  }

  console.log(`stakeholder-upload-simulation: PASS ${caseId} sha256=${contentSha256}`);
}

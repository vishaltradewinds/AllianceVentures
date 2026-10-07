import assert from "node:assert/strict";
import { evaluateCurrentRoundProcessDocument } from "./current-round-process-gate";

const base = {
  caseId: "P1-PILOT-002",
  auctionRound: "15-10-2026",
  documentRole: "PROCESS_DOCUMENT" as const,
  state: "VERIFIED_CURRENT" as const,
  contentSha256: "a".repeat(64),
  sourceReference: "https://www.hallmarklivingspace.co.in/assets/liquidation/current.pdf",
  exactRoundConfirmed: true,
  currentStatusConfirmed: true,
  corrigendaReconciled: true,
  pageReferencesCaptured: true,
};

assert.equal(evaluateCurrentRoundProcessDocument(base).readyForDecisionEvidence, true);

for (const field of [
  "exactRoundConfirmed",
  "currentStatusConfirmed",
  "corrigendaReconciled",
  "pageReferencesCaptured",
] as const) {
  const failed = evaluateCurrentRoundProcessDocument({ ...base, [field]: false });
  assert.equal(failed.readyForDecisionEvidence, false, field);
}

assert.equal(
  evaluateCurrentRoundProcessDocument({ ...base, state: "ACQUIRED_PENDING_VERIFICATION" }).readyForDecisionEvidence,
  false,
);

assert.equal(
  evaluateCurrentRoundProcessDocument({ ...base, contentSha256: "" }).readyForDecisionEvidence,
  false,
);

console.log("AssetShakti current-round process-document gate: PASS");

export type VerificationOutcome = "VERIFIED" | "REJECTED";

export interface VerificationInput {
  documentIdentityConfirmed: boolean;
  authoritativeSourceConfirmed: boolean;
  applicableRoundConfirmed: boolean;
  currentOrSupersededStatusConfirmed: boolean;
  corrigendaConsistencyConfirmed: boolean;
  hashIntegrityConfirmed: boolean;
  materialAssertionsHavePageReferences: boolean;
  verifierNote: string;
}

export interface VerificationResult {
  outcome: VerificationOutcome;
  reasons: string[];
}

export function verifyUserSuppliedEvidence(input: VerificationInput): VerificationResult {
  const checks: Array<[string, boolean]> = [
    ["document identity is confirmed", input.documentIdentityConfirmed],
    ["authoritative source/reference is confirmed", input.authoritativeSourceConfirmed],
    ["applicable auction round is confirmed", input.applicableRoundConfirmed],
    ["current/superseded status is confirmed", input.currentOrSupersededStatusConfirmed],
    ["corrigenda/addenda consistency is confirmed", input.corrigendaConsistencyConfirmed],
    ["stored-file hash integrity is confirmed", input.hashIntegrityConfirmed],
    ["material assertions have page/section references", input.materialAssertionsHavePageReferences],
  ];

  const reasons = checks.filter(([, ok]) => !ok).map(([reason]) => reason);
  if (!input.verifierNote.trim()) reasons.push("verifier note is required");

  return {
    outcome: reasons.length ? "REJECTED" : "VERIFIED",
    reasons,
  };
}

export type ProcessDocumentState =
  | "NOT_ACQUIRED"
  | "ACQUIRED_PENDING_VERIFICATION"
  | "VERIFIED_CURRENT"
  | "VERIFIED_SUPERSEDED"
  | "REJECTED";

export interface ProcessDocumentRecord {
  caseId: string;
  auctionRound: string;
  documentRole: "PROCESS_DOCUMENT" | "CORRIGENDUM" | "ADDENDUM" | "SUPPORTING_DOCUMENT";
  state: ProcessDocumentState;
  contentSha256: string;
  sourceReference: string;
  exactRoundConfirmed: boolean;
  currentStatusConfirmed: boolean;
  corrigendaReconciled: boolean;
  pageReferencesCaptured: boolean;
}

export interface ProcessGateResult {
  readyForDecisionEvidence: boolean;
  reasons: string[];
}

export function evaluateCurrentRoundProcessDocument(
  record: ProcessDocumentRecord,
): ProcessGateResult {
  const checks: Array<[string, boolean]> = [
    ["exact auction round is confirmed", record.exactRoundConfirmed],
    ["current/superseded status is confirmed", record.currentStatusConfirmed],
    ["corrigenda/addenda are reconciled", record.corrigendaReconciled],
    ["stored-file SHA-256 is present", Boolean(record.contentSha256)],
    ["source reference is present", Boolean(record.sourceReference)],
    ["page/section references are captured", record.pageReferencesCaptured],
    ["document is verified current", record.state === "VERIFIED_CURRENT"],
  ];

  const reasons = checks
    .filter(([, ok]) => !ok)
    .map(([reason]) => reason);

  return {
    readyForDecisionEvidence: reasons.length === 0,
    reasons,
  };
}

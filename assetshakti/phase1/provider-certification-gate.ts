import type { AuctionSourceProvider } from "./auction-source-adapter";

export type ProviderCertificationState = "DISCOVERY_READY" | "EVIDENCE_READY" | "PRODUCTION_CERTIFIED";

export interface ProviderCertificationInput {
  provider: AuctionSourceProvider;
  currentRealAuctionPilot: boolean;
  exactAuctionLotIdentityVerified: boolean;
  currentNoticeOrProcessDocumentAcquired: boolean;
  sourceVersionHashBound: boolean;
  corrigendaReconciled: boolean;
  applicableTitlePossessionOwnershipEvidence: boolean;
  bidderObligationsVerified: boolean;
  deterministicEndToEndEvaluation: boolean;
  ciEvidencePassed: boolean;
  shaktiSignOff: boolean;
}

export interface ProviderCertificationResult {
  state: ProviderCertificationState;
  passed: boolean;
  blockingGates: string[];
}

export function evaluateProviderCertification(input: ProviderCertificationInput): ProviderCertificationResult {
  const gates: Array<[string, boolean]> = [
    ["CURRENT_REAL_AUCTION_PILOT", input.currentRealAuctionPilot],
    ["EXACT_AUCTION_LOT_IDENTITY", input.exactAuctionLotIdentityVerified],
    ["CURRENT_NOTICE_OR_PROCESS_DOCUMENT", input.currentNoticeOrProcessDocumentAcquired],
    ["SOURCE_VERSION_HASH_BINDING", input.sourceVersionHashBound],
    ["CORRIGENDA_RECONCILIATION", input.corrigendaReconciled],
    ["TITLE_POSSESSION_OWNERSHIP_EVIDENCE", input.applicableTitlePossessionOwnershipEvidence],
    ["BIDDER_OBLIGATIONS", input.bidderObligationsVerified],
    ["DETERMINISTIC_END_TO_END_EVALUATION", input.deterministicEndToEndEvaluation],
    ["CI_EVIDENCE", input.ciEvidencePassed],
    ["SHAKTI_SIGN_OFF", input.shaktiSignOff]
  ];
  const blockingGates = gates.filter(([, passed]) => !passed).map(([name]) => name);
  if (!input.currentRealAuctionPilot) return { state: "DISCOVERY_READY", passed: false, blockingGates };
  if (blockingGates.length) {
    const evidenceReadyGates = new Set([
      "CURRENT_NOTICE_OR_PROCESS_DOCUMENT",
      "SOURCE_VERSION_HASH_BINDING",
      "CORRIGENDA_RECONCILIATION",
      "TITLE_POSSESSION_OWNERSHIP_EVIDENCE",
      "BIDDER_OBLIGATIONS"
    ]);
    const evidenceBlocked = blockingGates.some((gate) => evidenceReadyGates.has(gate));
    return { state: evidenceBlocked ? "DISCOVERY_READY" : "EVIDENCE_READY", passed: false, blockingGates };
  }
  return { state: "PRODUCTION_CERTIFIED", passed: true, blockingGates: [] };
}

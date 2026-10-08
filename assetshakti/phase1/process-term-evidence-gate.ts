export type ProcessTermEvidenceState =
  | "PUBLISHED_BY_IBBI"
  | "VERIFIED_PROCESS_TERM"
  | "REJECTED";

export interface ProcessTermEvidence {
  caseId: string;
  auctionId: string;
  lotId: string;
  sourceUrl: string;
  contentSha256: string;
  pageOrSection: string;
  publicationDate: string;
  termType:
    | "EMD"
    | "BIDDER_DOCUMENTS"
    | "SECTION_29A"
    | "INSPECTION"
    | "FORFEITURE"
    | "PAYMENT"
    | "TAX_TRANSFER_COST"
    | "PROCESS_DOCUMENT_REFERENCE";
  publishedByIbbI: boolean;
  sourceAuthority?: "IBBI" | "BAANKNET" | "LIQUIDATOR" | "CORPORATE_DEBTOR";
  exactRoundConfirmed: boolean;
  exactLotConfirmed: boolean;
  currentProcessBundleAcquired: boolean;
  currentProcessBundleHashBound: boolean;
  corrigendaReconciled: boolean;
}

export function evaluateProcessTermEvidence(
  evidence: ProcessTermEvidence,
): {
  state: ProcessTermEvidenceState;
  decisionUsable: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];

  if (!evidence.caseId.trim()) reasons.push("caseId is required");
  if (!evidence.auctionId.trim()) reasons.push("auctionId is required");
  if (!evidence.lotId.trim()) reasons.push("lotId is required");
  if (!evidence.sourceUrl.startsWith("https://")) reasons.push("HTTPS sourceUrl is required");
  if (!evidence.contentSha256.trim()) reasons.push("content SHA-256 is required");
  if (!evidence.pageOrSection.trim()) reasons.push("page/section reference is required");
  if (!evidence.publicationDate.trim()) reasons.push("publication date is required");
  const authority = evidence.sourceAuthority ?? (evidence.publishedByIbbI ? "IBBI" : undefined);
  if (!authority) reasons.push("authoritative source authority is not established");
  if (!evidence.exactRoundConfirmed) reasons.push("exact auction round is not confirmed");
  if (!evidence.exactLotConfirmed) reasons.push("exact lot is not confirmed");

  if (reasons.length) {
    return { state: "REJECTED", decisionUsable: false, reasons };
  }

  const processBundleVerified =
    evidence.currentProcessBundleAcquired &&
    evidence.currentProcessBundleHashBound &&
    evidence.corrigendaReconciled;

  if (!processBundleVerified) {
    return {
      state: "PUBLISHED_BY_IBBI",
      decisionUsable: false,
      reasons: [
        "published notice term is captured, but the current lot-specific process bundle is not fully verified"
      ]
    };
  }

  return { state: "VERIFIED_PROCESS_TERM", decisionUsable: true, reasons: [] };
}

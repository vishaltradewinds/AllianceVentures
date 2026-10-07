export type EvidenceReadiness = "COMPLETE" | "PARTIAL" | "BLOCKED";

export const REQUIRED_PILOT_CATEGORIES = [
  "IDENTITY","AUTHORITY","TITLE","POSSESSION","ENCUMBRANCE","LITIGATION",
  "PHYSICAL","LOCATION","VALUATION","AUCTION","BIDDER_OBLIGATION","PROVENANCE_PARTY_RISK"
] as const;

export interface PilotReadinessCase {
  caseId: string;
  evidence: Array<{category: string; status: string; sourceReference?: string}>;
  documentVersions?: Array<{versionStatus: string; sourceReference: string}>;
  auctionLotBinding?: { auctionDate: string; assetDescription: string; reservePrice?: number; emdDeadline?: string; sourceReference: string; documentVersionReference?: string; status: "VERIFIED" | "UNRESOLVED" };
}

export interface PilotReadinessResult {
  caseId: string;
  readiness: EvidenceReadiness;
  missingCategories: string[];
  blockingCategories: string[];
  unresolvedDocuments: string[];
  sourceBackedAuctionTerms: boolean;
  auctionLotBinding: "VERIFIED" | "UNRESOLVED";
}

export function assessPilotReadiness(input: PilotReadinessCase): PilotReadinessResult {
  const missingCategories = REQUIRED_PILOT_CATEGORIES.filter(category =>
    !input.evidence.some(e => e.category === category && e.status !== "MISSING")
  );
  const blockingCategories = REQUIRED_PILOT_CATEGORIES.filter(category =>
    input.evidence.some(e => e.category === category && ["MISSING","CONTRADICTED"].includes(e.status))
  );
  const unresolvedDocuments = (input.documentVersions ?? [])
    .filter(d => d.versionStatus === "UNRESOLVED")
    .map(d => d.sourceReference);
  const currentDocumentReferences = (input.documentVersions ?? [])
    .filter(d => d.versionStatus === "CURRENT")
    .map(d => d.sourceReference);
  const sourceBackedAuctionTerms = input.evidence.some(e =>
    e.category === "BIDDER_OBLIGATION" &&
    ["VERIFIED","REPORTED_BY_SOURCE"].includes(e.status) &&
    !!e.sourceReference &&
    (!!input.auctionLotBinding?.documentVersionReference
      ? e.sourceReference === input.auctionLotBinding.documentVersionReference
      : currentDocumentReferences.includes(e.sourceReference))
  );
  const auctionLotBinding = input.auctionLotBinding?.status ?? "UNRESOLVED";
  const readiness: EvidenceReadiness =
    unresolvedDocuments.length || blockingCategories.length || !sourceBackedAuctionTerms || auctionLotBinding === "UNRESOLVED"
      ? "BLOCKED"
      : missingCategories.length
        ? "PARTIAL"
        : "COMPLETE";
  return { caseId: input.caseId, readiness, missingCategories, blockingCategories, unresolvedDocuments, sourceBackedAuctionTerms, auctionLotBinding };
}

export type DocumentVersionStatus = "CURRENT" | "SUPERSEDED" | "UNRESOLVED";

export interface AuctionDocumentVersion {
  documentType: "AUCTION_NOTICE" | "CORRIGENDUM" | "ADDENDUM" | "PROCESS_DOCUMENT" | "OTHER";
  sourceReference: string;
  observedAt: string;
  versionStatus: DocumentVersionStatus;
  materialChanges?: string[];
}

export interface ReconciliationInput {
  documents: AuctionDocumentVersion[];
}

export interface ReconciliationResult {
  status: "RECONCILED" | "UNRESOLVED" | "NOT_APPLICABLE";
  latestApplicableReference?: string;
  materialConflicts: string[];
  supersededReferences: string[];
}

export function reconcileAuctionDocuments(input: ReconciliationInput): ReconciliationResult {
  if (!input.documents.length) return { status: "NOT_APPLICABLE", materialConflicts: [], supersededReferences: [] };

  const unresolved = input.documents.filter(d => d.versionStatus === "UNRESOLVED");
  const currents = input.documents.filter(d => d.versionStatus === "CURRENT");
  const superseded = input.documents.filter(d => d.versionStatus === "SUPERSEDED");

  if (unresolved.length || currents.length !== 1) {
    return {
      status: "UNRESOLVED",
      latestApplicableReference: currents.length === 1 ? currents[0].sourceReference : undefined,
      materialConflicts: unresolved.map(d => `Unresolved document version: ${d.sourceReference}`).concat(
        currents.length > 1 ? ["Multiple CURRENT documents require explicit reconciliation."] : []
      ),
      supersededReferences: superseded.map(d => d.sourceReference)
    };
  }

  const materialConflicts = currents[0].materialChanges ?? [];
  return {
    status: materialConflicts.length ? "RECONCILED" : "RECONCILED",
    latestApplicableReference: currents[0].sourceReference,
    materialConflicts,
    supersededReferences: superseded.map(d => d.sourceReference)
  };
}

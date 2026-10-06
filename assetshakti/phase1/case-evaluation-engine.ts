import type { PropertyAsset, EvidenceItem, PropertyClass } from "./property-schema";
import { evaluatePropertyProductionDecision, evaluatePropertyGates } from "./decision-engine";
import { reconcileAuctionDocuments, type AuctionDocumentVersion } from "./document-reconciliation";

export type CaseEvaluationInput = {
  caseId: string;
  source: {
    authority: string;
    sourceReference: string;
    observedAt: string;
  };
  expectedDecision: PropertyAsset["shakti"]["decision"];
  asset?: {
    class?: PropertyClass;
    subtype?: string;
    description?: string;
  };
  evidence: Array<{
    category: EvidenceItem["category"];
    status: EvidenceItem["status"];
    assertion: string;
    confidence?: number;
    id?: string;
    sourceName?: string;
    sourceReference?: string;
    observedAt?: string;
  }>;
  notes?: string;
  documentVersions?: AuctionDocumentVersion[];
  reconciliation?: { status: "RECONCILED" | "UNRESOLVED" | "NOT_APPLICABLE"; materialConflicts?: string[]; latestApplicableReference?: string };
};

export type CaseEvaluationResult = {
  caseId: string;
  expectedDecision: PropertyAsset["shakti"]["decision"];
  actualDecision: PropertyAsset["shakti"]["decision"];
  passed: boolean;
  criticalGatePassed: boolean;
  evidenceCount: number;
  source: CaseEvaluationInput["source"];
  gateResults: ReturnType<typeof import("./decision-engine").evaluatePropertyGates>;
  documentReconciliation?: ReturnType<typeof reconcileAuctionDocuments>;
};

function toPropertyAsset(input: CaseEvaluationInput): PropertyAsset {
  const evidence: EvidenceItem[] = input.evidence.map((item, index) => ({
    id: item.id ?? `${input.caseId}-E${String(index + 1).padStart(3, "0")}`,
    category: item.category,
    sourceName: item.sourceName ?? input.source.authority,
    sourceReference: item.sourceReference ?? input.source.sourceReference,
    observedAt: item.observedAt ?? input.source.observedAt,
    status: item.status,
    assertion: item.assertion,
    confidence: item.confidence ?? (item.status === "VERIFIED" ? 1 : item.status === "REPORTED_BY_SOURCE" ? 0.8 : item.status === "UNVERIFIED" ? 0.35 : 0),
  }));

  return {
    assetId: input.caseId,
    source: {
      platform: input.source.authority === "IBBI" ? "IBBI" : "OTHER_AUTHORISED",
      sourceUrl: input.source.sourceReference,
      auctionReference: input.caseId,
    },
    identity: {
      class: input.asset?.class ?? "OTHER_IMMOVABLE",
      subtype: input.asset?.subtype ?? "UNSPECIFIED",
      address: input.asset?.description,
    },
    evidence,
    shakti: {
      legal: 0,
      physical: 0,
      location: 0,
      market: 0,
      economics: 0,
      auction: 0,
      criticalGatePassed: false,
      decision: "INSUFFICIENT_EVIDENCE",
    },
  };
}

export function evaluateCase(input: CaseEvaluationInput): CaseEvaluationResult {
  const asset = toPropertyAsset(input);
  const documentReconciliation = input.documentVersions?.length
    ? reconcileAuctionDocuments({ documents: input.documentVersions })
    : undefined;
  const shakti = evaluatePropertyProductionDecision(asset);
  const gates = evaluatePropertyGates(asset);
  if (documentReconciliation && documentReconciliation.status === "UNRESOLVED") {
    gates.push({ gate: "DOCUMENT_RECONCILIATION", passed: false, reason: "Auction document versions are unresolved or have conflicting CURRENT records." });
    shakti.criticalGatePassed = false;
    shakti.decision = "DO_NOT_BID";
  }

  return {
    caseId: input.caseId,
    expectedDecision: input.expectedDecision,
    actualDecision: shakti.decision,
    passed: shakti.decision === input.expectedDecision,
    criticalGatePassed: shakti.criticalGatePassed,
    evidenceCount: asset.evidence.length,
    source: input.source,
    gateResults: gates,
    documentReconciliation,
  };
}

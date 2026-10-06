import type { DecisionState, EvidenceItem, PropertyAsset } from "./property-schema";

const CRITICAL = new Set(["IDENTITY", "TITLE", "AUTHORITY", "POSSESSION"]);

function hasCriticalFailure(evidence: EvidenceItem[]): boolean {
  return evidence.some(e => CRITICAL.has(e.category) && (e.status === "MISSING" || e.status === "CONTRADICTED"));
}

function evidenceCoverage(evidence: EvidenceItem[]): number {
  if (!evidence.length) return 0;
  const weighted = evidence.reduce((sum, e) => {
    const statusWeight =
      e.status === "VERIFIED" ? 1 :
      e.status === "REPORTED_BY_SOURCE" ? 0.8 :
      e.status === "UNVERIFIED" ? 0.35 :
      0;
    return sum + statusWeight * Math.max(0, Math.min(1, e.confidence));
  }, 0);
  return Math.round((weighted / evidence.length) * 100);
}

export function evaluateProperty(asset: PropertyAsset): PropertyAsset["shakti"] {
  const coverage = evidenceCoverage(asset.evidence);
  const criticalFailure = hasCriticalFailure(asset.evidence);
  const legal = Math.round(coverage * 0.30);
  const physical = Math.round(coverage * 0.15);
  const location = Math.round(coverage * 0.15);
  const market = Math.round(coverage * 0.15);
  const economics = Math.round(coverage * 0.15);
  const auction = Math.round(coverage * 0.10);
  const criticalGatePassed = !criticalFailure && coverage >= 75;

  let decision: DecisionState = "INSUFFICIENT_EVIDENCE";
  if (criticalFailure) decision = "DO_NOT_BID";
  else if (criticalGatePassed && coverage >= 85) decision = "BID_READY";
  else if (coverage >= 45) decision = "CONDITIONAL";

  return {
    legal, physical, location, market, economics, auction,
    criticalGatePassed,
    decision
  };
}

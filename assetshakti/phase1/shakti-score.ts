import type { DecisionState, EvidenceItem, PropertyAsset } from "./property-schema";

const CRITICAL = new Set(["IDENTITY", "TITLE", "AUTHORITY", "POSSESSION"]);

const DOMAIN_CATEGORIES: Record<string, string[]> = {
  legal: ["IDENTITY", "TITLE", "AUTHORITY", "ENCUMBRANCE", "LITIGATION"],
  physical: ["POSSESSION", "PHYSICAL"],
  location: ["LOCATION"],
  market: ["VALUATION"],
  economics: ["VALUATION", "AUCTION"],
  auction: ["AUCTION"]
};

function statusWeight(status: EvidenceItem["status"]): number {
  return status === "VERIFIED" ? 1 :
    status === "REPORTED_BY_SOURCE" ? 0.8 :
    status === "UNVERIFIED" ? 0.35 : 0;
}

function categoryScore(evidence: EvidenceItem[], categories: string[]): number {
  const items = evidence.filter(e => categories.includes(e.category));
  if (!items.length) return 0;

  const weighted = items.reduce(
    (sum, e) => sum + statusWeight(e.status) * Math.max(0, Math.min(1, e.confidence)),
    0
  );

  return Math.round((weighted / items.length) * 100);
}

function overallCoverage(evidence: EvidenceItem[]): number {
  if (!evidence.length) return 0;
  const weighted = evidence.reduce(
    (sum, e) => sum + statusWeight(e.status) * Math.max(0, Math.min(1, e.confidence)),
    0
  );
  return Math.round((weighted / evidence.length) * 100);
}

function hasCriticalFailure(evidence: EvidenceItem[]): boolean {
  return evidence.some(
    e => CRITICAL.has(e.category) &&
      (e.status === "MISSING" || e.status === "CONTRADICTED")
  );
}

/**
 * Evidence-gated prototype scorer.
 *
 * Important:
 * - Domain scores are now based on evidence relevant to that domain.
 * - Missing/contradicted critical evidence blocks BID_READY and conservatively
 *   produces DO_NOT_BID.
 * - A score never overrides a failed critical gate.
 * - This remains a validation-stage scorer until the 50-case corpus and
 *   error analysis are complete.
 */
export function evaluateProperty(asset: PropertyAsset): PropertyAsset["shakti"] {
  const evidence = asset.evidence;
  const coverage = overallCoverage(evidence);
  const criticalFailure = hasCriticalFailure(evidence);

  const legal = categoryScore(evidence, DOMAIN_CATEGORIES.legal);
  const physical = categoryScore(evidence, DOMAIN_CATEGORIES.physical);
  const location = categoryScore(evidence, DOMAIN_CATEGORIES.location);
  const market = categoryScore(evidence, DOMAIN_CATEGORIES.market);
  const economics = categoryScore(evidence, DOMAIN_CATEGORIES.economics);
  const auction = categoryScore(evidence, DOMAIN_CATEGORIES.auction);

  const criticalGatePassed = !criticalFailure && coverage >= 75;

  let decision: DecisionState = "INSUFFICIENT_EVIDENCE";
  if (criticalFailure) decision = "DO_NOT_BID";
  else if (criticalGatePassed && coverage >= 85) decision = "BID_READY";
  else if (coverage >= 45) decision = "CONDITIONAL";

  return {
    legal,
    physical,
    location,
    market,
    economics,
    auction,
    criticalGatePassed,
    decision
  };
}

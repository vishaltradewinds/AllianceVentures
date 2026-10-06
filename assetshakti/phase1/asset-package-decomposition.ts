export type AssetComponentType =
  | "LAND" | "BUILDING" | "PLANT_MACHINERY" | "SECURITIES_FINANCIAL_ASSETS"
  | "NRRA_PUFE_CLAIM" | "GOING_CONCERN" | "OTHER";

export type AssetSaleStructure =
  | "PROPERTY_ONLY" | "COMPOSITE_PACKAGE" | "SLUMP_SALE"
  | "GOING_CONCERN" | "NRRA_TRANSFER" | "ALTERNATIVE_LOTS" | "UNRESOLVED";

export interface AuctionAssetComponent {
  componentType: AssetComponentType;
  description: string;
  sourceReference?: string;
  observedAt?: string;
}

export interface AssetPackageInput {
  caseId: string;
  auctionDescription: string;
  components: AuctionAssetComponent[];
  alternativeStructures?: string[];
  saleBasisFlags?: string[];
}

export interface AssetPackageAssessment {
  caseId: string;
  structure: AssetSaleStructure;
  components: AuctionAssetComponent[];
  componentCount: number;
  requiresComponentLevelEvidence: boolean;
  blockingReasons: string[];
  propertyOnlyDecisionAllowed: boolean;
}

const COMPONENT_MARKERS: Record<AssetComponentType, RegExp[]> = {
  LAND: [/\bland\b/i, /leasehold rights? of land/i],
  BUILDING: [/\bbuilding\b/i, /\bproperty\b/i],
  PLANT_MACHINERY: [/plant\s*(?:&|and)\s*machinery/i, /plant\s*and\s*machineries/i, /machinery/i],
  SECURITIES_FINANCIAL_ASSETS: [/securities/i, /financial assets?/i, /shares?/i],
  NRRA_PUFE_CLAIM: [/\bnrra\b/i, /not[- ]readily[- ]realisable/i, /pufe/i, /actionable claim/i],
  GOING_CONCERN: [/going concern/i],
  OTHER: []
};

export function detectComponents(description: string): AuctionAssetComponent[] {
  const components: AuctionAssetComponent[] = [];
  for (const [componentType, markers] of Object.entries(COMPONENT_MARKERS) as [AssetComponentType, RegExp[]][]) {
    if (componentType === "OTHER") continue;
    if (markers.some((m) => m.test(description))) {
      components.push({ componentType, description });
    }
  }
  return components;
}

export function assessAssetPackage(input: AssetPackageInput): AssetPackageAssessment {
  const components = input.components.length ? input.components : detectComponents(input.auctionDescription);
  const unique = Array.from(new Map(components.map(c => [c.componentType, c])).values());
  const hasNonProperty = unique.some(c => ["PLANT_MACHINERY","SECURITIES_FINANCIAL_ASSETS","NRRA_PUFE_CLAIM","GOING_CONCERN"].includes(c.componentType));
  const composite = unique.length > 1;
  const alternative = Boolean(input.alternativeStructures?.length);
  const structure: AssetSaleStructure =
    alternative ? "ALTERNATIVE_LOTS" :
    unique.some(c => c.componentType === "GOING_CONCERN") ? "GOING_CONCERN" :
    unique.some(c => c.componentType === "NRRA_PUFE_CLAIM") ? "NRRA_TRANSFER" :
    /slump\s*sale/i.test(input.auctionDescription) ? "SLUMP_SALE" :
    composite || hasNonProperty ? "COMPOSITE_PACKAGE" :
    unique.some(c => c.componentType === "LAND" || c.componentType === "BUILDING") ? "PROPERTY_ONLY" :
    "UNRESOLVED";
  const blockingReasons: string[] = [];
  if (structure === "UNRESOLVED") blockingReasons.push("Sale structure could not be determined from supplied evidence.");
  if (composite || hasNonProperty) blockingReasons.push("Component-level evidence is required; property-only evaluation cannot represent the complete sale object.");
  if (alternative) blockingReasons.push("Alternative lots/structures require explicit selection and cross-lot reconciliation.");
  if (input.saleBasisFlags?.length) blockingReasons.push("Sale-basis disclaimers must remain explicit and cannot substitute for title, condition or possession evidence.");
  return {
    caseId: input.caseId,
    structure,
    components: unique,
    componentCount: unique.length,
    requiresComponentLevelEvidence: composite || hasNonProperty,
    blockingReasons,
    propertyOnlyDecisionAllowed: !composite && !hasNonProperty && structure === "PROPERTY_ONLY"
  };
}

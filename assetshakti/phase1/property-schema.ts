export type EvidenceStatus =
  | "VERIFIED"
  | "REPORTED_BY_SOURCE"
  | "UNVERIFIED"
  | "MISSING"
  | "CONTRADICTED";

export type DecisionState =
  | "BID_READY"
  | "CONDITIONAL"
  | "DO_NOT_BID"
  | "INSUFFICIENT_EVIDENCE";

export type PropertyClass =
  | "RESIDENTIAL"
  | "COMMERCIAL"
  | "INDUSTRIAL"
  | "AGRICULTURAL"
  | "OTHER_IMMOVABLE"
  | "COMPOSITE";

export interface EvidenceItem {
  id: string;
  category: "IDENTITY" | "TITLE" | "ENCUMBRANCE" | "LITIGATION" | "POSSESSION" | "BIDDER_OBLIGATION" | "PROVENANCE_PARTY_RISK" |
    "PHYSICAL" | "LOCATION" | "VALUATION" | "AUCTION" | "AUTHORITY";
  sourceName: string;
  sourceReference?: string;
  observedAt?: string;
  status: EvidenceStatus;
  assertion: string;
  confidence: number;
  notes?: string;
}

export interface PropertyAsset {
  assetId: string;
  source: {
    platform: "BAANKNET" | "IBBI" | "OTHER_AUTHORISED";
    sourceUrl?: string;
    auctionReference?: string;
  };
  identity: {
    class: PropertyClass;
    subtype: string;
    address?: string;
    state?: string;
    district?: string;
    city?: string;
    surveyOrPlotNumber?: string;
    area?: { value: number; unit: "SQFT" | "SQM" | "ACRE" | "HECTARE" | "OTHER" };
    boundaries?: Record<string, string>;
  };
  legalRoute?: {
    regime: "SARFAESI" | "DRT" | "IBC" | "NCLT" | "BANK_OWNED" | "ARC" | "OTHER" | "UNKNOWN";
    authority?: string;
  };
  auction?: {
    reservePrice?: number;
    emdAmount?: number;
    auctionDate?: string;
    emdDeadline?: string;
    possessionType?: "PHYSICAL" | "SYMBOLIC" | "UNKNOWN";
    saleBasis?: string;
  };
  evidence: EvidenceItem[];
  shakti: {
    legal: number;
    physical: number;
    location: number;
    market: number;
    economics: number;
    auction: number;
    criticalGatePassed: boolean;
    decision: DecisionState;
  };
}

export type AuctionSourceProvider =
  | "IBBI" | "BAANKNET" | "MSTC" | "SAMIL" | "EAUCTION_INDIA"
  | "INDIAN_RAILWAYS" | "C1_INDIA" | "AUCTION_TIGER";

export type SourceAccessMode =
  | "PUBLIC_DISCOVERY" | "PUBLIC_DOCUMENT" | "USER_SUPPLIED" | "AUTHENTICATED";

export type AuctionMechanism =
  | "ENGLISH" | "YANKEE" | "E_TENDER" | "E_TENDER_CUM_E_AUCTION"
  | "BOOK_BUILDING" | "TWO_STAGE" | "SWISS_CHALLENGE" | "SMRA"
  | "PHYGITAL" | "PHYSICAL" | "UNKNOWN";

export type AssetCategory =
  | "PROPERTY" | "PLANT_AND_MACHINERY" | "VEHICLE" | "SCRAP"
  | "MINERAL" | "FOREST_AGRI" | "GOLD" | "CUSTOMS_GOODS" | "OTHER";

export interface AuctionSourceAdapter {
  provider: AuctionSourceProvider;
  displayName: string;
  authoritativeUrl: string;
  accessMode: SourceAccessMode;
  discoveryEnabled: boolean;
  documentAcquisitionEnabled: boolean;
  transactionExecutionEnabled: false;
  supportedMechanisms: AuctionMechanism[];
  supportedAssetCategories: AssetCategory[];
}

export interface NormalizedAuctionLot {
  provider: AuctionSourceProvider;
  sourceRecordId: string;
  auctionId?: string;
  lotId?: string;
  sourceUrl: string;
  sourceTimestamp?: string;
  sourceVersion?: string;
  contentSha256?: string;
  auctionStart?: string;
  auctionEnd?: string;
  auctionMechanism: AuctionMechanism;
  assetCategory: AssetCategory;
  title: string;
  location?: string;
  sellerOrOwner?: string;
  reservePrice?: number;
  emdAmount?: number;
  currency: "INR";
  documentReferences: string[];
  evidenceState: "DISCOVERED" | "ACQUIRED_PENDING_VERIFICATION" | "VERIFIED";
  decisionEvidenceProjection: false;
}

export const AUCTION_SOURCE_ADAPTERS: readonly AuctionSourceAdapter[] = [
  {
    provider: "IBBI",
    displayName: "IBBI Liquidation Auction Notices",
    authoritativeUrl: "https://ibbi.gov.in/liquidation-auction-notices/lists",
    accessMode: "PUBLIC_DISCOVERY", discoveryEnabled: true, documentAcquisitionEnabled: true,
    transactionExecutionEnabled: false, supportedMechanisms: ["ENGLISH", "UNKNOWN"],
    supportedAssetCategories: ["PROPERTY", "PLANT_AND_MACHINERY", "OTHER"]
  },
  {
    provider: "BAANKNET",
    displayName: "BAANKNET — Bank Assets Auction Network",
    authoritativeUrl: "https://baanknet.com/",
    accessMode: "PUBLIC_DISCOVERY", discoveryEnabled: true, documentAcquisitionEnabled: true,
    transactionExecutionEnabled: false, supportedMechanisms: ["ENGLISH", "UNKNOWN"],
    supportedAssetCategories: ["PROPERTY", "PLANT_AND_MACHINERY", "VEHICLE", "OTHER"]
  },
  {
    provider: "MSTC",
    displayName: "MSTC e-Commerce / MSTC Realty",
    authoritativeUrl: "https://www.mstcecommerce.com/",
    accessMode: "PUBLIC_DISCOVERY", discoveryEnabled: true, documentAcquisitionEnabled: true,
    transactionExecutionEnabled: false,
    supportedMechanisms: ["ENGLISH", "YANKEE", "E_TENDER", "E_TENDER_CUM_E_AUCTION", "BOOK_BUILDING", "TWO_STAGE", "SWISS_CHALLENGE", "SMRA"],
    supportedAssetCategories: ["PROPERTY", "PLANT_AND_MACHINERY", "SCRAP", "MINERAL", "FOREST_AGRI", "CUSTOMS_GOODS", "OTHER"]
  },
  {
    provider: "SAMIL",
    displayName: "SAMIL — Shriram Automall India Limited",
    authoritativeUrl: "https://www.samil.in/",
    accessMode: "PUBLIC_DISCOVERY", discoveryEnabled: true, documentAcquisitionEnabled: true,
    transactionExecutionEnabled: false, supportedMechanisms: ["ENGLISH", "PHYGITAL", "PHYSICAL", "UNKNOWN"],
    supportedAssetCategories: ["VEHICLE", "PLANT_AND_MACHINERY", "PROPERTY", "SCRAP", "GOLD", "OTHER"]
  },
  {
    provider: "EAUCTION_INDIA",
    displayName: "NIC eAuction India",
    authoritativeUrl: "https://www.eauction.gov.in/eAuction/app",
    accessMode: "PUBLIC_DISCOVERY", discoveryEnabled: true, documentAcquisitionEnabled: true,
    transactionExecutionEnabled: false, supportedMechanisms: ["ENGLISH", "E_TENDER", "UNKNOWN"],
    supportedAssetCategories: ["PROPERTY", "SCRAP", "VEHICLE", "OTHER"]
  },
  {
    provider: "INDIAN_RAILWAYS",
    displayName: "Indian Railways e-Tender / e-Auction",
    authoritativeUrl: "https://www.ireps.gov.in/",
    accessMode: "PUBLIC_DISCOVERY", discoveryEnabled: true, documentAcquisitionEnabled: true,
    transactionExecutionEnabled: false, supportedMechanisms: ["ENGLISH", "E_TENDER", "UNKNOWN"],
    supportedAssetCategories: ["PROPERTY", "SCRAP", "OTHER"]
  },
  {
    provider: "AUCTION_TIGER",
    displayName: "AuctionTiger",
    authoritativeUrl: "https://www.auctiontiger.in/",
    accessMode: "PUBLIC_DISCOVERY", discoveryEnabled: true, documentAcquisitionEnabled: true,
    transactionExecutionEnabled: false, supportedMechanisms: ["ENGLISH", "UNKNOWN"],
    supportedAssetCategories: ["PROPERTY", "PLANT_AND_MACHINERY", "VEHICLE", "SCRAP", "OTHER"]
  },
  {
    provider: "C1_INDIA",
    displayName: "C1 India Bankeauctions",
    authoritativeUrl: "https://bankeauctions.com/",
    accessMode: "PUBLIC_DISCOVERY", discoveryEnabled: true, documentAcquisitionEnabled: true,
    transactionExecutionEnabled: false, supportedMechanisms: ["ENGLISH", "UNKNOWN"],
    supportedAssetCategories: ["PROPERTY", "PLANT_AND_MACHINERY", "VEHICLE", "OTHER"]
  }
];

export function getAuctionSourceAdapter(provider: AuctionSourceProvider): AuctionSourceAdapter {
  const adapter = AUCTION_SOURCE_ADAPTERS.find((item) => item.provider === provider);
  if (!adapter) throw new Error("Unsupported auction source provider: " + provider);
  return adapter;
}

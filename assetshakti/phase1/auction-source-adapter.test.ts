import {
  AUCTION_SOURCE_ADAPTERS,
  getAuctionSourceAdapter,
  type AuctionSourceProvider,
  type NormalizedAuctionLot
} from "./auction-source-adapter";
import { normalizeDiscoveredHtml } from "./source-discovery";

const expected: AuctionSourceProvider[] = [
  "IBBI", "BAANKNET", "MSTC", "SAMIL", "EAUCTION_INDIA", "INDIAN_RAILWAYS", "C1_INDIA", "AUCTION_TIGER"
];

if (AUCTION_SOURCE_ADAPTERS.length !== expected.length) {
  throw new Error("FAIL: source registry does not contain the expected eight providers");
}

for (const provider of expected) {
  const adapter = getAuctionSourceAdapter(provider);
  if (!adapter.authoritativeUrl.startsWith("https://")) throw new Error("FAIL: " + provider + " has no HTTPS authoritative URL");
  if (adapter.transactionExecutionEnabled !== false) throw new Error("FAIL: " + provider + " must never execute transactions");
  if (!adapter.discoveryEnabled) throw new Error("FAIL: " + provider + " discovery is disabled");
}

const sample: NormalizedAuctionLot = {
  provider: "MSTC",
  sourceRecordId: "MSTC-EXAMPLE-001",
  auctionId: "A-001",
  lotId: "LOT-01",
  sourceUrl: "https://www.mstcecommerce.com/",
  auctionMechanism: "ENGLISH",
  assetCategory: "PROPERTY",
  title: "Example industrial property",
  currency: "INR",
  documentReferences: ["https://www.mstcecommerce.com/"],
  evidenceState: "DISCOVERED",
  decisionEvidenceProjection: false
};

if (sample.provider !== "MSTC" || sample.lotId !== "LOT-01" || sample.decisionEvidenceProjection !== false) {
  throw new Error("FAIL: normalized lot identity/evidence invariants are not preserved");
}

const discovery = normalizeDiscoveredHtml({ provider: "AUCTION_TIGER", url: "https://www.auctiontiger.in/" }, "<tr><th>Listing ID</th><th>Reserve Price</th></tr><tr><td>123</td><td>₹2.50 Crore</td></tr>");
if (discovery.records.length !== 1 || discovery.records[0].reservePrice !== 25000000) throw new Error("FAIL: source discovery normalization regression");
console.log("PASS: multi-auction source adapter registry and discovery invariants");

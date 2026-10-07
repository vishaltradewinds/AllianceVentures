import { normalizeDiscoveredHtml } from "./source-discovery";

const auctionTigerHtml = "<table><tr><th>Listing ID</th><th>Auction Bank Name</th><th>Reserve Price</th><th>Auction Date</th></tr><tr><td>123</td><td>Example Bank</td><td>₹2.50 Crore</td><td>26 October 2026</td></tr></table>";
const tiger = normalizeDiscoveredHtml({ provider: "AUCTION_TIGER", url: "https://www.auctiontiger.in/" }, auctionTigerHtml);
if (tiger.records.length !== 1) throw new Error("FAIL: AuctionTiger discovery did not normalize one listing");
if (tiger.records[0].provider !== "AUCTION_TIGER") throw new Error("FAIL: provider identity was lost");
if (tiger.records[0].reservePrice !== 25000000) throw new Error("FAIL: crore reserve normalization failed");
if (tiger.records[0].decisionEvidenceProjection !== false) throw new Error("FAIL: discovery projected into decision evidence");

const mstcHtml = "<table><tr><th>Property</th><th>EMD</th></tr><tr><td>Industrial shed with plant and machinery</td><td>100000</td></tr></table>";
const mstc = normalizeDiscoveredHtml({ provider: "MSTC", url: "https://www.mstcecommerce.com/" }, mstcHtml);
if (mstc.records[0].assetCategory !== "PLANT_AND_MACHINERY") throw new Error("FAIL: MSTC category normalization failed");

const empty = normalizeDiscoveredHtml({ provider: "SAMIL", url: "https://www.samil.in/" }, "<html><body>No auction table</body></html>");
if (!empty.failClosed || empty.records.length !== 0) throw new Error("FAIL: empty discovery must fail closed");

console.log("PASS: live-source discovery normalization invariants");

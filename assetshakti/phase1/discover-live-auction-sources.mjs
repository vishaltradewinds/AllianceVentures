import fs from "node:fs/promises";

const SOURCES = [
  { provider: "IBBI", url: "https://ibbi.gov.in/liquidation-auction-notices/lists", mode: "PUBLIC_HTML" },
  { provider: "BAANKNET", url: "https://baanknet.com/", mode: "CONTROLLED_DISCOVERY" },
  { provider: "MSTC", url: "https://web.mstcecommerce.com/auctionhome/propsearch/property_search.jsp", mode: "PUBLIC_HTML" },
  { provider: "EAUCTION_INDIA", url: "https://www.eauction.gov.in/eAuction/app", mode: "PUBLIC_HTML" },
  { provider: "INDIAN_RAILWAYS", url: "https://www.ireps.gov.in/", mode: "CONTROLLED_DISCOVERY" },
  { provider: "SAMIL", url: "https://www.samil.in/", mode: "PUBLIC_HTML" }
];

const clean = v => v.replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/\s+/g, " ").trim();

function classify(provider, html) {
  const text = clean(html).slice(0, 250000);
  const signals = {
    IBBI: /Liquidation|Auction Notices|Auction/i,
    BAANKNET: /auction|property|bank/i,
    MSTC: /Floor Price|EMD value|Bank Property ID|Auction/i,
    EAUCTION_INDIA: /Auction Search|Active Auctions|Department Onboarding/i,
    INDIAN_RAILWAYS: /IREPS|e-Auction|eAuction/i,
    SAMIL: /Live Now|Upcoming Auctions|Automall|Auction/i
  };
  return {
    recordSignals: (text.match(/auction/gi) || []).length,
    categories: provider === "MSTC" ? ["PROPERTY","PLANT_AND_MACHINERY","SCRAP","MINERAL","FOREST_AGRI","CUSTOMS_GOODS"] : ["PROPERTY","PLANT_AND_MACHINERY","VEHICLE","OTHER"],
    liveSurface: signals[provider].test(text)
  };
}

const results = [];
for (const source of SOURCES) {
  const result = { provider: source.provider, url: source.url, accessMode: source.mode, checkedAt: new Date().toISOString(), sourceVersion: "direct-platform-v1", status: "UNKNOWN", decisionEvidenceProjection: false };
  try {
    const response = await fetch(source.url, { redirect: "follow", headers: { accept: "text/html,application/xhtml+xml", "user-agent": "AssetShakti-Source-Discovery/1.0" } });
    result.httpStatus = response.status;
    if (!response.ok) throw new Error("HTTP " + response.status);
    const classified = classify(source.provider, await response.text());
    Object.assign(result, classified);
    result.status = classified.liveSurface ? "DISCOVERY_OK" : "DISCOVERY_NO_MACHINE_READABLE_SURFACE";
    if (source.provider === "BAANKNET" || source.provider === "INDIAN_RAILWAYS") result.warning = "Use only public/documented interfaces or controlled authorised evidence intake; never bypass access controls.";
  } catch (error) {
    result.status = "DISCOVERY_UNAVAILABLE";
    result.warning = String(error?.message || error);
  }
  results.push(result);
}
await fs.mkdir("assetshakti/phase1/live-source-evidence", { recursive: true });
await fs.writeFile("assetshakti/phase1/live-source-evidence/latest-discovery.json", JSON.stringify({ schemaVersion: "1.1", sourcePolicy: "DIRECT_AUCTION_PLATFORMS_ONLY", productionCertification: "OFF", results }, null, 2) + "\n");
console.log(JSON.stringify({ checked: results.length, directPlatformsOnly: true, productionCertification: "OFF" }, null, 2));

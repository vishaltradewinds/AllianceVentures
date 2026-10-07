import fs from "node:fs/promises";

const SOURCES = [
  { provider: "MSTC", url: "https://web.mstcecommerce.com/auctionhome/propsearch/property_search.jsp", mode: "PUBLIC_HTML" },
  { provider: "SAMIL", url: "https://www.samil.in/automall-profiles", mode: "PUBLIC_HTML" },
  { provider: "AUCTION_TIGER", url: "https://auctiontiger.in/", mode: "PUBLIC_HTML" },
  { provider: "BAANKNET", url: "https://baanknet.com/", mode: "CONTROLLED_DISCOVERY" }
];

function clean(v) {
  return v.replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&").replace(/\s+/g, " ").trim();
}

function classify(provider, html) {
  const text = clean(html).slice(0, 250000);
  if (provider === "MSTC") return {
    recordSignals: (text.match(/Floor Price|EMD amount|Auction\/Property Ref No/gi) || []).length,
    categories: ["PROPERTY"],
    liveSurface: /MSTC Property Portal|Property Search/i.test(text)
  };
  if (provider === "SAMIL") return {
    recordSignals: (text.match(/Live Now|Upcoming Auctions|Auction Vehicles|Construction Equipment|Farm Equipment/gi) || []).length,
    categories: ["VEHICLE", "PLANT_AND_MACHINERY", "PROPERTY", "GOLD"],
    liveSurface: /Live Now|Upcoming Auctions|Automall/i.test(text)
  };
  if (provider === "AUCTION_TIGER") return {
    recordSignals: (text.match(/Listing ID|Reserve Price|Auction Date|Auction Bank Name/gi) || []).length,
    categories: ["PROPERTY", "PLANT_AND_MACHINERY", "VEHICLE", "SCRAP"],
    liveSurface: /Listing ID|Auction Bank Name|Reserve Price/i.test(text)
  };
  return {
    recordSignals: 0,
    categories: ["PROPERTY", "PLANT_AND_MACHINERY", "VEHICLE", "OTHER"],
    liveSurface: false
  };
}

const results = [];
for (const source of SOURCES) {
  const result = {
    provider: source.provider,
    url: source.url,
    accessMode: source.mode,
    checkedAt: new Date().toISOString(),
    status: "UNKNOWN",
    sourceVersion: "public-surface-v1",
    recordSignals: 0,
    categories: [],
    liveSurface: false,
    decisionEvidenceProjection: false,
    warning: ""
  };

  try {
    const response = await fetch(source.url, {
      redirect: "follow",
      headers: { "accept": "text/html,application/xhtml+xml", "user-agent": "AssetShakti-Source-Discovery/1.0" }
    });
    result.httpStatus = response.status;
    if (!response.ok) throw new Error("HTTP " + response.status);
    const html = await response.text();
    const classified = classify(source.provider, html);
    Object.assign(result, classified);
    result.status = classified.liveSurface ? "DISCOVERY_OK" : "DISCOVERY_NO_MACHINE_READABLE_SURFACE";
    if (source.provider === "BAANKNET") {
      result.warning = "BAANKNET public root was reached, but no internal search/API contract is assumed. Use authorised export, documented API, or controlled user evidence intake.";
    }
  } catch (error) {
    result.status = "DISCOVERY_UNAVAILABLE";
    result.warning = String(error?.message || error);
  }
  results.push(result);
}

await fs.mkdir("assetshakti/phase1/live-source-evidence", { recursive: true });
await fs.writeFile(
  "assetshakti/phase1/live-source-evidence/latest-discovery.json",
  JSON.stringify({ schemaVersion: "1.0", productionCertification: "OFF", results }, null, 2) + "\n"
);

const ok = results.filter(r => r.status === "DISCOVERY_OK").length;
console.log(JSON.stringify({ checked: results.length, discoveryOk: ok, productionCertification: "OFF" }, null, 2));
if (ok === 0) process.exitCode = 1;

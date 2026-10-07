import type { AuctionSourceProvider, AuctionMechanism, AssetCategory, NormalizedAuctionLot } from "./auction-source-adapter";

export interface DiscoveryRequest {
  provider: AuctionSourceProvider;
  url: string;
  sourceTimestamp?: string;
}

export interface DiscoveryResult {
  provider: AuctionSourceProvider;
  sourceUrl: string;
  records: NormalizedAuctionLot[];
  warnings: string[];
  failClosed: boolean;
}

const PROVIDER_RULES: Record<string, { mechanism: AuctionMechanism; category: AssetCategory }> = {
  AUCTION_TIGER: { mechanism: "ENGLISH", category: "PROPERTY" },
  MSTC: { mechanism: "ENGLISH", category: "PROPERTY" },
  SAMIL: { mechanism: "PHYGITAL", category: "VEHICLE" }
};

function clean(value: string): string {
  return value.replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ").trim();
}

function money(value?: string): number | undefined {
  if (!value) return undefined;
  const normalized = value.replace(/[,₹]/g, " ").replace(/\s+/g, " ").trim();
  const crore = normalized.match(/([0-9]+(?:\.[0-9]+)?)\s*(?:crore|cr)\b/i);
  if (crore) return Number(crore[1]) * 10000000;
  const lakh = normalized.match(/([0-9]+(?:\.[0-9]+)?)\s*(?:lakh|lac)\b/i);
  if (lakh) return Number(lakh[1]) * 100000;
  const direct = normalized.match(/[0-9]+(?:\.[0-9]+)?/);
  return direct ? Number(direct[0]) : undefined;
}

function categoryFromText(text: string, fallback: AssetCategory): AssetCategory {
  const t = text.toLowerCase();
  if (/plant\s*(and|&)\s*machinery|machinery/.test(t)) return "PLANT_AND_MACHINERY";
  if (/vehicle|car|truck|bus|tractor|two.?wheeler/.test(t)) return "VEHICLE";
  if (/scrap|salvage/.test(t)) return "SCRAP";
  if (/gold/.test(t)) return "GOLD";
  if (/mineral|coal|iron ore/.test(t)) return "MINERAL";
  if (/customs/.test(t)) return "CUSTOMS_GOODS";
  return fallback;
}

function record(provider: AuctionSourceProvider, sourceUrl: string, title: string, raw: string, index: number, sourceTimestamp?: string): NormalizedAuctionLot {
  const rule = PROVIDER_RULES[provider] ?? { mechanism: "UNKNOWN" as AuctionMechanism, category: "OTHER" as AssetCategory };
  return {
    provider,
    sourceRecordId: provider + ":" + index + ":" + Buffer.from(title).toString("base64url").slice(0, 24),
    sourceUrl,
    sourceTimestamp,
    auctionMechanism: rule.mechanism,
    assetCategory: categoryFromText(raw, rule.category),
    title: title.slice(0, 500),
    location: undefined,
    sellerOrOwner: undefined,
    reservePrice: money(raw),
    currency: "INR",
    documentReferences: [],
    evidenceState: "DISCOVERED",
    decisionEvidenceProjection: false
  };
}

function discoverAuctionTiger(html: string, request: DiscoveryRequest): NormalizedAuctionLot[] {
  const rows = [...html.matchAll(/<tr\b[^>]*>([\\s\\S]*?)<\\/tr>/gi)];
  const output: NormalizedAuctionLot[] = [];
  for (let i = 0; i < rows.length; i++) {
    const text = clean(rows[i][1]);
    if (!/listing id|reserve price|auction date|auction bank/i.test(text)) continue;
    const title = text.replace(/Listing ID|Auction Bank Name|Reserve Price|Auction Date|Action/gi, "").trim();
    if (!title) continue;
    output.push(record("AUCTION_TIGER", request.url, title, text, i, request.sourceTimestamp));
  }
  return output;
}

function discoverMstc(html: string, request: DiscoveryRequest): NormalizedAuctionLot[] {
  const rows = [...html.matchAll(/<tr\b[^>]*>([\\s\\S]*?)<\\/tr>/gi)];
  const output: NormalizedAuctionLot[] = [];
  for (let i = 0; i < rows.length; i++) {
    const text = clean(rows[i][1]);
    if (!/auction|property|emd|floor price/i.test(text)) continue;
    const title = text.slice(0, 500);
    if (!title) continue;
    output.push(record("MSTC", request.url, title, text, i, request.sourceTimestamp));
  }
  return output;
}

function discoverSamil(html: string, request: DiscoveryRequest): NormalizedAuctionLot[] {
  const chunks = html.split(/(?:Live Now|Upcoming Auctions|Commercial Vehicles|Passenger Cars|Construction Equipment|Farm Equipment|Property & Other Assets)/i);
  return chunks.slice(1, 80).map((chunk, i) => {
    const text = clean(chunk).slice(0, 1000);
    return record("SAMIL", request.url, text.slice(0, 250) || "SAMIL auction", text, i, request.sourceTimestamp);
  }).filter(x => x.title.length > 3);
}

export function normalizeDiscoveredHtml(request: DiscoveryRequest, html: string): DiscoveryResult {
  let records: NormalizedAuctionLot[] = [];
  if (request.provider === "AUCTION_TIGER") records = discoverAuctionTiger(html, request);
  else if (request.provider === "MSTC") records = discoverMstc(html, request);
  else if (request.provider === "SAMIL") records = discoverSamil(html, request);

  const warnings: string[] = [];
  if (!records.length) warnings.push("No machine-readable auction records were discovered from this source response.");
  warnings.push("Discovery is not verification and cannot project into decision evidence.");
  return { provider: request.provider, sourceUrl: request.url, records, warnings, failClosed: records.length === 0 };
}

export async function discoverPublicAuctionSource(request: DiscoveryRequest): Promise<DiscoveryResult> {
  const response = await fetch(request.url, {
    headers: { "accept": "text/html,application/xhtml+xml" },
    redirect: "follow"
  });
  if (!response.ok) throw new Error("Source discovery failed with HTTP " + response.status);
  const html = await response.text();
  return normalizeDiscoveredHtml(
    { ...request, sourceTimestamp: request.sourceTimestamp ?? new Date().toISOString() },
    html
  );
}

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

const PROVIDER_RULES: Record<AuctionSourceProvider, { mechanism: AuctionMechanism; category: AssetCategory }> = {
  IBBI: { mechanism: "ENGLISH", category: "PROPERTY" },
  BAANKNET: { mechanism: "ENGLISH", category: "PROPERTY" },
  MSTC: { mechanism: "ENGLISH", category: "PROPERTY" },
  SAMIL: { mechanism: "PHYGITAL", category: "VEHICLE" },
  EAUCTION_INDIA: { mechanism: "ENGLISH", category: "PROPERTY" },
  INDIAN_RAILWAYS: { mechanism: "E_TENDER", category: "OTHER" }
};

function clean(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
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

function record(
  provider: AuctionSourceProvider,
  sourceUrl: string,
  title: string,
  raw: string,
  index: number,
  sourceTimestamp?: string
): NormalizedAuctionLot {
  const rule = PROVIDER_RULES[provider];
  return {
    provider,
    sourceRecordId: provider + ":" + index + ":" + Buffer.from(title).toString("base64url").slice(0, 24),
    sourceUrl,
    sourceTimestamp,
    auctionMechanism: rule.mechanism,
    assetCategory: categoryFromText(raw, rule.category),
    title: title.slice(0, 500),
    reservePrice: money(raw),
    currency: "INR",
    documentReferences: [],
    evidenceState: "DISCOVERED",
    decisionEvidenceProjection: false
  };
}

function discoverTableRows(provider: AuctionSourceProvider, html: string, request: DiscoveryRequest): NormalizedAuctionLot[] {
  const rows = [...html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)];
  const output: NormalizedAuctionLot[] = [];
  for (let i = 0; i < rows.length; i++) {
    const text = clean(rows[i][1]);
    if (!/auction|property|emd|floor price|reserve price|listing/i.test(text)) continue;
    if (!text) continue;
    output.push(record(provider, request.url, text, text, i, request.sourceTimestamp));
  }
  return output;
}

function discoverSamil(html: string, request: DiscoveryRequest): NormalizedAuctionLot[] {
  const chunks = html.split(/(?:Live Now|Upcoming Auctions|Commercial Vehicles|Passenger Cars|Construction Equipment|Farm Equipment|Property & Other Assets)/i);
  return chunks.slice(1, 80)
    .map((chunk, i) => {
      const text = clean(chunk).slice(0, 1000);
      return record("SAMIL", request.url, text.slice(0, 250) || "SAMIL auction", text, i, request.sourceTimestamp);
    })
    .filter((item) => item.title.length > 3);
}

export function normalizeDiscoveredHtml(request: DiscoveryRequest, html: string): DiscoveryResult {
  let records: NormalizedAuctionLot[] = [];
  if (request.provider === "MSTC" || request.provider === "IBBI" || request.provider === "EAUCTION_INDIA" || request.provider === "INDIAN_RAILWAYS" || request.provider === "BAANKNET") {
    records = discoverTableRows(request.provider, html, request);
  } else if (request.provider === "SAMIL") {
    records = discoverSamil(html, request);
  }

  const warnings: string[] = [];
  if (!records.length) warnings.push("No machine-readable auction records were discovered from this source response.");
  warnings.push("Discovery is not verification and cannot project into decision evidence.");
  return { provider: request.provider, sourceUrl: request.url, records, warnings, failClosed: records.length === 0 };
}

export async function discoverPublicAuctionSource(request: DiscoveryRequest): Promise<DiscoveryResult> {
  const response = await fetch(request.url, {
    headers: { accept: "text/html,application/xhtml+xml" },
    redirect: "follow"
  });
  if (!response.ok) throw new Error("Source discovery failed with HTTP " + response.status);
  const html = await response.text();
  return normalizeDiscoveredHtml({
    ...request,
    sourceTimestamp: request.sourceTimestamp ?? new Date().toISOString()
  }, html);
}

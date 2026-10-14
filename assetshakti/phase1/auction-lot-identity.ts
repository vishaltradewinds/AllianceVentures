import type { AuctionSourceProvider, NormalizedAuctionLot } from "./auction-source-adapter";

export type ExactLotIdentityState = "EXACT" | "INCOMPLETE";

export interface ExactLotIdentity {
  provider: AuctionSourceProvider;
  sourceRecordId: string;
  auctionId: string;
  lotId: string;
  sourceUrl: string;
  sourceVersion?: string;
  contentSha256?: string;
}

export function evaluateExactLotIdentity(lot: Pick<NormalizedAuctionLot, "provider" | "sourceRecordId" | "auctionId" | "lotId" | "sourceUrl" | "sourceVersion" | "contentSha256">): {
  state: ExactLotIdentityState;
  reasons: string[];
  identity?: ExactLotIdentity;
} {
  const reasons: string[] = [];
  if (!lot.sourceRecordId?.trim()) reasons.push("sourceRecordId is required");
  if (!lot.auctionId?.trim()) reasons.push("auctionId is required");
  if (!lot.lotId?.trim()) reasons.push("lotId is required");
  if (!lot.sourceUrl?.startsWith("https://")) reasons.push("authoritative HTTPS sourceUrl is required");

  if (reasons.length) return { state: "INCOMPLETE", reasons };

  return {
    state: "EXACT",
    reasons: [],
    identity: {
      provider: lot.provider,
      sourceRecordId: lot.sourceRecordId.trim(),
      auctionId: lot.auctionId!.trim(),
      lotId: lot.lotId!.trim(),
      sourceUrl: lot.sourceUrl,
      sourceVersion: lot.sourceVersion,
      contentSha256: lot.contentSha256
    }
  };
}

export function canEnterDecisionEvidence(identity: ReturnType<typeof evaluateExactLotIdentity>): boolean {
  return identity.state === "EXACT";
}

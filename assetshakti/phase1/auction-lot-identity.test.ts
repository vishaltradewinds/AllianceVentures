import { canEnterDecisionEvidence, evaluateExactLotIdentity } from "./auction-lot-identity";

const base = {
  provider: "MSTC" as const,
  sourceRecordId: "MSTC/EXAMPLE/001",
  auctionId: "A-001",
  lotId: "LOT-01",
  sourceUrl: "https://www.mstcecommerce.com/auctionhome/property/index.jsp",
  sourceVersion: "2026-10-07",
  contentSha256: "a".repeat(64)
};

const exact = evaluateExactLotIdentity(base);
if (exact.state !== "EXACT" || !exact.identity) throw new Error("FAIL: exact auction/lot identity was not accepted");
if (!canEnterDecisionEvidence(exact)) throw new Error("FAIL: exact identity should be eligible for downstream evidence gating");

const missingLot = evaluateExactLotIdentity({ ...base, lotId: "" });
if (missingLot.state !== "INCOMPLETE" || canEnterDecisionEvidence(missingLot)) throw new Error("FAIL: missing lot ID must fail closed");

const missingAuction = evaluateExactLotIdentity({ ...base, auctionId: undefined });
if (missingAuction.state !== "INCOMPLETE") throw new Error("FAIL: missing auction ID must fail closed");

const insecure = evaluateExactLotIdentity({ ...base, sourceUrl: "http://example.invalid" });
if (insecure.state !== "INCOMPLETE") throw new Error("FAIL: non-HTTPS source must fail closed");

console.log("PASS: exact auction/lot identity fails closed");

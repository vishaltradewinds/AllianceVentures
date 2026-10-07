# AssetShakti Phase 1 — Exact Auction Lot Binding Gate

## Rule
A pilot cannot become COMPLETE merely because the corporate debtor and a property are identified. The evidence dossier must bind the evaluation to one exact auction lot/round using the authoritative auction date, asset description, reserve price where applicable, EMD deadline, and source reference.

## Why
IBBI records show real cases with repeated auctions, changed reserve prices, changed parcel structures, corrigenda, and different combinations of land/building/plant/machinery/financial assets. Evaluating only at debtor level can mix evidence from different transactions.

## Gate
auctionLotBinding.status must be VERIFIED.

Required fields:
- auction date
- exact asset description / lot identity
- authoritative source reference
- reserve price when stated
- EMD deadline when stated

If the current lot cannot be uniquely reconciled with prior rounds, corrigenda or addenda, readiness remains BLOCKED.

## Current pilot implications
- General Composites: current 07-10-2026 composite Land/Building/Plant & Machinery lot must remain distinct from earlier slump-sale structures that also included financial assets/securities.
- Hallmark Living Space: 15-10-2026 Emerald Project lot must remain distinct from prior rounds; the current record expressly excludes 6,388 sq.ft. UDS already conveyed to home buyers.
- Vysali Pharmaceuticals: current 10-10-2026 Edathala Land and Building lot must not inherit evidence from earlier multi-parcel rounds without reconciliation.
- Parakkott Investments: the 20-08-2026 first-floor commercial-premises lot must remain distinct from later 29-09-2026 and 01-10-2026 auctions with different reserve prices/assets.

Production certification remains OFF until this gate and the other critical evidence gates pass.
# AssetShakti — Multi-Auction Platform Expansion

Status: Foundation implemented; production certification OFF.

## Strategic position

AssetShakti is an **auction intelligence OS above authorised auction sources**, not another auction portal.

**Discover → Normalize → Exact-lot bind → Acquire evidence → Verify → Reconcile → Due diligence → Risk → Shakti gate → Decision**

The transaction remains on the source platform.

## Source expansion

| Provider | Primary opportunity | Initial integration | Key caution |
|---|---|---|---|
| IBBI | Insolvency/liquidation assets | Discovery + documents | Exact liquidation round/version |
| BAANKNET | PSB bank/NPA assets | Discovery + documents | Title/possession/encumbrance terms |
| MSTC | Property, plant & machinery, scrap, minerals, forest/agri, customs | Discovery + documents | Multiple auction mechanisms |
| SAMIL | Vehicles, equipment, property, plant & machinery, scrap, gold | Discovery + documents | Online/physical/phygital workflows |
| NIC eAuction India | Government department auctions | Discovery + documents | Inviting authority remains authoritative |
| Indian Railways | Sale materials and asset leasing/e-auctions | Discovery + documents | Railway authority rules vary |
| C1 India | Bank foreclosed property and other assets | Discovery + documents | Bank/auctioneer terms govern |

## Recommended implementation order

1. BAANKNET
2. MSTC
3. SAMIL
4. NIC eAuction India
5. Indian Railways
6. C1 India

## Architecture rule

Do not create seven decision engines. Use one source-neutral contract: AuctionSourceAdapter, NormalizedAuctionLot, AuctionMechanism, AssetCategory, SourceVersion, ExactLotIdentity.

Each provider supplies acquisition/discovery rules; the Shakti decision engine remains shared.

## Production gate

This foundation does **not** certify any provider as production-ready. Each provider requires current real auction discovery, exact auction/lot identity verification, current notice/process document acquisition, document hash and source/version binding, corrigendum/addendum reconciliation, relevant title/possession/ownership evidence where applicable, auction-specific bidder obligations, at least one end-to-end deterministic evaluation, CI evidence and Shakti sign-off.

Until these pass, provider state remains DISCOVERY_READY, not PRODUCTION_CERTIFIED.

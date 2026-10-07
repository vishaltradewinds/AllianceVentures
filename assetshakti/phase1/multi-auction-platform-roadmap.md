# AssetShakti — Multi-Auction Platform Expansion

Status: Foundation hardened; production certification OFF.

## Strategic position

AssetShakti is an auction intelligence OS above direct/authorised auction platforms, not another auction portal.

Discover → Normalize → Exact-lot bind → Acquire evidence → Verify → Reconcile → Due diligence → Risk → Shakti gate → Decision

The transaction remains on the source platform.

## Direct platform scope

| Provider | Primary opportunity | Initial integration | Key caution |
|---|---|---|---|
| IBBI | Insolvency/liquidation assets | Discovery + documents | Exact liquidation round/version |
| BAANKNET | PSB bank/NPA assets | Discovery + documents | Title/possession/encumbrance terms |
| MSTC | Property, plant & machinery, scrap, minerals, forest/agri, customs | Discovery + documents | Multiple auction mechanisms |
| SAMIL | Vehicles, equipment, property, plant & machinery, scrap, gold | Discovery + documents | Online/physical/phygital workflows |
| NIC eAuction India | Government department auctions | Discovery + documents | Inviting authority remains authoritative |
| Indian Railways IREPS | Railway e-tender/e-auction surfaces | Discovery + documents | Railway authority rules vary |

Excluded from source truth: auction aggregators/listing portals. They may not be used as authoritative auction evidence.

## Architecture rule

Do not create separate decision engines per provider. Use one source-neutral contract: AuctionSourceAdapter, NormalizedAuctionLot, AuctionMechanism, AssetCategory, sourceVersion, exact auction/lot identity, evidence lifecycle and Shakti gates.

Each provider supplies source-specific discovery/acquisition rules; the Shakti decision engine remains shared.

## Fail-closed rules

- Discovery is never verification.
- Source metadata is never title, possession, valuation or bidder eligibility.
- Exact lot identity must be preserved.
- Current notice/process document and applicable corrigenda/addenda must be reconciled before decision evidence.
- Asset composition must remain component-specific; similar lots are never merged by inference.
- AssetShakti never executes bids, payments or transaction commitments.
- Authentication, CAPTCHA, robots controls, paywalls and other access restrictions are never bypassed.

## Production gate

A provider remains DISCOVERY_READY until it has:

1. a current real auction pilot;
2. exact auction and lot identity verification;
3. current notice/process document acquisition;
4. SHA-256 and source/version binding;
5. corrigendum/addendum reconciliation;
6. relevant title/possession/ownership evidence where applicable;
7. auction-specific bidder obligations;
8. deterministic end-to-end case evaluation;
9. CI evidence;
10. Shakti sign-off.

Until all applicable gates pass, provider state is NOT PRODUCTION CERTIFIED.
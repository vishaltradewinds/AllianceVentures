# BAANKNET Direct-Source Evidence Route — 2026-10-07

Status: ACTIVE / FAIL-CLOSED / PRODUCTION CERTIFICATION OFF

## Authoritative platform finding

BAANKNET is a direct auction platform operated by PSB Alliance. IBBI's FAQ states that BAANKNET is used by Insolvency Professionals to list assets and conduct auctions. Government/PIB material identifies BAANKNET as the revamped public-sector-bank e-auction portal.

## AssetShakti rule

BAANKNET may be used as an authoritative auction surface only when the exact current auction/property record can be bound to:
- provider = BAANKNET
- sourceRecordId / property ID
- auction ID
- lot ID where the platform exposes one
- exact source URL
- source version/timestamp
- acquired document hash where a document is used

Search-engine results and third-party auction pages are discovery aids only and cannot become decision evidence.

## Current acquisition outcome

The public BAANKNET web surface is reachable, but the available indexed/public surface did not expose an exact match for the six IBBI pilots during this execution pass. Therefore no BAANKNET record is being falsely attached to any pilot.

A recent public BAANKNET surface demonstrates the expected identity pattern: auction ID plus property ID, and auction listings can expose detailed asset information. This confirms the adapter model but is not evidence for the six pilots.

## Next controlled route

1. Query BAANKNET using exact debtor/asset/auction identifiers.
2. Capture the exact BAANKNET auction/property record.
3. Bind provider + auction ID + property/lot ID.
4. Acquire the associated current process/tender document where accessible.
5. Hash the exact bytes.
6. Run exact-lot identity and document verification.
7. Reconcile against IBBI current-round notice/corrigenda.
8. Promote to decision evidence only after all applicable gates pass.

No authentication, CAPTCHA, robots, paywall or access-control bypass is permitted.

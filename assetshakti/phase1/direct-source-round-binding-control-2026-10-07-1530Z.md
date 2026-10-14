# AssetShakti Direct-Source Round Binding Control — 2026-10-07T15:30Z

## New control
The acquisition orchestrator must bind every documentary artifact to:
- provider
- source record
- debtor
- auction date/round
- lot or option where applicable
- source URL
- source version
- SHA-256
- acquisition state

## Evidence hierarchy
1. IBBI current auction register: exact-round discovery/identity.
2. IBBI auction notice: authoritative auction metadata and lot/option identity.
3. BAANKNET/direct liquidator/corporate-debtor process bundle: detailed terms and bidder obligations.
4. Controlled user evidence intake: fallback when direct public bytes cannot be acquired.

## Round contamination prevention
Historical evidence may be retained for reconciliation but cannot satisfy a current-round gate without explicit deterministic reconciliation.

Multiple options for the same debtor remain separate lots. Example: Silverton's 22-05-2026 auction has separate Option 1, Option 2 and Option 3 records with distinct reserve prices and asset boundaries.

## Acquisition state machine
DISCOVERED
-> EXACT_ROUND_BOUND
-> DIRECT_DOCUMENT_LOCATED
-> BYTES_ACQUIRED
-> HASH_BOUND
-> VERSION_VERIFIED
-> CORRIGENDA_RECONCILED
-> DECISION_ELIGIBLE

Any failed identity, inaccessible bytes, missing hash, unresolved version, or unreconciled corrigendum returns the artifact to BLOCKED and prevents decision projection.

## Security/legal boundary
AssetShakti must not bypass authentication, CAPTCHA, robots restrictions, paywalls or other access controls. No bidding, payment, acceptance or transaction commitment is executed by the intelligence layer.

## Current six-pilot status
All six remain DO_NOT_BID / decision blocked. Production certification remains OFF.

# AssetShakti Acquisition Gate — 2026-10-07T15:28Z

## Purpose
Machine-readable checkpoint for the current-round documentary acquisition gate.

## Authoritative route status
IBBI's liquidation auction register currently exposes the applicable auction records and provides direct BAANKNET links for auction/listing details. IBBI remains the authoritative identity/round discovery source; BAANKNET/liquidator/corporate-debtor documents remain the acquisition route for complete process bundles.

## Six-pilot acquisition state
| Case | Exact round | Identity | Detailed process bytes | Decision evidence |
|---|---|---|---|---|
| P1-PILOT-001 | 07-10-2026 | PASS | BLOCKED/PENDING | BLOCKED |
| P1-PILOT-002 | 15-10-2026 | PASS | BLOCKED/PENDING | BLOCKED |
| P1-PILOT-003 | 10-10-2026 | PASS | BLOCKED/PENDING | BLOCKED |
| P1-PILOT-004 | 01-10-2026 | PASS | BLOCKED/PENDING | BLOCKED |
| P1-PILOT-005 | 23-09-2026 | PASS | BLOCKED/PENDING | BLOCKED |
| P1-PILOT-006 | 22-05-2026 | PASS | BLOCKED/PENDING | BLOCKED |

## Fail-closed rule
A URL, register row, search result, or source listing is NOT documentary acquisition.

A document may become decision evidence only when:
1. exact debtor is bound;
2. exact auction round is bound;
3. exact lot/option is bound where applicable;
4. exact bytes are acquired;
5. SHA-256 is calculated;
6. source/version metadata is captured;
7. page/section references are captured;
8. corrigenda/addenda are reconciled;
9. deterministic verification passes.

If an authoritative endpoint returns 403, inaccessible content, authentication, CAPTCHA, robots restriction, or equivalent access failure, status MUST remain BLOCKED/PENDING and the system must offer controlled user evidence intake rather than bypassing access controls.

## Current decision
All six pilots remain DO_NOT_BID. Production certification remains OFF.

## Next execution
Use the direct BAANKNET/liquidator/corporate-debtor route for exact current-round documents. Where public machine acquisition is unavailable, route the exact original document through AssetShakti's controlled evidence intake, then hash and reconcile it before downstream use.

# AssetShakti Evidence-Source Failover Control — 2026-10-07T14:59Z

Status: ACTIVE / FAIL-CLOSED / PRODUCTION CERTIFICATION OFF

A fresh authoritative-source search did not return a new official IBBI result for the six pilot identifiers in this execution pass.

Control decision:
- Do not downgrade existing confirmed discovery.
- Do not create a new lot match from third-party search results.
- Do not infer a BAANKNET lot from debtor/name similarity.
- Do not mark document acquisition, hash binding, or verification complete.
- Continue independent provider lanes rather than repeatedly retrying the same blocked source.

Failover order:
1. BAANKNET exact identifier route.
2. Direct liquidator/corporate debtor process-document route.
3. Controlled authorised user-evidence intake.
4. Other registered direct auction providers only for their own auctions; never substitute a different provider's lot for an IBBI/BAANKNET lot.

Current decision gate remains BLOCKED until exact current-round documentary evidence is available.

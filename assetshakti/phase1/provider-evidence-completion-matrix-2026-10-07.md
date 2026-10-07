# AssetShakti — Provider Evidence Completion Matrix

Captured 2026-10-07.

| Provider | Direct source | Current source record | Exact-lot evidence | Current authoritative documents | Verification | Production |
|---|---|---|---|---|---|---|
| IBBI | Yes | Yes | Partial / pilot-specific | Required for each current round | Pending applicable gates | OFF |
| BAANKNET | Yes | Yes | Pending | Pending | Pending | OFF |
| MSTC | Yes | Yes | Pending | Pending | Pending | OFF |
| SAMIL | Yes | Yes | Pending | Pending | Pending | OFF |
| NIC eAuction India | Yes | Yes | Pending | Pending | Pending | OFF |
| IREPS | Yes | Source architecture established | Exact current lot still required | Pending | Pending | OFF |

## Completion definition

The multi-auction foundation is not considered production-complete until every provider intended for production has at least one real current pilot that passes:

1. exact provider/auction/lot identity;
2. current authoritative notice/process/catalogue;
3. document SHA-256 and source/version binding;
4. corrigenda/addenda reconciliation;
5. applicable title/ownership/possession evidence;
6. bidder eligibility and obligations;
7. deterministic case evaluation;
8. CI regression;
9. Shakti sign-off.

A provider may remain Discovery Ready without being Production Certified.

## Current state

Engineering foundation: GREEN at the last validated checkpoint.

Evidence/compliance: INCOMPLETE.

Security: separate npm vulnerability remediation gate remains OPEN.

Production certification: OFF.

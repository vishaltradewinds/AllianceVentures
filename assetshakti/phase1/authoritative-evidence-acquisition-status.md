# AssetShakti — Authoritative Evidence Acquisition Checkpoint

Observed: 2026-10-07

## Acquisition result

- Workflow: `AssetShakti authoritative evidence acquisition`
- Head commit: `e5811ae5ac11ae65f653449df28f67af0a97e0f9`
- Acquisition run: `37610054650`
- Acquisition conclusion: **SUCCESS**
- Authoritative source: IBBI Liquidation Auction Notices
- Exact pilot rounds bound: **6 / 6**
- Downloaded PDF records: **12**
- Page-level evidence index records: **12**
- Keyword/page discovery hits: **55**
- Artifact ID: `11478265222`
- Artifact is retained by GitHub Actions for the normal artifact retention period.

## Exact round bindings

| Case | Auction round |
|---|---|
| P1-PILOT-001 General Composites | 07-10-2026 |
| P1-PILOT-002 Hallmark Living Space | 15-10-2026 |
| P1-PILOT-003 Vysali Pharmaceuticals | 10-10-2026 |
| P1-PILOT-004 Parakkott Investments | 01-10-2026 |
| P1-PILOT-005 Josan Foods | 23-09-2026 |
| P1-PILOT-006 Silverton Spinners | 22-05-2026 |

Silverton correctly resolves to three separate option rows for the same auction date, preserving the distinct sale structures rather than collapsing them.

## Integrity controls executed

1. Source row was obtained from IBBI using debtor-specific filtering.
2. Exact auction date was matched before download.
3. PDF source links were extracted from the authoritative IBBI row.
4. Downloaded bytes were SHA-256 hashed.
5. Missing rows/source links fail the workflow closed.
6. Page-level text extraction was generated only as a discovery aid.
7. No extracted assertion is automatically promoted to decision evidence.

## Shakti status

**Acquisition: PASS**

**Engineering validation: PASS**

**Verification: PENDING**

**Document reconciliation: UNRESOLVED where previously recorded**

**Production certification: OFF**

The acquired auction notices establish authoritative source-document possession and exact-lot binding. They do **not** by themselves establish title, possession, valuation, encumbrance clearance, bidder eligibility, or complete process-term reconciliation.

## Latest engineering gate

- Latest commit: `9d0f20ef442d2163d0e136e8f85d867ef02ef7ef`
- Phase 1 Validation run: `37611221979` (Run #359)
- Result: **SUCCESS**
- Added and CI-enforced: current-round process-document gate. An acquired process document cannot project into decision evidence unless exact round, current status, corrigenda reconciliation, hash, source reference and page/section references are all present.

## Next gate

For each pilot:

**verify document identity → verify exact round/version → reconcile corrigenda/addenda/process documents → confirm page-referenced material assertions → independently verify title/interest and possession where required → verify bidder obligations → component-level provenance/valuation where applicable → deterministic re-evaluation → independent Shakti sign-off.**

No pilot may become `BID_READY` merely because these PDFs were successfully acquired.

# AssetShakti Direct Evidence Acquisition Attempt — 2026-10-07T14:38Z

Status: ACTIVE / FAIL-CLOSED

## Result

The evidence lane re-queried the official IBBI liquidation auction index and corporate-process pages for the six pilot rounds.

The official IBBI index confirms the six target auction records and current-round asset descriptions where exposed. However, direct PDF retrieval from the IBBI upload endpoint returned HTTP 403 in the acquisition environment for at least the Josan Foods notice. Therefore the system MUST NOT mark those PDFs as acquired, hashed, or verified.

## Confirmed direct-source records

- GENERAL COMPOSITES PRIVATE LIMITED — 07-10-2026 — reserve INR 9,27,00,000 — composite Land, Building and Plant & Machinery.
- HALLMARK LIVING SPACE PRIVATE LIMITED — 15-10-2026 — reserve INR 70,50,00,000 — Emerald Project Land & Building; 7.62 acres approximately; proposed building 8,98,137 sq.ft.; UDS 6,388 sq.ft. already conveyed is excluded.
- VYSALI PHARMACEUTICALS LIMITED — 10-10-2026 — reserve INR 13,36,68,963 — Edathala Land & Building.
- PARAKKOTT INVESTMENTS INDIA PRIVATE LIMITED — 01-10-2026 — reserve INR 2,87,34,000 — Land with Built Up Godown.
- JOSAN FOODS PRIVATE LIMITED — 23-09-2026 — reserve INR 43,40,005 — leasehold rights through 22-07-2033.
- SILVERTON SPINNERS LIMITED — 22-05-2026 — three separate reserve rows: INR 12.50 crore, INR 10.15 crore, INR 4.75 crore; preserve options separately.

## Fail-closed decision

Direct-source discovery: CONFIRMED.
PDF acquisition: BLOCKED where HTTP 403 prevents byte retrieval.
Hash binding: NOT CLAIMED.
Document verification: NOT CLAIMED.
Corrigenda reconciliation: NOT CLAIMED.
Title/possession/valuation/eligibility: NOT CLAIMED.
Production certification: OFF.

## Next action

Continue acquisition through permitted authoritative surfaces (including BAANKNET where the exact lot can be bound) without bypassing access controls. If an authoritative document remains inaccessible to machine acquisition, route it through AssetShakti's controlled user-evidence intake rather than treating a search-result copy as verified evidence.

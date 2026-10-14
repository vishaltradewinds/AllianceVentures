# AssetShakti — Source Document Integrity Finding — 2026-10-08

## Integrated gate impact

The previously successful IBBI acquisition workflow acquired 12 PDFs for the six pilot rounds and hash-bound them. Direct byte/content verification of the retained artifact shows that 3 of 6 auction-notice PDFs are not the target auction documents, despite being linked from the authoritative IBBI rows.

This is a source-document integrity failure and is not treated as a minor warning.

### Result

**WHOLE-LOT: BLOCKED**

Production certification remains OFF. No positive decision is permitted.

## Verified artifact

- Workflow run: 37610054650
- Artifact: assetshakti-ibbi-evidence-manifest
- Artifact ID: 11478265222
- Artifact SHA-256: 75b3103434f71388411e9e38d6927d03701adb2fdc58b5e6d30f1700286a8cba
- Acquisition source: IBBI Liquidation Auction Notices
- Retained records: 12 PDFs across 6 exact auction rounds

## Auction-notice identity verification

| Pilot | Round | SHA-256 | Content identity | Gate |
|---|---|---|---|---|
| P1-PILOT-001 General Composites | 07-10-2026 | 312dff4b6b69494596e128d94d7a6f2f0bb5a461f01afffadde2c3caee6ec22c | FAIL — downloaded PDF contains unrelated public notice/newspaper content; target debtor not found | BLOCK |
| P1-PILOT-002 Hallmark Living Space | 15-10-2026 | fd4b6ca5839fa3e3a85d9a88ea26361afbb57a85bcd4c0ba4d679a6e286fc500 | FAIL — OCR shows unrelated Maharashtra/Chennai tender/public-notice material | BLOCK |
| P1-PILOT-003 Vysali Pharmaceuticals | 10-10-2026 | 6ef4395385906c1a9bcd0b9148e5675cd888db8e3cc2cd01f21ace5299cc863e | PASS — target debtor and auction notice identified | PASS at source-document identity layer |
| P1-PILOT-004 Parakkott Investments | 01-10-2026 | cd12236ead8dfb51adc098c5c9392632b638887ea677ba7b37d3b2bf4a65b265 | FAIL — OCR shows unrelated Financial Express capital-market material | BLOCK |
| P1-PILOT-005 Josan Foods | 23-09-2026 | 914ed8b6b62c08e1866c7b05f9ab0a5fb1741c71b1290a7acaa67369d9437e50 | PASS — target debtor and sale notice identified | PASS at source-document identity layer |
| P1-PILOT-006 Silverton Spinners | 22-05-2026 | 1826395f5e7841cc8aeeb0fc0f67012338cf224e774ad4585b4e85609536383a | PASS — target debtor and e-auction sale notice identified | PASS at source-document identity layer |

## Important distinction

The IBBI HTML row remains authoritative evidence that the listed auction round exists and that IBBI exposes a PDF link for it. The problem is that the downloaded bytes behind three of those links do not match the target auction document.

Therefore:

- IBBI row identity remains usable as public metadata.
- Hashes prove exactly what bytes were downloaded.
- The mismatched bytes are not decision evidence.
- A reserve price is not valuation.
- A public row or notice does not prove title, possession, encumbrance clearance or bidder eligibility.
- BAANKNET process-document terms remain unverified until the exact current-round process bundle is acquired and bound.

## Engineering action

verify-acquired-ibbi-documents.mjs has been hardened so any source-document identity/integrity failure exits non-zero and blocks downstream evidence promotion.

This prevents the previous false-positive pattern where acquisition could be marked successful merely because a PDF URL downloaded successfully.

## Required closure path

1. Re-acquire/correct the three mismatched IBBI auction-notice documents through an authoritative source path.
2. Re-hash exact bytes and verify debtor + current auction round.
3. Verify the remaining three notice documents and all six details records.
4. Acquire exact BAANKNET/current process bundles where required.
5. Reconcile corrigenda/addenda and historical rounds.
6. Complete title/possession/lease/transfer/eligibility/obligation checks.
7. Complete component-level asset and valuation/economic analysis.
8. Run deterministic risk/decision evaluation.
9. Independent Shakti review.
10. Only then consider production certification.

No access-control, CAPTCHA, robots or paywall bypass is permitted.

# AssetShakti Authoritative Document Acquisition — 2026-10-10

## Scope and method
Directly queried the official IBBI liquidation auction register for the six exact target rounds. Downloaded two IBBI-linked PDFs per pilot (12 PDFs total) to a temporary evidence workspace and SHA-256 hashed the original downloaded bytes. PDF text extraction is performed with the pinned PDF.js dependency. Acquisition is not verification and these files are not promoted to decision evidence.

## Integrity findings
- The automated gate correctly blocks the batch: 4 of 12 IBBI-linked PDFs fail extracted debtor/round identity checks.
- The mismatches affect the first linked PDFs for General Composites (P1-001), Hallmark Living Space (P1-002), Parakkott Investments (P1-004), and the Vysali current-round PDF (P1-003). They are quarantined, not treated as verified notices.
- The other linked PDFs are IBBI register/details records, not a substitute for the full current auction process information document.
- Local manifest with source URLs, exact SHA-256 hashes, byte lengths and per-record gate results: `C:\Temp\assetshakti-acquisition-20261010-verified\manifest.json`.
- Original downloaded files are retained locally under `C:\Temp\assetshakti-acquisition-20261010-verified\`. These temporary paths are not repository artifacts.

## Hallmark Living Space — official process document recovered
- Issuer: Hallmark Living Space website / liquidator's liquidation-process section.
- Document: E-Auction Process Information Document dated 18-09-2026; 71 pages.
- Exact source URL: https://www.hallmarklivingspace.co.in/assets/liquidation/EAUCTION%20PROCESS%20INFORMATION%20DOCUMENT%2018.09.2026.pdf
- Local original: `C:\Temp\assetshakti-official-process-docs\HALLMARK-2026-10-15-process-information-2026-09-18.pdf`
- Original byte length: 1,444,824
- SHA-256: `0FBB2C36878313B142C26CDAE1C58F7F2557CBD19AC893E83DC112CA8A1B33CF`
- Identity and intended round: document pages 1–2 name Hallmark Living Space Private Limited and the Emerald Project; page 1 states sale notice 18 September 2026 and auction date 15 October 2026.
- Critical internal inconsistency: page 1 labels 15 October 2026 as “Friday”; that calendar date is Thursday. The process document must be clarified against an official corrigendum or written liquidator confirmation before treating all terms/timelines as reconciled.
- Material title/UDS risk: pages 3–4 state the company sells only its own title and excludes 6,388 sq. ft. UDS already conveyed to home buyers, and place responsibility for title, UDS acquisition and due diligence on the bidder. This is a blocker, not proof of clear title or possession.
- The document instructs bidders to check BAANKNET and the corporate-debtor website for amendments/extensions. No assertion is made here that no later corrigendum exists.

## Per-pilot status
1. P1-001 General Composites — 07-10-2026: exact IBBI row found; linked PDF identity mismatch; full process document and any later status/corrigendum unresolved.
2. P1-002 Hallmark Living Space — 15-10-2026: exact IBBI row found; official process document acquired and hashed; weekday inconsistency and UDS/title/possession/obligations remain blockers.
3. P1-003 Vysali Pharmaceuticals — 10-10-2026: exact IBBI row found; current-round notice extraction did not verify the exact round. The auction date is today on this checkpoint; no sale result is inferred. Obtain official platform/liquidator status and the applicable current process document.
4. P1-004 Parakkott Investments — 01-10-2026: exact IBBI row found; linked PDF identity mismatch; exact current-round process bundle and post-auction status unresolved.
5. P1-005 Josan Foods — 23-09-2026: linked notice text matches debtor/round, but the current process document, corrigendum reconciliation, lease deed/assignment conditions and post-auction status remain unresolved.
6. P1-006 Silverton Spinners — 22-05-2026: linked notice text matches debtor/round; the lot is multi-option and must be reconciled to the exact intended sale structure and later status. Process bundle, lease, handover and component-level valuation remain unresolved.

## Hard gate
All acquired files remain pending verification. No uploaded/acquired file is decision-evidence eligible. All six pilots remain DO_NOT_BID; production certification and decision evidence projection remain OFF. No title, possession, valuation, auction outcome or bidder obligation is inferred from an index record or reserve price.

## Next required actions
1. Obtain correct original process documents for General Composites, Parakkott and Vysali through official BAANKNET/liquidator routes.
2. Get official clarification/corrigendum for Hallmark's weekday mismatch and confirm current amendment/extension status.
3. Obtain official status/outcome for past auction rounds; do not infer sold/unsold from the notice register.
4. Complete title, possession, encumbrance/litigation, bidder obligations, lease, asset decomposition and independent valuation.
5. Run deterministic re-evaluation and independent Shakti sign-off.

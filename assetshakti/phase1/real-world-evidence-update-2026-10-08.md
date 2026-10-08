# AssetShakti — Real-World Evidence Update — 2026-10-08

## Integrated lot impact

**WHOLE-LOT: BLOCKED — evidence integrity / raw-byte binding**

This update records fresh authoritative-source discovery. It does not promote parsed web content to cryptographically verified document evidence.

## P1-002 Hallmark Living Space

Authoritative corporate-debtor source:

- URL: https://www.hallmarklivingspace.co.in/index.php?project_status=1
- Exact current process document: https://www.hallmarklivingspace.co.in/assets/liquidation/EAUCTION%20PROCESS%20INFORMATION%20DOCUMENT%2018.09.2026.pdf
- Document title: EAUCTION PROCESS INFORMATION DOCUMENT (Terms and Conditions)
- Pages: 71
- Sale notice: 18 September 2026
- Auction: 15 October 2026, 03:00 PM–05:00 PM
- Corporate debtor: Hallmark Living Space Private Limited
- CIN: U45400TN2012PTC084362
- Liquidator: S. Dhanapal, IBBI/IPA-002/IP-N00060/2017-18/10112

The parsed authoritative document confirms, among other things:

- BAANKNET is the e-auction service-provider portal.
- Bidder KYC/registration and EMD are required.
- Sale is on "as is" / "without recourse" terms.
- 6,388 sq.ft. UDS already conveyed to home buyers is excluded.
- Successful bidder must independently acquire title/ownership/possession of the conveyed UDS portions.
- Bidder bears responsibility for title, marketability, encumbrances, approvals and project completion.
- Amendments/timeline modifications are to be checked on the corporate-debtor site and BAANKNET.
- Section 29A eligibility declaration and EMD forfeiture conditions apply.

## Cryptographic status

The web interface exposes the exact PDF content but the connected runtime could not retrieve the raw PDF bytes. Therefore:

- SHA-256: PENDING
- Raw-byte binding: PENDING
- Corrigenda/version reconciliation: PENDING
- Decision evidence projection: BLOCKED

No hash is invented from parsed content.

## P1-001 General Composites

IBBI authoritative listing confirms:

- Notice date: 18-09-2026
- Auction: 07-10-2026
- Reserve: INR 9,27,00,000
- Composite Land + Building + Plant & Machinery
- EMD deadline: 05-10-2026

The previously retained PDF bytes remain mismatched and cannot be promoted to decision evidence.

## P1-004 Parakkott Investments India Private Limited

IBBI authoritative listing/claims record confirms:

- Notice date: 07-09-2026
- Auction: 01-10-2026
- Reserve: INR 2,87,34,000
- Land + Built Up Godown
- EMD deadline: 29-09-2026

Historical rounds remain explicitly separated. The previously retained auction-notice PDF bytes remain mismatched and cannot be promoted to decision evidence.

## Recovery path

Controlled original-document intake is implemented at:

- assetshakti/phase1/controlled-evidence-intake.mjs
- assetshakti/phase1/controlled-evidence-intake.md

Only legitimate original document bytes can be promoted after SHA-256 and identity verification.

## Gate state

- G0 source truth: PASS
- G1 exact lot identity: PASS
- G2 evidence package: BLOCKED
- G3 cryptographic/version truth: BLOCKED
- G4-G9: BLOCKED
- Engineering/security: PASS on reviewed head
- Shakti review: NOT STARTED
- Production certification: OFF

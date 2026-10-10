# AssetShakti IBBI Machine-Acquirable Evidence Layer — 2026-10-07T17:28Z

## Decision

The source strategy is refined:

1. IBBI current liquidation-auction register is the authoritative index.
2. The linked IBBI auction-notice PDF is authoritative documentary evidence and is machine-acquirable through the public IBBI interface.
3. BAANKNET remains the authoritative deeper process-document source where the IBBI notice directs bidders there.
4. Failure to retrieve BAANKNET bytes must not prevent ingestion and verification of the authoritative IBBI notice PDF.
5. IBBI notice evidence must never be represented as a substitute for the BAANKNET process bundle when the latter is required for bidder obligations or participation terms.

## Current evidence examples verified 2026-10-07

- General Composites: current 07-10-2026 auction, composite Land/Building/Plant & Machinery, reserve Rs 9.27 crore.
- Hallmark Living Space: current 15-10-2026 Emerald Project, reserve Rs 70.50 crore, approx. 7.62 acres and 6,388 sq.ft. UDS exclusion.
- Vysali: current 10-10-2026 Edathala Land & Building, reserve Rs 13,36,68,963.
- Historical Vysali 17-04-2026: separate Edathala Land/Building, Edappally Land/Building and Edathala Plant/Machinery.
- Silverton: official IBBI notices preserve separate auction options and explicitly identify BAANKNET as the process-document source.

## Evidence-state rule

IBBI_NOTICE_ACQUIRED may progress independently of BAANKNET_PROCESS_ACQUIRED.

For each exact current lot:
IBBI_NOTICE_ACQUIRED -> SHA256 -> PAGE/SECTION_REFERENCES -> NOTICE_VERSION_BOUND -> CORRIGENDA_RECONCILED -> NOTICE_EVIDENCE_VERIFIED.

BAANKNET_PROCESS_ACQUIRED remains a separate gate.

## No unsafe promotion

Neither IBBI listing metadata nor the IBBI notice alone may create:
- positive bid recommendation,
- title clearance,
- possession clearance,
- valuation approval,
- bidder eligibility approval,
- transaction execution authority.

Production certification remains OFF.

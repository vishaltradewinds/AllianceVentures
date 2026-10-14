# AssetShakti BAANKNET Route Evidence — 2026-10-07T15:33Z

## Fresh authoritative evidence
Official IBBI records establish:
1. The current liquidation-auction register provides direct BAANKNET discovery/listing links.
2. Vysali's 17-04-2026 auction notice explicitly states that the sale is conducted on the BAANKNET platform and directs bidders to the BAANKNET e-auction/tender documents.
3. The same notice gives exact parcel boundaries and separate reserve prices for Edathala Land & Building, Edappally Land & Building, and Edathala Plant & Machinery.

## Engineering interpretation
This is sufficient to mark the DIRECT_SOURCE_ROUTE as VERIFIED for the applicable IBBI liquidation flow.

It is NOT sufficient to mark:
- detailed process document ACQUIRED;
- process document HASH_BOUND;
- current-round corrigenda RECONCILED;
- title/possession VERIFIED;
- bidder obligations VERIFIED.

Those states require the actual applicable current-round document bytes.

## Control
Source route proof and documentary acquisition are separate gates:
SOURCE_ROUTE_VERIFIED != DOCUMENT_ACQUIRED

## Current execution
Continue direct acquisition. If the BAANKNET process bundle is not publicly machine-accessible, the controlled evidence-intake path is the compliant fallback.

Production certification remains OFF. All six pilots remain DO_NOT_BID until applicable critical evidence is verified.

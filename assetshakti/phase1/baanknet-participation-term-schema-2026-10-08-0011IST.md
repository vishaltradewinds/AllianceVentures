# AssetShakti BAANKNET Participation-Term Schema — 2026-10-08 00:11 IST

## Fresh authoritative evidence

Current IBBI guidance and auction notices establish that liquidation auctions issued on/after 01-04-2025 use BAANKNET and that bidders submit required documents and EMD through the platform.

IBBI auction notices also repeatedly state that:
- the complete E-Auction Process Information Document is hosted on BAANKNET;
- the document contains asset details, bid forms, declarations/undertakings and general terms;
- bidders must independently inspect/enquire into assets before bidding;
- Section 29A eligibility declarations are required;
- EMD is deposited through BAANKNET and may be forfeited if the bidder is ineligible;
- taxes, transfer charges, stamp duties, legal costs and other applicable dues may be borne by the successful bidder depending on the specific notice.

## Engineering schema

AssetShakti may create a PROVISIONAL_PUBLISHED_PARTICIPATION_TERM record from an IBBI notice when the term is explicitly published there.

Required provenance:
- provider = IBBI
- exact source URL
- exact auction ID / lot ID where available
- document SHA-256
- page/section reference
- publication/version date
- term text normalized without changing legal meaning
- status = PUBLISHED_BY_IBBI

A BAANKNET-specific term becomes VERIFIED_PROCESS_TERM only after the applicable BAANKNET process bundle is acquired and bound to the same auction/lot/version.

## Current gate

IBBI_NOTICE_TERMS = ACTIVE
BAANKNET_PROCESS_BYTES = NOT_ACQUIRED_BY_CONNECTED_INTERFACE
PROVISIONAL_PARTICIPATION_TERMS = ALLOWED
VERIFIED_PROCESS_TERMS = BLOCKED
TITLE/POSSESSION/VALUATION = NOT_INFERRED
DECISION = FAIL_CLOSED
PRODUCTION = OFF

This enables continued evidence engineering without silently upgrading notice-level terms into full process-document verification.

# AssetShakti Published Process-Obligation Evidence — 2026-10-08 00:14 IST

## Authoritative source finding

Fresh IBBI material confirms that auction notices can explicitly publish:
- BAANKNET as the auction service provider;
- EMD deposit mechanism and deadline;
- bidder KYC / participation documents;
- Section 29A undertaking;
- inspection / independent due-diligence requirements;
- EMD forfeiture for ineligible bidders;
- balance-sale-consideration timing and consequences;
- applicable stamp duty, transfer charges, taxes and fees;
- requirement to read the complete E-Auction Process Document.

## Engineering action

Add these as structured evidence categories:

PUBLISHED_AUCTION_IDENTITY
PUBLISHED_EMD_TERM
PUBLISHED_BIDDER_DOCUMENT_TERM
PUBLISHED_SECTION_29A_TERM
PUBLISHED_INSPECTION_TERM
PUBLISHED_FORFEITURE_TERM
PUBLISHED_PAYMENT_TERM
PUBLISHED_TAX_TRANSFER_COST_TERM
PUBLISHED_PROCESS_DOCUMENT_REFERENCE

Each record must retain:
- provider/source;
- exact source URL;
- exact auction/lot identity;
- source document hash;
- page/section;
- published date/version;
- extraction status;
- legal interpretation status.

## Hard boundary

A published IBBI term is evidence of what the notice says. It is not evidence that:
- the underlying title is clear;
- possession is available;
- encumbrances are absent;
- valuation is correct;
- all current BAANKNET process terms have been captured.

BAANKNET_PROCESS_COMPLETE remains blocked until the exact applicable process bundle is acquired and reconciled.

## CI state

This commit requires the standard AssetShakti Phase 1 Validation, Dependency Security Gate and Dependency Remediation workflows.

Production certification remains OFF.

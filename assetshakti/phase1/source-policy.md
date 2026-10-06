# AssetShakti Source Policy — Phase 1

## Authoritative-first hierarchy
1. IBBI auction notice and linked statutory/process documents.
2. BAANKNET listing and auction terms for bank/PSB auctions.
3. Government land/registration/court/municipal sources where legally accessible.
4. Licensed professional reports and other traceable primary evidence.
5. Secondary market information only as supporting evidence.

## Rules
- Preserve the original source reference and observation date.
- Never silently convert an auctioneer assertion into verified title.
- Missing evidence is a state, not a value to be guessed.
- Conflicting sources create a contradiction requiring resolution.
- Third-party data may support discovery but cannot silently override authoritative evidence.
- BAANKNET remains the transaction channel; AssetShakti is an intelligence layer.

IBBI currently exposes auction notices with fields including auction date, reserve price, asset nature and EMD deadline, and links users to BAANKNET for auction/listing details. This makes IBBI a suitable authoritative discovery source for the Phase 1 validation pipeline.


## Discovery-corpus provenance gate
A record may be a candidate for the validation corpus only after its corporate debtor, asset class, reserve price, auction date and source URL have been checked against the authoritative IBBI listing or underlying notice. Candidate records discovered through search are stored separately and do not count toward the production-certification sample until this verification step is recorded.

The IBBI listing itself is discovery evidence. It must not be upgraded to verified title, possession, valuation, encumbrance or litigation evidence merely because the listing is authoritative. The underlying auction notice and, where required, independent records remain necessary for those domains.

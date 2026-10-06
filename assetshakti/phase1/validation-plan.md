# Phase 1 Validation Plan

## Target
At least 50 real property auction records before production certification.

## Current corpus
The validation corpus is being expanded to 53 real IBBI auction-list discovery records so that every minimum class quota can be met without relying on over-representation in another class. Discovery records remain deliberately marked `DISCOVERY_ONLY` and `NOT_EVALUATED`: an index listing is not proof of title, possession, valuation, encumbrances or litigation status.

Current certification quotas:
- Residential: 10
- Commercial: 8
- Industrial: 10
- Agricultural: 6
- Other immovable: 4
- Composite: 12

## Risk coverage
The sample must include:
- physical possession
- symbolic possession
- unknown possession
- land/building
- plant and machinery with property
- leasehold rights
- composite sales
- explicit litigation/dispute language
- incomplete or contradictory evidence
- materially different reserve-price bands
- auction-term / bidder-obligation / forfeiture exposure

## Acceptance tests
1. Every record has a source reference.
2. Every material assertion has an evidence status.
3. Absence, MISSING, or CONTRADICTED critical evidence cannot produce BID_READY.
4. A negative-control case must produce DO_NOT_BID.
5. Decisions are reproducible from stored evidence.
6. No model-generated fact is treated as verified without source evidence.
7. Discovery-list evidence must not be represented as independently verified title, possession, valuation or litigation evidence.
8. Auction terms affecting EMD, payment deadlines, forfeiture or bidder eligibility must remain source-traceable.
9. The corpus must satisfy all class quotas, not merely the aggregate 50-case count.

## Executable validation
Run:

`npm run assetshakti:validate`

The check reports class coverage, remaining certification gaps, structural evidence errors, and the negative-control result.

## Certification
Phase 1 is not production-certified until the full sample is processed, errors are reviewed, risk coverage is demonstrated, and the Shakti gate criteria are signed off.


## Current source-reconciliation checkpoint — 2026-10-06
The combined corpus currently contains **52 certification-eligible source records**:
- Residential: 10
- Commercial: 8
- Industrial: 10
- Agricultural: 6
- Other immovable: 6
- Composite: 12

Three supplemental candidates remain explicitly pending and do not count toward certification. Source reconciliation verifies only the corporate debtor, auction date, reserve price, asset nature and authoritative IBBI reference; it does not verify title, possession, encumbrances, litigation or valuation.

**Corpus-size gate: PASS (52/50). Case-level evaluation and Shakti certification gates remain open.**


### 2026-10-06 auction-term control

A production validation run must include cases where auction notices expose:
- explicit forfeiture language;
- extended payment with interest;
- “as is” sale conditions;
- disclosed title/possession limitations;
- bidder eligibility restrictions.

Acceptance criterion: a case with materially missing or contradictory auction-term evidence cannot receive BID_READY. This control is independent of the numerical score.

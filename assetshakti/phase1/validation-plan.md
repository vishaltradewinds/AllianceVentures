# Phase 1 Validation Plan

## Target
50 real property auction records before production certification.

## Current corpus
22 real IBBI auction-list discovery records are now stored in `validation-corpus.json`.
They are deliberately marked `DISCOVERY_ONLY` and `NOT_EVALUATED`: the listing is a discovery source, not proof of title, possession, valuation, encumbrances or litigation status.

Current distribution:
- Residential: 2 / 10
- Commercial: 2 / 8
- Industrial: 6 / 10
- Agricultural: 0 / 6
- Other immovable: 7 / 4
- Composite: 5 / 12

Remaining certification sample: 28 records, with particular gaps in Agricultural (6), Residential (8), Commercial (6), Composite (7), and Industrial (4). Other immovable already exceeds its minimum, but must still contain the required risk patterns.

## Minimum coverage
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

## Acceptance tests
1. Every record has a source reference.
2. Every material assertion has an evidence status.
3. Absence, MISSING, or CONTRADICTED critical evidence cannot produce BID_READY.
4. A negative-control case must produce DO_NOT_BID.
5. Decisions are reproducible from stored evidence.
6. No model-generated fact is treated as verified without source evidence.
7. Discovery-list evidence must not be represented as independently verified title, possession, valuation or litigation evidence.

## Executable validation
Run:

`npm run assetshakti:validate`

The check reports class coverage, remaining certification gaps, structural evidence errors, and the negative-control result.

## Certification
Phase 1 is not production-certified until the full 50-case sample is processed, errors are reviewed, risk coverage is demonstrated, and the Shakti gate criteria are signed off.

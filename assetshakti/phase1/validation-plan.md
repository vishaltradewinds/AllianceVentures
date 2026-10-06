# Phase 1 Validation Plan

## Target
50 real property auction records before production certification.

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
3. Critical missing/contradicted evidence cannot produce BID_READY.
4. A negative-control case must produce DO_NOT_BID.
5. Decisions are reproducible from stored evidence.
6. No model-generated fact is treated as verified without source evidence.

## Certification
Phase 1 is not production-certified until the full sample is processed, error classes are reviewed, and the gate criteria are signed off.

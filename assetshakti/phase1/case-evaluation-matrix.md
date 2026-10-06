# Phase 1 Case-Level Evaluation Matrix

## Purpose

Convert the 50+ discovery corpus into reproducible case-level evaluations without upgrading discovery evidence into verified evidence.

## Evaluation dimensions

Each case must be evaluated independently for:

1. Identity
2. Authority / legal route
3. Title / interest
4. Possession
5. Encumbrance
6. Litigation
7. Physical reality
8. Location / access
9. Valuation / market evidence
10. Auction terms
11. Bidder obligations / eligibility
12. Provenance / party-risk for composite or financial-asset components

## Evidence rule

For each dimension:

- VERIFIED = independently validated by authoritative evidence or appropriate professional/statutory source.
- REPORTED_BY_SOURCE = explicitly stated by the source but not independently verified.
- UNVERIFIED = evidence exists but validation is incomplete.
- MISSING = no adequate evidence captured.
- CONTRADICTED = credible sources conflict or the assertion is materially adverse/inconsistent.

Do not convert a source assertion into VERIFIED merely because it appears on an authoritative auction index.

## Decision rule

- Any critical failure -> DO_NOT_BID.
- Critical evidence insufficient -> INSUFFICIENT_EVIDENCE.
- Critical gates pass but material non-critical uncertainty remains -> CONDITIONAL.
- BID_READY requires all applicable critical gates, sufficient evidence coverage, resolved contradictions, assessed auction obligations, and reproducibility.

## Auction-term minimum record

Before BID_READY, capture source-traceable:

- EMD amount and deadline
- Section 29A / bidder eligibility requirements where applicable
- balance consideration deadline
- extension terms
- interest on extension where applicable
- forfeiture/cancellation conditions
- resale/risk consequences
- sale basis and disclaimers
- material title/possession/claim disclosures
- source URL and observation date

Current IBBI notices demonstrate these are operational decision inputs, including EMD deadlines, eligibility declarations, forfeiture provisions and balance-payment consequences. The September 2026 Supreme Court ruling further confirms that explicit auction-notice forfeiture terms can control the bidder's exposure.

## Corpus execution order

1. Evaluate negative controls first.
2. Evaluate cases with explicit litigation/possession risk.
3. Evaluate composite/property-with-financial-assets cases.
4. Evaluate ordinary land/building cases.
5. Evaluate remaining cases by class quota.
6. Re-run deterministic decision tests after every material rule change.
7. Record unresolved cases explicitly; never force a positive state to complete the quota.

## Certification evidence

The production certification package must contain:

- case-level evaluation records;
- decision outputs;
- expected-vs-actual comparison;
- negative-control results;
- contradiction log;
- unresolved-evidence register;
- source/version references;
- reproducibility result;
- class and risk coverage report;
- Shakti sign-off.

**Status: execution framework established; case-level production certification remains open.**


## Live-market edge-case acceptance rules — 2026-10-06

The evidence model must preserve materially different auction structures visible in authoritative IBBI listings:

1. **NRRA / PUFE / actionable-claim lots** — do not classify these as ordinary immovable property. Preserve the legal nature and provenance of the claim/asset package separately.
2. **Leasehold rights** — title/interest must record leasehold rights, remaining term and relevant transfer/consent conditions; never normalize to freehold ownership.
3. **Composite lots** — land/building, plant & machinery, securities/financial assets and other components require component-level provenance and valuation boundaries.
4. **Going-concern sales** — distinguish sale of the corporate debtor/going concern from sale of an identified immovable property asset.
5. **Sale-basis disclaimers** — “as is where is”, “as is what is”, “whatever there is” and “without/no recourse” are source-traceable auction risks, not substitutes for title/condition verification.
6. **Addenda/corrigenda** — the latest applicable notice version must be reconciled before a decision is treated as current; prior evidence remains immutable historical evidence.

These rules are derived from live IBBI auction structures and are validation requirements, not legal conclusions.

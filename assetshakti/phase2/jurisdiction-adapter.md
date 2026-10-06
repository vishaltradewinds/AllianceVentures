# AssetShakti Phase 2 — Jurisdiction Adapter Standard

## Principle
India-wide real-estate intelligence must use a common evidence model with jurisdiction-specific source adapters.

The platform must never assume that a field, approval, status label, search method, or public disclosure available in one State/UT exists or has the same meaning elsewhere.

## Adapter responsibilities
Each state/UT adapter must define:
1. RERA authority and official project search
2. Registered-project evidence
3. Project/promoter status variants
4. Complaints/orders/judgements where publicly available
5. Lapsed/revoked/abeyance/deregistered/withdrawn states where applicable
6. Project progress/QPR evidence where applicable
7. Applicable planning/local-authority source families
8. Land/registration source families
9. Environmental/statutory source families where applicable
10. Source access method, observation timestamp and limitations

## Current adapter priority
- Uttar Pradesh — initial adapter
- Maharashtra — initial adapter
- Gujarat — discovery adapter
- Madhya Pradesh — next production-validation adapter
- Other States/UTs — onboard through the same contract

## Evidence rule
A RERA record verifies only what the RERA authority's record actually establishes. It does not independently prove clean title, possession, construction quality, market value, absence of litigation, or investment suitability.

## Status normalization
Source-specific statuses must be preserved verbatim and mapped to AssetShakti normalized states without destroying the original meaning.

Example:
- registered
- completed
- lapsed
- revoked / ab initio void
- abeyance
- withdrawn
- de-registered
- NCLT-linked

These are not interchangeable.

## Shakti requirement
Every adapter must include source provenance, observation date, retrieval limitations and a human-review path for ambiguous or contradictory records.

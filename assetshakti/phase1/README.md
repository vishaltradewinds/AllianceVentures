# AssetShakti — Phase 1 Property Intelligence Foundation

Status: Shakti-gated foundation
Scope: All property classes before any non-property asset class.

## Goal
Analyse a BAANKNET/IBBI property auction without becoming an auction portal or reproducing BAANKNET content.

Pipeline:
1. Identify
2. Classify
3. Establish legal route
4. Collect evidence
5. Detect missing/contradictory evidence
6. Assess physical/location factors
7. Estimate economics
8. Apply auction constraints
9. Produce an evidence-traceable Shakti decision

## Stakeholder operating model

AssetShakti is a multi-stakeholder intelligence layer. It does not replace the auction transaction channel, professional advice, regulators, courts, or statutory records.

### Tier 1 — Decision makers / primary customers
- Investors and auction bidders
- Property investors, HNIs and family offices
- Corporates and strategic buyers
- Real-estate professionals
- ARCs and distressed-asset investors
- SMEs and entrepreneurs seeking distressed commercial/industrial assets

Core workflow: **“Should I commit capital to this auction asset, and what must I verify before bidding?”**

### Tier 2 — Evidence and professional users
- Insolvency Professionals / Liquidators
- Lawyers and legal due-diligence teams
- Registered valuers
- Chartered Engineers / technical consultants
- Surveyors / architects
- Environmental and other specialist verification professionals

These stakeholders validate, contribute, or challenge evidence. Licensed/statutory professional judgment remains authoritative where required.

### Tier 3 — Institutional / ecosystem stakeholders
- Banks and public-sector banks
- Asset Reconstruction Companies
- Institutional investors
- Government and statutory authorities
- Regulators, courts and tribunals
- Approved data/evidence partners

### Role separation
**BAANKNET = transaction/execution channel**

**AssetShakti = evidence + risk + decision intelligence layer**

AssetShakti must not become a BAANKNET clone, perform automated bidding, guarantee title, or represent AI output as legal/valuation certification.

## Property classes
- Residential
- Commercial
- Industrial
- Agricultural
- Other immovable
- Composite property

## Decision states
- BID_READY
- CONDITIONAL
- DO_NOT_BID
- INSUFFICIENT_EVIDENCE

A numerical score never overrides a failed critical evidence gate.

## Source boundary
BAANKNET remains the authoritative transaction channel. This project is an independent intelligence layer. No unauthorised scraping, copying, redistribution, automated bidding, title guarantee, or legal certification is implemented.

## Phase 1 validation gate
Minimum 50 real property auction cases across the taxonomy before production certification.

## Real-evidence acquisition

The actionable six-pilot document queue is maintained in `real-pilot-evidence-request-manifest.json`. When automated retrieval is blocked, use the AssetShakti Evidence Intake UI to obtain the exact document through the authorised source and upload it. Uploads remain `USER_SUPPLIED_PENDING_VERIFICATION` until source/version identity, integrity, reconciliation, and material page/section references are verified. This mechanism does not bypass IBBI/BAANKNET access controls and cannot override a failed Shakti gate.

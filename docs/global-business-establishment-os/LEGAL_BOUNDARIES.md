# Legal Boundaries and Source Policy

**Purpose:** define controls for an evidence-led business establishment platform. This document is a product control specification, not legal advice.

## 1. Two-sided legal qualification

Every case must separately assess:

### India-side investor and transaction
- FEMA and applicable Overseas Investment Rules, Regulations, Directions, circulars, and amendments.
- Investor type, ownership, eligibility, financial commitment, funding route, guarantees, acquisition/subscription/transfer structure, reporting and designated Authorised Dealer bank process.
- Indian tax, transfer pricing, corporate approvals, export/import and sector-specific obligations where applicable.
- Other Indian restrictions or approval requirements triggered by the actual transaction.

### Host jurisdiction and activity
- Foreign ownership, beneficial ownership and sector restrictions.
- Entity forms, registration, investment screening and business licensing.
- Land tenure, foreign ownership of land, agricultural/forest/coastal/tribal land rules, lease rights, title, encumbrances, zoning and environmental constraints.
- Tax, permanent establishment, transfer pricing, customs, foreign exchange and profit repatriation.
- Employment, immigration, occupational safety, data protection, cybersecurity and environmental permits.
- Sanctions, export controls, anti-bribery, competition, insolvency and dispute resolution.

Rules can vary below country level. Jurisdiction must therefore support country, state/province, city/municipality, regulator, and activity-specific scope.

## 2. Evidence/source hierarchy

Use sources in this order, subject to the issue and legal system:
1. Official legislation, regulations, gazettes, binding decisions and official regulator directions.
2. Official government and regulator guidance, forms, registers and published decisions.
3. Official investment-promotion and industrial-zone authorities for programme information.
4. Qualified local professional analysis, identifying author, scope, date and limitations.
5. Reputable secondary sources for discovery and cross-checking only.
6. Commercial listings, crowd-sourced data and AI outputs as leads only, never sole proof for critical legal or title claims.

For each source capture: issuing authority, exact title, URL or document identifier, jurisdiction, publication/effective/repeal dates where available, retrieval time, language, document hash where practicable, relevant passage, translation status, reviewer, and next review date.

## 3. Legal status vocabulary

Do not conflate these states:
- SOURCE_DISCOVERED
- SOURCE_AUTHENTICITY_CHECKED
- RULE_EXTRACTED
- RULE_REVIEW_PENDING
- RULE_REVIEWED
- APPLICABILITY_CONFIRMED
- PROFESSIONAL_OPINION_RECEIVED
- APPLICATION_NOT_REQUIRED_WITH_REASONS
- APPLICATION_PREPARED
- APPLICATION_SUBMITTED
- AUTHORITY_QUERY_RECEIVED
- APPROVED
- REFUSED
- EXPIRED
- SUPERSEDED
- UNKNOWN / CONFLICTING

An approval state requires evidence of the actual authority decision and its conditions. An eligibility assessment is not an approval.

## 4. Professional-service boundary

The platform may organise public information, evidence, preliminary screening, workflow, and referrals within the law. Legal opinions, tax advice, immigration services, regulated brokerage, investment advice, incorporation filings, and other regulated services must be delivered by appropriately authorised professionals where required. Provider credentials, jurisdiction, scope, conflicts, and verification date must be recorded.

The platform must not misrepresent automated summaries as advice from a licensed professional.

## 5. India-side official starting sources

- RBI Master Direction - Overseas Investment: https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12710
- RBI Foreign Exchange Management (Overseas Investment) Regulations, 2022: https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12380
- RBI official directions and circulars: https://www.rbi.org.in/
- Ministry of Corporate Affairs: https://www.mca.gov.in/
- Income Tax Department: https://www.incometax.gov.in/

These links are entry points. The implementation must resolve the controlling instrument and amendments for the case date and transaction, not hard-code the links as a sufficient legal check.

## 6. Mandatory controls

- Never rank an unlawful or legally unqualified route as eligible.
- Never infer property title, licence validity, approval, incentive award, or partner credentials from marketing content.
- Preserve conflicting sources and require review; do not silently select the more convenient answer.
- Flag translations and machine translations; legal interpretation requires appropriate review.
- Require human approval for material legal conclusions and customer-facing decisions according to the case's risk class.
- Maintain source freshness schedules and automatically mark expired/stale reviews as requiring reassessment.
- Record jurisdiction-module scope and exclusions. Lack of coverage must return NOT_COVERED, not an assumed pass.
- Do not collect or share sensitive ownership, identity, financial, or business-confidential data without a defined purpose, appropriate controls, and applicable legal basis/consent.

## 7. Legal gate failure behaviour

If a critical rule is unknown, contradictory, stale, or not reviewed, status is BLOCKED or PENDING_REVIEW. It cannot be overridden by a high commercial score. An exception cannot authorise unlawful conduct. A no-go result is a valid platform outcome.

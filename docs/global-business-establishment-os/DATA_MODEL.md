# Canonical Data Model — Initial Contract

This is a logical domain contract, not a claim that database migrations or APIs have been implemented.

## Design principles

- Stable global identifiers; no country-specific assumptions in shared entity fields.
- Separate source facts, extracted rules, AI interpretations, professional opinions, decisions, and authority outcomes.
- Store applicable jurisdiction and time validity for every rule or assessment.
- Version decisions; do not overwrite evidence that supported an earlier decision.
- Use explicit enums and structured relationships for gate outcomes.
- Keep personally identifiable and commercially sensitive data segregated and access-controlled.

## Core entities

### CompanyProfile
- id
- legal_name, incorporation_jurisdiction, registration_identifier (restricted)
- ownership/beneficial-ownership reference (restricted; collect only as necessary)
- business_profile, size band, capabilities, objectives, constraints
- authorised decision-makers
- created_at, updated_at

### BusinessActivity
- id, company_id
- products/services, activity description, industry classification and version
- target customers/markets, operating model
- regulated-activity indicators
- facility, land, utility, workforce, logistics and resource requirements

### Jurisdiction
- id, parent_jurisdiction_id
- jurisdiction_type (country/state/province/municipality/special_zone/authority)
- official names and codes, competent authorities
- coverage_status, review date, module version
- coverage limitations and excluded topics

### LocationCandidate
- id, jurisdiction_id
- candidate_type (land/facility/industrial_zone/partner_site/non_property_route)
- source evidence references, geospatial reference, zoning/utility/logistics facts
- availability status and last verification
- title/lease status (unknown until verified)
- suitability assumptions and exclusions

### EvidenceRecord
- id, evidence_type, subject_type, subject_id
- source_authority, title, source_uri/document_id, retrieved_at
- publication/effective/expiry dates when known
- language, translation status, checksum, relevant passage
- authenticity status, reviewer, review timestamp, next_review_at
- confidentiality class, access policy, retention policy

### LegalRule
- id, jurisdiction_id, rule_topic, rule_identifier
- source_evidence_id, text/passage reference, extracted summary
- valid_from, valid_to, published_at, checked_at
- applicability conditions, affected activity/investor classes
- rule status, reviewer, professional opinion reference
- consequences, required action, source supersession relation

### EligibilityAssessment
- id, company_id, business_activity_id, jurisdiction_id, candidate_id
- assessed_at, as_of_date, rule-set version
- outcome (PASS/FAIL/BLOCKED/PENDING_REVIEW/NOT_COVERED)
- applicable rules, blockers, unresolved questions, assumptions
- reviewer and sign-off evidence

### FeasibilityModel
- id, candidate_id, business_activity_id, currency and FX basis/date
- capex, opex, tax assumptions, logistics, labour, utility and facility costs
- incentives (potential vs applied vs awarded kept separate)
- cash-flow horizon, scenarios, sensitivities, source evidence
- model version, author, review status

### ProviderProfile
- id, organisation/person reference, jurisdiction and permitted service scope
- credential type/issuer/identifier, verification evidence/date/expiry
- conflicts, insurance where relevant, due diligence status
- customer consent, engagement status, performance record
- no credential may be shown as verified without evidence

### Approval
- id, authority, approval_type, related company/activity/site
- requiredness and rationale, prerequisite list
- status, submission evidence, authority response evidence
- conditions, effective/expiry dates, responsible owner
- statuses distinguish planned, submitted, queried, granted, refused, expired and not applicable with justification

### EstablishmentWorkflow
- id, company_id, selected_route, jurisdiction/module versions
- stage, owner, milestones, budget baseline, target dates
- tasks and dependencies, blockers, customer decisions
- completion evidence, acceptance and rollback/exit plan

### ShaktiGateRecord
- id, subject_type, subject_id, gate_id, gate_version
- outcome, required evidence, tests run, blocker list
- reviewer/sign-off, exception record (if permitted), timestamp
- immutable history of status transitions

### OperationalPerformance
- id, company_id, establishment_workflow_id
- planned versus actual costs and dates
- operational readiness evidence, compliance events and renewals
- customer-defined business outcome measures and reporting period
- data source, verification level, review status

## Relationship and integrity rules

1. Every material assessment links to an as-of date and the versions of evidence/rules used.
2. Every legal conclusion links to at least one reviewed legal source or is explicitly marked unresolved.
3. An approval must link to actual authority evidence; a model-generated expectation is not approval evidence.
4. A candidate cannot be marked legally eligible if a mandatory blocker remains unresolved.
5. A location's marketing listing is not title evidence.
6. An incentive is not treated as realised value until award conditions and receipt/application status are verified.
7. Updates create new versions and preserve prior decisions and source snapshots.
8. Tenant-scoped access and audit logging apply to all customer-confidential entities.

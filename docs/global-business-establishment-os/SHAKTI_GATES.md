# Shakti Standards — GBEG-OS Gate Specification

**Status:** Proposed control specification for implementation and validation.

Gate outcomes: PASS, FAIL, BLOCKED, PENDING_REVIEW, NOT_APPLICABLE_WITH_JUSTIFICATION. A pending review cannot be treated as pass. No exception may permit unlawful conduct or bypass a mandatory safety/security control.

## G0 — Reality and context
Required: verified customer mandate, business objective, activity, constraints, decision authority, success criteria, and material unknowns.
Fail/block: scope is ambiguous or the customer has not authorised the assessment.

## G1 — Evidence integrity
Required: source provenance, authenticity checks appropriate to source, retrieval date, applicable period, conflict detection, and reviewer status.
Fail/block: critical evidence is absent, unverifiable, stale, or contradictory.

## G2 — Legal applicability
Required: India-side rules, destination country and subnational rules, relevant activity regulators, investor class, and transaction structure are mapped.
Fail/block: jurisdiction or controlling legal regime is not identified.

## G3 — Eligibility and restrictions
Required: ownership, sector, land, licensing, investment-screening, sanctions/export-control and other mandatory restrictions assessed as relevant.
Fail/block: a critical restriction is unresolved or the route is prohibited.

## G4 — Commercial relevance
Required: demand hypotheses, customer access, competition, supply chain, and business model tested against evidence.
Fail/block: material commercial assumptions are unlabelled or unsupported.

## G5 — Technical and location feasibility
Required: facility/land needs, utilities, transport, workforce, environmental constraints, site evidence and availability.
Fail/block: a critical site requirement cannot be verified or met.

## G6 — Financial feasibility
Required: transparent capex/opex, currency and FX date, tax assumptions, funding, working capital, sensitivity and downside scenarios.
Fail/block: critical cost assumptions are missing or the plan fails customer-approved thresholds.

## G7 — Risk and security
Required: risk register with owners and mitigations; data-security assessment; integrity, operational, environmental and geopolitical risks.
Fail/block: unacceptable risk or critical control gap remains without authorised disposition.

## G8 — Solution design
Required: compare lawful alternatives, including no-go, with documented rationale and assumptions.
Fail/block: solution selected without comparing material alternatives.

## G9 — Independent/professional review
Required: appropriately qualified review for material legal, tax, technical, property/title and financial issues according to case risk.
Fail/block: mandatory professional review is missing.

## G10 — Approval and readiness
Required: required company approvals, financing, permits and other preconditions identified; actual approvals evidenced before proceeding.
Fail/block: an action requiring prior approval is scheduled to occur before that approval.

## G11 — Deployment and acceptance
Required: incorporation/contract/site/licence/utility/operational evidence as relevant; user acceptance and handover; contingency and exit plan.
Fail/block: operational readiness is asserted without evidence.

## G12 — Continuous assurance
Required: renewal calendar, legal-source review dates, change monitoring, KPI baseline, incident and corrective-action workflow.
Fail/block: ongoing obligations have no owner or monitoring mechanism.

## Cross-gate controls

- Gate order may be adapted to context, but dependencies cannot be bypassed.
- Non-applicability requires reason, scope, reviewer, and timestamp.
- Each decision records the evidence and module versions used.
- AI may assist extraction, summarisation and question generation, but cannot silently change legal status or approve a gate.
- All overrides are auditable and are forbidden where law or mandatory safety/security controls prohibit them.
- Certification is scoped to the tested product version, jurisdiction module, use case and evidence set; it is never a blanket claim of global legal coverage.

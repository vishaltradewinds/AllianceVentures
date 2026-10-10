# Product Requirements — GBEG-OS

## 1. Customer and problem

Initial customer: an Indian company considering a business activity in one or more overseas jurisdictions. Industry is not preselected. The intake and discovery process must derive sector-specific requirements from the customer's actual activity.

Customer problem: fragmented information and execution across market research, legal eligibility, taxation, land/facilities, utilities, supply chains, local providers, approvals, and ongoing compliance.

## 2. Product outcome

Deliver a traceable establishment dossier and, when separately contracted, a managed workflow to coordinate qualified professionals and local providers through establishment and early growth.

A report alone is not evidence of establishment. Workflow completion requires documentary proof of the relevant event and any required independent review.

## 3. User roles

- Company owner / authorised decision-maker
- Company analyst / project manager
- Internal compliance reviewer
- Local legal, tax, technical, property, and other qualified professionals
- Platform operations coordinator
- Read-only auditor

Access must be scoped by customer, matter, role, and purpose. External providers receive only the data required for their assigned work and authorised by the customer.

## 4. Required user journey

1. Intake: company profile, beneficial ownership as appropriate, intended activity, objectives, constraints, target markets, budget range, timing, people, technology, and resources.
2. Clarify: ask for missing material facts; preserve unknowns rather than infer answers.
3. Discover: generate candidate jurisdictions and business models with explainable inclusion/exclusion reasons.
4. Qualify: apply India-side outbound-investment rules and host-jurisdiction restrictions to the actual investor and activity.
5. Assess: compare demand, operating costs, infrastructure, talent, supply chain, taxes, incentives, risks, and alternatives.
6. Review: route unresolved legal/tax/technical issues to qualified professionals.
7. Decide: produce a decision record with evidence, assumptions, blockers, alternatives, and sign-offs.
8. Execute: track incorporation, property/facility, licences, financing, utilities, hiring, contracts, and other dependencies.
9. Operate: track renewals, obligations, performance, legal changes, and expansion opportunities.

## 5. Required outputs

- Business requirements and assumption register
- Jurisdiction and location candidate set
- Legal applicability and eligibility matrix
- Evidence register with source provenance and review status
- Comparative feasibility model with downside scenarios
- Risk register and mitigation owners
- Permits and approvals dependency map
- Partner due-diligence records
- Costed milestone plan
- Gate decision log and professional sign-offs
- Operating and growth assurance plan

## 6. Candidate comparison

Potential dimensions include legal feasibility, commercial demand, total cost, operational readiness, supply-chain access, workforce, infrastructure, resilience, strategic fit, and time-to-operation.

Weights must be configurable per case and validated empirically. Hard legal restrictions and unresolved mandatory approvals cannot be offset by other scores. Any candidate with a material unresolved legal blocker must remain BLOCKED or PENDING_REVIEW, not be ranked as eligible.

## 7. Functional requirements

- FR-01: Store source-linked evidence and its provenance.
- FR-02: Model country, state/province, municipality, regulator, and applicable period.
- FR-03: Separate legal text/source from summaries and AI interpretations.
- FR-04: Version assessments and preserve prior decisions.
- FR-05: Record blockers, contradictory evidence, and missing information.
- FR-06: Support a no-go recommendation and alternatives.
- FR-07: Track approvals as planned, submitted, queried, granted, refused, expired, or not applicable with rationale.
- FR-08: Track task owner, dependency, due date, proof, reviewer, and completion.
- FR-09: Generate exportable establishment dossiers with citations and assumptions.
- FR-10: Record customer consent and permitted data sharing.
- FR-11: Monitor source freshness and jurisdiction-module coverage.
- FR-12: Prevent an AI-generated answer from changing a gate status without a validated rule and authorised human review where required.

## 8. Non-functional requirements

- Security: least privilege, tenant isolation, encryption, secret management, audit logs.
- Reliability: idempotent workflows, recoverable jobs, backups and documented restore tests.
- Explainability: each material conclusion links to evidence and assumptions.
- Accessibility: mobile-first, low-bandwidth tolerant, clear language.
- Portability: jurisdiction modules and domain logic must not depend on one AI vendor.
- Observability: trace failures, stale sources, review delays, and gate transitions.
- Data governance: retention, deletion, export, and cross-border transfer controls reviewed before production.

## 9. Out of scope for the initial pilot

- Claiming universal coverage of all countries or industries.
- Giving unlicensed professional advice.
- Guaranteeing profits, tax outcomes, incentives, visas, bank accounts, or regulatory approvals.
- Holding or transferring client funds.
- Automatically acquiring property, forming entities, or filing regulated submissions without the required authorisation and approvals.
- Certifying an entire jurisdiction from a single pilot.

## 10. Product success metrics

Measure qualified opportunities, time to complete a supported assessment, percentage of material claims with traceable evidence, legal-review turnaround, blocker detection, cost-estimate variance, milestone completion, customer acceptance, and actual establishment outcomes. Do not use recommendation conversion alone as a quality metric.

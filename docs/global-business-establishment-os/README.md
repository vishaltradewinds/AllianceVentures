# Global Business Establishment & Growth OS (GBEG-OS)

**Status:** Proposed product; Phase 0 foundation documentation  
**Standard:** Shakti Standards  
**Initial customer direction:** Indian companies establishing businesses overseas  
**Industry scope:** Any industry; requirements-led discovery  
**Architecture rule:** Global-first and jurisdiction-neutral. Country-specific rules belong in versioned jurisdiction modules.

## Mission

Help an Indian company discover, compare, legally qualify, establish, and grow an overseas business through evidence-backed workflows and accountable local execution.

The system must not presume that buying land, incorporating a subsidiary, or choosing a particular country is always the right answer. It must compare lawful alternatives, including exporting from India, distribution, contract manufacturing, leasing, acquisition, joint venture, and a no-go recommendation where appropriate.

## Current implementation status

Implemented on this feature branch: governance/product documentation, a mobile-responsive intake prototype, and a deterministic evidence gate with fail-closed tests. The gate engine is not yet connected to the UI or an API, and the intake is not persisted. This is **not** a production workflow, validated global jurisdiction database, legal opinion service, or establishment execution engine.

- [Product requirements](PRODUCT_REQUIREMENTS.md)
- [Legal boundaries and source policy](LEGAL_BOUNDARIES.md)
- [Canonical data model](DATA_MODEL.md)
- [Shakti gates and acceptance criteria](SHAKTI_GATES.md)
- [Pilot and validation plan](PILOT_AND_VALIDATION.md)
- [Existing AssetShakti capability/reuse audit](REUSE_AUDIT.md)
- [Automated validation plan](VALIDATION_PLAN.md)
- [Deterministic gate engine](../../src/lib/gbeg/gate-engine.ts)
- [Gate engine tests](../../src/lib/gbeg/gate-engine.test.ts)
- [GitHub Actions validation run](https://github.com/vishaltradewinds/AllianceVentures/actions/runs/38064001766) — test, TypeScript check and build passed for commit 9a6b715.

## Non-negotiable principles

1. Evidence before conclusions; source and effective date are traceable.
2. Legal eligibility is a hard gate, never offset by a weighted score.
3. Distinguish fact, assumption, model inference, professional opinion, application, and granted approval.
4. Never present an unverified listing as proof of ownership or an incentive as guaranteed.
5. No automated legal, tax, immigration, brokerage, investment, or regulated decision-making beyond permitted scope.
6. Preserve customer consent, least privilege, audit trails, source versioning, and documented human approvals.
7. If evidence is missing, stale, contradictory, or outside the approved jurisdiction scope, block the affected conclusion.
8. Common Shakti governance; project- and jurisdiction-specific controls.

## Proposed initial implementation sequence

1. Inventory existing GPTO and AssetShakti assets before reuse or duplication.
2. Approve domain model, threat model, source policy, and API contracts.
3. Implement the evidence registry and gate engine.
4. Select one destination jurisdiction based on a real pilot customer, not assumptions.
5. Obtain local professional review and validate one bounded end-to-end case.
6. Expand only after the pilot's acceptance evidence is approved.

## Authoritative starting references

- World Bank Business Ready methodology: https://www.worldbank.org/en/businessready/methodology
- UN Trade and Development, World Investment Report: https://unctad.org/publication/world-investment-report-2024
- RBI, Master Direction - Overseas Investment: https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12710
- RBI, Foreign Exchange Management (Overseas Investment) Regulations, 2022: https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12380

References are research entry points, not proof that a specific rule is current or applicable. Before a customer decision, the applicable official instrument, amendments, commencement dates, and local professional interpretation must be checked.

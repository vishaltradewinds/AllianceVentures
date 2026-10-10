# Existing Capability Audit and Reuse Boundaries

**Audit date:** 2026-10-10  
**Repository:** `vishaltradewinds/AllianceVentures`  
**Scope:** inspect accessible AssetShakti branches and the current AllianceVentures application before duplicating domain logic.

## Verified branch/PR topology

- AssetShakti Phase 1: `assetshakti/phase1-property-foundation`, PR #1.
- AssetShakti Phase 1.5: `assetshakti/phase1.5-multi-auction-source-foundation`, PR #3.
- AssetShakti Phase 2: `assetshakti/phase2-new-project-intelligence`, PR #2.
- GBEG-OS: `global-business-establishment-os/phase0-foundation`, draft PR #4 based on `main`.

These are separate branches with different ancestry. The Phase 2 PR targets Phase 1, while Phase 1.5 also targets Phase 1. GBEG-OS currently branches from `main`; therefore it must not assume the AssetShakti implementation files are available in its working tree. Do not merge branches blindly or change PR ancestry without reviewing the resulting diff.

## Existing capabilities verified from source

| Existing artifact | Demonstrated capability | Reuse boundary |
|---|---|---|
| `assetshakti/phase1/property-schema.ts` | Evidence statuses, property evidence model, property-specific decision states | Reuse concepts; do not make property fields mandatory for every industry |
| `assetshakti/phase1/shakti-score.ts` | Deterministic evidence scoring; critical evidence absence/failure blocks positive result | GBEG must not copy property scoring categories or turn weighted score into a legal pass |
| `assetshakti/phase1/shakti-gates.md` | Identity, legal route, evidence, title, physical, economics, transaction and audit gates | Common governance pattern; title/possession gates are conditional to the actual asset/activity |
| `assetshakti/phase1/source-policy.md` | Authoritative-first hierarchy, provenance, explicit missing and contradictory evidence | Reuse the source-provenance principle globally; resolve sources by actual jurisdiction/topic |
| `assetshakti/phase1/validate-corpus.ts` | Corpus checks and a minimum 50-case validation target | Adopt real-case validation discipline; property class distribution does not transfer to global business |
| `assetshakti/phase2/project-evidence-schema.json` | Structured evidence and jurisdiction-aware project data | Reuse jurisdiction/time/version principles; do not reuse real-estate-only schema as the global business model |
| `assetshakti/phase2/decision-engine.ts` | Deterministic missing/contradicted evidence handling and applicability reasons | Reuse fail-closed behavior; add global coverage and qualified legal review requirements |
| `assetshakti/phase2/jurisdiction-adapter.md` and `jurisdictions.json` | Country/subnational adapter concept and coverage status | Architectural reference only; current registry is India real-estate-specific, not a validated global registry |
| `assetshakti/phase2/validation-plan.md` | Negative controls and multi-case validation before certification | Reuse validation method, not the stated real-estate pilot scope |

## GBEG implementation added in this branch

- `src/lib/gbeg/gate-engine.ts`: a domain-neutral evidence gate. It is intentionally not an eligibility, investment, or legal-advice engine.
- `src/lib/gbeg/gate-engine.test.ts`: negative controls for missing evidence, contradiction, stale/future-dated evidence, missing professional review, partial/uncovered jurisdiction, unsupported source type, and unjustified non-applicability.
- `src/lib/gbeg/evidence-registry.ts`: append-only tenant-scoped registry service with immutable IDs, supersession links, source URL/hash checks and a repository interface. Its in-memory adapter is for tests only; durable persistence and API integration are not implemented.
- `src/lib/gbeg/evidence-registry.test.ts`: checks append-only corrections, tenant isolation, source provenance, URL schemes and supersession integrity.
- The engine distinguishes evidence-complete-for-human-review from legal eligibility. A score cannot override mandatory legal-control failure.

## Validation and remaining risks

- The GBEG gate tests, TypeScript check, and Vite production build passed in GitHub Actions for commit `9a6b7152510a161571059ced976e8cffcbb5741a`. Earlier intermediate commits failed a test before the review-evidence fixture was updated; the successful run is linked from the project README.
- `npm ci` reported 24 dependency vulnerabilities (including 2 critical) in the existing dependency graph. The detailed advisories and production-versus-development exposure still need a dedicated dependency audit and remediation; this branch does not silently change dependency versions.
- The existing `server.ts` is not safe to use as the confidential GBEG case/evidence API without a separate security pass: the source contains a default admin-bootstrap path and a demo login path that can mint an admin-role token when MongoDB is not configured; startup also generates local JWT keys outside production. Do not attach customer case data to these routes. PR #3 adds production startup/key/storage guards on its own branch, but it is not merged and does not by itself prove tenant isolation or fix every auth flow.
- Mergeability or combined behavior of the separate AssetShakti PRs after a rebase/merge.
- Availability of global official-source adapters or country-specific legal rule sets.
- Production persistence, authenticated tenant identity, authorization policy, verified professional credentials, evidence hashing at ingestion, or durable audit-log immutability for GBEG.
- A real customer case or any country-specific legal conclusion.

## Next safe integration sequence

1. Run GBEG engine tests, TypeScript checks and production build in CI.
2. Reconcile the three AssetShakti PR ancestry/diffs before selecting any code integration route.
3. Extract a shared, versioned evidence contract only after proving that Phase 1 and Phase 2 semantics can be represented without regressions.
4. Implement jurisdiction module metadata, official-source registry, rule effective dates and change-impact tracking.
5. Select a real pilot customer and destination only after requirements discovery; obtain qualified local review.
6. Do not mark production-ready until independent tests, real-case validation, security/privacy review, recovery and operational controls are accepted.

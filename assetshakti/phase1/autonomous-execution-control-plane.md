# AssetShakti Autonomous Execution Control Plane

Status: ACTIVE / FAIL-CLOSED / PRODUCTION CERTIFICATION OFF

## Mission
Orchestrate parallel specialist workstreams against one Shakti lifecycle without allowing any workstream to create an unauthorised decision.

## Agent lanes

| Lane | Responsibility | Current gate |
|---|---|---|
| Source Network Agent | Direct platform discovery and source-surface mapping | Discovery |
| Lot Identity Agent | Exact provider/auction/lot binding | Hard gate |
| Evidence Acquisition Agent | Current notices, process docs, catalogues, corrigenda | Evidence |
| Document Verification Agent | Identity, source, round, hash, page/section evidence | Verification |
| Reconciliation Agent | Current vs historical versions, corrigenda/addenda, component boundaries | Reconciliation |
| Due Diligence Agent | Title, possession, ownership, lease/encumbrance/obligation evidence | Due diligence |
| Risk Agent | Deterministic risk factors and unresolved blockers | Risk |
| Decision Agent | Positive/negative/hold decision only from verified evidence | Decision |
| Security Agent | Dependency, code, CI and access-control assurance | Security |
| QA/Certification Agent | Regression, production gates, Shakti sign-off readiness | Certification |
| Orchestrator | Coordinates dependencies, preserves provenance, prevents gate bypass | Continuous |

## Non-negotiable isolation

1. Discovery agents cannot certify evidence.
2. Evidence agents cannot approve a bid.
3. Decision agents cannot invent missing evidence.
4. No agent can change `productionCertification` to ON without all applicable gates.
5. Exact auction ID + lot ID are mandatory before decision evidence.
6. Aggregators are never authoritative source truth.
7. No bid/payment/transaction execution.
8. No authentication/CAPTCHA/robots/paywall bypass.
9. Reserve price is never treated as valuation.
10. Every material assertion must retain source/version/hash/page or section provenance where applicable.

## Orchestration state

`DISCOVER → EXACT_BIND → ACQUIRE → VERIFY → RECONCILE → DUE_DILIGENCE → RISK → DECISION → ACTION_ON_SOURCE → OUTCOME → CONTINUOUS_ASSURANCE`

A blocked upstream gate automatically blocks downstream positive decision paths.

## Current mission queue

### Priority A — six IBBI real pilots
Complete current-round evidence bundles and deterministic reconciliation for P1-PILOT-001 through P1-PILOT-006.

### Priority B — direct-platform expansion
Advance BAANKNET, MSTC, SAMIL, NIC eAuction India and IREPS from discovery toward exact-lot evidence.

### Priority C — security/engineering
Obtain fresh current-head CI evidence for dependency remediation, source regression, lot identity, provider certification, build and lint.

### Priority D — platform productization
After evidence gates are stable, expose the common journey:
Intent → Discovery → Exact Lot → Evidence → Verification → Reconciliation → Due Diligence → Risk → Decision → Source Action → Outcome.

## Autonomous checkpoint rule

Every completed lane must leave machine-readable evidence and a deterministic status. If a dependency is blocked, record the blocker and continue independent lanes; never fabricate completion.

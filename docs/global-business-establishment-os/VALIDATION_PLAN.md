# GBEG-OS Automated Validation Gate

## Purpose
Prevent evidence or jurisdiction gaps from being converted into positive conclusions by application code.

## Deterministic checks
- Complete evidence permits only `EVIDENCE_COMPLETE_FOR_HUMAN_REVIEW`, never a legal eligibility status.
- Missing or contradicted mandatory evidence blocks.
- Stale, invalidly dated, future-dated or expired evidence blocks the affected control.
- A legal control requires recorded qualified-professional review.
- Commercial/secondary evidence alone cannot satisfy a legal control.
- Partial or absent jurisdiction coverage cannot pass a legal control.
- Non-applicability requires a rationale; legal non-applicability also requires qualified-professional review.
- All outcomes preserve finding-level reasons and evidence identifiers.

## Release levels
1. Source tests pass: deterministic engine behaves as specified for synthetic test cases.
2. Branch CI passes: TypeScript, build, and targeted tests pass in a clean runner.
3. Pilot validated: a bounded customer case is reviewed with official sources and qualified local professionals.
4. Production accepted: security/privacy, access isolation, operational monitoring, recovery, incident handling, and independent acceptance evidence are complete.

Passing synthetic tests is necessary but insufficient for legal coverage or production certification.

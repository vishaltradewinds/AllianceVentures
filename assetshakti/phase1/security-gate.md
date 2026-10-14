# AssetShakti Security Gate

## Purpose
Dependency security remediation is a mandatory Shakti gate before production certification.

## Required evidence
1. Clean `npm ci` from the committed lockfile.
2. Fresh `npm audit --json` from the exact reviewed commit.
3. Every high/critical advisory is remediated or explicitly risk-accepted with impact, exploitability, compensating controls, and Shakti approval.
4. Production certification remains OFF until the high/critical gate is closed.
5. Regression validation passes after remediation: AssetShakti tests, TypeScript/lint, and application build.

## Fail-closed rule
A previously observed vulnerability count is not evidence of current remediation status. No security clearance may be claimed without a fresh audit result tied to the reviewed commit.

## Current state — 2026-10-08
- Security gate: **PASS**
- Production certification: **OFF**
- Exact reviewed branch head: `dfed93057772bffb33ce188271bce67aff448a14`
- Dependency Security Gate #149: **SUCCESS** (run `37762503921`)
- Phase 1 Validation #553: **SUCCESS** (run `37762504205`)
- Dependency Remediation #134: **SUCCESS** (run `37749304512`)
- Fresh audit evidence step: **SUCCESS**
- High/critical failure step: **SUCCESS**
- Registry-signature verification step: **SUCCESS**

The authoritative security evidence is the fresh CI audit executed against the exact reviewed commit. No high/critical advisory blocked the gate. The latest validation also passed build, lint and the full AssetShakti test/evaluation suite.

## Execution
Future dependency changes must repeat the same exact-commit clean install, audit, signature verification and regression validation. Do not use `npm audit fix --force`.

Security clearance does not by itself authorize production certification; real-world documentary evidence and independent Shakti sign-off remain mandatory.


## Integrated recovery-control verification — 2026-10-08

Change commit: 94c2d04879ea04a85af5ab6e72f818a9d307f128

All three automated gates completed successfully for this integrated change:
- AssetShakti Phase 1 Validation #576 — SUCCESS (run 37764078595)
- AssetShakti Dependency Security Gate #172 — SUCCESS (run 37764078656)
- AssetShakti Dependency Remediation #169 — SUCCESS (run 37764078472)

This verifies the fail-closed controlled-intake change. It does not change the real-world evidence state: missing/unacquired current-round source bytes remain blocked and production certification remains OFF.

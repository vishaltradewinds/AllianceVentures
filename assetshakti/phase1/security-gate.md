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
- Exact reviewed branch head: `fae20bbd367d33915da80ec0bbbf44f5211207a8`
- Dependency Security Gate #119: **SUCCESS** (run `37678747705`)
- Phase 1 Validation #523: **SUCCESS** (run `37678747646`)
- Dependency Remediation #116: **SUCCESS** (run `37678747634`)
- Fresh audit evidence step: **SUCCESS**
- High/critical failure step: **SUCCESS**
- Registry-signature verification step: **SUCCESS**

The authoritative security evidence is the fresh CI audit executed against the exact reviewed commit. No high/critical advisory blocked the gate.

## Execution
Future dependency changes must repeat the same exact-commit clean install, audit, signature verification and regression validation. Do not use `npm audit fix --force`.

Security clearance does not by itself authorize production certification; real-world documentary evidence and independent Shakti sign-off remain mandatory.

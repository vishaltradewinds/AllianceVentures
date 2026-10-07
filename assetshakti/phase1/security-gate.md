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

## Current state
- Security gate: **OPEN**
- Production certification: **OFF**
- Exact vulnerability inventory: **PENDING FRESH npm audit**
- No dependency version has been changed without audit evidence.

## Execution
Run `npm ci` and `npm audit --json` against the exact branch/commit, then remediate only confirmed vulnerable dependency paths and rerun the complete validation suite.

# AssetShakti — Dependency Security Gate

Date: 2026-10-07

## Purpose

Track dependency security as an explicit Shakti production gate. A functional CI pass does not override unresolved dependency risk.

## Current baseline

A previous clean-install audit reported 24 npm vulnerabilities: 3 low, 5 moderate, 14 high, 2 critical.

This baseline must be re-run against the current lockfile before remediation decisions are made.

## Required remediation workflow

1. Run npm audit against the exact committed package-lock.json.
2. Record every vulnerable package, severity, direct/transitive path and fixed version where available.
3. Prefer minimal compatible upgrades.
4. Do not use broad force upgrades without compatibility analysis.
5. Regenerate package-lock.json through npm.
6. Run npm ci.
7. Run the complete AssetShakti test suite.
8. Run build and TypeScript validation.
9. Re-run npm audit.
10. Record residual vulnerabilities and documented risk acceptance only where no safe fix exists.

## Pass criteria

- No critical vulnerabilities.
- No high vulnerabilities with an available compatible fix.
- No dependency upgrade may break AssetShakti evidence/security invariants.
- npm ci succeeds.
- Full AssetShakti validation remains green.
- Production certification remains OFF until the gate is explicitly passed.

## Fail-closed rule

Do not claim security remediation is complete from a package-version change alone. The post-change audit and application validation are mandatory.

# AssetShakti — Dependency Security Gate

Date: 2026-10-07

## Current state

The dependency remediation pass removed the two residual vulnerable package paths identified in the previous clean-install audit:

- esbuild: 0.27.3 → 0.28.2
- qs: 6.14.2 → 6.16.0

The dependency paths were also advanced:

- tsx 4.23.15 → esbuild ~0.28.0
- express 4.22.3 → qs ~6.16.0
- body-parser 1.20.8 → qs ~6.16.0

Current committed lockfile values must be verified by CI on every security-gate run.

## External security evidence

The current public package/security records identify:

- esbuild 0.28.2 as the latest non-vulnerable version.
- qs 6.16.0 as the latest non-vulnerable version.
- The reported qs 2026 advisories are fixed in 6.16.0.

These external records are supporting evidence only. AssetShakti's authoritative security gate remains the audit of the exact committed package-lock.json.

## Mandatory gate

A security gate is PASS only when the current commit successfully executes:

1. npm ci
2. npm audit --audit-level=high
3. npm run assetshakti:test:source-adapters
4. npx tsx assetshakti/phase1/source-discovery.test.ts
5. npm run assetshakti:validate
6. npm build
7. npm run lint

A full npm audit report must also be captured as a CI artifact.

## Fail closed

- Never use npm audit fix --force.
- Never bypass peer/dependency compatibility.
- Never declare production certification from package versions alone.
- Production certification remains OFF until the current commit passes the complete security and application gates.
- Any new high/critical vulnerability blocks the gate until its dependency path and remediation are reviewed.

## Current decision

Dependency remediation itself is COMPLETE.

Security certification is PENDING the fresh CI audit against the current branch head.

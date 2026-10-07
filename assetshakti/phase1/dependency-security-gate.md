# AssetShakti — Dependency Security Gate

Date: 2026-10-07

## Status

The original 24-vulnerability baseline has been remediated through compatible dependency updates.

Original baseline:
- 3 low
- 5 moderate
- 14 high
- 2 critical

Vulnerable versions observed at the start:
- esbuild 0.27.3
- qs 6.14.2

Current committed lockfile:
- node_modules/esbuild: 0.28.2
- node_modules/qs: 6.16.0
- node_modules/tsx: 4.23.15, using esbuild ~0.28.0
- node_modules/express: 4.22.3, using qs ~6.16.0
- node_modules/body-parser: 1.20.8, using qs ~6.16.0
- nested node_modules/vite/node_modules/esbuild: 0.25.12

The nested Vite esbuild 0.25.12 is below the affected esbuild advisory range beginning at 0.27.3 and is not the vulnerable path identified by the current advisory.

## Dependency path findings

esbuild 0.27.3 was previously pulled by:
- tsx 4.21.0 via esbuild ~0.27.0

The current branch uses tsx 4.23.15, which resolves esbuild ~0.28.0.

qs 6.14.2 was previously pulled through:
- express 4.22.1 via qs ~6.14.0
- body-parser 1.20.4 via qs ~6.14.0

The current branch uses express 4.22.3 and body-parser 1.20.8, both resolving qs ~6.16.0.

## Exploitability assessment

esbuild advisory GHSA-g7r4-m6w7-qqqr affects 0.27.3 through versions below 0.28.1 and concerns arbitrary file read through the development server on Windows. AssetShakti does not intentionally expose the esbuild development server as its production service. Nevertheless, this remains a supply-chain/build security gate and the affected top-level version has been removed.

qs is part of the Express/body-parser HTTP dependency path. The reported moderate findings affect versions below 6.16.0. The current lockfile resolves qs 6.16.0.

## Required validation

A security claim is not complete from package versions alone.

The exact committed lockfile must pass:

npm ci
npm audit
npm audit --audit-level=high
npm run assetshakti:test:source-adapters
npx tsx assetshakti/phase1/source-discovery.test.ts
npm run assetshakti:validate
npm run build
npm run lint

The exact-lot identity and parser invariants must remain unchanged.

## Fail-closed rule

Production certification remains OFF until the post-change security audit and application validation are successfully executed against the current commit.

Do not use:
npm audit fix --force
npm install --force
or dependency changes that bypass peer/dependency compatibility.

If a new audit finding appears, map the dependency path, assess exploitability, and remediate deliberately.

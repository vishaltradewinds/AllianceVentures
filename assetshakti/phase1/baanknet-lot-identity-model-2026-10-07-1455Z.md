# AssetShakti BAANKNET Lot-Identity Model Upgrade — 2026-10-07T14:55Z

Status: IMPLEMENTED / FAIL-CLOSED / PRODUCTION CERTIFICATION OFF

A current 2026 IBBI/BAANKNET auction notice pattern demonstrates that BAANKNET records can expose both an Auction ID and an Asset ID at lot level. Asset IDs are therefore modeled as first-class source identifiers where a BAANKNET surface exposes them.

## Mandatory identity tuple

provider = BAANKNET
auctionId = exact BAANKNET auction identifier
lotId = exact BAANKNET lot identifier when exposed
assetId = exact BAANKNET asset identifier when exposed
sourceUrl = exact authoritative BAANKNET URL
sourceVersion = timestamp/version where available
contentSha256 = required when a document is acquired

## Fail-closed rule

An Asset ID must never be substituted for an Auction ID or Lot ID. Similar names, reserve prices, locations or debtor names cannot establish identity.

## Evidence progression

DISCOVERY_READY -> EVIDENCE_READY -> PRODUCTION_CERTIFIED

Provider evidence readiness does not certify a pilot. Individual-lot certification requires exact identity plus current documentary evidence, verification, reconciliation and Shakti gates.

## Current result

BAANKNET remains EVIDENCE_READY at provider level.
Six IBBI pilots remain unverified at individual-lot level.
No decision evidence is promoted.
Production certification remains OFF.

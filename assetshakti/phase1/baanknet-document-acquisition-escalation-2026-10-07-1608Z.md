# AssetShakti BAANKNET Document Acquisition Escalation — 2026-10-07T16:08Z

## Fresh authoritative finding

Official IBBI material confirms that detailed e-auction process documents are made available to prospective bidders through BAANKNET. Silverton's official notice explicitly directs bidders to BAANKNET for the complete E-Auction Process Information Document, bid forms, declarations, undertakings and terms and conditions.

## Consequence for AssetShakti

The platform must distinguish:
1. IBBI auction-register / notice evidence — authoritative for auction identity and published metadata.
2. BAANKNET process bundle — authoritative operational participation evidence where the applicable notice directs bidders there.
3. User-controlled evidence intake — compliant fallback when the exact BAANKNET bytes cannot be retrieved by the connected machine interface.

## Current gate

DIRECT_ROUTE = VERIFIED
CURRENT_ROUND_IDENTITY = VERIFIED
PROCESS_DOCUMENT_BYTES = NOT_ACQUIRED_BY_CONNECTED_INTERFACE
HASH_BOUND = PENDING
VERSION_RECONCILED = PENDING
DECISION = FAIL_CLOSED
PRODUCTION = OFF

## Safety/control
No login bypass, CAPTCHA bypass, robots bypass, paywall bypass, or fabricated BAANKNET document content is permitted.

## Next executable state
For each pilot, bind the expected BAANKNET document to provider + auction ID + lot ID. If bytes become available through an authorized/public interface, acquire and SHA-256 hash them. Otherwise route the exact document through controlled evidence intake and perform the same identity/hash/version/reconciliation checks.

## CI status
The preceding commit 4541ce5b72e75dee6f0db53eaafafb8453e21300 passed all three workflows:
- Phase 1 Validation #492
- Dependency Security Gate #88
- Dependency Remediation #85

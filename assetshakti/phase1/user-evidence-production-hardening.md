# AssetShakti User Evidence — Production Hardening Gate

## Lifecycle
REQUESTED -> UPLOADED_PENDING_VERIFICATION -> VERIFIED or REJECTED.

Receipt, hashing, or extraction never equals verification.

For current-round auction terms, promotion requires authenticated upload, immutable hash, authoritative reference, exact auction round, current/superseded status, corrigendum reconciliation, verifier identity/time, page or section provenance, and RECONCILED current-version binding.

## Production blockers
1. Replace local filesystem storage with encrypted versioned object storage.
2. Malware/content scan before extraction.
3. Enforce case-level authorization.
4. Make audit events durable and tamper-evident.
5. Sandbox PDF extraction and preserve page/section provenance.
6. Make verification/reconciliation records append-only/versioned.
7. Return explicit 401/403 JSON from API authentication failures.
8. Add rate limits and upload quotas.
9. Test backup, restore, retention and deletion policy.
10. Deterministically re-run the case engine after verified evidence changes.

Development remains zero-cost and uses synthetic fixtures. Production certification remains OFF until these controls and the Shakti evidence gates are satisfied.

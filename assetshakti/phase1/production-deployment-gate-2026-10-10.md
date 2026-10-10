# AssetShakti Production Deployment Gate — 2026-10-10

## Status
Production deployment is not authorised by this file. The server now fails closed at startup when required production authentication/database/evidence-storage settings are absent or the evidence volume is not explicitly configured and attested.

## Production requirements
- `NODE_ENV=production`.
- `JWT_PRIVATE_KEY` and `JWT_PUBLIC_KEY` injected from a secret manager; do not generate or store production signing keys in the repository or ephemeral application filesystem.
- `MONGO_URI` points to a secured non-local production database with authentication, network restrictions, backups and recovery testing. Localhost, loopback and IPv6 loopback targets are rejected.
- `ASSETSHAKTI_EVIDENCE_DIR` is an absolute path on a persistent, access-controlled volume.
- `ASSETSHAKTI_EVIDENCE_STORAGE_MODE=persistent-volume`.
- `ASSETSHAKTI_EVIDENCE_STORAGE_CONFIRMED=true` only after an operator has verified that the volume survives restarts/redeployments and has backup/restore controls.
- Production secrets must be configured in the hosting provider's secret manager; no secret values belong in `.env.example` or Git.
- Verify rate limiting, file-upload limits, authentication/authorization, audit retention, malware scanning, storage permissions and backup/restore before public launch.

## Why the gate exists
The evidence-intake route writes PDFs and metadata to a local filesystem directory. On serverless/ephemeral filesystems that is not durable evidence storage. Production must not silently boot with generated RSA keys or ephemeral storage. The guard is a deployment safety gate, not proof that an operator's volume is durable.

## Verification
- Local type-check/build and AssetShakti test suite must pass.
- A negative production-startup test with required settings omitted must fail closed.
- After the deployment owner configures a durable volume and secret manager, run a controlled upload/hash/restart/retrieve/restore test with a non-sensitive test PDF and verify the SHA-256 and audit trail.
- Do not enable production certification or decision evidence projection until the real-world evidence gates and independent Shakti sign-off also pass.

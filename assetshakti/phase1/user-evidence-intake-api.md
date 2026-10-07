# AssetShakti Phase 1 — User Evidence Intake API Contract

## Purpose
Expose the user-assisted evidence path as a deterministic application contract. This contract does not perform external-source bypasses and does not grant decision authority to the uploader.

## Intake states
- REQUESTED — AssetShakti has identified a missing authoritative document.
- UPLOADED_PENDING_VERIFICATION — user supplied a document; provenance captured but not trusted.
- VERIFIED — document identity, source/version binding and integrity checks have passed.
- REJECTED — document cannot be accepted for the requested evidence role.

## Required request fields
- caseId
- documentType
- sourceReference
- auctionRound or applicableRound
- observedAt
- file

## Required server actions
1. Validate file type and configured size limit.
2. Persist the original without mutation.
3. Calculate SHA-256 content hash.
4. Record uploader identity and upload timestamp.
5. Bind the intake to caseId and requested auction round.
6. Create evidence status UPLOADED_PENDING_VERIFICATION.
7. Queue extraction/reconciliation.
8. Never promote evidence directly to VERIFIED from upload.

## Verification requirements
A verifier must establish:
- document identity
- authoritative source/reference
- applicable auction round
- current/superseded status
- consistency with captured corrigenda/addenda
- integrity/hash of the stored original
- page/section references for material extracted assertions.

## Decision integration
Only VERIFIED evidence may satisfy an evidence gate. Pending or rejected evidence cannot satisfy G16. If current document binding or reconciliation remains unresolved, the decision engine must remain fail-closed.

## Audit events
Record at minimum: requested, uploaded, hash_created, extraction_started, extraction_completed, verification_started, verified/rejected, reconciliation_changed, decision_re_evaluated.

## Security
Do not execute uploaded files. Enforce authorization per case. Do not accept credentials, cookies or session tokens as evidence. Preserve immutable originals and audit history.

## Product behavior
When automated acquisition fails, the UI should convert the failure into an actionable user task rather than a dead end: `Get document from authorised source → Upload → Verify → Re-evaluate`.
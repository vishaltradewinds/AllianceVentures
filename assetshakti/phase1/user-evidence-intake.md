# AssetShakti Phase 1 — User Evidence Intake

## Purpose
When AssetShakti cannot retrieve an authoritative auction document automatically because of access controls, authentication, robots restrictions, CAPTCHA, temporary outage, or another external-system limitation, the platform must provide a first-class user-assisted evidence path.
This is a fallback acquisition mechanism, not a bypass of access controls.

## User workflow
1. AssetShakti identifies the exact missing document and current auction round.
2. The UI shows case/property ID, auction round/date, required document type, authoritative source, why automated acquisition failed, and evidence fields to be extracted.
3. User obtains the document through the normal authorised source (for example, IBBI/BAANKNET) and uploads the PDF or supported document.
4. AssetShakti creates an immutable intake record: SHA-256 file hash, upload timestamp, uploader identity, source URL/reference supplied by user, observed/source date, document type, and auction/case binding.
5. The document enters USER_SUPPLIED_PENDING_VERIFICATION.
6. Document extraction creates a structured evidence ledger, preserving page/section references.
7. Reconciliation compares it with other notices/corrigenda.
8. A human verification step confirms that the uploaded document is the intended authoritative document/version.
9. Only after verification can evidence become VERIFIED or REPORTED_BY_SOURCE.
10. The decision engine re-runs automatically.
11. Original files and extracted evidence remain immutable/auditable; later versions create new evidence records.

## Fail-closed rules
- User-uploaded evidence does not automatically become VERIFIED.
- A screenshot or photograph may be accepted as intake evidence but cannot silently become authoritative document evidence.
- The system must not infer missing bidder obligations.
- A user cannot manually override a failed critical gate to create BID_READY.
- Conflicting documents remain CONTRADICTED or UNRESOLVED until reconciled.
- The platform must preserve the exact document version used for every decision.

## Minimum UI
Evidence acquisition panel:
- Document required
- Why AssetShakti could not retrieve it
- Authoritative source
- Open source
- Upload document
- Paste source reference
- Record observation date
- Submit for verification

After upload:
- PENDING VERIFICATION
- Document identity verified
- Version reconciled
- Evidence extracted
- Critical fields verified
- Decision re-evaluated

## Security
- Validate file type and size.
- Malware-scan uploaded documents where infrastructure supports it.
- Store immutable content hash.
- Do not execute uploaded files.
- Restrict document access according to case permissions.
- Maintain audit log for upload, verification, replacement and decision changes.
- Never expose credentials, session cookies or access tokens through the evidence workflow.

## Shakti classification
USER_SUPPLIED_PENDING_VERIFICATION is an evidence provenance state, not a decision state.
The platform remains fail-closed until the evidence is independently validated against the applicable authoritative source/version.

## Product principle
Automated acquisition when possible. User-assisted authorised acquisition when necessary. Verification before decision.
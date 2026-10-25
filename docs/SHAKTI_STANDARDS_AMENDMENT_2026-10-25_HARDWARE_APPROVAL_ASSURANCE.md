# Shakti Standards Amendment — Hardware Approval Assurance

**Amendment:** SHAKTI-AMD-2026-10-25-01  
**Rule:** SHAKTI-HW-01  
**Status:** Proposed on review branch; not adopted until merged.

## Governing rule

No hardware may be procured for production, represented as approved, or released into production until the exact manufacturer/model, intended use, applicable approvals and supporting evidence have been verified.

For RupayKg, the owner's explicit rule is to use only hardware whose applicable MeitY approval/certification status has been verified. If the approval route or exact-model evidence cannot be established, mark the candidate HOLD. Do not infer approval from marketing, country of origin, another model's certificate, or a supplier listing.

Do not assume every gateway, sensor, gas analyser, flow meter, weighbridge or power supply is governed by one universal MeitY certificate. Determine legal and contractual applicability for the exact product and intended use. Verify any other applicable STQC, BIS, telecom/radio, Legal Metrology, electrical-safety, calibration or sector-specific requirements independently. Another approval does not automatically waive the user's MeitY selection rule.

## Required approval register

Record project/site/use case; category; manufacturer and exact model/SKU/revision; intended use, range, accuracy and interfaces; applicable requirement and applicability rationale; issuing authority; certificate or registration identifier, scope, status and validity; official verification source and date checked; calibration traceability, uncertainty and due date; security/firmware support; protocol compatibility; acceptance evidence; reviewer; and disposition.

Allowed dispositions: VERIFIED, PENDING, HOLD, EXPIRED, REJECTED, or NOT APPLICABLE WITH WRITTEN JUSTIFICATION. A certificate must match the exact model and scope. Vendor claims and search snippets are leads, not proof.

The terms “MeitY approved”, “STQC tested/certified”, “BIS certified”, “Legal Metrology verified”, “calibrated”, “Made in India” and procurement-preference status are distinct claims. Use only wording supported by evidence.

## Evidence-vault binding and immutable approval

For every VERIFIED instrument, bind each applicable MeitY, calibration and firmware/security evidence item to an exact immutable evidence-vault artifact-version identifier—not only a free-text reference. The approval gate must verify all of the following:

1. The artifact version resolves to bytes stored in the approved evidence vault.
2. The artifact belongs to the same organization as the instrument and its evidence record is VERIFIED.
3. The latest independent review for that exact artifact version is APPROVED; a later REJECTED decision invalidates its use.
4. The stored byte length and SHA-256 are recomputed and match the artifact version and canonical evidence record.
5. The exact artifact-version IDs and hashes are recorded in the instrument decision history and cannot be substituted after verification.
6. The same checks are re-evaluated at measurement ingestion and MRV submission, not only at initial approval.

A syntactically valid hash, URL, certificate number, or user-entered evidence reference is not proof of the underlying artifact. Missing, cross-organization, unreviewed, changed, hash-mismatched or later-rejected evidence means HOLD.

## Structured measurement specification

Before a measurement instrument may become VERIFIED, every supported parameter must have a reviewed specification tied to a reviewed same-organization evidence-vault artifact. At minimum record:

- parameter code and exact canonical unit;
- minimum and maximum accepted value;
- measurement resolution;
- absolute accuracy and/or relative accuracy, with the accuracy basis and supporting source;
- uncertainty unit where provided;
- source artifact-version identifier and reviewer.

Unit symbols are case-sensitive. No implicit unit conversion is allowed. Any conversion must be an explicit, versioned and separately tested rule. Reject missing specifications, unsupported parameter codes, unit mismatch, values outside the registered range, invalid precision/resolution or missing accuracy metadata. Once an instrument is VERIFIED, its model identity, evidence bindings and parameter specifications are immutable; a changed model or specification requires a new instrument record and review.

## Mandatory fail-closed gates

1. Define use case, measurement boundary, methodology, environment, interfaces and acceptance criteria.
2. Determine applicable approval requirements from current primary sources.
3. Verify exact-model and certificate scope against an authoritative source.
4. Verify measurement range, accuracy, calibration traceability and uncertainty.
5. Verify evidence-vault artifact identity, independent review, organization scope, byte length and recomputed SHA-256.
6. Assess device identity, secure provisioning, authenticated transport, firmware support and key lifecycle as applicable.
7. Test interfaces, offline buffering, retries, duplicates, replay, out-of-order data and recovery.
8. Demonstrate instrument → gateway → authenticated ingestion → original evidence retention → normalized observation → methodology calculation/reconciliation.
9. Recheck approval, calibration, security and evidence validity at every relevant use boundary. A later rejected review or expired approval/calibration blocks new eligible measurement and MRV submission.
10. Record test results, exceptions and operational ownership. Missing mandatory evidence blocks procurement or production release.

## MRV integrity

Preserve original observations and provenance. Capture device/site identity, exact instrument ID, parameter, value, unit, observation and receipt times, time quality, calibration status, quality flags, source reference, corrections and processing version as applicable. Never silently fabricate missing values or overwrite original evidence. Quarantine readings from unverified devices or instruments with expired/unknown calibration where calibration is required.

Instrument placement, sampling frequency, gas conditions, moisture basis and aggregation must match the applicable methodology and site monitoring plan. Software controls do not replace field calibration, commissioning, independent verification or statutory approvals.

## RupayKg initial application

For landfill methane, follow the current applicable BEE methodology and site monitoring plan. BM WA03.001 specifies continuous flow measurement with accumulated-volume recording and direct methane-content measurement; measurement location and moisture basis must be compatible with the methodology. This requirement does not approve any particular model.

**Kathonda site-reality hold:** do not assume the proposed RupayKg boundary is an active landfill-methane-recovery project. The reviewed public records describe the site's primary activity as mass-burning waste-to-energy and do not establish active landfill-gas recovery within the intended project boundary. Confirm the current operator, boundary, actual activity, operating status and methodology eligibility before selecting methane-specific instrumentation. A proposed Bio-CNG/CBG plant must not be treated as operating before its approval, commissioning and eligibility are evidenced.

Candidate categories to assess only after site and methodology gates pass:
- industrial gateway and required interfaces;
- continuous landfill-gas flow meter with accumulated volume, only if an eligible actual gas stream exists;
- direct methane analyser or a methodology-compliant periodic measurement arrangement, only if allowed by the approved monitoring plan;
- temperature/pressure/moisture measurement only as required by the meter, methodology and site design;
- existing weighbridge/indicator and controlled data interface for MSW mass records;
- power, communications, local buffering and time source.

This is a requirements list, not an approved-model list. No model is VERIFIED until its evidence and tests are reviewed.

## Official source starting points

- STQC IoT System Certification Scheme: https://stqc.gov.in/en/iot-system-certification-scheme-iotscs-0
- STQC certified products: https://www.stqc.gov.in/certified-product
- Department of Consumer Affairs Legal Metrology overview: https://consumeraffairs.gov.in/pages/legal-metrology-overview
- BEE approved methodologies: https://beeindia.gov.in/view_content.php?lang=1&lid=571
- BEE BM WA03.001: https://beeindia.gov.in/sites/default/files/BM%20WA03.001.pdf

These are source starting points, not proof that a specific model is approved.

## Change control

This amendment is proposed on a review branch. It becomes part of the governing Shakti Standards only after review and merge. Project teams must maintain model-specific evidence and test records. Shakti certification never replaces independent statutory or third-party approvals.

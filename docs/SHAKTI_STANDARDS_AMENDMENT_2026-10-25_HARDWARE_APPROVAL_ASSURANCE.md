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

## Mandatory fail-closed gates

1. Define use case, measurement boundary, methodology, environment, interfaces and acceptance criteria.
2. Determine applicable approval requirements from current primary sources.
3. Verify exact-model and certificate scope against an authoritative source.
4. Verify measurement range, accuracy, calibration traceability and uncertainty.
5. Assess device identity, secure provisioning, authenticated transport, firmware support and key lifecycle as applicable.
6. Test interfaces, offline buffering, retries, duplicates, replay, out-of-order data and recovery.
7. Demonstrate instrument → gateway → authenticated ingestion → original evidence retention → normalized observation → methodology calculation/reconciliation.
8. Record test results, exceptions and operational ownership. Missing mandatory evidence blocks procurement or production release.

## MRV integrity

Preserve original observations and provenance. Capture device/site identity, parameter, value, unit, observation and receipt times, time quality, calibration status, quality flags, source reference, corrections and processing version as applicable. Never silently fabricate missing values or overwrite original evidence. Quarantine readings from unverified devices or instruments with expired/unknown calibration where calibration is required.

Instrument placement, sampling frequency, gas conditions, moisture basis and aggregation must match the applicable methodology and site monitoring plan. Software controls do not replace field calibration, commissioning, independent verification or statutory approvals.

## RupayKg initial application

For landfill methane, follow the frozen applicable BEE methodology and site monitoring plan. BM WA03.001 specifies continuous flow measurement with accumulated-volume recording and direct methane-content measurement; measurement location and moisture basis must be compatible with the methodology. This requirement does not approve any particular model.

Candidate categories to assess first:
- industrial gateway and required interfaces;
- continuous landfill-gas flow meter with accumulated volume;
- direct methane analyser or a methodology-compliant periodic measurement arrangement;
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

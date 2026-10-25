# Shakti Standards Amendment — Approved Hardware and Instrumentation Assurance

**Amendment ID:** SHAKTI-AMD-2026-10-25-01  
**Effective date:** 2026-10-25  
**Applies to:** All AllianceVentures projects and all Shakti-governed hardware, instruments, sensors, gateways, communications equipment, embedded devices and connected systems  
**Status:** Proposed change on a review branch; binding adoption requires merge into the governing standards branch.

## 1. Governing rule

**SHAKTI-HW-01 — Approved Hardware, Instrumentation and Supply-Chain Assurance**

No hardware item may be procured for a Shakti-governed production system, represented as approved, or released into production until the exact manufacturer, model, intended use, applicable approval/certification requirements and supporting evidence have been verified.

For RupayKg, the user's explicit requirement is to use only hardware whose applicable MeitY approval/certification status has been verified. If the relevant MeitY approval route or an applicable approval cannot be established for an instrument category, the item remains **HOLD** until the requirement is clarified and an authoritative compliance determination is recorded. Do not infer approval from a seller listing, marketing statement, country of origin, or a certificate belonging to a different model.

This rule does **not** assume that every sensor, flow meter, gas analyser, weighbridge, power supply or industrial gateway is governed by one universal MeitY certificate. Applicable statutory requirements must be determined for the exact product category and intended use. Where another authority or regime applies, verify it independently; that does not automatically waive the user's MeitY selection requirement.

## 2. Evidence and approval register

Every candidate item must have a controlled record with at least:

- project, site, use case and measurement purpose;
- device category, manufacturer, exact model/SKU and hardware/firmware revision;
- intended operating environment, interfaces, measurement range and accuracy requirements;
- applicable law, rule, order, technical regulation, procurement condition and certification scheme, with applicability rationale;
- issuing authority, certificate/registration/test-report identifier, model scope, status and validity/expiry where applicable;
- official verification URL, source title, date checked, and retained evidence artifact or cryptographic hash where practical;
- country-of-origin/value-addition evidence only where separately relevant; do not confuse it with product-security certification;
- calibration certificate, traceability, due date, uncertainty and out-of-calibration handling for measurement instruments;
- security support lifecycle, firmware update process, identity/authentication capabilities and known limitations;
- protocol/interface compatibility, environmental rating, installation requirements and test evidence;
- disposition: **VERIFIED**, **PENDING**, **HOLD**, **EXPIRED**, **REJECTED**, or **NOT APPLICABLE WITH WRITTEN JUSTIFICATION**; and reviewer/date.

A certificate must match the exact product and scope. A vendor certificate, a certificate for another model, a test report, a procurement preference listing and a statutory approval are not interchangeable.

## 3. Fail-closed gates

1. **Requirements gate:** define the use case, measurement boundary, methodology, operating conditions, interfaces and acceptance criteria before selecting models.
2. **Applicability gate:** determine which approvals/certifications are legally or contractually applicable using current primary sources.
3. **Evidence gate:** independently verify the exact model and certificate scope with the issuing authority or authoritative register.
4. **Measurement gate:** establish accuracy, range, repeatability, calibration traceability, environmental suitability and uncertainty budget.
5. **Security gate:** assess unique device identity, secure provisioning, authenticated transport, least privilege, signed/controlled firmware updates, vulnerability support and key rotation as applicable.
6. **Integration gate:** demonstrate protocol compatibility and robust handling of timestamps, units, quality flags, disconnections, buffering, retries, duplicate messages and out-of-order data.
7. **End-to-end validation gate:** test the real or traceably simulated instrument reading through gateway, ingestion, persisted evidence, reconciliation and methodology calculation.
8. **Release gate:** record approval, test evidence, exceptions and operational ownership. Unresolved mandatory gates block procurement or production release.

Do not mark a device verified merely because the platform accepts its data. Do not mark an instrument accurate merely because it is certified. Do not mark a deployment compliant merely because a build or CI job passes.

## 4. Measurement and MRV integrity

For environmental MRV, preserve the raw observation and its provenance before normalization. Each record should capture, as applicable: device identity, site, parameter, value, unit, observation time, receipt time, time source, calibration status, quality flags, protocol/source reference, corrections, processing version and evidence hash.

Never silently substitute missing readings, units, calibration status, timestamps or methodology parameters. Quarantine readings from unverified devices or instruments with expired/unknown calibration when calibration is required. Any correction must be additive/auditable rather than overwriting the original evidence.

Instrument placement, moisture basis, gas conditions, sampling frequency and aggregation must match the applicable methodology and site monitoring plan. A software control does not replace field calibration, site commissioning, independent verification or regulator/standard-owner acceptance.

## 5. Terminology and evidence hierarchy

The phrases **MeitY approved**, **STQC tested/certified**, **BIS certified**, **TEC/MTCTE compliant**, **WPC/ETA approved**, **Legal Metrology verified**, **calibrated**, **Made in India**, and **listed under a procurement preference order** have different meanings. Use only the exact claim supported by evidence.

Prefer current primary sources: legislation and official notifications, regulator/authority registers, certification scheme rules, certificate documents, official standards and methodology sources. Search snippets and vendor marketing are discovery leads, not final evidence.

If the source is inaccessible, its scope is ambiguous, or status cannot be confirmed, record the uncertainty and retain **HOLD**. Do not invent a certificate number, approval, expiry date, or regulatory obligation.

## 6. RupayKg-specific initial application

For landfill methane monitoring, use the currently applicable BEE methodology and the project's frozen methodology version. BM WA03.001 requires continuous flow measurement with accumulated-volume recording and direct methane-content measurement; methane and flow measurements must be suitably located and use compatible humidity/moisture conditions as specified by the methodology. Check the original methodology and site-specific monitoring plan before selecting the instrument package.

The minimum candidate categories to assess are:
- industrial gateway and required interfaces;
- continuous landfill-gas flow meter with accumulated volume;
- direct methane analyser or a methodology-compliant periodic measurement arrangement;
- temperature/pressure/moisture measurement only as required by the meter, methodology and site design;
- existing weighbridge/indicator and authenticated data interface for MSW mass records;
- power, communications, secure local buffering and time source as required.

This is a requirements list, not a list of approved models. No candidate becomes approved without model-specific evidence and test results.

## 7. Official sources consulted for this amendment

- STQC, IoT System Certification Scheme certified-product information: https://stqc.gov.in/en/iot-system-certification-scheme-iotscs-0
- STQC, certified products overview: https://www.stqc.gov.in/certified-product
- Department of Consumer Affairs, Legal Metrology overview: https://consumeraffairs.gov.in/pages/legal-metrology-overview
- BEE, approved methodologies under the Offset Mechanism: https://beeindia.gov.in/view_content.php?lang=1&lid=571
- BEE, BM WA03.001 methodology: https://beeindia.gov.in/sites/default/files/BM%20WA03.001.pdf

These sources provide starting points for applicability and methodology review; they do not establish approval of any specific unverified model.

## 8. Adoption and change control

This amendment is proposed on a review branch. It becomes part of the governing Shakti Standards only after review and merge through the repository's normal change-control process. Project teams must then maintain a project-specific approval register and test evidence. A Shakti rule never replaces independent statutory approvals or third-party certification.

# Shakti Standards Amendment — Digital Public Infrastructure (DPI) Architecture and Ecosystem Qualification

**Amendment ID:** SHAKTI-AMD-2026-11-03-01  
**Effective date:** 2026-11-03  
**Applies to:** Every current and future AllianceVentures / AVGAT INFRASYS project where shared digital infrastructure, multi-party ecosystems, public-service delivery, regulated data exchange, reusable platforms, or sector-wide interoperability is relevant.  
**Status:** Binding architecture and assessment standard. Applicability is project-specific; this amendment does not confer DPI status, statutory approval, certification, or government endorsement.

## 1. Governing rule and relationship to Shakti

This amendment incorporates relevant Digital Public Infrastructure (DPI) architecture and implementation principles into Shakti Standards. It supplements, and does not replace, the common Shakti lifecycle, source hierarchy, evidence requirements, security controls, project-specific operating systems, and release gates.

> **ONE SHAKTI STANDARD. MANY PROJECT-SPECIFIC OPERATING SYSTEMS.**

> **Build reusable, interoperable infrastructure where the ecosystem requires it; do not label ordinary software as DPI without evidence that it meets the applicable characteristics.**

CDPI (Centre for Digital Public Infrastructure) is a useful non-statutory source of architecture patterns, implementation experience, knowledge resources and country advisory practice. Its material is guidance, not Indian law, a regulator's direction, a certification scheme, or proof that a product qualifies as DPI. Where CDPI guidance conflicts with applicable law, binding government requirements, contracts, safety obligations or a project's approved risk posture, those controlling requirements prevail.

## 2. When this amendment applies

At project discovery and every material architecture review, classify the project as one or more of:

1. **DPI / shared-infrastructure candidate:** reusable digital capabilities intended to serve multiple independent institutions, providers, users or public-interest use cases.
2. **DPI-enabled application:** an application that consumes or contributes to shared infrastructure but is not itself the infrastructure layer.
3. **Conventional product or internal system:** a bounded application or workflow without demonstrated ecosystem-wide infrastructure characteristics.
4. **Hybrid:** a product containing both shared infrastructure components and application-specific components.

Record the classification, rationale, scope, intended ecosystem, and evidence. Reassess when the number or independence of participants, use cases, jurisdictions, data sensitivity, or operating model materially changes. Never claim “national DPI”, “government DPI”, “officially recognised DPI” or equivalent status solely because software is open-source, has APIs, is deployed at scale, or serves a government customer.

## 3. DPI qualification and design principles

Evaluate the following characteristics proportionately. A project may be a candidate without satisfying every characteristic at inception; gaps must be recorded in its roadmap and must not be concealed.

### 3.1 Reusable public-interest building blocks
- Identify the smallest stable capabilities that multiple independent participants can reuse.
- Separate shared infrastructure services from sector-specific business logic, user interfaces and commercial products.
- Define service boundaries, versioning, lifecycle ownership, support and deprecation policy.
- Avoid creating a monolith or a compulsory intermediary where modular composition is feasible.
- Reuse proven infrastructure when lawful, secure, fit for purpose and economically sensible; do not rebuild merely for branding or control.

### 3.2 Open standards and interoperability
- Prefer documented, implementation-neutral standards and well-defined open APIs.
- Publish machine-readable schemas, data dictionaries, identifiers, error models, versioning rules and conformance tests where safe and appropriate.
- Support independent implementations and multiple providers; do not make one vendor's proprietary format the only practical route to participation.
- Design for backward compatibility, portability, migration and graceful degradation.
- Verify actual interoperability with independent implementations or counterparties; an API existing is not proof of interoperability.

### 3.3 Federated architecture and institutional autonomy
- Keep authoritative source records with the institution legally and operationally responsible for them unless a lawful, documented reason requires otherwise.
- Exchange only the data needed for a defined purpose; prefer query, reference, token, credential or evidence exchange over unnecessary bulk centralisation.
- Define authoritative source, controller/processor or equivalent roles, stewardship, update rights, correction processes, retention and dispute handling for every material dataset.
- Use central coordination only where it has a clear, justified function and proportionate controls.
- Prevent cross-tenant and cross-institution access by default. Federation must not weaken tenant isolation or accountability.

### 3.4 Inclusion and multiple access channels
- Design for low-bandwidth, intermittent connectivity, mobile-first use, assisted/offline workflows and accessible interfaces where relevant.
- Support appropriate language, disability access, low digital literacy and local operating realities.
- Do not make a smartphone, one private app, one payment provider, one identity provider or uninterrupted connectivity the sole route to an essential service unless a binding requirement demands it and an accessible alternative is addressed.
- Test with representative users and frontline operators; record exclusion risks and mitigations.

### 3.5 Trust, privacy and security by design
- Apply privacy/data protection law and sector-specific obligations in the actual jurisdiction and effective timeline.
- Establish lawful purpose, minimum necessary data, transparency, consent or other valid legal basis as applicable, withdrawal/correction routes, retention limits and rights handling.
- Use appropriate authentication, authorisation, cryptographic signatures, key management, revocation, integrity protection, audit logs and independent verification.
- Treat consent as a specific, informed and revocable mechanism where legally applicable; do not treat a consent screen as a substitute for lawful basis or governance.
- Threat-model issuers, holders, verifiers, APIs, administrators, devices, intermediaries, insiders, supply chains and recovery processes.
- Do not place personal, confidential or commercially sensitive data on an immutable ledger. Store proofs, hashes or references only after privacy, threat and legal review; immutability does not establish truth or lawful collection.

### 3.6 Competitive neutrality and anti-lock-in
- Allow multiple qualified providers and implementations where the market and risk permit.
- Keep data export, exit, migration, audit and substitution practicable.
- Disclose proprietary dependencies, hosted service concentration, switching costs and operational control points.
- Open-source licensing, governance, maintenance, security response and long-term sustainability must be assessed; source availability alone does not ensure openness or resilience.

### 3.7 Accountability and public-interest governance
- Identify who sets policy, operates each building block, approves participants, resolves disputes, handles incidents, funds maintenance and is accountable to affected people.
- Separate technical verification from legal or regulatory determination.
- Provide transparent participation criteria, change governance, auditability, grievance/redress and escalation routes.
- Assess misuse, exclusion, surveillance, market concentration, discrimination, fraud, coercion and unintended harm.

## 4. Required architecture artefacts

For every project classified as a DPI candidate, DPI-enabled or hybrid, maintain the following proportionate artefacts in its project-specific Shakti operating system:

1. **Ecosystem map:** participants, roles, incentives, existing systems, authoritative sources, dependencies, intermediaries and excluded stakeholders.
2. **Capability map:** shared building blocks versus application-specific functions; reuse decisions and rationale.
3. **Context and trust diagram:** system boundaries, data flows, trust boundaries, identity/authentication, authorisation, issuer/holder/verifier roles where applicable, and external integrations.
4. **Interoperability contract:** API and event contracts, schemas, identifiers, versioning, conformance tests, error handling and portability.
5. **Data governance register:** data owner/steward, purpose, legal basis, classification, source of truth, minimisation, retention, sharing, correction, deletion and audit obligations.
6. **Federation and tenancy model:** institutional autonomy, tenant boundaries, delegated access, cross-organisation trust, isolation tests and failure containment.
7. **Security and privacy assessment:** threat model, abuse cases, cryptographic/key lifecycle, privacy impact where required, incident and recovery plan.
8. **Inclusion and adoption plan:** accessibility, language, connectivity, assisted channels, frontline training, adoption barriers and measurable user outcomes.
9. **Governance and operating model:** operator, decision rights, service levels, support, funding, change control, dispute handling, grievance and accountability.
10. **Sustainability and exit plan:** lifecycle cost, open-source/proprietary dependencies, maintenance, portability, vendor substitution, archival and end-of-life.
11. **Evidence and assurance plan:** test fixtures, independent participant testing, audit evidence, conformance results, production monitoring and reassessment triggers.

If an artefact is not relevant, document why. Do not create paperwork for its own sake; the purpose is to make material architecture and accountability decisions testable.

## 5. Reusable building-block catalogue

Assess, but do not automatically implement, the following capability families:

- **Identity and authentication:** identity proofing, identifiers, authentication, federation, account recovery and delegated access.
- **Registries:** people, organisations, facilities, assets, products, locations, classifications and authoritative reference data.
- **Trust and credentials:** PKI, signing, verifiable credentials, issuer trust lists, status/revocation and verification.
- **Consent and data exchange:** purpose-bound sharing, consent/authorisation records, APIs, data portability and auditable exchange.
- **Payments and benefits:** interoperable payment initiation/acceptance, reconciliation and benefit delivery, subject to regulated payment-system requirements.
- **Discovery and fulfilment:** catalogues, directories, service discovery, matching, orders and fulfilment across independent participants.
- **Evidence and audit:** provenance, event records, chain of custody, evidence packages, independent assurance and dispute resolution.
- **Communication and access:** notifications, assisted channels, offline capture/synchronisation and accessible user interfaces.
- **Observability and operations:** service health, incident exchange, status reporting, conformance and operational assurance.

Select only what the use case requires. Do not introduce a national identity, payment rail, blockchain, central registry, credential wallet or other heavyweight component merely because it appears in a DPI reference architecture.

## 6. Digital Public Goods (DPGs) and ecosystem procurement

Where relevant, evaluate Digital Public Goods and open-source components using the same Shakti due diligence as any other dependency:

- licence and permitted use, modification, redistribution and attribution;
- project governance, maintainer diversity, release cadence and roadmap;
- security posture, vulnerability disclosure, dependency health and patch response;
- documentation, interoperability, conformance and deployment maturity;
- hosting, data residency, support, upgrade, migration and exit costs;
- community sustainability and the availability of local implementation capacity.

A DPG is not automatically secure, production-ready, legally suitable, sovereign, interoperable or free to operate. “Free to download” does not mean zero total cost of ownership. Evaluate service providers through transparent, capability-based and non-discriminatory criteria; avoid unjustified vendor exclusivity.

## 7. Implementation and country / ecosystem execution method

Use a staged delivery method inspired by practical DPI country implementation patterns, adapted to the project's scope:

### Discover
- Map user needs, institutions, existing infrastructure, laws, readiness, gaps and adoption barriers.
- Prioritise use cases by public value, feasibility, inclusion, risk and measurable benefit.
- Establish baseline metrics and stakeholder ownership.

### Design
- Agree target architecture, governance, standards, data responsibilities, procurement/partnering and implementation sequencing.
- Validate architecture with counterparties and independent technical reviewers.
- Define a narrow, reversible proof of concept and measurable acceptance criteria.

### Demonstrate and validate
- Test real end-to-end journeys with representative participants and realistic data controls.
- Verify multi-party interoperability, security, accessibility, failure handling and operating responsibilities.
- Clearly distinguish synthetic/demo evidence from live operational evidence.

### Deploy and scale
- Release only after applicable statutory, security, operational, contractual and stakeholder gates pass.
- Expand by use case and geography based on measured readiness, not promotional claims.
- Preserve local institutional ownership, training, support, portability and long-term funding.

### Operate and assure
- Monitor availability, adoption, inclusion, interoperability, cost, fraud, incidents, grievances and outcomes.
- Reassess standards, participants, threat models and governance on material change.
- Maintain a tested exit, recovery and continuity plan.

## 8. Project-specific application: RupayKg

RupayKg is to be assessed as a **potential sectoral digital infrastructure candidate for waste, EPR, circular-economy evidence and carbon/MRV workflows**, not presumed to be recognised or approved DPI. Its statutory compliance duties remain governed by applicable Indian laws, rules, official portals, regulator directions, permits, contracts and approved methodologies.

The RupayKg project operating system must map the following candidate capabilities:

1. **Federated participant and facility registries:** producers, brand owners, waste generators, local bodies, collection entities, processors, recyclers, facilities, equipment and authorised verifiers. Record authoritative source, verification status, jurisdiction, validity period and correction/dispute route. Do not imply that RupayKg registration grants statutory authorisation.
2. **Material and activity evidence:** weighment, collection, transport, receipt, processing, recovery, disposal and product/output events with provenance, timestamps, units, source device/operator, calibration/quality evidence, corrections and chain of custody.
3. **Verifiable evidence and credentials:** signed evidence packages and role-specific credentials for authorised issuers, holders and verifiers where legally and technically suitable. Define issuer authority, key custody, credential status/revocation and independent verification. A signed claim proves origin/integrity under a key, not factual accuracy of the underlying event.
4. **Interoperable exchange:** documented, versioned APIs and exportable evidence schemas for permitted exchange with CPCB/SPCB, government systems, local bodies, producers, recyclers, auditors and other ecosystem participants. External integration must remain disabled until official API availability, terms, credentials, permission and conformance are verified.
5. **Federated data governance:** preserve each organisation's lawful source records and enforce tenant isolation, least privilege, purpose limitation, retention and audit. No cross-tenant data access by default. National analytics must use an explicitly governed, minimised and lawful data-sharing model.
6. **Discovery and fulfilment:** connect waste generators, collectors, processors, recyclers and buyers through transparent matching and transaction records without making RupayKg the compulsory intermediary or confusing marketplace transactions with statutory compliance evidence.
7. **MRV and assurance:** keep regulatory reporting, voluntary carbon methodologies, CCTS requirements, EPR obligations and independent verification distinct. Maintain methodology version, boundary, baseline, factors, calculations, uncertainty, monitoring evidence, audit trail and verifier decision. Do not issue or imply carbon credits, EPR certificates, regulatory acceptance or verified environmental outcomes without the relevant authority and independent process.
8. **Offline and field inclusion:** support practical mobile/assisted workflows, intermittent connectivity, device identity, secure synchronisation, duplicate/replay detection, correction workflows and field-user accessibility.
9. **Open and portable architecture:** expose documented contracts and data export; evaluate DPGs and open-source components without assuming that any named project is automatically suitable.
10. **Governance:** define who may onboard participants, approve issuers, correct records, resolve disputes, operate infrastructure, access aggregate data, respond to incidents and approve methodology changes.

### RupayKg acceptance gates

- **R-DPI-01 Ecosystem:** material participant classes and authoritative sources mapped.
- **R-DPI-02 Data governance:** lawful purpose, stewardship, retention, sharing and correction responsibilities documented.
- **R-DPI-03 Tenant isolation:** negative tests prove that tenants cannot read or mutate another tenant's protected data, including through background jobs, exports, reports and integrations.
- **R-DPI-04 Interoperability:** versioned contracts and independent conformance tests exist; no unverified external integration is represented as live.
- **R-DPI-05 Evidence trust:** provenance, signing, key lifecycle, revocation, device/operator attribution and tamper detection are tested; integrity is not misrepresented as truth.
- **R-DPI-06 MRV separation:** statutory/EPR/CCTS and voluntary methodology logic remain traceable and are not conflated; calculations and evidence are reproducible.
- **R-DPI-07 Inclusion and field readiness:** representative field workflows, offline recovery and assisted alternatives are tested.
- **R-DPI-08 Operational governance:** accountable operator, incident response, support, recovery, portability and lifecycle funding are documented.
- **R-DPI-09 Independent assurance:** material claims and relevant integrations receive independent review appropriate to their risk.
- **R-DPI-10 Release authority:** all applicable statutory, contractual, security, deployment and external approval gates are satisfied before the relevant production use.

Each gate is recorded PASS / PARTIAL / FAIL / HOLD with evidence and scope. Passing these engineering gates does not confer government approval, legal compliance, carbon-credit issuance, EPR recognition or DPI designation.

## 9. Relationship to Indian statutory and regulatory requirements

For India-facing projects, maintain a current project-specific register of applicable central and state laws, rules, notifications, regulator directions, standards, permits, procurement conditions and official integration terms. Verify primary sources, effective dates, transition periods, jurisdiction and applicability at the time of each material decision.

DPI principles are architectural guidance, not a substitute for:
- statutory authorisation, registration, licences, permits or regulator approval;
- data protection, cybersecurity, sectoral privacy and records-retention obligations;
- official portal/API onboarding, credentials, terms and production permission;
- procurement, competition, consumer protection, accessibility and grievance obligations;
- independent verification, accreditation, certification or registry decisions.

Do not claim that CDPI, any DPG, a development partner or a technical architecture framework has approved or certified a project unless an exact, verifiable approval exists and its scope is accurately stated.

## 10. Measurement and continuous assurance

Define baseline and target measures appropriate to the project, such as:
- number and diversity of independent participants and implementations;
- successful cross-system transactions and conformance-test coverage;
- onboarding time, availability, latency, recovery and error rates;
- data quality, provenance completeness, correction and dispute rates;
- security incidents, access violations and time to remediate;
- accessibility, assisted-channel usage, geographic and language coverage;
- portability/exit test results and concentration risk;
- total cost to operate, support burden and value delivered;
- user trust, grievance resolution and measurable public-interest outcomes.

Do not use vanity metrics such as API count, downloads, registrations or countries named as substitutes for real interoperability, adoption, inclusion, service quality or outcomes.

## 11. Evidence and source register

The following are initial contextual references, not legal authorities or endorsements. Review the primary pages and their linked technical materials relevant to the actual design; record exact source, owner, date checked, applicable section, version and limitations in the project evidence register.

- CDPI official website: https://cdpi.dev/
- CDPI DPI Wiki: https://docs.cdpi.dev/ (verify current canonical destination before relying on a specific page)
- CDPI Thought Leadership: https://cdpi.dev/thought-leadership (verify current route)
- Digital Public Goods Alliance: https://digitalpublicgoods.net/
- Digital Public Goods Standard: https://standard.digitalpublicgoods.net/
- GovStack: https://www.govstack.global/
- MOSIP: https://mosip.io/
- OpenG2P: https://openg2p.org/
- W3C Verifiable Credentials Data Model: https://www.w3.org/TR/vc-data-model-2.0/
- OpenID Foundation specifications: https://openid.net/developers/specs/
- NIST Cybersecurity Framework: https://www.nist.gov/cyberframework
- NIST Privacy Framework: https://www.nist.gov/privacy-framework

Check current standards versions, implementation status, licensing and official documentation before adopting any technology. For India-specific legal decisions, use the applicable official Indian government and regulator sources under the Shakti source hierarchy.

## 12. Definition of done

This amendment is implemented in a project only when its DPI applicability classification is documented, the relevant architecture and governance artefacts are maintained, project-specific acceptance gates are testable, and all claims about status, interoperability, approval and outcomes are evidence-backed. A project may legitimately be classified as not applicable; the rationale must be recorded.

**Operational shorthand:** Classify honestly → map the ecosystem → design reusable and federated building blocks → protect rights and trust → prove interoperability → validate adoption and operations → meet statutory and release gates → continuously assure.

---
**Approval boundary:** This amendment is an internal Shakti engineering and governance standard. It is not a CDPI endorsement, government standard, statutory instrument, certification or external approval.

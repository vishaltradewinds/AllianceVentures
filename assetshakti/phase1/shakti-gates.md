# Phase 1 Shakti Gates — Property

P1-G01 Identity — uniquely identify the property from authoritative evidence.

P1-G02 Authority/legal route — determine selling authority and applicable mechanism.

P1-G03 Evidence completeness — material assertions require source and evidence status.

P1-G04 Title/interest — never infer clean title from absence of a detected problem.

P1-G05 Possession — physical, symbolic and unknown remain distinct.

P1-G06 Encumbrance/litigation — known, searched-no-result, unverified and contradictory remain distinct.

P1-G07 Physical reality — location, access, condition and occupancy need appropriate evidence.

P1-G08 Economics — reserve price is not market value; total acquisition cost must be modelled.

P1-G09 Auction constraints — EMD, dates, sale basis and material conditions are represented.

P1-G10 Decision integrity — BID_READY requires critical gates to pass; score cannot override a failed gate.

P1-G11 Auditability — every score and decision traces to evidence.

P1-G12 Production certification — minimum 50 real property cases across major classes before production certification.


## P1-G13 Bidder obligations and forfeiture
Auction-specific bidder obligations are first-class evidence. The system must capture source-traceable EMD requirements, eligibility declarations, payment deadlines, extension terms, forfeiture clauses and material “as is / no recourse” conditions. A bidder obligation may create a decision-critical risk even where title or physical evidence is otherwise adequate.

## P1-G14 Provenance and party-risk
Where an auction package contains financial assets, securities, receivables, NRRA/PUFE claims or rights beyond immovable property, those components must retain explicit provenance and must not be silently treated as ordinary property value.


## P1-G15 Auction-Term / Forfeiture Integrity

An auction decision cannot be treated as BID_READY unless the applicable auction notice/corrigendum has been reviewed for:

- EMD amount and deadline;
- bidder eligibility/declarations;
- balance sale-consideration deadline;
- extension terms and interest;
- forfeiture/cancellation conditions;
- sale basis such as “as is where is”, “as is what is”, “whatever there is” or “without recourse”;
- material title/possession disclosures contained in the auction notice.

A missing or contradictory material auction-term record is a critical evidence failure. The engine must never infer that regulatory silence removes a forfeiture/payment exposure stated in the auction notice.

This gate reflects the Supreme Court's September 2026 treatment of explicit e-auction forfeiture conditions and is subject to future legal/regulatory change control.

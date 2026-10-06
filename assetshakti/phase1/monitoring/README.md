# AssetShakti source monitoring

This module defines the monitoring contract for the Distressed Asset Intelligence OS.

## Authoritative sources

1. IBBI liquidation auction notices
2. IBBI legal framework, circulars and regulations
3. BAANKNET official transaction/listing references
4. Other government or statutory sources approved by source policy

## Monitor only meaningful changes

A change is meaningful when it affects one or more of:

- auction volume or observable coverage;
- material asset-category mix;
- source fields or export availability;
- BAANKNET/IBBI access or platform terms;
- liquidation/auction/valuation regulation;
- bidder eligibility, EMD, payment, forfeiture or possession obligations;
- data-access/legal/technical feasibility.

Routine page changes, unchanged records and duplicate notices are not alerts.

## Evidence rule

Every detected change must preserve:

- source URL;
- observation timestamp;
- previous observation;
- current observation;
- change classification;
- impact on AssetShakti;
- confidence;
- whether human/legal review is required.

Monitoring discovers change. It does not certify legal meaning.

## Current baseline: 2026-10-06

IBBI currently exposes auction notices with structured fields including auction date,
corporate debtor, insolvency professional, reserve price, asset nature, EMD deadline,
notice and details, and links users to BAANKNET listing/auction information.

The current regulatory baseline includes the Liquidation Process Regulations amended
through 02-06-2026, valuation guidance issued in 2026, and a 09-09-2026 circular
on due diligence concerning misuse of the IBC framework.

BAANKNET remains the transaction channel; AssetShakti remains an independent
intelligence/evidence layer.

No automated bidding, title guarantee or unrestricted BAANKNET scraping is part
of this design.

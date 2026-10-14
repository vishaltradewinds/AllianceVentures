# AssetShakti Controlled Original-Evidence Intake

## Purpose

This is the permitted recovery path when an authoritative auction document is not retrievable through the connected interface.

It does **not** weaken source policy and does **not** promote an uploaded document to verified evidence automatically.

## Required source

The user must provide the **original document bytes** obtained through a legitimate authoritative path, such as:

- the direct auction platform;
- the liquidator;
- the corporate debtor's official liquidation website;
- another source expressly accepted by the project source-authority policy.

Screenshots, copied text, summaries and aggregator listings are not substitutes for the original document when cryptographic document binding is required.

## Intake contract

Prepare a metadata JSON file:

```json
{
  "records": [
    {
      "caseId": "P1-PILOT-001",
      "documentType": "AUCTION_NOTICE",
      "documentRole": "CURRENT_ROUND_NOTICE",
      "expectedDebtor": "General Composites",
      "auctionDate": "2026-10-07",
      "publicationDate": "2026-09-17",
      "sourceReference": "AUTHORITATIVE_SOURCE_REFERENCE",
      "fileName": "P1-001-current-auction-notice.pdf"
    }
  ]
}
```

Place the exact original PDF in the supplied input directory.

Run:

```bash
node assetshakti/phase1/controlled-evidence-intake.mjs metadata.json ./evidence ./intake-output
```

The intake creates:

- `manifest.json`
- `verification-report.json`
- SHA-256 binding for every supplied document.

## Fail-closed checks

A record is source-identity verified only when:

1. the bytes are a real PDF;
2. text extraction succeeds and is non-trivial;
3. the expected debtor is present;
4. the exact current auction round/date is present.

A failed record remains blocked.

Successful intake is **not** equivalent to full due diligence. It does not prove:

- title or ownership;
- possession or vacant possession;
- encumbrance clearance;
- marketability;
- valuation;
- bidder eligibility;
- transfer/assignment permission;
- corrigenda completeness;
- payment or forfeiture obligations.

Those remain downstream Shakti gates.

## Current AssetShakti recovery targets

The present whole-lot blocker includes the exact current auction notices for:

- P1-001 General Composites — 07-10-2026
- P1-002 Hallmark Living Space — 15-10-2026
- P1-004 Parakkott Investments — 01-10-2026

P1-002 also requires raw-byte acquisition and SHA-256 binding for the authoritative 18-09-2026 current process document already located on the corporate debtor website.

## Prohibited

No authentication, CAPTCHA, robots, paywall, rate-limit or other access-control bypass is permitted.

No uploaded evidence may be silently substituted for another round or another document.

No decision may become BID_READY until the complete evidence-to-decision chain passes the whole-lot gates.

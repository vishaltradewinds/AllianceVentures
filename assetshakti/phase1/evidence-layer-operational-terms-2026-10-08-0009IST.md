# AssetShakti Evidence Layer — Operational Terms Split — 2026-10-08 00:09 IST

## Fresh source verification

Official IBBI material confirms that auction notices can contain operational bidder terms such as:
- auction date/time;
- inspection arrangements;
- EMD deadline;
- Section 29A eligibility requirements;
- EMD forfeiture consequences;
- applicable taxes/fees and bidder costs;
- links/instructions to the BAANKNET process.

Official IBBI material also confirms that the detailed auction-process documents are uploaded on BAANKNET and must be obtained/downloaded by participants.

## Engineering control

AssetShakti therefore maintains two evidence classes:

A. IBBI_NOTICE_OPERATIONAL_TERMS
Can be acquired and verified from the IBBI notice PDF, with SHA-256 and page/section references.

B. BAANKNET_PROCESS_PARTICIPATION_TERMS
Requires the applicable BAANKNET process bundle when the notice/process directs bidders there. It cannot be synthesized from the IBBI notice.

## Promotion rules

IBBI notice evidence may advance:
- auction identity;
- published reserve/EMD/date;
- published inspection terms;
- published bidder eligibility language;
- published forfeiture/tax/fee language.

It may NOT independently establish:
- title clearance;
- possession;
- current valuation;
- complete bidder-document checklist;
- data-room contents;
- current corrigenda not present in the acquired notice;
- transaction completion authority.

## Current AssetShakti state

IBBI_EVIDENCE_LAYER = ACTIVE
BAANKNET_PROCESS_BYTES = NOT_ACQUIRED_BY_CONNECTED_INTERFACE
DECISION = FAIL_CLOSED
PRODUCTION_CERTIFICATION = OFF

No aggregator is authoritative and no access-control bypass is permitted.

# AssetShakti — MSTC Acquisition Gate Result

**Result: FAIL CLOSED — discovery confirmed, evidence acquisition not completed.**

The official MSTC property portal currently exposes:

- Event: MSTC/NRO/Energy Efficiency Services Limited/1/Lodhi Road/26-27/23533
- Host: Energy Efficiency Services Limited
- Last date shown: 23 October 2026, 17:00
- Event type: Auction

The deeper MSTC property-search endpoint required for lot/property detail retrieval returned HTTP 502 during the acquisition attempt. Therefore AssetShakti does **not** treat the event as verified decision evidence.

This is intentional Shakti behaviour:

1. Public discovery can establish a source record exists.
2. A failed detail endpoint cannot be converted into assumed lot data.
3. No reserve price, valuation, title, possession, EMD, bidder eligibility or document contents are inferred.
4. Exact lot documents must be acquired through an authorised MSTC route before verification.
5. Production certification remains OFF.

Official MSTC source: https://web.mstcecommerce.com/auctionhome/property/index.jsp

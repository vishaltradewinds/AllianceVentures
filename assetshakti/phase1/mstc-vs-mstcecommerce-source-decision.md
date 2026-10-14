# MSTC vs MSTC eCommerce — AssetShakti Source Decision

## Result

MSTC and MSTC eCommerce are **not separate providers** for AssetShakti. MSTC Limited operates the e-commerce auction ecosystem; mstcecommerce.com is its portal family.

### Surfaces checked

1. https://www.mstcecommerce.com/ — MSTC E-Commerce hub.
2. https://web.mstcecommerce.com/ — operational e-commerce surface.
3. https://www.mstcecommerce.com/auctionhome/property/index.jsp — current property auction bulletin.
4. https://www.mstcecommerce.com/auctionhome/propertysale/index.jsp — property sale/lease/license bidding application.
5. MSTC Realty — property/realty route inside the MSTC ecosystem.
6. IBAPI/e-Bikray — MSTC-operated legacy/NPA property surface; its current page states NPA property-auction registration has been suspended.

## AssetShakti architecture decision

Provider = MSTC

Portal surface = source attribute

Auction ID + lot ID = immutable source identity

This avoids incorrectly duplicating MSTC into multiple providers while preserving the exact technical source used to acquire evidence.

## Evidence boundary

The MSTC property bulletin establishes current auction-record existence, but it does not by itself prove title, possession, valuation, lot composition or bidder eligibility.

Production certification remains OFF.

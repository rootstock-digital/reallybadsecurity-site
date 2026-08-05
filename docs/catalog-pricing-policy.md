# RBS catalog pricing policy

**Status:** owner-approved operational policy as of 2026-08-04.

## Decision

RBS sets retail prices from the supplier's current synced fulfillment cost using a **minimum 30% gross margin**. This is a margin, not a 30% markup.

```
retail price = supplier unit cost / (1 - 0.30)
```

Round the calculated result up to a customer-facing `.99` price. Do not price below the calculated minimum.

## Scope and exclusions

- Use the current Printful unit cost synced to Shopify for each variant.
- Customer shipping remains separately charged through the applicable Shopify/Printful shipping profile; it is not included in the product-price calculation.
- Sales tax is handled separately according to Shopify tax settings.
- Card processing, returns, replacements, discounts, and fixed Shopify costs are not part of the formula. The 30% target is therefore a minimum, not a guarantee of net profit.

## Current catalog ladder

| Product | Supplier unit cost | Retail price |
| --- | ---: | ---: |
| Bella + Canvas 3001 tee, XS–XL | $11.69 | $16.99 |
| Bella + Canvas 3001 tee, 2XL | $13.69 | $19.99 |
| Bella + Canvas 3001 tee, 3XL | $15.69 | $22.99 |
| Bella + Canvas 3001 tee, 4XL | $17.69 | $25.99 |
| Bella + Canvas 3001 tee, 5XL | $19.69 | $28.99 |
| Cotton Heritage M2580 hoodie, S–XL | $27.29 | $38.99 |
| Cotton Heritage M2580 hoodie, 2XL | $29.29 | $41.99 |
| Cotton Heritage M2580 hoodie, 3XL | $31.29 | $44.99 |
| White glossy mug, 11 oz | $5.95 | $8.99 |

The mug rounds above the minimum to $8.99, yielding a slightly higher than 30% gross margin.

## Operating rule

Before publishing a new Printful-synced product or changing a blank, print area, supplier, or region, re-check the variant unit costs in Shopify and recalculate the ladder. Any exception below the 30% minimum requires owner approval.

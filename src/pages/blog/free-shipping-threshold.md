---
layout: ../../layouts/BlogPostLayout.astro
draft: false
title: "Free Shipping Threshold: A Profit-First Formula"
description: "Calculate a free shipping threshold from order value, margin and delivery cost, then test it across markets without giving away profit on every order."
publishedOn: "2026-10-20"
updatedOn: "2026-10-20"
category: "Ecommerce profit & finance"
author: "Mehul"
coverImage: "/Blogs/free-shipping-threshold/free-shipping-threshold-hero.svg"
coverImageAlt: "A free shipping threshold balancing cart value against a profit guardrail"
faqs:
  - question: "Should a free shipping threshold be above average order value?"
    answer: "Usually, but average order value is only the starting point. Add enough incremental contribution to cover the shipping subsidy, then check the result against real product combinations. A threshold just above average order value can still lose money when the added item has a low margin or changes the parcel size."
  - question: "Should every country use the same free shipping threshold?"
    answer: "No. Delivery cost, product mix, taxes, duties and local price presentation differ by market. Build the threshold from each market's delivered-order economics, display it in the shopper's currency and keep the store, checkout and product feed consistent. A converted global number is a starting point, not a policy."
---

A free shipping threshold is the cart value at which the store absorbs delivery cost. Set it high enough that contribution from the larger basket covers the shipping subsidy. Then test carts by market.

<figure class="blog-feature-image">
  <img src="/Blogs/free-shipping-threshold/free-shipping-threshold-hero.svg" alt="A free shipping threshold balancing cart value against a profit guardrail" width="1600" height="900" fetchpriority="high" decoding="async">
  <figcaption>A useful threshold sits where a larger basket pays for the delivery promise and still leaves contribution behind.</figcaption>
</figure>

## How does the free shipping threshold formula work?

Use this planning formula:

```text
Threshold = current AOV + (shipping subsidy / incremental contribution rate)
```

The shipping subsidy is what the business pays after collecting any delivery fee from the shopper. The incremental contribution rate is the share of each extra revenue unit left after variable costs. Include product cost, payment fees, pick and pack, packaging and expected returns. Do not substitute gross margin unless the two rates truly match.

<!-- [UNIQUE INSIGHT] -->
Use the margin of likely add-ons because their contribution must pay for delivery. A low-margin or bulky product may raise revenue while adding too little contribution or moving the parcel into a costlier band.

Australia Post's *Inside Australian Online Shopping 2025* figures say 30% of surveyed businesses used a free-shipping threshold ([Australia Post](https://auspost.com.au/business/grow-your-business/business-ideas-blog/free-shipping-ecommerce-growth)). The same Australia Post report says one in four shoppers would add up to AUD 10 and one in five would add up to AUD 20 to qualify. Those vendor figures show why the gap must be reachable, not why any particular amount is safe.

The [unit economics calculator](/tools/unit-economics) can help you rebuild the contribution rate with your actual variable costs before you set the threshold.

## How do you calculate a free shipping threshold?

**Illustrative example in currency units:** a store has a current average order value of 60, an average shipping subsidy of 8, and a 40% incremental contribution rate on the products shoppers are most likely to add.

```text
Extra revenue needed = 8 / 0.40 = 20
Starting threshold = 60 + 20 = 80
```

At an illustrative threshold of 80, the extra 20 of revenue contributes 8 before fixed overhead, exactly funding the illustrative shipping subsidy. It does not improve profit, so the business may add a buffer.

| Illustrative check | Value |
|---|---:|
| Current average order value | 60 currency units |
| Shipping subsidy | 8 currency units |
| Incremental contribution rate | 40% |
| Extra revenue needed | 20 currency units |
| Formula result | 80 currency units |

In this illustrative example, inspect the products customers could add between 60 and 80 before rounding. If the catalog jumps from 12-unit items to 30-unit items, an illustrative 80-unit target may look close but be awkward in practice. The [bundle planner](/tools/bundle-planner) can compare reachable combinations without hiding the offer cost.

<figure class="blog-feature-image">
  <img src="/Blogs/free-shipping-threshold/free-shipping-threshold-formula.svg" alt="An illustrative free shipping threshold formula from order value to profit check" width="1600" height="900" loading="lazy" decoding="async">
  <figcaption>Illustrative example: the added basket contribution funds the shipping subsidy before the threshold is approved.</figcaption>
</figure>

## Profit checks before average order value

Average order value describes past baskets. It does not tell you whether the next order is profitable. Run the candidate through four checks before changing the storefront.

- **Basket check:** list the products customers can add to cross the threshold. Use their contribution rates, not the storewide average.
- **Parcel check:** recalculate packaging, weight, dimensional weight and pick-and-pack cost for those baskets.
- **Discount check:** test the threshold after product and order discounts. Shopify's Help Center says price-based shipping tiers can offer free shipping above a minimum order value ([Shopify Help Center](https://help.shopify.com/en/manual/fulfillment/setup/shipping-rates/setting-up-shipping-rates)). It also warns that a gap between tiers can leave the shopper with no rate at checkout.
- **Returns check:** reserve for refunds, exchanges and failed deliveries using the rate that fits the products in the larger basket.

If the candidate fails only for heavy or remote orders, do not inflate the threshold for everyone. A separate shipping profile, product rule or regional rate can preserve a simple promise for the profitable core.

The checkout message matters too. Baymard's Product Page UX research reports that 64% of users start thinking about shipping on the product page ([Baymard Institute](https://baymard.com/research-articles/avoid-banners-only-free-shipping)). The same Baymard research says 55% abandoned an order because extra costs were too high. Baymard also found that 32% of benchmarked sites showed free-shipping information only in a banner.

State the amount and exclusions near the buy area and cart, not only in the header. The [cart abandonment guide](/blog/cart-abandonment-2026) covers the wider checkout fixes around that price signal.

## Regional thresholds need local economics

Build separate cases for the US, UK, EU, Canada, Australia, India, the Middle East and Southeast Asia from local carrier cost, payment mix, return exposure and catalog pricing. Group markets only when their economics are similar.

Shopify lets eligible stores create flat rates in local currencies and separate zones when a fixed local amount is preferable to automatic conversion ([Shopify Help Center](https://help.shopify.com/en/manual/fulfillment/setup/shipping-rates/setting-up-shipping-rates)). Google Merchant Center also tells merchants to submit a different free-shipping value for every country and keep the threshold currency aligned with the offer currency ([Google Merchant Center Help](https://support.google.com/merchants/answer/14768922?hl=en)).

Use the same amount and conditions in the product feed, announcement, product page, cart and checkout. If a remote-area surcharge, oversized item or cash-on-delivery fee remains, name it before checkout. “Free shipping” with a quiet exception is not a clean offer.

## How should you test a free shipping threshold?

A threshold can raise average order value while reducing contribution per visitor. Compare a candidate with the current policy and keep the audience, market and campaign mix as stable as possible.

Track:

- checkout conversion rate;
- contribution per visitor;
- shipping subsidy per delivered order;
- average items per order;
- the share of carts just below and just above the threshold;
- cancellation, return and failed-delivery rates; and
- delivery-related support contacts.

<!-- [UNIQUE INSIGHT] -->
Keep the change only if incremental contribution per visitor improves after delivery and return costs. A larger basket alone is not a win.

A 2019 *Journal of Retailing and Consumer Services* study of 367 online responses found that willingness to pay for delivery was driven mainly by the shopper's inferred retailer motive ([Huang, Shen and Liang](https://doi.org/10.1016/j.jretconser.2019.01.015)). Avoid a threshold that feels engineered to trap the shopper just below free delivery.

Before launch, place test orders below, exactly at and above the threshold. Repeat them with a discount, a heavy product, a remote postcode, and each active market. Shopify recommends a test order after configuring rates because the applicable choices recalculate from the delivery address and cart contents ([Shopify Help Center](https://help.shopify.com/en/manual/fulfillment/setup/shipping-rates/setting-up-shipping-rates)).

<section class="blog-cta">
  <h2>Turn the threshold into a profitable store rule</h2>
  <p>MlabsGrowth can map the threshold to real cart combinations, regional delivery costs and the product-page and cart messages that shoppers see before checkout.</p>
  <p><a href="/services/store-conversion">Improve your Shopify store conversion</a> or browse <a href="/services">all MlabsGrowth services</a>.</p>
</section>

## Frequently asked questions

### Should a free shipping threshold be above average order value?

Usually, but average order value is only the starting point. Add enough incremental contribution to cover the shipping subsidy, then check the result against real product combinations. A threshold just above average order value can still lose money when the added item has a low margin or changes the parcel size.

### Should every country use the same free shipping threshold?

No. Delivery cost, product mix, taxes, duties and local price presentation differ by market. Build the threshold from each market's delivered-order economics, display it in the shopper's currency and keep the store, checkout and product feed consistent. A converted global number is a starting point, not a policy.

## Sources

- [Australia Post, *Why free shipping is essential for eCommerce growth*](https://auspost.com.au/business/grow-your-business/business-ideas-blog/free-shipping-ecommerce-growth), citing *Inside Australian Online Shopping 2025*, retrieved 2026-10-20.
- [Baymard Institute, *Product Pages: “Free Shipping” Should Not Only Be in a Site-Wide Banner*](https://baymard.com/research-articles/avoid-banners-only-free-shipping), survey data updated for 2025, retrieved 2026-10-20.
- [Shopify Help Center, *Setting up shipping zones and rates*](https://help.shopify.com/en/manual/fulfillment/setup/shipping-rates/setting-up-shipping-rates), retrieved 2026-10-20.
- [Google Merchant Center Help, *Free shipping threshold*](https://support.google.com/merchants/answer/14768922?hl=en), retrieved 2026-10-20.
- [Huang, Shen and Liang, *The effect of threshold free shipping policies on online shoppers' willingness to pay for shipping*](https://doi.org/10.1016/j.jretconser.2019.01.015), *Journal of Retailing and Consumer Services*, 2019, retrieved 2026-10-20.

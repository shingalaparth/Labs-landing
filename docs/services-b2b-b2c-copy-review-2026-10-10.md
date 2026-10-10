# Services page: "For B2C" and "For B2B" sections (copy for review)

**Status:** Draft for owner review. Nothing is built yet.
**Page:** `/services` (`src/pages/services/index.astro`)
**Date:** 10 October 2026

How to review: read Part 1 (decisions) first. Then mark up the copy in Parts 3–4 directly. Every claim the page would make is listed in Part 6. Strike anything you can't stand behind.

---

## Part 1: Decisions only you can make

| # | Decision | My recommendation | Why it matters |
|---|---|---|---|
| 1 | **Do we actively sell to B2B now?** The rest of the site is positioned for D2C. The hero, the tagline and every service page say "for D2C brands". | Yes, as a **second track**. D2C stays the lead positioning. B2B gets one honest section and a clear "ask to see the workflow" step. | B2B is new ground. We don't run a B2B business, so there's no first-hand proof. The copy says that openly (see 4.6). |
| 2 | **Which B2B use cases can you deliver and demonstrate today?** Proposed: enquiry callback, dealer reorders, quote drafting, payment reminders. | Keep only the ones you'd be happy to demo on a call. | If a prospect asks to see one and we can't show it, the section costs trust instead of earning it. |
| 3 | **Which tools have you actually connected before?** Proposed list: Zoho, Tally, LeadSquared, HubSpot, IndiaMART, WhatsApp Business, Google Sheets. | Remove any you haven't worked with. | Naming tools is a strong B2B trust signal, but only if it's true. |
| 4 | **Calling-agent languages.** Which have you actually tested (English, Hindi, Hinglish, Gujarati…)? | The page says "languages you approve", not a number, until you confirm. | Competitors claim "8–22 languages" and contradict themselves. Naming only tested languages is a differentiator. |
| 5 | **Use sourced statistics, or "check it yourself" only?** | B2C: check-it-yourself only. B2B: one sourced line (Gartner or Salesforce, see 4.4). | B2B buyers expect evidence. Your site rule allows a number only when it has a real source. |
| 6 | **$5,000 pilot for Indian B2B SMBs.** That's large next to typical SMB software budgets. | No change to the offer now. Watch audit-call feedback from B2B leads. | This is a pricing question, not a copy question. Flagged only. |
| 7 | **Placement:** two full sections right after the services grid, numbered `02 /` and `03 /`. | Yes. The numbering slots in neatly, because "How it works" is already `04 /`. | See Part 2. |

---

## Part 2: Where it goes and what's in it

### Placement on `/services`

```
Hero
Platforms ("Family of growth")
01 / Brand services       ← existing 3 cards
   + new jump line: "Sell to shoppers? → For B2C   ·   Sell to businesses? → For B2B"
02 / For B2C businesses   ← NEW  (id="b2c")
03 / For B2B businesses   ← NEW  (id="b2b")
The experience behind the work (existing)
Skill Manager band (existing)
04 / How it works (existing)
Guides · FAQ (+3 new questions) · Contact
```

The jump line is two visible anchor links, not tabs. Both sections stay fully visible, so nothing is hidden behind a toggle. Hidden content on mobile is not read (shared knowledge base §11, discovery friction).

### Elements in each section (same template for both)

| # | Element | Job it does | Theme pattern reused |
|---|---|---|---|
| 1 | Section label + two-line headline (second line muted) | "Is this about me?" | `section-intro`, `section-title`, `muted-heading` |
| 2 | One-paragraph description naming who it's for | Clarity: who, and what changes | `section-description` |
| 3 | "Built for" chips (business types) | Visitors self-identify in 2 seconds | pill style from `service-route-card li` |
| 4 | Three leaks, each ending in **"Check it yourself:"** | Shows we understand their day, without invented numbers | same rule as `leaks` in `offer.ts` |
| 5 | Four "What we build" use cases, each linked to its existing service page | Turns the 3 services into this audience's language | `service-modules` cards |
| 6 | Honest-experience line + objection line | Answers "why you?" and "will customers hate it?" | `growth-note` |
| 7 | Fit / not-yet | Qualifies leads; disqualifying earns the rest | `service-fit` |
| 8 | CTA with audience-specific microcopy | One action: the free audit call | `growth-button` + existing reducers |

**Left out on purpose:**
- Logo walls, testimonials and stat bars: we have no client proof yet, and competitors' unsourced stat bars are exactly what buyers have learned to distrust.
- An industry grid listing clinics, coaching, salons and real estate (see 3.0).
- Pricing tables: pricing already lives on `/offers`.

---

## Part 3: Copy for "For B2C businesses"

### 3.0 Who it's for (decision behind the copy)

The section covers **consumer product businesses**: D2C brands, marketplace sellers, Instagram/WhatsApp sellers, and offline-first shops that also ship (sweet shops, jewellers, gifting, home décor).

It does **not** list service businesses such as clinics, coaching, salons or real estate:
- Only 2 of our 3 services apply to them.
- Our own brands give no proof there.
- That's where calling regulation and ad-claim rules (TRAI 2025 amendment, CCPA coaching guidelines) bite hardest.

They get one FAQ line instead (5.1).

### 3.1 Label + headline

```
02 / For B2C businesses

You won the order.
[muted] Now make sure it's delivered — and paid.
```

**Alternative (dream-outcome angle):** "Selling to shoppers? / [muted] Keep more of the orders you already paid to win."

### 3.2 Description

> For brands that sell to consumers: on Shopify, on marketplaces, through Instagram and WhatsApp, or from a shop that also ships. Ad costs, cash on delivery and festive peaks all land on the same small team. We connect your store, orders and marketing so fewer sales slip between the click and the doorstep.

### 3.3 Built for (chips)

`D2C brands on Shopify` · `Marketplace sellers building their own site` · `Instagram & WhatsApp sellers` · `Shops and makers that also ship` · `Brands with festive or seasonal peaks`

### 3.4 Where it leaks (three cards)

**01 The ad worked. The page didn't.**
You paid for the visit. The shopper landed, couldn't find the product or the proof they came for, and left. Now you pay again to retarget them.
*Check it yourself:* compare the add-to-cart rate on your five busiest landing pages with your store's overall conversion rate.

**02 Booked on the dashboard. Returned at the door.**
A COD order nobody confirmed. A failed delivery nobody chased on day one. The parcel comes back, you pay shipping both ways, and the dashboard still counted a sale.
*Check it yourself:* take last month's returns to origin and multiply by your forward and return shipping cost.

**03 Festive week runs on WhatsApp and willpower.**
Address changes, "where is my parcel?" and order questions pile into chats at the exact moment the team should be packing. The peak ends; the same scramble waits for the next one.
*Check it yourself:* count last festive week's messages that were about an order you already had.

### 3.5 What we build for B2C brands (four cards → existing services)

**01 Confirm before it ships. Follow up before it comes back.**
An approved call flow confirms cash-on-delivery orders and addresses before dispatch, and follows up the same day a delivery fails. Customers who want a person reach your team.
→ *Order Operations · AI calling agent*

**02 One view of every order.**
Shopify, marketplace and chat orders, with stock and courier status, in one place. Nobody re-types an order, and your team works the exceptions instead of everything.
→ *Order Operations · D2C infrastructure, workflow automation*

**03 Pages that finish the sale.**
We rebuild the product, collection and cart pages your ads actually land on, based on what your own store data shows is stopping buyers. Add-ons appear only when they fit the order and are in stock.
→ *Store Conversion · Shopify CRO, sell agent, smart cart*

**04 Marketing judged on delivered orders.**
Creative and campaigns start from your Claude Brain (your approved brand context) and are reviewed against orders that actually arrived, not only what the ad platform reported.
→ *AI & Marketing · Managed marketing, Claude Brain*

### 3.6 Trust and objection line

> Our calls are about orders your customers have already placed. We don't make cold sales calls. You approve the script, languages, calling hours and the point where a person takes over before anything goes live.

### 3.7 Fit

- **A good fit when:** orders are already coming in, COD or returns are a real cost line, and each festive peak exposes the same gaps.
- **Not yet if:** you're still finding a product people want, or nobody on your team can own the workflow after handover.

### 3.8 CTA

> Bring last month's orders. In 30 minutes we'll show you where they leaked — from landing page to doorstep — and which leak to close first.

Button: **Book my free audit call ↗** (tracking: `services-b2c`)
Under the button: the existing reducers. *30-minute call via Calendly · No retainer, no obligation · A ranked leak list, yours to keep*

---

## Part 4: Copy for "For B2B businesses"

### 4.1 Label + headline

```
03 / For B2B businesses

Selling to businesses?
[muted] Close the gaps between enquiry and payment.
```

**Alternative (problem-callout angle):** "The enquiry came in. / [muted] Who called back, and when?"

### 4.2 Description

> For manufacturers, wholesalers, distributors and B2B service firms. Your sales move through enquiries, quotes, dealer orders and payment terms, usually spread across a marketplace inbox, WhatsApp, Excel and somebody's memory. We connect those steps so each one has an owner, a record and a next action.

### 4.3 Built for (chips)

`Manufacturers` · `Wholesalers & distributors` · `Exporters & industrial suppliers` · `B2B service firms` · `Brands that sell wholesale and direct`

### 4.4 Where it stalls (three cards)

**01 The first good reply wins the enquiry.**
Marketplace and website enquiries often reach several suppliers at once. The one who calls back first, with the right answer, sets the terms. Yours waits until someone is free.
*Check it yourself:* take last week's ten newest enquiries. Note how long each waited for a real reply, and how many never got one.

**02 Dealer orders live in calls and chats.**
Reorders arrive as a WhatsApp message, a voice note or a call to whoever picks up. There's no record until someone types it in, and the stock, price and dispatch questions start again.
*Check it yourself:* count last month's orders that arrived outside any system, and how many needed a second call.

**03 Your sales team spends the day not selling.**
Re-explaining specs, rebuilding quotes, updating the CRM after the fact, reminding customers about overdue invoices. Necessary work, just not the work you hired salespeople for.
*Check it yourself:* ask your sales team what they did yesterday. Mark the hours a customer would have noticed.

**Optional research line** (decision 5; recommended for B2B only, pick one):
- (a) Under card 03: *"Sales reps report spending 70% of their time on non-selling tasks." Salesforce, State of Sales, 2024 (5,500 sales professionals).* [source](https://www.salesforce.com/news/stories/sales-ai-statistics-2024/)
- (b) Under 4.5 card 02: *"61% of B2B buyers prefer an overall rep-free buying experience." Gartner survey of 632 B2B buyers, published June 2025.* [source](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-sales-survey-finds-61-percent-of-b2b-buyers-prefer-a-rep-free-buying-experience)

### 4.5 What we build for B2B teams (four cards → existing services)

**01 Call back every enquiry while it's warm.**
An approved AI call flow responds to new marketplace or website enquiries, asks your qualifying questions (quantity, location, timeline), logs the answers in your CRM and passes serious buyers to a named salesperson.
→ *Order Operations · AI calling agent, workflow automation*

**02 Reorders that land in a system, not a chat.**
Dealers reorder through a WhatsApp flow or a wholesale store with their own prices, minimums and payment terms. Orders reach your sheet, CRM or ERP without re-typing, and dispatch updates go back to the dealer.
→ *Order Operations · workflow automation (Shopify wholesale where it fits)*

**03 Quotes and answers from one approved source.**
Specs, price rules, past proposals and common objections in one approved workspace. Your team drafts quotes, tender answers and follow-ups from it, and a person signs off every one.
→ *AI & Marketing · Claude Brain*

**04 Payment reminders that don't depend on memory.**
Reminders go out before the due date, on it and after it, by WhatsApp or call, in the wording you approve. Disputes go straight to your accounts team.
→ *Order Operations · workflow automation, AI calling agent*

Line under the cards:
> Need demand as well as follow-up? Managed marketing (Google Search, LinkedIn and content) is scoped the same way.

### 4.6 Honest-experience line + tools line

> **Straight answer:** our own brands sell to consumers, not to businesses. What carries over is the build: calling flows, connected data, approved knowledge and a clean handover. Ask us to show the relevant workflow before you agree to anything.

> Works around the tools you already use, such as Zoho, Tally, LeadSquared, HubSpot, IndiaMART, WhatsApp Business and Google Sheets. We confirm each connection before we quote. *(List pending decision 3.)*

### 4.7 Fit

- **A good fit when:** enquiries or dealer orders arrive every week, follow-up depends on who remembers, and someone on your team can own the workflow.
- **Not yet if:** you close a handful of large deals a year through relationships alone (software won't move those), or you want someone to run your sales for you.

### 4.8 CTA

> Bring last month's enquiries and orders. In 30 minutes we'll map where they stall between enquiry and payment, and which gap to close first.

Button: **Book my free audit call ↗** (tracking: `services-b2b`)
Under the button: the same three reducers.

---

## Part 5: Supporting changes

### 5.1 Three new FAQ entries (added to the existing FAQ)

**Do you work with B2B businesses as well as consumer brands?**
Yes. We build the same pieces for both: calling flows, connected order data, workflow automation and an approved knowledge workspace. Our own brands sell to consumers, so for B2B work we'll show you the relevant workflow before scoping. Not a product business? Ask on the audit call, and we'll tell you honestly whether we fit.

**Will it work with Tally, Zoho or our ERP?**
It depends on what your system allows. Tally, for example, supports data exchange but often runs on a local machine. We check each connection, decide which system holds the master record, and confirm limits before we quote. We don't ask you to replace your tools first.

**Will customers mind talking to an AI caller?**
Calls should be about something the customer already started: an order, an enquiry or an invoice. They should never be cold selling. You approve the script, languages, calling hours and when a person takes over. Calling numbers and consents stay in your name, and your legal adviser should confirm the consent and calling rules that apply to you.

### 5.2 The data the sections will be fed

Both sections render from one new data file, `src/data/audiences.ts`, in the same pattern as `offer.ts`. This is the shape for you to approve:

```ts
export interface AudienceLeak { title: string; body: string; check: string }      // check must start "Check it yourself:"
export interface AudienceUseCase {
  title: string;
  body: string;
  serviceSlug: 'store-conversion' | 'order-operations' | 'ai-automation';     // links to the existing service page
  modules: string;                                                             // "AI calling agent, workflow automation"
}
export interface AudienceResearch { quote: string; source: string; url: string; year: string } // optional, sourced only

export interface Audience {
  id: 'b2c' | 'b2b';
  number: '02' | '03';
  label: string;            // "For B2C businesses"
  headline: string;         // "You won the order."
  headlineMuted: string;    // "Now make sure it's delivered — and paid."
  description: string;
  builtFor: readonly string[];
  leaks: readonly AudienceLeak[];          // exactly 3
  useCases: readonly AudienceUseCase[];    // exactly 4
  trustLine: string;
  toolsLine: string | null;                // B2B only
  research: AudienceResearch | null;       // renders nothing when null
  fit: { yes: string; no: string };
  cta: { microcopy: string; trackingLocation: 'services-b2c' | 'services-b2b' };
}
```

Tests will be added to `tests/landing.test.cjs`, matching the existing honesty tests:
- Every `check` starts with "Check it yourself:".
- No `%` or `Nx` appears in leaks.
- A research line renders only with a source and URL.
- Every `serviceSlug` exists.
- The banned-promise list (refund, guarantee, ROI…) appears nowhere.

---

## Part 6: Claims register (everything the page would assert)

| Claim | Basis | Status |
|---|---|---|
| We confirm COD orders, follow up failed deliveries, connect order data, do Shopify CRO/sell agent/smart cart, managed marketing, Claude Brain | Existing `offer.ts` modules | Already on site |
| Enquiry callback, dealer reorder flows, quote drafting, payment reminders (B2B) | Same modules applied to B2B | **Needs your OK** (decision 2) |
| Shopify wholesale store with dealer prices, minimums, payment terms | Shopify changelog, 2 Apr 2026: native B2B on Basic, Grow and Advanced plans; up to 3 catalogs off-Plus ([changelog](https://changelog.shopify.com/posts/key-b2b-features-now-available-on-non-plus-plans), [plan table](https://help.shopify.com/en/manual/b2b/getting-started/plan-features)) | Verified. Re-check before publishing. |
| "Enquiries often reach several suppliers at once" | IndiaMART seller reviews ("one lead shared with 10-11 sellers", [SmartCustomer](https://www.smartcustomer.com/reviews/indiamart.com?page=3)); IndiaMART advises same-day replies ([help](https://help.indiamart.com/knowledge-base/best-practice-to-repond-to-buyer)) | Qualitative. Worded "often", with no number. |
| Tool names (Zoho, Tally, etc.) | Owner experience | **Needs your OK** (decision 3) |
| Calls only about existing orders/enquiries/invoices; you approve script, languages, hours, handoff | Existing FAQ policy | Already on site. Extended to B2B. |
| "Our own brands sell to consumers, not businesses" | Fact | True |
| Salesforce 70% / Gartner 61% | Read on source pages by research agent | Verified. Optional (decision 5). |

**Deliberately not claimed anywhere:**
- "TRAI-compliant" or "DPDP-compliant". Calling rules changed in Feb 2025, and the DPDP consent duties phase in around 2027. The copy says the consents stay in your name and points to your legal adviser instead.
- Any language count.
- Any RTO, COD-share or speed-to-lead percentage. The widely quoted ones (e.g. "25–30% COD RTO", "7x within an hour") are vendor-sourced, unattributed or paywalled.

---

## Part 7: Research summary

### B2C (consumer product brands, India)

- **Pains, in operators' own words.** These come from Shopify Community threads, 2023–2026 (Reddit was unreachable):
  - COD is "mostly unreliable and risky" ([thread](https://community.shopify.com/t/advance-half-payment-cash-on-delivery/243460))
  - RTO comes from fake orders, bad addresses and "no follow-up before delivery attempts" ([thread](https://community.shopify.com/t/how-do-i-reduce-rto-on-cod-orders-for-my-shopify-store/643846))
  - RTO data "skews every metric downstream" and staff "treat high RTO products as 'bad products'" ([thread](https://community.shopify.com/t/shopify-should-add-separate-rto-status-instead-of-mixing-it-with-customer-returns/623128)). This directly supports the "one view of every order" card.
- **Festive peaks.**
  - Unicommerce (vendor platform data, 6,000+ brands): festive-season COD orders "returned at 58%", and overall RTO was 39.2% in Nov 2025 ([report](https://unicommerce.com/india-d2c-report-2026-april/)).
  - Diwali 2025 brand-website orders were up 33% year on year ([coverage](https://mediabrief.com/unicommerce-reports-24-order-volume-growth-during-2025-diwali-festive-season/)).
  - These are vendor figures, so they inform the copy and are not quoted on the page.
- **WhatsApp overload at peaks.** Example: Bombay Sweet Shop's team spent "way too much time responding to individual customer queries" ([vendor case study](https://www.interakt.shop/casestudie/how-haptik-and-interakt-helped-bombay-sweet-shop-achieve-4x-revenue-within-a-year/)).
- **Cart abandonment.** Baymard's global average is 70.22% ([source](https://baymard.com/lists/cart-abandonment-rate)). Verified, but global rather than Indian, so it's not used.
- **Main objections:**
  - "Customers hate robot calls." 95% of Indians get unwanted calls daily ([LocalCircles via BusinessToday](https://www.businesstoday.in/amp/technology/news/story/95-indians-continue-to-get-unwanted-calls-daily-despite-regulatory-interventions-survey-443922-2024-09-02)). Answered in 3.6.
  - "Apps are cheaper." Answered by the existing FAQ and the fit lines.

### B2B (Indian SMB and mid-market)

- **Pains.** Shared and junk marketplace leads. Dealer orders by phone or WhatsApp with "no official record". Enquiries lost between WhatsApp and Excel. A CRM nobody updates. Payment chasing. Inconsistent information: 69% of buyers see mismatches between a supplier's website and its salespeople (Gartner 2025, verified).
- **Buyer behaviour.**
  - 61% prefer rep-free buying, and 73% avoid suppliers who send irrelevant outreach (Gartner 2025, verified).
  - Reps spend 70% of their time on non-selling tasks (Salesforce 2024, verified).
  - HBR's 2011 speed-to-lead study is real, but its famous "7x" figure is paywalled, so it's not used.
- **Competitor B2B pages** (Power Digital, Charle, Kinex Media, Workd, MakeAutomation):
  - Overused: logo walls, unsourced % uplifts, "data-driven/holistic", SEO-padded FAQs.
  - Rarer and more convincing: use cases by role, naming the systems they connect to, and an ownership/handover FAQ. All three are in this draft.
  - Several agencies still describe Shopify B2B as Plus-only. That has been out of date since April 2026.
- **Objections:**
  - Data security and DPDP.
  - "Will it work with Tally/Zoho/ERP?" Tally supports XML/JSON/ODBC integration ([Tally docs](https://help.tallysolutions.com/integration-with-tallyprime/)).
  - Hindi/Hinglish voice quality.
  - AI giving wrong answers.
  - Cost.
  - Team adoption.

### Research gaps

- No real buyer interviews.
- Reddit and LinkedIn were unreachable.

The best next source of customer language is your own audit-call notes. Swap in their exact words wherever they beat mine.

---

## Assumptions

- [ASSUMPTION] Traffic to `/services` is warm (site visitors, referrals, outreach), and visitors are problem-aware, so the copy opens with the problem rather than with education.
- [ASSUMPTION] The single goal stays the free audit call. No separate B2B offer or form.
- [ASSUMPTION] The B2B buyer is the owner or sales head at an Indian SMB, not an enterprise procurement team.

## What would change this

- **If you don't want B2B leads yet:** ship only the B2C section, and keep the B2B copy for a later `/services/b2b` page.
- **If you can demo a B2B workflow:** replace the "Straight answer" line with a captioned screenshot or recording (per `docs/operating-evidence.md`). That's the strongest upgrade available.
- **If audit calls show different words for these pains:** their words win.

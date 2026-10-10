import type { ServiceRoute } from '@/data/services';

/**
 * Who the services are for, in each buyer's own terms. Renders /services/b2c and /services/b2b
 * and their cards on /services. Copy approved in docs/services-b2b-b2c-copy-review-2026-10-10.md.
 *
 * Same rules as `offer.ts`: leaks end in a check the reader runs on their own numbers,
 * and a statistic appears only as `research`, with a source a reader can open.
 * Do not add "compliant" badges, language counts or outcome percentages.
 */

export interface AudienceLeak {
  title: string;
  body: string;
  /** Must start with "Check it yourself:". No invented numbers. */
  check: string;
}

export interface AudienceUseCase {
  title: string;
  body: string;
  /** The existing service page this use case is delivered under. */
  serviceSlug: ServiceRoute['slug'];
  modules: string;
}

/** A published figure, quoted exactly, with a source anyone can open. */
export interface AudienceResearch {
  quote: string;
  source: string;
  url: string;
}

export interface AudienceFaq {
  question: string;
  answer: string;
}

export interface Audience {
  id: 'b2c' | 'b2b';
  /** Page route: /services/<slug>. */
  slug: string;
  number: string;
  label: string;
  /** Services menu and card on /services. */
  navLabel: string;
  navDescription: string;
  kicker: string;
  headline: string;
  headlineMuted: string;
  description: string;
  builtFor: readonly string[];
  leaksTitle: string;
  leaks: readonly AudienceLeak[];
  research: AudienceResearch | null;
  useCasesTitle: string;
  useCases: readonly AudienceUseCase[];
  useCasesNote: string | null;
  trustTitle: string;
  trustLine: string;
  toolsLine: string | null;
  fit: { yes: string; no: string };
  cta: { microcopy: string; trackingLocation: string };
  faqs: readonly AudienceFaq[];
}

export const audiences: readonly Audience[] = [
  {
    id: 'b2c',
    slug: 'b2c',
    number: '02',
    label: 'For B2C businesses',
    navLabel: 'For B2C brands',
    navDescription: 'Get more of your orders delivered and paid.',
    kicker: 'For B2C & D2C brands',
    headline: 'You won the order.',
    headlineMuted: 'Now make sure it’s delivered — and paid.',
    description:
      'For brands that sell to consumers: on Shopify, on marketplaces, through Instagram and WhatsApp, or from a shop that also ships. Ad costs, cash on delivery and festive peaks all land on the same small team. We connect your store, orders and marketing so fewer sales slip between the click and the doorstep.',
    builtFor: [
      'D2C brands on Shopify',
      'Marketplace sellers building their own site',
      'Instagram & WhatsApp sellers',
      'Shops and makers that also ship',
      'Brands with festive or seasonal peaks',
    ],
    leaksTitle: 'Where B2C revenue leaks',
    leaks: [
      {
        title: 'The ad worked. The page didn’t.',
        body: 'You paid for the visit. The shopper landed, couldn’t find the product or the proof they came for, and left. Now you pay again to retarget them.',
        check: 'Check it yourself: compare the add-to-cart rate on your five busiest landing pages with your store’s overall conversion rate.',
      },
      {
        title: 'Booked on the dashboard. Returned at the door.',
        body: 'A COD order nobody confirmed. A failed delivery nobody chased on day one. The parcel comes back, you pay shipping both ways, and the dashboard still counted a sale.',
        check: 'Check it yourself: take last month’s returns to origin and multiply by your forward and return shipping cost.',
      },
      {
        title: 'Festive week runs on WhatsApp and willpower.',
        body: 'Address changes, “where is my parcel?” and order questions pile into chats at the exact moment the team should be packing. The peak ends; the same scramble waits for the next one.',
        check: 'Check it yourself: count last festive week’s messages that were about an order you already had.',
      },
    ],
    research: null,
    useCasesTitle: 'What we build for B2C brands',
    useCases: [
      {
        title: 'Confirm before it ships. Follow up before it comes back.',
        body: 'An approved call flow confirms cash-on-delivery orders and addresses before dispatch, and follows up the same day a delivery fails. Customers who want a person reach your team.',
        serviceSlug: 'order-operations',
        modules: 'AI calling agent',
      },
      {
        title: 'One view of every order.',
        body: 'Shopify, marketplace and chat orders, with stock and courier status, in one place. Nobody re-types an order, and your team works the exceptions instead of everything.',
        serviceSlug: 'order-operations',
        modules: 'D2C infrastructure · Workflow automation',
      },
      {
        title: 'Pages that finish the sale.',
        body: 'We rebuild the product, collection and cart pages your ads actually land on, based on what your own store data shows is stopping buyers. Add-ons appear only when they fit the order and are in stock.',
        serviceSlug: 'store-conversion',
        modules: 'Shopify CRO · Sell agent · Smart cart',
      },
      {
        title: 'Marketing judged on delivered orders.',
        body: 'Creative and campaigns start from your Claude Brain — your approved brand context — and are reviewed against orders that actually arrived, not only what the ad platform reported.',
        serviceSlug: 'ai-automation',
        modules: 'Managed marketing · Claude Brain',
      },
    ],
    useCasesNote: null,
    trustTitle: 'Calls your customers expect',
    trustLine:
      'Our calls are about orders your customers have already placed — never cold selling. Before anything goes live, you approve the script, languages, calling hours and the point where a person takes over.',
    toolsLine: null,
    fit: {
      yes: 'Orders are already coming in, COD or returns are a real cost line, and each festive peak exposes the same gaps.',
      no: 'You’re still finding a product people want, or nobody on your team can own the workflow after handover.',
    },
    cta: {
      microcopy:
        'Bring last month’s orders. In 30 minutes we’ll show you where they leaked — from landing page to doorstep — and which leak to close first.',
      trackingLocation: 'services-b2c',
    },
    faqs: [
      {
        question: 'Will customers mind an AI confirmation call?',
        answer: 'The call is about an order they placed minutes or hours ago — not a sales pitch. You approve the script, languages and calling hours, and anyone who asks for a person is passed to your team. Calling numbers and consents stay in your business’s name.',
      },
      {
        question: 'We already use a COD or RTO app. Do we still need this?',
        answer: 'Maybe not. If an app already confirms orders and your team handles the rest comfortably, keep it. We are useful when the work spans several tools — store, courier, calls and chats — and needs one flow with exception rules and a named owner. If an app is enough, the audit will say so.',
      },
      {
        question: 'We sell on marketplaces and Instagram too. Can those orders be included?',
        answer: 'Where a channel gives access to its order data, yes. We confirm which marketplaces and tools can connect, and what has to stay manual, before we quote. Store conversion work itself focuses on Shopify.',
      },
      {
        question: 'Which languages can the calling agent use?',
        answer: 'Languages are confirmed per project, after testing with your scripts and your customers. We do not promise a language until it has been tested for your use.',
      },
    ],
  },
  {
    id: 'b2b',
    slug: 'b2b',
    number: '03',
    label: 'For B2B businesses',
    navLabel: 'For B2B businesses',
    navDescription: 'Lose fewer deals between enquiry and payment.',
    kicker: 'For B2B businesses',
    headline: 'Selling to businesses?',
    headlineMuted: 'Close the gaps between enquiry and payment.',
    description:
      'For manufacturers, wholesalers, distributors and B2B service firms. Your sales move through enquiries, quotes, dealer orders and payment terms — usually spread across a marketplace inbox, WhatsApp, Excel and somebody’s memory. We connect those steps so each one has an owner, a record and a next action.',
    builtFor: [
      'Manufacturers',
      'Wholesalers & distributors',
      'Exporters & industrial suppliers',
      'B2B service firms',
      'Brands that sell wholesale and direct',
    ],
    leaksTitle: 'Where B2B deals stall',
    leaks: [
      {
        title: 'The first good reply wins the enquiry.',
        body: 'Marketplace and website enquiries often reach several suppliers at once. The one who calls back first, with the right answer, sets the terms. Yours waits until someone is free.',
        check: 'Check it yourself: take last week’s ten newest enquiries. Note how long each waited for a real reply, and how many never got one.',
      },
      {
        title: 'Dealer orders live in calls and chats.',
        body: 'Reorders arrive as a WhatsApp message, a voice note or a call to whoever picks up. There’s no record until someone types it in, and the stock, price and dispatch questions start again.',
        check: 'Check it yourself: count last month’s orders that arrived outside any system, and how many needed a second call.',
      },
      {
        title: 'Your sales team spends the day not selling.',
        body: 'Re-explaining specs, rebuilding quotes, updating the CRM after the fact, reminding customers about overdue invoices. Necessary work — just not the work you hired salespeople for.',
        check: 'Check it yourself: ask your sales team what they did yesterday. Mark the hours a customer would have noticed.',
      },
    ],
    research: {
      quote: 'Sales reps report spending 70% of their time on non-selling tasks.',
      source: 'Salesforce, State of Sales, 2024 · survey of 5,500 sales professionals',
      url: 'https://www.salesforce.com/news/stories/sales-ai-statistics-2024/',
    },
    useCasesTitle: 'What we build for B2B teams',
    useCases: [
      {
        title: 'Call back every enquiry while it’s warm.',
        body: 'An approved AI call flow responds to new marketplace or website enquiries, asks your qualifying questions — quantity, location, timeline — logs the answers in your CRM and passes serious buyers to a named salesperson.',
        serviceSlug: 'order-operations',
        modules: 'AI calling agent · Workflow automation',
      },
      {
        title: 'Reorders that land in a system, not a chat.',
        body: 'Dealers reorder through a WhatsApp flow or a wholesale store with their own prices, minimums and payment terms. Orders reach your sheet, CRM or ERP without re-typing, and dispatch updates go back to the dealer.',
        serviceSlug: 'order-operations',
        modules: 'Workflow automation · Shopify wholesale where it fits',
      },
      {
        title: 'Quotes and answers from one approved source.',
        body: 'Specs, price rules, past proposals and common objections in one approved workspace. Your team drafts quotes, tender answers and follow-ups from it, and a person signs off every one.',
        serviceSlug: 'ai-automation',
        modules: 'Claude Brain',
      },
      {
        title: 'Payment reminders that don’t depend on memory.',
        body: 'Reminders go out before the due date, on it and after it, by WhatsApp or call, in the wording you approve. Disputes go straight to your accounts team.',
        serviceSlug: 'order-operations',
        modules: 'Workflow automation · AI calling agent',
      },
    ],
    useCasesNote: 'Need demand as well as follow-up? Managed marketing — Google Search, LinkedIn and content — is scoped the same way.',
    trustTitle: 'Straight answer',
    trustLine:
      'Our own brands sell to consumers, not to businesses. What carries over is the build: calling flows, connected data, approved knowledge and a clean handover. Ask us to show the relevant workflow before you agree to anything.',
    toolsLine:
      'Works around the tools you already use, such as Zoho, Tally, LeadSquared, HubSpot, IndiaMART, WhatsApp Business and Google Sheets. We confirm each connection before we quote.',
    fit: {
      yes: 'Enquiries or dealer orders arrive every week, follow-up depends on who remembers, and someone on your team can own the workflow.',
      no: 'You close a handful of large deals a year through relationships alone — software won’t move those — or you want someone to run your sales for you.',
    },
    cta: {
      microcopy:
        'Bring last month’s enquiries and orders. In 30 minutes we’ll map where they stall between enquiry and payment, and which gap to close first.',
      trackingLocation: 'services-b2b',
    },
    faqs: [
      {
        question: 'You run consumer brands. Why trust you with B2B work?',
        answer: 'Fair question. What carries over is the build — calling flows, connected data, approved knowledge and handover — not B2B sales experience. So we show you the relevant workflow before scoping, agree the scope and checks in writing, and build in your own accounts.',
      },
      {
        question: 'Will it work with Tally, Zoho or our ERP?',
        answer: 'It depends on what your system allows. Tally, for example, supports data exchange but often runs on a local machine. We check each connection, agree which system holds the master record, and confirm limits before we quote. We do not ask you to replace your tools first.',
      },
      {
        question: 'Can an AI caller handle technical buyer questions?',
        answer: 'Only from the approved material you give it. The call asks your qualifying questions and answers routine ones; anything outside that material goes to a named person on your team, with the call notes attached.',
      },
      {
        question: 'Is Shopify suitable for a dealer or wholesale store?',
        answer: 'Sometimes. Shopify now includes core B2B features — company accounts, quantity rules, payment terms and a limited number of price catalogues — on its standard plans, with more on Shopify Plus. If your pricing or approval rules are complex, an ERP portal or a WhatsApp ordering flow may suit you better. We say which before quoting.',
      },
      {
        question: 'Can you remind our buyers about overdue payments?',
        answer: 'Yes, for invoices they owe you, in wording you approve, from numbers registered to your business. Disputes and sensitive accounts go to your team. Your legal adviser should confirm the calling and messaging rules for your sector.',
      },
    ],
  },
] as const;

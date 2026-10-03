import { pillars, type PillarId } from '@/data/offer';

export type ServiceRoute = {
  slug: string;
  pillarId: Exclude<PillarId, 'all-in-one'>;
  navLabel: string;
  navDescription: string;
  title: string;
  accent: string;
  intro: string;
  problemTitle: string;
  problemBody: string;
  outcomes: readonly string[];
};

export const serviceRoutes: readonly ServiceRoute[] = [
  {
    slug: 'store-conversion',
    pillarId: 'store-conversion',
    navLabel: 'Store Conversion',
    navDescription: 'Turn more paid visits into orders.',
    title: 'Shopify conversion optimization.',
    accent: 'Stop paying twice for the same visit.',
    intro:
      'You already paid for the click. We work on the pages, product discovery and cart decisions sitting between that click and a completed Shopify order — the stretch you are currently paying for twice.',
    problemTitle: 'The leak is rarely “more traffic.” It is what happens after the click.',
    problemBody:
      'A visitor lands on the wrong product, misses the proof they need or reaches a cart that adds no useful next step. More spend only sends more people through the same gaps.',
    outcomes: [
      'Find the pages and decisions losing the most buyers.',
      'Put proven products in front of visitors before they leave.',
      'Test relevant cart additions against order value and margin.',
    ],
  },
  {
    slug: 'order-operations',
    pillarId: 'operations',
    navLabel: 'Order Operations',
    navDescription: 'Handle more orders with less firefighting.',
    title: 'COD confirmation & order automation.',
    accent: 'Booked is not delivered.',
    intro:
      'We connect order data, cash-on-delivery confirmation calls and failed-delivery follow-ups, so your team spends the day on exceptions instead of chasing every order by hand.',
    problemTitle: 'Booked revenue is not delivered revenue.',
    problemBody:
      'Cash-on-delivery confirmations wait, failed-delivery follow-ups happen late, stock changes live in several places and people spend the day copying updates. The dashboard says growth while the team feels the drag.',
    outcomes: [
      'Give every brand and channel one reliable order view.',
      'Route routine calls through an approved flow, with exceptions for your team.',
      'Remove repetitive copying, updating and chasing between tools.',
    ],
  },
  {
    slug: 'ai-automation',
    pillarId: 'ai-automation',
    navLabel: 'AI & Marketing',
    navDescription: 'Keep brand knowledge ready for the next brief.',
    title: 'AI marketing workflow automation.',
    accent: 'Stop explaining your brand.',
    intro:
      'Managed marketing puts the work into market. A structured AI workspace — your Claude Brain — keeps the approved brand context behind it, so the next brief starts from what your brand already learned instead of a blank chat.',
    problemTitle: 'The expensive part is not one task. It is explaining the brand again and again.',
    problemBody:
      'Customer insight sits in calls, creative lessons sit in ad accounts and positioning sits in somebody’s head. Each new campaign begins by rebuilding context that the business already paid to learn.',
    outcomes: [
      'Keep approved customer, offer and brand knowledge in one working context.',
      'Turn that context into sharper briefs, analysis and repeat decisions.',
      'Connect the thinking to a managed marketing team that ships the work.',
    ],
  },
] as const;

export function getServiceRoute(slug: string) {
  return serviceRoutes.find(service => service.slug === slug);
}

export function getServicePillar(service: ServiceRoute) {
  const pillar = pillars.find(item => item.id === service.pillarId);
  if (!pillar) throw new Error(`Missing offer pillar for service: ${service.slug}`);
  return pillar;
}

/** Specific deliverables make each service reviewable before a sales conversation. */
export const serviceDelivery = {
  'store-conversion': {
    example: 'A product page gets visits but few shoppers add to cart. We review the message, product information, buying questions and mobile purchase path, then scope one change to test.',
    handover: ['Agreed page or cart changes, with desktop and mobile QA', 'A record of what changed and the metrics to review', 'Editing guidance and the apps or subscriptions the build needs'],
    needs: 'Your Shopify setup, relevant store reports, product material and one person who can approve copy and design.',
    measure: 'Review conversion, add-to-cart, order value and margin together. Traffic quality and the offer still affect results.',
  },
  'operations': {
    example: 'Cash-on-delivery confirmations sit in a spreadsheet. We map how orders enter the queue, which cases can follow an approved flow, and when a person needs to take over.',
    handover: ['A scoped connection or calling workflow, tested with representative cases', 'An exception queue, responsible owner and handoff rules', 'A runbook covering access, logs, usage costs and routine checks'],
    needs: 'Your order and courier tools, sample order states, existing call scripts and an operations owner. Available connections and languages are confirmed first.',
    measure: 'Review handling time, missed follow-ups and delivery outcomes against a baseline. A completed call does not guarantee a delivered order.',
  },
  'ai-automation': {
    example: 'Every content brief starts by explaining the brand again. We organise approved products, customer questions, positioning and past learning so a repeatable brief can start from that context.',
    handover: ['A structured brand workspace built from approved source material', 'The agreed repeatable brief, analysis or content workflow', 'Review instructions, an owner and a method for keeping context current'],
    needs: 'Approved brand material, access to the relevant reports, examples of useful outputs and a reviewer on your team. Managed content and channel work is scoped separately.',
    measure: 'Review output quality, revision effort and turnaround first. Marketing performance is evaluated using actual campaign results.',
  },
} as const;

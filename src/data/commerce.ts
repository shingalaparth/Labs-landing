import { formatPilotPrice } from '@/data/offers';
import { pillars, type PillarId } from '@/data/offer';

/**
 * The enquiry options mirror the offer pillars, so the page and the form never drift.
 * Four choices plus "help me choose" — enough to route the conversation, few enough
 * that nobody has to weigh eight options before they can act.
 */
export const solutions = pillars.map(pillar => ({
  id: pillar.id,
  number: pillar.number,
  label: pillar.label,
  shortcut: pillar.shortcut,
  outcome: pillar.outcome,
  action: pillar.action,
}));

export type SolutionId = PillarId;
export type InterestId = SolutionId | 'not-sure';
export const solutionSelectionEvent = 'mehul:solution-select';

/** Campaign links published before the offer was repackaged still land in the right place. */
const legacySolutionIds: Readonly<Record<string, SolutionId>> = {
  infrastructure: 'operations',
  'cod-voice': 'operations',
  'meta-creatives': 'ai-automation',
  'seo-content': 'ai-automation',
  growth: 'ai-automation',
};

export function isSolutionId(value: unknown): value is SolutionId {
  return solutions.some(solution => solution.id === value);
}

/** Accepts a current or retired solution ID and returns the pillar it belongs to. */
export function resolveSolutionId(value: unknown): SolutionId | null {
  if (isSolutionId(value)) return value;
  return typeof value === 'string' && value in legacySolutionIds ? legacySolutionIds[value] : null;
}

/** Volume tells us how to scope everything except demand work, where catalogue size matters more. */
export function needsOrderVolume(interest: InterestId) {
  return interest !== 'ai-automation';
}

export const orderRanges = ['Under 100', '100–499', '500–999', '1,000–1,499', '1,500+', 'Not live yet'] as const;

export const processSteps = [
  {
    number: '01',
    title: 'The leak audit.',
    body: '30 minutes on your store and last month’s orders. We name the leaks we can see and which one is costing you the most right now.',
    output: 'Your leaks, ranked — yours to keep',
  },
  {
    number: '02',
    title: 'The scope.',
    body: 'The workflow, the connections, the cost, and who does what. Written down and agreed before a single thing is built.',
    output: 'A fixed scope you approved',
  },
  {
    number: '03',
    title: 'One workflow live.',
    body: 'We build and run the first workflow end to end, with your team, using agreed checks, monitoring and a clear route for exceptions.',
    output: 'A tested workflow and written handover',
  },
  {
    number: '04',
    title: 'Then the next one.',
    body: 'We add the next module only once the last is holding. You approve each step, you keep the agreed deliverables, and further work needs a new approval.',
    output: 'A layer that grows at your pace',
  },
] as const;

export const faqs = [
  { question: 'What does the free audit include, and what does it cost?', answer: 'A 30-minute conversation about your store or workflow. We review the context you share, identify the problems we can see, and recommend what to investigate or fix first. The audit is free. You keep the next steps whether or not you hire us.' },
  { question: 'How much does implementation cost?', answer: `The focused service pilot is ${formatPilotPrice()} USD for one agreed use case. Broader work is quoted separately after the audit. Before work begins, the written scope states deliverables, timing, payment terms, support and any applicable taxes, software, AI or usage charges. An enquiry does not purchase a pilot.` },
  { question: 'Do I need a service engagement to use your products?', answer: 'No. Products and brand services are separate paths. Skill Manager is in development and is not yet for sale. Its pricing, included skills, supported setup and support terms will be stated before purchase becomes available. Our free calculators are available now.' },
  { question: 'What experience can I review before I trust you with my brand?', answer: 'Sanskrutibydiorin and Diorin Demifine Jewellery are our own brands, not independent clients. They inform our operating experience. Ask which relevant workflows we can demonstrate and what evidence is available. We agree how your project will be evaluated before implementation; we do not promise a revenue result.' },
  { question: 'Are we too small, or do we need to buy every service?', answer: 'Start with one recurring problem that is worth solving. You do not need every module or several brands. If you are pre-launch, still validating demand, or do not have a team member to own the workflow, we may recommend a simpler next step.' },
  { question: 'How will AI use our customer data?', answer: 'We agree the data, tools, access and review rules in the scope. You grant access to the relevant accounts, and we identify third-party services used by the workflow. Calling scripts, supported languages, stopping rules and human handoff need approval before rollout. AI outputs still need appropriate review.' },
  { question: 'What happens if we stop working together?', answer: 'You retain your accounts and the deliverables agreed in your scope. Handover covers routine use, exceptions and the subscriptions or licences the workflow depends on. Third-party services may still have fees, and ongoing maintenance or support is agreed separately.' },
  { question: 'Do you work with B2B businesses as well as consumer brands?', answer: 'Yes. We build the same pieces for both: calling flows, connected order data, workflow automation and an approved knowledge workspace. Our own brands sell to consumers, so for B2B work we show you the relevant workflow before scoping. Not a product business? Ask on the audit call — we will tell you honestly whether we fit.' },
  { question: 'Will it work with Tally, Zoho or our ERP?', answer: 'It depends on what your system allows. Tally, for example, supports data exchange but often runs on a local machine. We check each connection, agree which system holds the master record, and confirm limits before we quote. We do not ask you to replace your tools first.' },
  { question: 'Will customers mind talking to an AI caller?', answer: 'Calls should be about something the customer already started — an order, an enquiry or an invoice — never cold selling. You approve the script, languages, calling hours and when a person takes over. Calling numbers and consents stay in your name, and your legal adviser should confirm the consent and calling rules that apply to you.' },
  { question: 'Can you work with our existing tools?', answer: 'Store conversion work focuses on Shopify. Order and AI workflows depend on the connections your tools support. Share your platform, courier, inventory and marketing setup; we confirm compatibility and limits before quoting. We do not ask you to replace everything before understanding the problem.' },
] as const;

import { guides } from '@/data/guides';

/** Search intent and public metadata for every indexable route. No keyword-volume claims. */
export type PageSeo = { title: string; description: string; label: string; type: string };
export const pageSeo: Record<string, PageSeo> = {
  "/": {
    "title": "Shopify CRO & AI Automation for D2C Brands",
    "description": "MLabs helps D2C brands improve Shopify conversion, automate COD order operations and build AI marketing workflows. Book a free 30-minute audit.",
    "label": "Home",
    "type": "WebPage"
  },
  "/services": {
    "title": "Shopify Growth, Order Operations & AI Services",
    "description": "Explore MlabsGrowth services for Shopify conversion, order operations and practical AI marketing workflows. Start with a free 30-minute audit.",
    "label": "Services",
    "type": "CollectionPage"
  },
  "/services/store-conversion": {
    "title": "Shopify Conversion Rate Optimization Services",
    "description": "Improve Shopify product pages, product discovery and cart journeys with MLabs. Start with a free audit, then agree a focused implementation scope.",
    "label": "Shopify conversion",
    "type": "WebPage"
  },
  "/services/order-operations": {
    "title": "COD Confirmation & Order Automation Services",
    "description": "Connect COD confirmation calls, order data and failed-delivery follow-ups. MLabs scopes order automation with human handoffs for D2C teams.",
    "label": "Order operations",
    "type": "WebPage"
  },
  "/services/ai-automation": {
    "title": "AI Marketing Workflow Automation Services",
    "description": "Build a brand knowledge workspace and repeatable AI marketing workflows. MLabs helps teams create briefs, review outputs and keep context current.",
    "label": "AI marketing workflows",
    "type": "WebPage"
  },
  "/services/b2c": {
    "title": "Growth & Order Automation for B2C Brands",
    "description": "For B2C and D2C brands: confirm COD orders, chase failed deliveries, fix the pages your ads land on and judge marketing on delivered orders.",
    "label": "For B2C brands",
    "type": "WebPage"
  },
  "/services/b2b": {
    "title": "Sales & Order Automation for B2B Businesses",
    "description": "For manufacturers, wholesalers and distributors: call back enquiries fast, capture dealer reorders, draft quotes from approved data and automate payment reminders.",
    "label": "For B2B businesses",
    "type": "WebPage"
  },
  "/offers": {
    "title": "AI & Shopify Services: Pricing and Scope",
    "description": "Compare MLabs Shopify, order operations and AI workflow services. Explore the $5,000 USD pilot, deliverables, custom scope and free audit call.",
    "label": "Pricing & scope",
    "type": "CollectionPage"
  },
  "/about": {
    "title": "About Mehul & MlabsGrowth",
    "description": "Meet Mehul, the founder of MlabsGrowth. Learn how operating D2C brands shapes our Shopify, order automation and AI marketing workflow services.",
    "label": "About Mehul",
    "type": "AboutPage"
  },
  "/products": {
    "title": "AI Workflow Products & Free D2C Tools",
    "description": "Explore MLabs Skill Manager and eight free D2C calculators for marketplace profit, website margins, order costs, bundles, inventory and cash planning.",
    "label": "Products",
    "type": "CollectionPage"
  },
  "/products/skill-manager": {
    "title": "MLabs Skill Manager: AI Skills & Recurring Tasks",
    "description": "Explore MLabs Skill Manager, in development for organising AI skills, scheduling recurring work and reviewing outputs. Pricing and release are pending.",
    "label": "Skill Manager",
    "type": "WebPage"
  },
  "/blog": {
    "title": "D2C & AI Automation Blog",
    "description": "Read practical field notes from MLabs on D2C operations, Shopify conversion and useful AI automation workflows.",
    "label": "Blog",
    "type": "CollectionPage"
  },
  "/tools": {
    "title": "Free Ecommerce & D2C Calculators",
    "description": "Use eight free ecommerce calculators for marketplace and D2C profit, RTO costs, unit economics, bundles, marketing budgets, cash runway and inventory.",
    "label": "Free calculators",
    "type": "CollectionPage"
  },
  "/tools/rto-simulator": {
    "title": "Free RTO Cost Calculator for Ecommerce",
    "description": "Calculate return-to-origin costs for COD and prepaid orders. Estimate shipping and packaging losses, then compare a lower COD RTO-rate scenario.",
    "label": "RTO cost calculator",
    "type": "WebPage"
  },
  "/tools/unit-economics": {
    "title": "Free Ecommerce Unit Economics Calculator",
    "description": "Estimate D2C contribution margin per order using product costs, shipping, fees, advertising and RTO assumptions. Check your numbers before scaling.",
    "label": "Unit economics calculator",
    "type": "WebPage"
  },
  "/tools/bundle-planner": {
    "title": "Free Product Bundle Pricing Calculator",
    "description": "Compare bundle discounts, product costs and projected average order value. Model bundle adoption and margin before changing your ecommerce offer.",
    "label": "Bundle pricing calculator",
    "type": "WebPage"
  },
  "/tools/marketing-budget": {
    "title": "Free Ecommerce Marketing Budget Calculator",
    "description": "Plan channel budgets and model ROAS, revenue, orders and acquisition cost. Compare ecommerce marketing scenarios using your own assumptions.",
    "label": "Marketing budget calculator",
    "type": "WebPage"
  },
  "/tools/runway-planner": {
    "title": "Free Cash Runway & Burn Rate Calculator",
    "description": "Model monthly cash flow, burn rate and runway over 24 months. Compare revenue growth, fixed costs and marketing spend for your D2C business.",
    "label": "Cash runway calculator",
    "type": "WebPage"
  },
  "/tools/inventory-planner": {
    "title": "Free Inventory Reorder Point Calculator",
    "description": "Calculate SKU reorder points, safety stock and stockout estimates from daily sales and supplier lead times. Plan inventory using your own inputs.",
    "label": "Inventory calculator",
    "type": "WebPage"
  },
  "/tools/ecommerce-platform-profit": {
    "title": "Free Marketplace Profit Calculator for Ecommerce",
    "description": "Calculate marketplace profit after platform commission, GST, returns, RTO, logistics, product cost and ad spend. Find break-even price and ROAS.",
    "label": "Marketplace profit calculator",
    "type": "WebPage"
  },
  "/tools/website-d2c-profit": {
    "title": "Free Website & D2C Profit Calculator",
    "description": "Calculate direct website profit after payment gateway fees, GST, returns, RTO, delivery, product cost and ads. Find target price and break-even ROAS.",
    "label": "Website profit calculator",
    "type": "WebPage"
  }
};

for (const guide of guides) {
  pageSeo[`/guides/${guide.slug}`] = { title: guide.title, description: guide.description, label: guide.title, type: 'WebPage' };
}
pageSeo['/guides'] = { title: 'D2C Growth & AI Workflow Guides', description: 'Practical MLabs guides to Shopify conversion audits, COD return-to-origin costs and repeatable AI marketing workflows. Explore checklists and examples.', label: 'Guides', type: 'CollectionPage' };

export function breadcrumbsFor(path: string) {
  if (path === '/' || !pageSeo[path]) return [];
  const parent = path.startsWith('/blog/') ? '/blog' : path.startsWith('/guides/') ? '/guides' : path.startsWith('/tools/') ? '/tools' : path.startsWith('/products/') ? '/products' : path.startsWith('/services/') ? '/services' : null;
  return [{ path: '/', label: 'Home' }, ...(parent ? [{ path: parent, label: pageSeo[parent].label }] : []), { path, label: pageSeo[path].label }];
}

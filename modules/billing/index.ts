// Multi-Tenant Subscription & Billing Module
export interface SubscriptionPlan {
  id: string;
  name: string; // Starter, Growth, Enterprise
  max_properties: number;
  max_units: number;
  price_monthly_inr: number;
  price_monthly_usd: number;
}

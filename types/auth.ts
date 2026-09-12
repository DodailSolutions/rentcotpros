export type UserRole =
  | "owner"
  | "manager"
  | "frontdesk"
  | "hr"
  | "housekeeping"
  | "event_coordinator"
  | "guest";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  billing_email: string;
  subscription_tier: "starter" | "growth" | "enterprise";
  subscription_status: "active" | "trialing" | "past_due" | "canceled";
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface OrgMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: UserRole;
  // If empty or null, member has access to all properties in the org (Owner)
  // Otherwise, scoped to specific property IDs (e.g. Manager of Vikarabad Campsite only)
  assigned_property_ids: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  organization_id: string;
  property_id?: string;
  actor_user_id: string;
  actor_role: UserRole;
  action: string; // e.g. "unit.status_changed", "reservation.created", "payroll.approved"
  entity_type: string; // e.g. "unit", "reservation", "guest", "rate_plan", "staff"
  entity_id: string;
  before_state?: Record<string, any> | null;
  after_state?: Record<string, any> | null;
  metadata?: Record<string, any>;
  created_at: string;
}

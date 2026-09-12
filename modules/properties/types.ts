export type PropertyType = "resort" | "farmhouse" | "camping_zone" | "villa" | "cottages";

export interface Property {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  type: PropertyType;
  description?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  timezone: string;
  currency: string;
  contact_phone?: string;
  contact_email?: string;
  check_in_time: string; // e.g. "14:00"
  check_out_time: string; // e.g. "11:00"
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

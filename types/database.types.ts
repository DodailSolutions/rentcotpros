export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole =
  | "owner"
  | "manager"
  | "frontdesk"
  | "hr"
  | "housekeeping"
  | "event_coordinator"
  | "guest";

export type PropertyType =
  | "resort"
  | "farmhouse"
  | "camping_zone"
  | "villa"
  | "cottages";

export type UnitCategory =
  | "room"
  | "tent"
  | "cottage"
  | "dorm_bed"
  | "villa"
  | "individual_stay";

export type UnitOperationalStatus =
  | "clean"
  | "dirty"
  | "inspected"
  | "occupied"
  | "vacant"
  | "out_of_service";

export type InventoryCategory =
  | "overnight_unit"
  | "event_venue"
  | "day_outing_slot"
  | "activity_slot";

export type PricingModel =
  | "per_night"
  | "per_slot"
  | "per_person"
  | "flat_rate";

export type BookingSource =
  | "direct"
  | "ota"
  | "walk_in"
  | "agent"
  | "corporate";

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          billing_email: string;
          phone: string | null;
          subscription_tier: "starter" | "growth" | "enterprise";
          subscription_status: "active" | "trialing" | "past_due" | "canceled";
          logo_url: string | null;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          billing_email: string;
          phone?: string | null;
          subscription_tier?: "starter" | "growth" | "enterprise";
          subscription_status?: "active" | "trialing" | "past_due" | "canceled";
          logo_url?: string | null;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          billing_email?: string;
          phone?: string | null;
          subscription_tier?: "starter" | "growth" | "enterprise";
          subscription_status?: "active" | "trialing" | "past_due" | "canceled";
          logo_url?: string | null;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          preferred_locale: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          phone?: string | null;
          avatar_url?: string | null;
          preferred_locale?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          preferred_locale?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      org_members: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          role: UserRole;
          assigned_property_ids: string[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id: string;
          role?: UserRole;
          assigned_property_ids?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          user_id?: string;
          role?: UserRole;
          assigned_property_ids?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      properties: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          slug: string;
          type: PropertyType;
          description: string | null;
          address_line1: string;
          address_line2: string | null;
          city: string;
          state: string;
          postal_code: string;
          country: string;
          timezone: string;
          currency: string;
          contact_phone: string | null;
          contact_email: string | null;
          check_in_time: string;
          check_out_time: string;
          hero_image_url: string | null;
          is_active: boolean;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          slug: string;
          type?: PropertyType;
          description?: string | null;
          address_line1: string;
          address_line2?: string | null;
          city: string;
          state: string;
          postal_code: string;
          country?: string;
          timezone?: string;
          currency?: string;
          contact_phone?: string | null;
          contact_email?: string | null;
          check_in_time?: string;
          check_out_time?: string;
          hero_image_url?: string | null;
          is_active?: boolean;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          slug?: string;
          type?: PropertyType;
          description?: string | null;
          address_line1?: string;
          address_line2?: string | null;
          city?: string;
          state?: string;
          postal_code?: string;
          country?: string;
          timezone?: string;
          currency?: string;
          contact_phone?: string | null;
          contact_email?: string | null;
          check_in_time?: string;
          check_out_time?: string;
          hero_image_url?: string | null;
          is_active?: boolean;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      unit_types: {
        Row: {
          id: string;
          organization_id: string;
          property_id: string;
          name: string;
          slug: string;
          category: UnitCategory;
          description: string | null;
          base_capacity: number;
          max_capacity: number;
          adults_capacity: number;
          children_capacity: number;
          base_price: number;
          extra_adult_price: number;
          extra_child_price: number;
          amenities: Json;
          pet_policy: Json;
          images: string[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          property_id: string;
          name: string;
          slug: string;
          category?: UnitCategory;
          description?: string | null;
          base_capacity?: number;
          max_capacity?: number;
          adults_capacity?: number;
          children_capacity?: number;
          base_price?: number;
          extra_adult_price?: number;
          extra_child_price?: number;
          amenities?: Json;
          pet_policy?: Json;
          images?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          property_id?: string;
          name?: string;
          slug?: string;
          category?: UnitCategory;
          description?: string | null;
          base_capacity?: number;
          max_capacity?: number;
          adults_capacity?: number;
          children_capacity?: number;
          base_price?: number;
          extra_adult_price?: number;
          extra_child_price?: number;
          amenities?: Json;
          pet_policy?: Json;
          images?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      units: {
        Row: {
          id: string;
          organization_id: string;
          property_id: string;
          unit_type_id: string;
          unit_number: string;
          floor: string | null;
          building: string | null;
          operational_status: UnitOperationalStatus;
          housekeeping_notes: string | null;
          maintenance_notes: string | null;
          last_cleaned_at: string | null;
          last_inspected_at: string | null;
          last_cleaned_by: string | null;
          last_inspected_by: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          property_id: string;
          unit_type_id: string;
          unit_number: string;
          floor?: string | null;
          building?: string | null;
          operational_status?: UnitOperationalStatus;
          housekeeping_notes?: string | null;
          maintenance_notes?: string | null;
          last_cleaned_at?: string | null;
          last_inspected_at?: string | null;
          last_cleaned_by?: string | null;
          last_inspected_by?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          property_id?: string;
          unit_type_id?: string;
          unit_number?: string;
          floor?: string | null;
          building?: string | null;
          operational_status?: UnitOperationalStatus;
          housekeeping_notes?: string | null;
          maintenance_notes?: string | null;
          last_cleaned_at?: string | null;
          last_inspected_at?: string | null;
          last_cleaned_by?: string | null;
          last_inspected_by?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookable_inventory: {
        Row: {
          id: string;
          organization_id: string;
          property_id: string;
          category: InventoryCategory;
          name: string;
          capacity: number;
          pricing_model: PricingModel;
          base_price: number;
          slot_duration_minutes: number | null;
          start_time: string | null;
          end_time: string | null;
          metadata: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          property_id: string;
          category: InventoryCategory;
          name: string;
          capacity: number;
          pricing_model?: PricingModel;
          base_price?: number;
          slot_duration_minutes?: number | null;
          start_time?: string | null;
          end_time?: string | null;
          metadata?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          property_id?: string;
          category?: InventoryCategory;
          name?: string;
          capacity?: number;
          pricing_model?: PricingModel;
          base_price?: number;
          slot_duration_minutes?: number | null;
          start_time?: string | null;
          end_time?: string | null;
          metadata?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      guests: {
        Row: {
          id: string;
          organization_id: string;
          first_name: string;
          last_name: string;
          email: string | null;
          phone: string;
          country_code: string;
          id_type: string | null;
          id_number: string | null;
          id_document_url: string | null;
          id_verified: boolean;
          default_adults_count: number;
          default_children_count: number;
          has_pets: boolean;
          pet_details: string | null;
          stay_preferences: Json;
          notes: string | null;
          vip_status: boolean;
          total_stays_count: number;
          total_revenue_spent: number;
          last_booking_source: BookingSource;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          first_name: string;
          last_name: string;
          email?: string | null;
          phone: string;
          country_code?: string;
          id_type?: string | null;
          id_number?: string | null;
          id_document_url?: string | null;
          id_verified?: boolean;
          default_adults_count?: number;
          default_children_count?: number;
          has_pets?: boolean;
          pet_details?: string | null;
          stay_preferences?: Json;
          notes?: string | null;
          vip_status?: boolean;
          total_stays_count?: number;
          total_revenue_spent?: number;
          last_booking_source?: BookingSource;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          first_name?: string;
          last_name?: string;
          email?: string | null;
          phone?: string;
          country_code?: string;
          id_type?: string | null;
          id_number?: string | null;
          id_document_url?: string | null;
          id_verified?: boolean;
          default_adults_count?: number;
          default_children_count?: number;
          has_pets?: boolean;
          pet_details?: string | null;
          stay_preferences?: Json;
          notes?: string | null;
          vip_status?: boolean;
          total_stays_count?: number;
          total_revenue_spent?: number;
          last_booking_source?: BookingSource;
          created_at?: string;
          updated_at?: string;
        };
      };
      audit_log: {
        Row: {
          id: string;
          organization_id: string;
          property_id: string | null;
          actor_user_id: string | null;
          actor_role: UserRole | null;
          action: string;
          entity_type: string;
          entity_id: string;
          before_values: Json | null;
          after_values: Json | null;
          metadata: Json;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          property_id?: string | null;
          actor_user_id?: string | null;
          actor_role?: UserRole | null;
          action: string;
          entity_type: string;
          entity_id: string;
          before_values?: Json | null;
          after_values?: Json | null;
          metadata?: Json;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          property_id?: string | null;
          actor_user_id?: string | null;
          actor_role?: UserRole | null;
          action?: string;
          entity_type?: string;
          entity_id?: string;
          before_values?: Json | null;
          after_values?: Json | null;
          metadata?: Json;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

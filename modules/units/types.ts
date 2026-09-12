export type UnitCategory = "room" | "tent" | "cottage" | "dorm_bed" | "villa" | "individual_stay";

export type UnitOperationalStatus = 
  | "clean"
  | "dirty"
  | "inspected"
  | "occupied"
  | "vacant"
  | "out_of_service";

export interface PetPolicy {
  allowed: boolean;
  max_pets?: number;
  fee_per_pet?: number;
  restrictions?: string;
}

export interface UnitType {
  id: string;
  organization_id: string;
  property_id: string;
  name: string; // e.g. "Luxury Glamping Dome", "3-BHK Farmhouse Villa", "Deluxe Lake View Cottage"
  slug: string;
  category: UnitCategory;
  description?: string;
  base_capacity: number;
  max_capacity: number;
  adults_capacity: number;
  children_capacity: number;
  base_price: number;
  extra_adult_price: number;
  extra_child_price: number;
  pet_policy: PetPolicy;
  amenities: string[]; // e.g. ["wifi", "ac", "campfire", "private_pool", "bbq_setup"]
  images: string[];
  total_units_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Unit {
  id: string;
  organization_id: string;
  property_id: string;
  unit_type_id: string;
  unit_number: string; // e.g. "Tent A3", "Room 101", "Cottage 2"
  floor?: string;
  building?: string;
  operational_status: UnitOperationalStatus;
  housekeeping_notes?: string;
  maintenance_notes?: string;
  last_cleaned_at?: string;
  last_inspected_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type InventoryCategory = 
  | "overnight_unit"
  | "event_venue"
  | "day_outing_slot"
  | "activity_slot";

export interface BookableInventory {
  id: string;
  organization_id: string;
  property_id: string;
  category: InventoryCategory;
  name: string; // e.g. "Lawn A - Wedding Banquet", "Full Day Pool Access Slot", "Kayaking Morning Slot"
  capacity: number;
  pricing_model: "per_night" | "per_slot" | "per_person" | "flat_rate";
  base_price: number;
  slot_duration_minutes?: number;
  start_time?: string;
  end_time?: string;
  is_active: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

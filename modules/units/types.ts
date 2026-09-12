export type UnitCategory =
  | "villa"
  | "tent"
  | "glamping_dome"
  | "cottage"
  | "suite"
  | "room"
  | "dorm_bed"
  | "lawn_venue";

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

export interface BeddingConfig {
  kingBeds: number;
  queenBeds: number;
  singleBeds: number;
  bunkBeds: number;
  extraRollawayAllowed: boolean;
}

export interface UnitCurrentGuest {
  bookingId: string;
  name: string;
  phone: string;
  adults: number;
  children: number;
  checkIn: string;
  checkOut: string;
  paidAmount: number;
  source: "direct" | "airbnb" | "booking.com" | "walk_in";
}

export interface RichUnit {
  id: string;
  unit_number: string; // e.g. "Suite 101", "Dome A-02", "Villa 1"
  name: string;
  property_id: string;
  property_name: string;
  category: UnitCategory;
  category_label: string;
  zone_or_floor: string; // e.g. "Zone A: Lakeside Deck", "East Wing 1st Floor"
  status: UnitOperationalStatus;
  rate_per_night: number;
  weekend_rate: number;
  adults_capacity: number;
  children_capacity: number;
  bedding: BeddingConfig;
  has_attached_bath: boolean;
  has_ac: boolean;
  has_private_pool: boolean;
  pet_friendly: boolean;
  door_lock_code?: string;
  assigned_cleaner?: string;
  last_cleaned_at?: string;
  last_inspected_by?: string;
  maintenance_notes?: string;
  current_guest?: UnitCurrentGuest;
  image_url: string;
  // Owner & Outdoor Camping/Tent Management
  owner_name?: string;
  owner_phone?: string;
  pricing_model?: "per_unit" | "per_person" | "single_tent" | "flat_rate"; // "per_unit" = Entire unit flat rate; "per_person" = Charged per head/camper; "single_tent" = Single tent slot
  per_person_rate?: number; // Active when pricing_model === "per_person" or "single_tent"
  min_chargeable_pax?: number; // Minimum adults to bill
  package_includes_meals?: boolean;
  meal_inclusions?: string;
  tent_type?: "glamping_dome" | "swiss_canvas" | "alpine_tent" | "safari_bell" | "byot_pitch";
  washroom_type?: "attached_private" | "shared_bathhouse";
  ground_type?: "wooden_deck" | "grass_pitch" | "stone_plinth";
}

export interface UnitType {
  id: string;
  organization_id: string;
  property_id: string;
  name: string;
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
  amenities: string[];
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
  unit_number: string;
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
  name: string;
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

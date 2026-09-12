export type BookingSource = "direct" | "ota" | "walk_in" | "agent" | "corporate";

export interface Guest {
  id: string;
  organization_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  country_code: string;
  id_type?: "passport" | "national_id" | "driving_license" | "aadhaar";
  id_number?: string;
  id_document_url?: string;
  id_verified: boolean;
  
  // Party composition defaults / last known
  default_adults_count: number;
  default_children_count: number;
  has_pets: boolean;
  pet_details?: string;

  // Preferences & CRM history
  stay_preferences?: {
    dietary?: string;
    room_preference?: string;
    anniversary?: string;
    birthday?: string;
  };
  notes?: string;
  vip_status: boolean;
  total_stays_count: number;
  total_revenue_spent: number;
  last_booking_source: BookingSource;
  
  created_at: string;
  updated_at: string;
}

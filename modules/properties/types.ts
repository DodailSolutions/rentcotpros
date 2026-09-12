export type PropertyType =
  | "resort"
  | "farmhouse"
  | "camping_zone"
  | "villa"
  | "cottages"
  | "eco_lodge"
  | "homestay";

export type PropertyStatus = "active" | "seasonal_closure" | "renovation" | "inactive";

export interface PropertyCommercials {
  adr: number; // Average Daily Rate in INR / local currency
  revPar: number; // Revenue per available room
  monthlyRevenueEst: number;
  taxRegistrationNumber?: string; // GSTIN / Trade License / Tourism Tax ID
  licenseExpiryDate?: string;
  commissionRatePercent?: number;
}

export interface PropertyOperations {
  managerName: string;
  managerPhone: string;
  caretakerPhone?: string;
  emergencyContact: string;
  checkInTime: string; // e.g. "14:00"
  checkOutTime: string; // e.g. "11:00"
  quietHoursStart?: string; // e.g. "22:30"
  quietHoursEnd?: string; // e.g. "06:00"
  petFriendly: boolean;
  powerBackup: "100% DG Generator" | "Solar + Inverter" | "Standard Grid" | "Off-Grid";
}

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
  check_in_time: string;
  check_out_time: string;
  is_active: boolean;
  status: PropertyStatus;
  units_count: number;
  live_occupancy_rate: number; // e.g. 85 for 85%
  amenities: string[];
  commercials: PropertyCommercials;
  operations: PropertyOperations;
  created_at: string;
  updated_at: string;
}

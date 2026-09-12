export type CampsitePitchType =
  | "luxury_glamping_dome"
  | "pre_pitched_tent"
  | "byot_ground_pitch"
  | "rv_campervan_bay"
  | "swiss_cottage_tent"
  | "alpine_dome";

export type PitchGroundType =
  | "wooden_deck"
  | "grass_lawn"
  | "sand_bed"
  | "forest_floor"
  | "gravel_pad";

export type PitchPowerType =
  | "16a_rv_hookup"
  | "5a_standard_plug"
  | "solar_usb_only"
  | "off_grid_unpowered";

export type FirePitType =
  | "private_stone_pit"
  | "central_amphitheater"
  | "portable_fire_brazier"
  | "not_permitted";

export type GearCondition =
  | "ready_sanitized"
  | "needs_cleaning"
  | "in_use"
  | "under_repair"
  | "damaged";

export type TentStatus = "available" | "reserved" | "occupied" | "maintenance" | "dirty";

export interface CampsiteGuest {
  bookingId: string;
  name: string;
  phone: string;
  email?: string;
  adults: number;
  children: number;
  pets: number;
  checkIn: string;
  checkOut: string;
  paidAmount: number;
  paymentStatus: "paid" | "partial" | "pending";
  mealPlan: "veg_special" | "jain" | "standard_veg" | "non_veg";
  bbqOptIn: boolean;
  firewoodBundles: number;
  sleepingBagsExtra: number;
  notes?: string;
}

export interface CampsitePitch {
  id: string | number;
  pitchNumber: string; // e.g. "RC-1" to "RC-200" or "DOME-01"
  name: string;
  zone: "A" | "B" | "C" | "D";
  zoneName: string;
  type: CampsitePitchType | string;
  groundType: PitchGroundType;
  powerSupply: PitchPowerType;
  firePit: FirePitType;
  maxOccupancy: number;
  ratePerNight: number;
  hasAttachedWashroom: boolean;
  distanceToWashroomMeters: number;
  isShaded: boolean;
  status: TentStatus;
  currentGuest?: CampsiteGuest;
}

export interface CampfireBbqOrder {
  id: string;
  pitchNumber: string;
  guestName: string;
  phone: string;
  scheduledTime: string;
  firewoodBundles: number;
  bbqPackage: "veg_marinade" | "nonveg_marinade" | "mixed_grill" | "wood_only" | "marshmallow_kit";
  fireSafetyCleared: boolean;
  status: "scheduled" | "delivered" | "lit" | "extinguished";
  totalAmount: number;
}

export interface GearItem {
  id: string;
  name: string;
  category: "sleeping_bag" | "air_mattress" | "headlamp" | "camp_chair" | "trekking_pole" | "portable_stove";
  serialTag: string;
  condition: GearCondition;
  lastSanitized: string;
  currentPitch?: string;
  dailyRate: number;
}

export interface WeatherSafetyState {
  temperatureCelsius: number;
  windSpeedKmh: number;
  windGustKmh: number;
  rainProbabilityPercent: number;
  humidityPercent: number;
  campfireBanActive: boolean;
  advisoryMessage: string;
  quietHoursActive: boolean; // 10:30 PM - 6:00 AM
}

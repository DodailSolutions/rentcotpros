export type CampsitePitchType =
  | "luxury_glamping_dome"
  | "pre_pitched_tent"
  | "byot_ground_pitch"
  | "rv_campervan_bay";

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

export interface CampsitePitch {
  id: string;
  pitchNumber: string;
  name: string;
  type: CampsitePitchType;
  groundType: PitchGroundType;
  powerSupply: PitchPowerType;
  firePit: FirePitType;
  maxOccupancy: number;
  hasAttachedWashroom: boolean;
  distanceToWashroomMeters: number;
  isShaded: boolean;
  status: "available" | "occupied" | "reserved" | "maintenance";
  currentGuest?: {
    name: string;
    phone: string;
    adults: number;
    children: number;
    pets: number;
    checkIn: string;
    checkOut: string;
  };
}

export interface CampfireBbqOrder {
  id: string;
  pitchNumber: string;
  guestName: string;
  phone: string;
  scheduledTime: string;
  firewoodBundles: number;
  bbqPackage: "veg_marinade" | "nonveg_marinade" | "mixed_grill" | "wood_only";
  fireSafetyCleared: boolean;
  status: "scheduled" | "delivered" | "lit" | "extinguished";
  totalAmount: number;
}

export interface GearItem {
  id: string;
  name: string;
  category: "sleeping_bag" | "air_mattress" | "headlamp" | "camp_chair" | "trekking_pole";
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

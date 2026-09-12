export type PricingType =
  | "nightly"
  | "hourly"
  | "day_use"
  | "tent_flat"
  | "tent_per_person"
  | "per_person";


export type OverrideType =
  | "fixed_rate"
  | "percent_increase"
  | "percent_decrease";

export type PetFeeType =
  | "none"
  | "flat_per_stay"
  | "per_pet_per_night";

export interface RatePlan {
  id: string;
  organizationId: string;
  propertyId: string;
  propertyName?: string;
  unitTypeId: string;
  name: string;
  description?: string;
  pricingType: PricingType;
  baseRate: number;
  weekendRate?: number;
  extraAdultRate: number;
  extraChildRate: number;
  pricePerHour?: number;
  minHours?: number;
  dayUseStartTime?: string;
  dayUseEndTime?: string;
  weeklyDiscountPercent: number; // e.g. 15 for 15%
  monthlyDiscountPercent: number; // e.g. 30 for 30%
  petsAllowed: boolean;
  petFeeType: PetFeeType;
  petFeeAmount: number;
  taxPercent: number; // e.g. 12 or 18%
  minNights: number;
  maxNights?: number;
  isActive: boolean;
}

export interface RateOverride {
  id: string;
  organizationId: string;
  propertyId: string;
  unitTypeId?: string | null;
  name: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
  daysOfWeek?: number[]; // [5, 6] for Fri/Sat. empty/null means all days
  overrideType: OverrideType;
  overrideValue: number;
  reason: string;
  isActive: boolean;
}

export interface CorporateRateCard {
  id: string;
  organizationId: string;
  propertyId: string;
  clientName: string;
  corporateCode: string;
  discountType: OverrideType;
  discountValue: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

export interface DynamicPricingRule {
  id: string;
  organizationId: string;
  propertyId: string;
  name: string;
  occupancyOperator: ">=" | "<=";
  occupancyPercent: number;
  daysBeforeArrivalMax?: number | null; // e.g. 3 days before check-in
  adjustmentPercent: number; // +20 or -15
  isActive: boolean;
}

export interface PricingCalculationParams {
  ratePlan: RatePlan;
  checkInDate: string; // "YYYY-MM-DD"
  checkOutDate?: string; // "YYYY-MM-DD" (required for nightly)
  checkInTime?: string; // "HH:MM"
  checkOutTime?: string; // "HH:MM"
  hoursDuration?: number; // for hourly
  adultsCount: number;
  childrenCount: number;
  petsCount: number;
  baseIncludedAdults?: number; // defaults to 2
  overrides?: RateOverride[];
  corporateCard?: CorporateRateCard | null;
  dynamicRules?: DynamicPricingRule[];
  currentOccupancyPercent?: number;
  bookingLeadDays?: number; // days between now and check-in
}

export interface NightlyCostDetail {
  date: string;
  baseRate: number;
  appliedOverrideName?: string;
  overrideAdjustment: number;
  effectiveNightlyRate: number;
  isWeekend: boolean;
}

export interface PriceBreakdown {
  pricingType: PricingType;
  totalNights: number;
  totalHours?: number;
  nightlyDetails: NightlyCostDetail[];
  
  // Totals breakdown
  baseStayAmount: number;
  extraAdultsAmount: number;
  extraChildrenAmount: number;
  petFeeAmount: number;
  
  // Discounts & Dynamic Adjustments
  longStayDiscountName?: string;
  longStayDiscountAmount: number;
  corporateDiscountName?: string;
  corporateDiscountAmount: number;
  dynamicAdjustmentName?: string;
  dynamicAdjustmentAmount: number; // positive surge or negative discount
  
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  totalAmount: number;
  averageRatePerNightOrHour: number;
  currency: string;
}

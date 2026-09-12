// Front-Desk POS Module for Rentcot Property OS

export type POSCategory = 
  | "food" 
  | "beverage" 
  | "bbq_campfire" 
  | "activities" 
  | "accommodation" 
  | "farm_produce" 
  | "other";

export interface POSItem {
  id: string;
  name: string;
  category: POSCategory;
  price: number; // in INR (₹)
  kidPrice?: number; // optional child/kid rate in INR (₹)
  isPerPerson?: boolean; // true if this item is charged on a per-head (guest/kid) basis
  taxRate: number; // e.g. 0.05 for 5%, 0.12 for 12% stay, 0.18 for 18%
  sacCode: string; // e.g. "996331" for F&B, "996311" for accommodation stay, "999699" for activities, "9997" for pet fee
  available: boolean;
  description?: string;
  unit?: string;
}

export type POSUnitStatus = "vacant" | "ready_to_vacant" | "occupied" | "dirty" | "out_of_service";

export interface POSRoomUnit {
  id: string;
  unitNumber: string; // e.g. "Tent T-01", "Villa V-01", "Cottage C-02"
  name: string; // e.g. "Swiss Luxury Canvas Tent", "Heritage Teak Pool Villa"
  category: "tent" | "cottage" | "villa" | "glamping_dome" | "suite" | "pitch";
  status: POSUnitStatus;
  ratePerDay: number; // in INR (₹) per night/day
  ratePerHour: number; // in INR (₹) per hour for flexible micro-stays
  minHours?: number; // e.g. 3 hours minimum
  adultsCapacity: number;
  kidsCapacity: number;
  petFriendly: boolean;
  petFee: number; // in INR (₹) per pet
  amenities: string[];
  currentGuestName?: string;
  currentGuestPhone?: string;
  currentGuestFolio?: string;
  expectedCheckoutTime?: string; // e.g. "11:00 AM Today" (for ready_to_vacant)
  standardCheckInTime: string; // e.g. "02:00 PM"
  standardCheckOutTime: string; // e.g. "11:00 AM"
  keyDoorCode?: string;
  imageUrl?: string;
}

export interface POSGuestProfile {
  id: string;
  guestName: string;
  guestPhone: string;
  email?: string;
  roomOrPitch: string;
  folio: string;
  adultsCount: number;
  kidsCount: number;
  petsCount: number; // Number of pets registered
  petType?: string; // e.g. "Golden Retriever", "Beagle", "Cat"
  isCorporate: boolean;
  companyName?: string;
  companyGstin?: string;
  checkInDate?: string;
  type?: "in_house" | "walk_in_dining" | "day_picnic" | "walk_in_stay";
  stayType?: "per_day" | "per_hour" | "dining_only";
  stayDuration?: number; // nights or hours
  checkInTime?: string;
  checkOutTime?: string;
  unitId?: string;
}

export interface SplitTenderDetails {
  cash: number;
  upi: number;
  card: number;
  upiRef?: string;
  cardLast4?: string;
  changeReturned?: number;
}

export interface B2BBillingDetails {
  isB2B: boolean;
  companyName: string;
  companyGstin: string;
  companyAddress?: string;
  placeOfSupply?: string;
}

export interface ResortBranding {
  name: string;
  tradeName: string;
  tagline: string;
  addressLine: string;
  cityStatePin: string;
  stateCode: string;
  phone: string;
  email: string;
  gstin: string;
  fssai: string;
  logoType: "treepine" | "tent" | "compass";
  customLogoUrl?: string;
  bankName?: string;
  bankAccountNo?: string;
  bankIfsc?: string;
  upiVpa?: string;
  currency?: string; // Defaults to "INR (₹)"
}

export interface TaxBreakdownRow {
  sacCode: string;
  taxableValue: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  totalTax: number;
}

export interface CompletedInvoice {
  invoiceNumber: string;
  date: string;
  guestName: string;
  guestPhone?: string;
  adultsCount?: number; // Number of adult guests
  kidsCount?: number; // Number of kids/children
  petsCount?: number; // Number of pets
  roomOrPitch: string;
  stayDetails?: {
    unitName: string;
    duration: string; // e.g. "1 Night (Per Day)" or "4 Hours (Flex Hourly)"
    checkIn: string;
    checkOut: string;
    type: "per_day" | "per_hour";
  };
  items: {
    name: string;
    quantity: number;
    price: number;
    sacCode: string;
    taxRate: number;
    unit?: string;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  currency?: string; // Defaults to "INR (₹)"
  paymentMethod: string;
  chargeTarget: "room" | "direct";
  splitDetails?: SplitTenderDetails;
  b2bDetails?: B2BBillingDetails;
  brandingSnapshot: ResortBranding;
  taxSummary: TaxBreakdownRow[];
  amountInWords: string;
  cashierName: string;
}

export interface CashierShift {
  shiftId: string;
  cashierName: string;
  openedAt: string;
  initialFloat: number;
  invoicesCount: number;
  totalGross: number;
  cashCollected: number;
  upiCollected: number;
  cardCollected: number;
  folioCharged: number;
  totalGst: number;
}



// Front-Desk POS Module for Rentcot Property OS

export type POSCategory = "food" | "beverage" | "bbq_campfire" | "activities" | "farm_produce" | "other";

export interface POSItem {
  id: string;
  name: string;
  category: POSCategory;
  price: number;
  taxRate: number; // e.g. 0.05 for 5%, 0.18 for 18%
  sacCode: string; // e.g. "996331" for F&B, "999699" for activities, "4401" for firewood
  available: boolean;
  description?: string;
  unit?: string;
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
  roomOrPitch: string;
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


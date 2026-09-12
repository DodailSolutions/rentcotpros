export type BookingStatus =
  | "draft"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "canceled"
  | "no_show";

export type PaymentStatus = "pending" | "partially_paid" | "paid" | "refunded";

export type BookingInventoryCategory = "room" | "tent" | "venue";

export type BookingChannel =
  | "direct_walkin"
  | "direct_web"
  | "airbnb"
  | "booking"
  | "makemytrip"
  | "agoda"
  | "corporate";

export type MealPlanType = "ep" | "cp" | "map" | "ap" | "buffet";

export interface BookingPaymentTransaction {
  id: string;
  amount: number;
  method: "cash" | "upi" | "card" | "netbanking" | "ota_virtual_card";
  timestamp: string;
  notes?: string;
}

export interface RichReservation {
  id: string;
  bookingReference: string;
  guestName: string;
  phone: string;
  email: string;
  city?: string;
  propertyId: string;
  propertyName: string;
  inventoryCategory: BookingInventoryCategory;
  unitId: string;
  unitName: string;
  unitNumber: string;
  doorLockCode?: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  pets: number;
  source: BookingChannel;
  status: "confirmed" | "checked_in" | "checked_out" | "canceled";
  paymentStatus: PaymentStatus;
  baseRate: number;
  addonsTotal: number;
  taxAmount: number;
  securityDeposit: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  mealPlan: MealPlanType;
  mealPlanLabel: string;
  specialRequests?: string;
  addons?: Array<{ name: string; price: number }>;
  paymentTransactions?: BookingPaymentTransaction[];
  createdAt: string;
  otaSyncLocked: boolean;
  ownerName?: string;
  ownerPayout?: number;
}

export interface Booking {
  id: string;
  organization_id: string;
  property_id: string;
  guest_id: string;
  unit_id?: string;
  unit_type_id: string;
  booking_reference: string;
  check_in_date: string;
  check_out_date: string;
  adults_count: number;
  children_count: number;
  pets_count: number;
  status: BookingStatus;
  payment_status: PaymentStatus;
  total_amount: number;
  paid_amount: number;
  balance_due: number;
  source: string;
  special_requests?: string;
  created_at: string;
  updated_at: string;
}


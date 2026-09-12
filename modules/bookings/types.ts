export type BookingStatus =
  | "draft"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "canceled"
  | "no_show";

export type PaymentStatus = "pending" | "partially_paid" | "paid" | "refunded";

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

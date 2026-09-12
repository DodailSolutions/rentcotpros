export type OTAChannel =
  | "airbnb"
  | "booking_com"
  | "agoda"
  | "makemytrip"
  | "goibibo"
  | "vrbo"
  | "mock_sandbox";

export type SyncDirection =
  | "push_rates"
  | "push_availability"
  | "pull_bookings"
  | "pull_cancellations"
  | "rate_parity_check";

export type SyncStatus = "success" | "failed" | "warning" | "in_progress";

export type ParityStatus = "parity_match" | "ota_undercut" | "rentcot_cheaper";

export interface OTAConnection {
  id: string;
  organizationId: string;
  propertyId: string;
  channel: OTAChannel;
  hotelId?: string;
  apiKey?: string;
  secretKey?: string;
  icalUrl?: string;
  syncRatesEnabled: boolean;
  syncAvailabilityEnabled: boolean;
  syncIntervalMinutes: number;
  status: "active" | "paused" | "error" | "disconnected";
  lastSyncAt?: string;
  lastError?: string;
}

export interface OTAUnitMapping {
  id: string;
  connectionId: string;
  unitTypeId: string;
  unitTypeName: string;
  otaRoomTypeId: string;
  otaRatePlanId?: string;
  rateMarkupPercent: number; // e.g. +15% to offset OTA commission
  isActive: boolean;
}

export interface DateRate {
  date: string; // YYYY-MM-DD
  rate: number;
  currency: string;
  minStay?: number;
}

export interface DateAvailability {
  date: string; // YYYY-MM-DD
  availableUnitsCount: number;
  isClosedToArrival?: boolean;
  isClosedToDeparture?: boolean;
  isStopSell?: boolean;
}

export interface OTABooking {
  otaBookingId: string;
  channel: OTAChannel;
  propertyId: string;
  unitTypeId: string;
  unitId?: string; // Assigned physical unit
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  checkInDate: string;
  checkOutDate: string;
  adultsCount: number;
  childrenCount: number;
  totalPayout: number;
  currency: string;
  createdAt: string;
  status: "confirmed" | "modified" | "canceled";
  specialRequests?: string;
}

export interface OTACancellation {
  otaBookingId: string;
  channel: OTAChannel;
  cancellationDate: string;
  penaltyFee: number;
  reason?: string;
}

export interface SyncResult {
  channel: OTAChannel;
  direction: SyncDirection;
  status: SyncStatus;
  recordsSynced: number;
  latencyMs: number;
  summary: string;
  error?: string;
  timestamp: string;
}

export interface RateParityItem {
  date: string;
  channel: OTAChannel;
  unitTypeId: string;
  unitTypeName: string;
  rentcotDirectRate: number;
  otaLiveRate: number;
  differenceAmount: number;
  differencePercent: number;
  status: ParityStatus;
  penaltyRisk: "high" | "medium" | "none";
}

export interface RateParityReport {
  propertyId: string;
  checkedAt: string;
  totalDatesChecked: number;
  discrepanciesCount: number;
  items: RateParityItem[];
}

export interface SyncLogEntry {
  id: string;
  propertyId: string;
  channel: OTAChannel;
  direction: SyncDirection;
  status: SyncStatus;
  recordsSynced: number;
  latencyMs: number;
  payloadSummary: string;
  errorDetails?: string;
  createdAt: string;
}

export interface ChannelManagerAdapter {
  channel: OTAChannel;
  name: string;
  connect(connection: OTAConnection): Promise<boolean>;
  pushRates(mapping: OTAUnitMapping, rates: DateRate[]): Promise<SyncResult>;
  pushAvailability(mapping: OTAUnitMapping, availability: DateAvailability[]): Promise<SyncResult>;
  pullBookings(sinceDate: string): Promise<OTABooking[]>;
  cancelBooking(otaBookingId: string): Promise<SyncResult>;
  checkRateParity(mapping: OTAUnitMapping, dates: string[], directRates: Record<string, number>): Promise<RateParityItem[]>;
}

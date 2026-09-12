import type {
  OTAChannel,
  OTAConnection,
  OTAUnitMapping,
  DateRate,
  DateAvailability,
  OTABooking,
  SyncResult,
  RateParityItem,
  ChannelManagerAdapter,
} from "../types";

export abstract class BaseOTAAdapter implements ChannelManagerAdapter {
  abstract channel: OTAChannel;
  abstract name: string;
  protected connection?: OTAConnection;

  async connect(connection: OTAConnection): Promise<boolean> {
    this.connection = connection;
    return true;
  }

  protected applyMarkup(rate: number, markupPercent: number): number {
    if (!markupPercent || markupPercent === 0) return rate;
    return Math.round(rate * (1 + markupPercent / 100));
  }

  abstract pushRates(mapping: OTAUnitMapping, rates: DateRate[]): Promise<SyncResult>;
  abstract pushAvailability(mapping: OTAUnitMapping, availability: DateAvailability[]): Promise<SyncResult>;
  abstract pullBookings(sinceDate: string): Promise<OTABooking[]>;
  abstract cancelBooking(otaBookingId: string): Promise<SyncResult>;
  abstract checkRateParity(
    mapping: OTAUnitMapping,
    dates: string[],
    directRates: Record<string, number>
  ): Promise<RateParityItem[]>;
}

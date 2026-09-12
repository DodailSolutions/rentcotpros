import { BaseOTAAdapter } from "./base-adapter";
import type {
  OTAChannel,
  OTAUnitMapping,
  DateRate,
  DateAvailability,
  OTABooking,
  SyncResult,
  RateParityItem,
} from "../types";

export class MockOTAAdapter extends BaseOTAAdapter {
  channel: OTAChannel;
  name: string;

  // In-memory simulation store
  private ratesStore: Map<string, number> = new Map();
  private availabilityStore: Map<string, number> = new Map();
  private mockBookings: OTABooking[] = [];

  constructor(channel: OTAChannel = "mock_sandbox", name: string = "Sandbox Simulator") {
    super();
    this.channel = channel;
    this.name = name;
  }

  async pushRates(mapping: OTAUnitMapping, rates: DateRate[]): Promise<SyncResult> {
    const start = Date.now();
    for (const r of rates) {
      const finalRate = this.applyMarkup(r.rate, mapping.rateMarkupPercent);
      const key = `${mapping.otaRoomTypeId}_${r.date}`;
      this.ratesStore.set(key, finalRate);
    }

    return {
      channel: this.channel,
      direction: "push_rates",
      status: "success",
      recordsSynced: rates.length,
      latencyMs: Date.now() - start + 45,
      summary: `Successfully pushed ${rates.length} dates to ${this.name} for ${mapping.unitTypeName} (Markup: +${mapping.rateMarkupPercent}%)`,
      timestamp: new Date().toISOString(),
    };
  }

  async pushAvailability(mapping: OTAUnitMapping, availability: DateAvailability[]): Promise<SyncResult> {
    const start = Date.now();
    for (const a of availability) {
      const key = `${mapping.otaRoomTypeId}_${a.date}`;
      this.availabilityStore.set(key, a.availableUnitsCount);
    }

    return {
      channel: this.channel,
      direction: "push_availability",
      status: "success",
      recordsSynced: availability.length,
      latencyMs: Date.now() - start + 38,
      summary: `Updated inventory availability for ${availability.length} dates on ${this.name}`,
      timestamp: new Date().toISOString(),
    };
  }

  async pullBookings(sinceDate: string): Promise<OTABooking[]> {
    // Generate simulated booking if store is empty
    if (this.mockBookings.length === 0) {
      this.mockBookings.push({
        otaBookingId: `${this.channel.toUpperCase()}-RES-7492`,
        channel: this.channel,
        propertyId: this.connection?.propertyId || "prop-1",
        unitTypeId: "ut-cottage",
        guestName: "Arjun Verma",
        guestEmail: "arjun.verma@example.com",
        guestPhone: "+91 98112 34567",
        checkInDate: "2026-09-22",
        checkOutDate: "2026-09-24",
        adultsCount: 2,
        childrenCount: 0,
        totalPayout: 11000,
        currency: "INR",
        createdAt: new Date().toISOString(),
        status: "confirmed",
        specialRequests: "Arriving late by 8 PM. Quiet room preferred.",
      });
    }

    return this.mockBookings;
  }

  async cancelBooking(otaBookingId: string): Promise<SyncResult> {
    const start = Date.now();
    this.mockBookings = this.mockBookings.filter((b) => b.otaBookingId !== otaBookingId);

    return {
      channel: this.channel,
      direction: "pull_cancellations",
      status: "success",
      recordsSynced: 1,
      latencyMs: Date.now() - start + 25,
      summary: `Booking ${otaBookingId} canceled on ${this.name}. Inventory reopened.`,
      timestamp: new Date().toISOString(),
    };
  }

  async checkRateParity(
    mapping: OTAUnitMapping,
    dates: string[],
    directRates: Record<string, number>
  ): Promise<RateParityItem[]> {
    const results: RateParityItem[] = [];

    for (const d of dates) {
      const direct = directRates[d] || 5000;
      const key = `${mapping.otaRoomTypeId}_${d}`;
      // Use pushed rate or simulate minor drift for parity detection
      let liveOtaRate = this.ratesStore.get(key);
      if (!liveOtaRate) {
        // Simulate a known discrepancy for demo/testing
        liveOtaRate = Math.round(direct * 0.92); // 8% cheaper on OTA
      }

      const diff = liveOtaRate - direct;
      const diffPercent = Math.round((diff / direct) * 100);

      let status: RateParityItem["status"] = "parity_match";
      let penaltyRisk: RateParityItem["penaltyRisk"] = "none";

      if (diff < -50) {
        status = "ota_undercut";
        penaltyRisk = "high";
      } else if (diff > 50) {
        status = "rentcot_cheaper";
        penaltyRisk = "medium";
      }

      results.push({
        date: d,
        channel: this.channel,
        unitTypeId: mapping.unitTypeId,
        unitTypeName: mapping.unitTypeName,
        rentcotDirectRate: direct,
        otaLiveRate: liveOtaRate,
        differenceAmount: diff,
        differencePercent: diffPercent,
        status,
        penaltyRisk,
      });
    }

    return results;
  }
}

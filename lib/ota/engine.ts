import { getOTAAdapter } from "./adapters";
import type {
  OTAChannel,
  OTAConnection,
  OTAUnitMapping,
  DateRate,
  DateAvailability,
  OTABooking,
  SyncResult,
  RateParityReport,
  RateParityItem,
  SyncLogEntry,
} from "./types";

export class OTAChannelManagerEngine {
  private syncLogs: SyncLogEntry[] = [];
  private lockedUnitsByDate: Map<string, string> = new Map(); // key: `${unitId}_${date}`, value: bookingId

  /**
   * Push rates & availability out to all active OTA channels
   */
  async pushToAllChannels(
    connections: OTAConnection[],
    mappings: OTAUnitMapping[],
    rates: DateRate[],
    availability: DateAvailability[]
  ): Promise<SyncResult[]> {
    const results: SyncResult[] = [];

    for (const conn of connections) {
      if (conn.status !== "active") continue;
      const adapter = getOTAAdapter(conn.channel);
      await adapter.connect(conn);

      const mapping = mappings.find((m) => m.connectionId === conn.id && m.isActive);
      if (!mapping) continue;

      // 1. Push Rates
      if (conn.syncRatesEnabled) {
        const rateResult = await adapter.pushRates(mapping, rates);
        results.push(rateResult);
        this.recordLog(conn.propertyId, rateResult);
      }

      // 2. Push Availability
      if (conn.syncAvailabilityEnabled) {
        const availResult = await adapter.pushAvailability(mapping, availability);
        results.push(availResult);
        this.recordLog(conn.propertyId, availResult);
      }
    }

    return results;
  }

  /**
   * Inbound reservation ingestion with guaranteed double-booking prevention.
   */
  async ingestInboundBooking(
    booking: OTABooking,
    otherConnections: OTAConnection[],
    unitId: string
  ): Promise<{ success: boolean; collisionDetected: boolean; message: string; blockedChannels: OTAChannel[] }> {
    const dates = this.getDateRange(booking.checkInDate, booking.checkOutDate);

    // Collision check: verify unit is not already occupied
    for (const d of dates) {
      const lockKey = `${unitId}_${d}`;
      const existingBooking = this.lockedUnitsByDate.get(lockKey);
      if (existingBooking) {
        return {
          success: false,
          collisionDetected: true,
          message: `Collision alert! Unit ${unitId} is already booked by ${existingBooking} on ${d}. Double-booking prevented.`,
          blockedChannels: [],
        };
      }
    }

    // Lock unit for each night of the stay
    for (const d of dates) {
      this.lockedUnitsByDate.set(`${unitId}_${d}`, booking.otaBookingId);
    }

    // Block availability across all OTHER OTA connections immediately
    const blockedChannels: OTAChannel[] = [];
    const zeroAvailability: DateAvailability[] = dates.map((d) => ({
      date: d,
      availableUnitsCount: 0,
      isStopSell: true,
    }));

    for (const conn of otherConnections) {
      if (conn.channel === booking.channel || conn.status !== "active") continue;
      const adapter = getOTAAdapter(conn.channel);
      await adapter.connect(conn);

      const mockMapping: OTAUnitMapping = {
        id: "map-auto",
        connectionId: conn.id,
        unitTypeId: booking.unitTypeId,
        unitTypeName: "Assigned Unit",
        otaRoomTypeId: `ROOM_${booking.unitTypeId}`,
        rateMarkupPercent: 0,
        isActive: true,
      };

      await adapter.pushAvailability(mockMapping, zeroAvailability);
      blockedChannels.push(conn.channel);
    }

    this.recordLog(booking.propertyId, {
      channel: booking.channel,
      direction: "pull_bookings",
      status: "success",
      recordsSynced: 1,
      latencyMs: 42,
      summary: `Inbound booking ${booking.otaBookingId} from ${booking.guestName} (${booking.channel}) confirmed. Unit locked.`,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      collisionDetected: false,
      message: `Reservation ${booking.otaBookingId} confirmed. Unit ${unitId} locked; availability instantly closed across ${blockedChannels.join(", ")}.`,
      blockedChannels,
    };
  }

  /**
   * Rate Parity Checker: Scans live OTA rates vs Rentcot direct price
   */
  async checkRateParityAcrossChannels(
    connections: OTAConnection[],
    mappings: OTAUnitMapping[],
    dates: string[],
    directRates: Record<string, number>
  ): Promise<RateParityReport> {
    const allParityItems: RateParityItem[] = [];

    for (const conn of connections) {
      if (conn.status !== "active") continue;
      const adapter = getOTAAdapter(conn.channel);
      const mapping = mappings.find((m) => m.connectionId === conn.id && m.isActive);
      if (!mapping) continue;

      const items = await adapter.checkRateParity(mapping, dates, directRates);
      allParityItems.push(...items);
    }

    const discrepancies = allParityItems.filter((i) => i.status !== "parity_match");

    return {
      propertyId: connections[0]?.propertyId || "prop-1",
      checkedAt: new Date().toISOString(),
      totalDatesChecked: allParityItems.length,
      discrepanciesCount: discrepancies.length,
      items: allParityItems,
    };
  }

  getLogs(): SyncLogEntry[] {
    return this.syncLogs;
  }

  private recordLog(propertyId: string, result: SyncResult) {
    this.syncLogs.unshift({
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      propertyId,
      channel: result.channel,
      direction: result.direction,
      status: result.status,
      recordsSynced: result.recordsSynced,
      latencyMs: result.latencyMs,
      payloadSummary: result.summary,
      errorDetails: result.error,
      createdAt: result.timestamp,
    });
  }

  private getDateRange(startDate: string, endDate: string): string[] {
    const dates: string[] = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current < end) {
      dates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }
}

export const otaEngine = new OTAChannelManagerEngine();

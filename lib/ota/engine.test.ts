import { OTAChannelManagerEngine } from "./engine.ts";
import type { OTAConnection, OTAUnitMapping, DateRate, DateAvailability, OTABooking } from "./types.ts";

async function runOTATests() {
  console.log("=== RUNNING RENTCOT OTA CHANNEL MANAGER TESTS ===");
  const engine = new OTAChannelManagerEngine();

  const connections: OTAConnection[] = [
    {
      id: "conn-airbnb",
      organizationId: "org-1",
      propertyId: "prop-1",
      channel: "airbnb",
      hotelId: "ABNB_9874",
      syncRatesEnabled: true,
      syncAvailabilityEnabled: true,
      syncIntervalMinutes: 15,
      status: "active",
    },
    {
      id: "conn-bcom",
      organizationId: "org-1",
      propertyId: "prop-1",
      channel: "booking_com",
      hotelId: "BCOM_5541",
      syncRatesEnabled: true,
      syncAvailabilityEnabled: true,
      syncIntervalMinutes: 15,
      status: "active",
    },
    {
      id: "conn-mmt",
      organizationId: "org-1",
      propertyId: "prop-1",
      channel: "makemytrip",
      hotelId: "MMT_1029",
      syncRatesEnabled: true,
      syncAvailabilityEnabled: true,
      syncIntervalMinutes: 15,
      status: "active",
    },
    {
      id: "conn-agoda",
      organizationId: "org-1",
      propertyId: "prop-1",
      channel: "agoda",
      hotelId: "AGD_6619",
      syncRatesEnabled: true,
      syncAvailabilityEnabled: true,
      syncIntervalMinutes: 15,
      status: "active",
    },
  ];

  const mappings: OTAUnitMapping[] = [
    {
      id: "map-1",
      connectionId: "conn-airbnb",
      unitTypeId: "ut-cottage",
      unitTypeName: "Deluxe Lake View Cottage",
      otaRoomTypeId: "ABNB_ROOM_101",
      rateMarkupPercent: 12, // +12% markup
      isActive: true,
    },
    {
      id: "map-2",
      connectionId: "conn-bcom",
      unitTypeId: "ut-cottage",
      unitTypeName: "Deluxe Lake View Cottage",
      otaRoomTypeId: "BCOM_ROOM_101",
      rateMarkupPercent: 15, // +15% markup
      isActive: true,
    },
    {
      id: "map-3",
      connectionId: "conn-mmt",
      unitTypeId: "ut-cottage",
      unitTypeName: "Deluxe Lake View Cottage",
      otaRoomTypeId: "MMT_ROOM_101",
      rateMarkupPercent: 15, // +15% markup
      isActive: true,
    },
    {
      id: "map-4",
      connectionId: "conn-agoda",
      unitTypeId: "ut-cottage",
      unitTypeName: "Deluxe Lake View Cottage",
      otaRoomTypeId: "AGD_ROOM_101",
      rateMarkupPercent: 15,
      isActive: true,
    },
  ];

  const rates: DateRate[] = [
    { date: "2026-09-20", rate: 5000, currency: "INR" },
    { date: "2026-09-21", rate: 5000, currency: "INR" },
    { date: "2026-09-22", rate: 6500, currency: "INR" },
  ];

  const availability: DateAvailability[] = [
    { date: "2026-09-20", availableUnitsCount: 3 },
    { date: "2026-09-21", availableUnitsCount: 3 },
    { date: "2026-09-22", availableUnitsCount: 3 },
  ];

  // Test 1: Push Rates & Availability to all channels
  console.log("\n--- Test 1: Two-Way Push Rates & Availability ---");
  const pushResults = await engine.pushToAllChannels(connections, mappings, rates, availability);
  console.log(`Pushed to ${pushResults.length} channel endpoints successfully.`);
  if (pushResults.length !== 8) throw new Error(`Expected 8 push results, got ${pushResults.length}`);

  // Test 2: Inbound Booking & Double-Booking Prevention
  console.log("\n--- Test 2: Inbound Booking & Cross-Channel Availability Closure ---");
  const inboundBooking: OTABooking = {
    otaBookingId: "ABNB-99882",
    channel: "airbnb",
    propertyId: "prop-1",
    unitTypeId: "ut-cottage",
    guestName: "Rohit Sharma",
    checkInDate: "2026-09-20",
    checkOutDate: "2026-09-22", // 2 nights
    adultsCount: 2,
    childrenCount: 0,
    totalPayout: 11200,
    currency: "INR",
    createdAt: new Date().toISOString(),
    status: "confirmed",
  };

  const bookingRes = await engine.ingestInboundBooking(inboundBooking, connections, "UNIT-101");
  console.log("Booking Confirmed:", bookingRes.message);
  console.log("Blocked other channels:", bookingRes.blockedChannels);
  if (!bookingRes.success || bookingRes.collisionDetected) throw new Error("Test 2 Failed");

  // Test 3: Double-Booking Collision Detection
  console.log("\n--- Test 3: Collision Prevention (Attempt Double Booking) ---");
  const collisionBooking: OTABooking = {
    otaBookingId: "BCOM-55441",
    channel: "booking_com",
    propertyId: "prop-1",
    unitTypeId: "ut-cottage",
    guestName: "Neha Patel",
    checkInDate: "2026-09-21", // Collides with night of Sep 21!
    checkOutDate: "2026-09-23",
    adultsCount: 2,
    childrenCount: 0,
    totalPayout: 13000,
    currency: "INR",
    createdAt: new Date().toISOString(),
    status: "confirmed",
  };

  const collisionRes = await engine.ingestInboundBooking(collisionBooking, connections, "UNIT-101");
  console.log("Collision Result:", collisionRes.message);
  if (!collisionRes.collisionDetected || collisionRes.success) {
    throw new Error("Test 3 Failed: Collision was not detected!");
  }

  // Test 4: Rate Parity Checker
  console.log("\n--- Test 4: Rate Parity Watchdog ---");
  const directRates = {
    "2026-09-20": 5000,
    "2026-09-21": 5000,
    "2026-09-22": 6500,
  };
  const parityReport = await engine.checkRateParityAcrossChannels(
    connections,
    mappings,
    ["2026-09-20", "2026-09-21", "2026-09-22"],
    directRates
  );
  console.log("Total dates checked:", parityReport.totalDatesChecked);
  console.log("Discrepancies found:", parityReport.discrepanciesCount);
  console.log("Sample Parity Item:", parityReport.items[0]);
  if (parityReport.totalDatesChecked !== 12) throw new Error("Test 4 Failed");

  // Test 5: Sync Logs Audit
  console.log("\n--- Test 5: Sync Event Audit Log ---");
  const logs = engine.getLogs();
  console.log(`Total Sync Audit Logs Recorded: ${logs.length}`);
  if (logs.length < 9) throw new Error("Test 5 Failed: Logs missing");

  console.log("\n>>> ALL OTA CHANNEL MANAGER TESTS PASSED SUCCESSFULLY! <<<\n");
}

runOTATests();

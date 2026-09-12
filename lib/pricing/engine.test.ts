import { calculateStayPrice } from "./engine.ts";
import {
  type RatePlan,
  type RateOverride,
  type CorporateRateCard,
  type DynamicPricingRule,
} from "./types.ts";

function runPricingTests() {
  console.log("=== RUNNING RENTCOT PRICING ENGINE TESTS ===");

  const standardNightlyPlan: RatePlan = {
    id: "rp_nightly",
    organizationId: "org_1",
    propertyId: "prop_1",
    unitTypeId: "ut_cottage",
    name: "Standard Best Available Rate",
    pricingType: "nightly",
    baseRate: 5000,
    extraAdultRate: 1000,
    extraChildRate: 500,
    weeklyDiscountPercent: 15,
    monthlyDiscountPercent: 30,
    petsAllowed: true,
    petFeeType: "flat_per_stay",
    petFeeAmount: 800,
    taxPercent: 12,
    minNights: 1,
    isActive: true,
  };

  const weekendAndFestivalOverrides: RateOverride[] = [
    {
      id: "ov_weekend",
      organizationId: "org_1",
      propertyId: "prop_1",
      name: "Weekend Surge",
      startDate: "2026-09-01",
      endDate: "2026-10-31",
      daysOfWeek: [5, 6], // Fri, Sat
      overrideType: "percent_increase",
      overrideValue: 20, // +20%
      reason: "weekend",
      isActive: true,
    },
    {
      id: "ov_diwali",
      organizationId: "org_1",
      propertyId: "prop_1",
      name: "Diwali Festival Peak",
      startDate: "2026-11-01",
      endDate: "2026-11-05",
      overrideType: "percent_increase",
      overrideValue: 50, // +50%
      reason: "festival",
      isActive: true,
    },
  ];

  // Test 1: Standard 2-night stay with Friday weekend surge
  console.log("\n--- Test 1: Standard Stay with Weekend Override ---");
  const res1 = calculateStayPrice({
    ratePlan: standardNightlyPlan,
    checkInDate: "2026-09-18", // Friday
    checkOutDate: "2026-09-20", // Sunday (2 nights: Fri, Sat)
    adultsCount: 3, // 1 extra adult
    childrenCount: 1, // 1 child
    petsCount: 1, // 1 pet
    overrides: weekendAndFestivalOverrides,
  });
  console.log("Total Nights:", res1.totalNights);
  console.log("Base Stay Amount (2 weekend nights @ 6000 each):", res1.baseStayAmount);
  console.log("Extra Adults Amount:", res1.extraAdultsAmount);
  console.log("Extra Children Amount:", res1.extraChildrenAmount);
  console.log("Pet Fee Amount:", res1.petFeeAmount);
  console.log("Subtotal:", res1.subtotal);
  console.log("Tax Amount (12%):", res1.taxAmount);
  console.log("Total Amount:", res1.totalAmount);
  if (res1.baseStayAmount !== 12000) throw new Error(`Test 1 Failed: Expected base 12000, got ${res1.baseStayAmount}`);

  // Test 2: Long Stay Weekly Discount (7 nights)
  console.log("\n--- Test 2: Long Stay Weekly Discount (7 nights) ---");
  const res2 = calculateStayPrice({
    ratePlan: standardNightlyPlan,
    checkInDate: "2026-09-01",
    checkOutDate: "2026-09-08", // 7 nights
    adultsCount: 2,
    childrenCount: 0,
    petsCount: 0,
  });
  console.log("Total Nights:", res2.totalNights);
  console.log("Base Stay (7 * 5000 = 35000):", res2.baseStayAmount);
  console.log("Weekly Discount (15% of 35000 = 5250):", res2.longStayDiscountAmount);
  console.log("Subtotal (35000 - 5250 = 29750):", res2.subtotal);
  if (res2.longStayDiscountAmount !== 5250) throw new Error("Test 2 Failed");

  // Test 3: Day-Picnic / Day-Use (10am - 6pm)
  console.log("\n--- Test 3: Day-Use Farmhouse Picnic Package ---");
  const dayUsePlan: RatePlan = {
    ...standardNightlyPlan,
    pricingType: "day_use",
    name: "Day Picnic Farmhouse Package (10AM - 6PM)",
    baseRate: 8000,
    extraAdultRate: 800,
    extraChildRate: 400,
  };
  const res3 = calculateStayPrice({
    ratePlan: dayUsePlan,
    checkInDate: "2026-09-15",
    adultsCount: 4, // 2 extra
    childrenCount: 2,
    petsCount: 0,
  });
  console.log("Day-Use Base:", res3.baseStayAmount);
  console.log("Extra Adults (2 * 800):", res3.extraAdultsAmount);
  console.log("Extra Children (2 * 400):", res3.extraChildrenAmount);
  console.log("Total:", res3.totalAmount);
  if (res3.subtotal !== 8000 + 1600 + 800) throw new Error("Test 3 Failed");

  // Test 4: Tents - Per Person Pricing
  console.log("\n--- Test 4: Campsite Tents (Per-Person Rate) ---");
  const tentPerPersonPlan: RatePlan = {
    ...standardNightlyPlan,
    pricingType: "tent_per_person",
    name: "Camping Tent Per Person Rate",
    baseRate: 1800, // per adult per night
    extraChildRate: 900,
    petsAllowed: true,
    petFeeType: "per_pet_per_night",
    petFeeAmount: 300,
  };
  const res4 = calculateStayPrice({
    ratePlan: tentPerPersonPlan,
    checkInDate: "2026-09-12",
    checkOutDate: "2026-09-13", // 1 night
    adultsCount: 4,
    childrenCount: 2,
    petsCount: 2,
  });
  console.log("Adults cost (4 * 1800 = 7200):", res4.baseStayAmount);
  console.log("Children cost (2 * 900 = 1800):", res4.extraChildrenAmount);
  console.log("Pets cost (2 * 300 = 600):", res4.petFeeAmount);
  console.log("Subtotal (7200 + 1800 + 600 = 9600):", res4.subtotal);
  if (res4.subtotal !== 9600) throw new Error("Test 4 Failed");

  // Test 5: Dynamic Pricing (Surge on >=80% occupancy & Distress discount <30% within 3 days)
  console.log("\n--- Test 5: Rule-Based Dynamic Pricing ---");
  const dynamicRules: DynamicPricingRule[] = [
    {
      id: "rule_high_occ",
      organizationId: "org_1",
      propertyId: "prop_1",
      name: "High Demand Surge (>80% Occ)",
      occupancyOperator: ">=",
      occupancyPercent: 80,
      adjustmentPercent: 20, // +20% surge
      isActive: true,
    },
    {
      id: "rule_last_minute",
      organizationId: "org_1",
      propertyId: "prop_1",
      name: "Last Minute Deal (<30% within 3 days)",
      occupancyOperator: "<=",
      occupancyPercent: 30,
      daysBeforeArrivalMax: 3,
      adjustmentPercent: -25, // -25% discount
      isActive: true,
    },
  ];

  // 5a. Surge Test
  const resSurge = calculateStayPrice({
    ratePlan: standardNightlyPlan,
    checkInDate: "2026-09-15",
    checkOutDate: "2026-09-16",
    adultsCount: 2,
    childrenCount: 0,
    petsCount: 0,
    dynamicRules,
    currentOccupancyPercent: 88, // > 80% triggers surge
  });
  console.log("Surge Adjustment (+20% of 5000 = +1000):", resSurge.dynamicAdjustmentAmount);
  if (resSurge.dynamicAdjustmentAmount !== 1000) throw new Error("Test 5a Failed");

  // 5b. Last minute discount Test
  const resDiscount = calculateStayPrice({
    ratePlan: standardNightlyPlan,
    checkInDate: "2026-09-15",
    checkOutDate: "2026-09-16",
    adultsCount: 2,
    childrenCount: 0,
    petsCount: 0,
    dynamicRules,
    currentOccupancyPercent: 25, // <= 30%
    bookingLeadDays: 2, // <= 3 days triggers discount
  });
  console.log("Last-Minute Discount (-25% of 5000 = -1250):", resDiscount.dynamicAdjustmentAmount);
  if (resDiscount.dynamicAdjustmentAmount !== -1250) throw new Error("Test 5b Failed");

  // Test 6: Corporate Rate Card
  console.log("\n--- Test 6: Corporate B2B Rate Card ---");
  const corpCard: CorporateRateCard = {
    id: "card_tcs",
    organizationId: "org_1",
    propertyId: "prop_1",
    clientName: "Tata Consultancy Services (TCS)",
    corporateCode: "TCS_CORP_2026",
    discountType: "percent_decrease",
    discountValue: 20, // 20% corporate discount
    validFrom: "2026-01-01",
    validUntil: "2026-12-31",
    isActive: true,
  };
  const resCorp = calculateStayPrice({
    ratePlan: standardNightlyPlan,
    checkInDate: "2026-09-15",
    checkOutDate: "2026-09-16",
    adultsCount: 2,
    childrenCount: 0,
    petsCount: 0,
    corporateCard: corpCard,
  });
  console.log("Corporate Discount (20% of 5000 = 1000):", resCorp.corporateDiscountAmount);
  console.log("Subtotal (5000 - 1000 = 4000):", resCorp.subtotal);
  if (resCorp.corporateDiscountAmount !== 1000) throw new Error("Test 6 Failed");

  console.log("\n>>> ALL PRICING ENGINE TESTS PASSED SUCCESSFULLY! <<<\n");
}

runPricingTests();

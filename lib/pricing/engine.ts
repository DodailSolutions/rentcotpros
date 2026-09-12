import type {
  PricingCalculationParams,
  PriceBreakdown,
  NightlyCostDetail,
  RateOverride,
} from "./types";

/**
 * Rentcot Centralized Pricing Engine
 * Shared across Direct Booking, OTA Sync, POS, and Day-Picnic modules.
 */
export function calculateStayPrice(params: PricingCalculationParams): PriceBreakdown {
  const {
    ratePlan,
    checkInDate,
    checkOutDate,
    hoursDuration = 0,
    adultsCount,
    childrenCount,
    petsCount,
    baseIncludedAdults = 2,
    overrides = [],
    corporateCard,
    dynamicRules = [],
    currentOccupancyPercent = 0,
    bookingLeadDays = 14,
  } = params;

  // 1. Hourly Calculation
  if (ratePlan.pricingType === "hourly") {
    const minHours = ratePlan.minHours || 2;
    const duration = Math.max(hoursDuration, minHours);
    const hourlyRate = ratePlan.pricePerHour || ratePlan.baseRate / 6;
    const baseStayAmount = duration * hourlyRate;

    const extraAdults = Math.max(0, adultsCount - baseIncludedAdults);
    const extraAdultsAmount = extraAdults * (ratePlan.extraAdultRate * 0.5); // Hourly extra guest discount
    const extraChildrenAmount = childrenCount * (ratePlan.extraChildRate * 0.5);

    let petFeeAmount = 0;
    if (ratePlan.petsAllowed && petsCount > 0) {
      petFeeAmount = ratePlan.petFeeAmount; // Flat pet fee for hourly
    }

    let subtotal = baseStayAmount + extraAdultsAmount + extraChildrenAmount + petFeeAmount;

    // Corporate Card
    let corporateDiscountName: string | undefined;
    let corporateDiscountAmount = 0;
    if (corporateCard && corporateCard.isActive) {
      corporateDiscountName = corporateCard.clientName;
      if (corporateCard.discountType === "percent_decrease") {
        corporateDiscountAmount = subtotal * (corporateCard.discountValue / 100);
      } else {
        corporateDiscountAmount = corporateCard.discountValue;
      }
      subtotal = Math.max(0, subtotal - corporateDiscountAmount);
    }

    const taxAmount = Math.round(subtotal * (ratePlan.taxPercent / 100));
    const totalAmount = Math.round(subtotal + taxAmount);

    return {
      pricingType: "hourly",
      totalNights: 0,
      totalHours: duration,
      nightlyDetails: [],
      baseStayAmount,
      extraAdultsAmount,
      extraChildrenAmount,
      petFeeAmount,
      corporateDiscountName,
      corporateDiscountAmount,
      longStayDiscountAmount: 0,
      dynamicAdjustmentAmount: 0,
      subtotal,
      taxPercent: ratePlan.taxPercent,
      taxAmount,
      totalAmount,
      averageRatePerNightOrHour: hourlyRate,
      currency: "INR",
    };
  }

  // 2. Day-Use / Day-Picnic (10:00 AM - 06:00 PM)
  if (ratePlan.pricingType === "day_use") {
    const baseStayAmount = ratePlan.baseRate;
    const extraAdults = Math.max(0, adultsCount - baseIncludedAdults);
    const extraAdultsAmount = extraAdults * ratePlan.extraAdultRate;
    const extraChildrenAmount = childrenCount * ratePlan.extraChildRate;

    let petFeeAmount = 0;
    if (ratePlan.petsAllowed && petsCount > 0) {
      petFeeAmount = ratePlan.petFeeAmount;
    }

    let subtotal = baseStayAmount + extraAdultsAmount + extraChildrenAmount + petFeeAmount;

    // Corporate Card
    let corporateDiscountName: string | undefined;
    let corporateDiscountAmount = 0;
    if (corporateCard && corporateCard.isActive) {
      corporateDiscountName = corporateCard.clientName;
      if (corporateCard.discountType === "percent_decrease") {
        corporateDiscountAmount = subtotal * (corporateCard.discountValue / 100);
      } else {
        corporateDiscountAmount = corporateCard.discountValue;
      }
      subtotal = Math.max(0, subtotal - corporateDiscountAmount);
    }

    const taxAmount = Math.round(subtotal * (ratePlan.taxPercent / 100));
    const totalAmount = Math.round(subtotal + taxAmount);

    return {
      pricingType: "day_use",
      totalNights: 0,
      totalHours: 8,
      nightlyDetails: [],
      baseStayAmount,
      extraAdultsAmount,
      extraChildrenAmount,
      petFeeAmount,
      corporateDiscountName,
      corporateDiscountAmount,
      longStayDiscountAmount: 0,
      dynamicAdjustmentAmount: 0,
      subtotal,
      taxPercent: ratePlan.taxPercent,
      taxAmount,
      totalAmount,
      averageRatePerNightOrHour: baseStayAmount,
      currency: "INR",
    };
  }

  // 3. Overnight Stays: Nightly, Tent Flat, or Tent Per-Person
  if (!checkOutDate) {
    throw new Error("checkOutDate is required for overnight pricing calculation");
  }

  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const totalNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const nightlyDetails: NightlyCostDetail[] = [];
  let baseStayAmount = 0;

  // Iterate each night of the stay
  for (let i = 0; i < totalNights; i++) {
    const currentNight = new Date(start);
    currentNight.setDate(start.getDate() + i);
    const dateStr = currentNight.toISOString().split("T")[0];
    const dayOfWeek = currentNight.getDay(); // 0 = Sunday, 5 = Friday, 6 = Saturday
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;

    let effectiveRate = ratePlan.baseRate;
    let appliedOverride: RateOverride | undefined;

    // Check for applicable rate overrides (Festival, Weekend, Seasonal)
    for (const ov of overrides) {
      if (!ov.isActive) continue;
      const ovStart = new Date(ov.startDate);
      const ovEnd = new Date(ov.endDate);

      if (currentNight >= ovStart && currentNight <= ovEnd) {
        if (!ov.daysOfWeek || ov.daysOfWeek.length === 0 || ov.daysOfWeek.includes(dayOfWeek)) {
          appliedOverride = ov;
          break; // First matching override takes precedence
        }
      }
    }

    let overrideAdjustment = 0;
    if (appliedOverride) {
      if (appliedOverride.overrideType === "percent_increase") {
        overrideAdjustment = (effectiveRate * appliedOverride.overrideValue) / 100;
        effectiveRate += overrideAdjustment;
      } else if (appliedOverride.overrideType === "percent_decrease") {
        overrideAdjustment = -(effectiveRate * appliedOverride.overrideValue) / 100;
        effectiveRate = Math.max(0, effectiveRate + overrideAdjustment);
      } else if (appliedOverride.overrideType === "fixed_rate") {
        overrideAdjustment = appliedOverride.overrideValue - effectiveRate;
        effectiveRate = appliedOverride.overrideValue;
      }
    }

    // Special tent per-person calculation
    if (ratePlan.pricingType === "tent_per_person") {
      effectiveRate = effectiveRate * adultsCount;
    }

    nightlyDetails.push({
      date: dateStr,
      baseRate: ratePlan.baseRate,
      appliedOverrideName: appliedOverride ? appliedOverride.name : undefined,
      overrideAdjustment,
      effectiveNightlyRate: effectiveRate,
      isWeekend,
    });

    baseStayAmount += effectiveRate;
  }

  // Extra Guests Calculation
  let extraAdultsAmount = 0;
  let extraChildrenAmount = 0;

  if (ratePlan.pricingType !== "tent_per_person") {
    const extraAdults = Math.max(0, adultsCount - baseIncludedAdults);
    extraAdultsAmount = extraAdults * ratePlan.extraAdultRate * totalNights;
    extraChildrenAmount = childrenCount * ratePlan.extraChildRate * totalNights;
  } else {
    // For tent per-person, children extra rate
    extraChildrenAmount = childrenCount * ratePlan.extraChildRate * totalNights;
  }

  // Pet Policy Fee Calculation
  let petFeeAmount = 0;
  if (ratePlan.petsAllowed && petsCount > 0 && ratePlan.petFeeType !== "none") {
    if (ratePlan.petFeeType === "flat_per_stay") {
      petFeeAmount = ratePlan.petFeeAmount;
    } else if (ratePlan.petFeeType === "per_pet_per_night") {
      petFeeAmount = ratePlan.petFeeAmount * petsCount * totalNights;
    }
  }

  // Calculate gross stay sum before discounts
  let grossStay = baseStayAmount + extraAdultsAmount + extraChildrenAmount + petFeeAmount;

  // Long-Stay Discounts: Weekly (>= 7 nights) or Monthly (>= 28 nights)
  let longStayDiscountName: string | undefined;
  let longStayDiscountAmount = 0;

  if (totalNights >= 28 && ratePlan.monthlyDiscountPercent > 0) {
    longStayDiscountName = `Monthly Stay Discount (${ratePlan.monthlyDiscountPercent}%)`;
    longStayDiscountAmount = Math.round(baseStayAmount * (ratePlan.monthlyDiscountPercent / 100));
  } else if (totalNights >= 7 && ratePlan.weeklyDiscountPercent > 0) {
    longStayDiscountName = `Weekly Stay Discount (${ratePlan.weeklyDiscountPercent}%)`;
    longStayDiscountAmount = Math.round(baseStayAmount * (ratePlan.weeklyDiscountPercent / 100));
  }

  let subtotal = grossStay - longStayDiscountAmount;

  // Corporate Rate Card Application
  let corporateDiscountName: string | undefined;
  let corporateDiscountAmount = 0;

  if (corporateCard && corporateCard.isActive) {
    corporateDiscountName = `${corporateCard.clientName} (${corporateCard.corporateCode})`;
    if (corporateCard.discountType === "percent_decrease") {
      corporateDiscountAmount = Math.round(subtotal * (corporateCard.discountValue / 100));
    } else {
      corporateDiscountAmount = corporateCard.discountValue;
    }
    subtotal = Math.max(0, subtotal - corporateDiscountAmount);
  }

  // Demand-Based Dynamic Pricing (Rule-Based Surge or Distress Discount)
  let dynamicAdjustmentName: string | undefined;
  let dynamicAdjustmentAmount = 0;

  for (const rule of dynamicRules) {
    if (!rule.isActive) continue;

    let triggerMet = false;
    if (rule.occupancyOperator === ">=" && currentOccupancyPercent >= rule.occupancyPercent) {
      triggerMet = true;
    } else if (rule.occupancyOperator === "<=" && currentOccupancyPercent <= rule.occupancyPercent) {
      if (rule.daysBeforeArrivalMax == null || bookingLeadDays <= rule.daysBeforeArrivalMax) {
        triggerMet = true;
      }
    }

    if (triggerMet) {
      dynamicAdjustmentName = rule.name;
      dynamicAdjustmentAmount = Math.round(baseStayAmount * (rule.adjustmentPercent / 100));
      subtotal = Math.max(0, subtotal + dynamicAdjustmentAmount);
      break; // Apply highest priority rule
    }
  }

  // Taxes
  const taxAmount = Math.round(subtotal * (ratePlan.taxPercent / 100));
  const totalAmount = Math.round(subtotal + taxAmount);

  return {
    pricingType: ratePlan.pricingType,
    totalNights,
    nightlyDetails,
    baseStayAmount,
    extraAdultsAmount,
    extraChildrenAmount,
    petFeeAmount,
    longStayDiscountName,
    longStayDiscountAmount,
    corporateDiscountName,
    corporateDiscountAmount,
    dynamicAdjustmentName,
    dynamicAdjustmentAmount,
    subtotal,
    taxPercent: ratePlan.taxPercent,
    taxAmount,
    totalAmount,
    averageRatePerNightOrHour: Math.round(subtotal / totalNights),
    currency: "INR",
  };
}

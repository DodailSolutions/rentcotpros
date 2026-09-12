"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { calculateStayPrice } from "@/lib/pricing/engine";
import {
  type RatePlan,
  type RateOverride,
  type CorporateRateCard,
  type DynamicPricingRule,
  type PriceBreakdown,
} from "@/lib/pricing/types";
import {
  CalendarDays,
  TrendingUp,
  Sparkles,
  Plus,
  Percent,
  Zap,
  Building2,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Briefcase,
  SunMedium,
  Moon,
  Clock,
  Tent,
  PawPrint,
  Check,
  Flame,
} from "lucide-react";

export default function PricingEnginePage() {
  const { t } = useTranslation();

  // Active Rate Plans
  const [ratePlans, setRatePlans] = useState<RatePlan[]>([
    {
      id: "rp-1",
      organizationId: "org-1",
      propertyId: "prop-1",
      unitTypeId: "ut-cottage",
      name: "Deluxe Lake View Cottage (Overnight)",
      pricingType: "nightly",
      baseRate: 5500,
      extraAdultRate: 1200,
      extraChildRate: 600,
      weeklyDiscountPercent: 15,
      monthlyDiscountPercent: 30,
      petsAllowed: true,
      petFeeType: "flat_per_stay",
      petFeeAmount: 750,
      taxPercent: 12,
      minNights: 1,
      isActive: true,
    },
    {
      id: "rp-2",
      organizationId: "org-1",
      propertyId: "prop-2",
      unitTypeId: "ut-dome",
      name: "Wildwoods Glamping Dome (Per Person / Tent)",
      pricingType: "tent_per_person",
      baseRate: 2200,
      extraAdultRate: 2200,
      extraChildRate: 1100,
      weeklyDiscountPercent: 10,
      monthlyDiscountPercent: 20,
      petsAllowed: true,
      petFeeType: "per_pet_per_night",
      petFeeAmount: 400,
      taxPercent: 12,
      minNights: 1,
      isActive: true,
    },
    {
      id: "rp-3",
      organizationId: "org-1",
      propertyId: "prop-1",
      unitTypeId: "ut-farmhouse",
      name: "Green Valley Farmhouse Day Picnic (10AM–6PM)",
      pricingType: "day_use",
      baseRate: 9500,
      extraAdultRate: 750,
      extraChildRate: 350,
      weeklyDiscountPercent: 0,
      monthlyDiscountPercent: 0,
      petsAllowed: true,
      petFeeType: "flat_per_stay",
      petFeeAmount: 500,
      taxPercent: 12,
      minNights: 1,
      isActive: true,
    },
    {
      id: "rp-4",
      organizationId: "org-1",
      propertyId: "prop-3",
      unitTypeId: "ut-suite",
      name: "Executive Suite (Hourly Resting / Photoshoot)",
      pricingType: "hourly",
      baseRate: 1800,
      pricePerHour: 900,
      minHours: 3,
      extraAdultRate: 400,
      extraChildRate: 200,
      weeklyDiscountPercent: 0,
      monthlyDiscountPercent: 0,
      petsAllowed: false,
      petFeeType: "none",
      petFeeAmount: 0,
      taxPercent: 12,
      minNights: 1,
      isActive: true,
    },
  ]);

  const [selectedPlanId, setSelectedPlanId] = useState<string>("rp-1");
  const selectedPlan = ratePlans.find((p) => p.id === selectedPlanId) || ratePlans[0];

  // Overrides State
  const [overrides, setOverrides] = useState<RateOverride[]>([
    {
      id: "ov-1",
      organizationId: "org-1",
      propertyId: "prop-1",
      name: "Weekend Friday & Saturday Surge",
      startDate: "2026-09-01",
      endDate: "2026-10-31",
      daysOfWeek: [5, 6],
      overrideType: "percent_increase",
      overrideValue: 20,
      reason: "weekend",
      isActive: true,
    },
    {
      id: "ov-2",
      organizationId: "org-1",
      propertyId: "prop-1",
      name: "Gandhi Jayanti Long Weekend",
      startDate: "2026-10-02",
      endDate: "2026-10-04",
      daysOfWeek: [],
      overrideType: "percent_increase",
      overrideValue: 35,
      reason: "long_weekend",
      isActive: true,
    },
    {
      id: "ov-3",
      organizationId: "org-1",
      propertyId: "prop-1",
      name: "Diwali Festival Peak Surcharge",
      startDate: "2026-11-08",
      endDate: "2026-11-13",
      daysOfWeek: [],
      overrideType: "percent_increase",
      overrideValue: 50,
      reason: "festival",
      isActive: true,
    },
  ]);

  // Corporate Rate Cards
  const [corporateCards, setCorporateCards] = useState<CorporateRateCard[]>([
    {
      id: "corp-1",
      organizationId: "org-1",
      propertyId: "prop-1",
      clientName: "Tata Consultancy Services (TCS)",
      corporateCode: "TCS2026",
      discountType: "percent_decrease",
      discountValue: 20,
      validFrom: "2026-01-01",
      validUntil: "2026-12-31",
      isActive: true,
    },
    {
      id: "corp-2",
      organizationId: "org-1",
      propertyId: "prop-1",
      clientName: "MakeMyTrip B2B Partner Rate",
      corporateCode: "MMT_PREFERRED",
      discountType: "percent_decrease",
      discountValue: 15,
      validFrom: "2026-01-01",
      validUntil: "2026-12-31",
      isActive: true,
    },
  ]);

  // Dynamic Pricing Rules
  const [dynamicRules, setDynamicRules] = useState<DynamicPricingRule[]>([
    {
      id: "dr-1",
      organizationId: "org-1",
      propertyId: "prop-1",
      name: "High Demand Surge (>80% Occupancy)",
      occupancyOperator: ">=",
      occupancyPercent: 80,
      adjustmentPercent: 20,
      isActive: true,
    },
    {
      id: "dr-2",
      organizationId: "org-1",
      propertyId: "prop-1",
      name: "Last-Minute Distress Sale (<30% Occupancy within 3 days)",
      occupancyOperator: "<=",
      occupancyPercent: 30,
      daysBeforeArrivalMax: 3,
      adjustmentPercent: -20,
      isActive: true,
    },
  ]);

  // Calendar dates mock (14 consecutive days starting from Sep 14, 2026)
  const calendarDays = Array.from({ length: 14 }).map((_, idx) => {
    const d = new Date(2026, 8, 14 + idx);
    const dateStr = d.toISOString().split("T")[0];
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const isWeekend = d.getDay() === 5 || d.getDay() === 6;
    const occupancy = [65, 55, 70, 85, 95, 90, 60, 45, 50, 75, 88, 92, 70, 65][idx];
    
    // Check if weekend surge applies
    const isSurge = occupancy >= 80;
    let price = selectedPlan.baseRate;
    if (isWeekend) price = Math.round(price * 1.2);
    if (isSurge) price = Math.round(price * 1.2);

    return {
      date: dateStr,
      dayNum: d.getDate(),
      dayName,
      isWeekend,
      occupancy,
      price,
      isSurge,
    };
  });

  // Simulator Form State
  const [simCheckIn, setSimCheckIn] = useState("2026-09-18");
  const [simCheckOut, setSimCheckOut] = useState("2026-09-20");
  const [simHours, setSimHours] = useState(4);
  const [simAdults, setSimAdults] = useState(2);
  const [simChildren, setSimChildren] = useState(1);
  const [simPets, setSimPets] = useState(1);
  const [simCorpCode, setSimCorpCode] = useState("");
  const [simOccupancy, setSimOccupancy] = useState(85);

  const matchedCorpCard = corporateCards.find(
    (c) => c.corporateCode.toLowerCase() === simCorpCode.trim().toLowerCase()
  );

  // Live calculation output
  const calculationResult: PriceBreakdown = calculateStayPrice({
    ratePlan: selectedPlan,
    checkInDate: simCheckIn,
    checkOutDate: selectedPlan.pricingType === "nightly" || selectedPlan.pricingType === "tent_per_person" ? simCheckOut : undefined,
    hoursDuration: simHours,
    adultsCount: simAdults,
    childrenCount: simChildren,
    petsCount: simPets,
    overrides,
    corporateCard: matchedCorpCard,
    dynamicRules,
    currentOccupancyPercent: simOccupancy,
    bookingLeadDays: 4,
  });

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Pricing Engine & Rate Plans
            </h1>
            <Badge variant="clean" className="flex items-center gap-1 text-[11px] font-semibold">
              <Zap className="h-3 w-3 text-emerald-600" />
              Dynamic Rules Active
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Manage hourly, overnight, day-picnic, tent-per-person, corporate cards, and seasonal overrides
          </p>
        </div>

        {/* Rate Plan Selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedPlanId}
            onChange={(e) => setSelectedPlanId(e.target.value)}
            className="h-11 rounded-lg border border-input bg-card px-3 text-xs font-semibold text-foreground focus:ring-2 focus:ring-rentcot-blue"
          >
            {ratePlans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-2xl">
          <TabsTrigger value="calendar" className="text-xs gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            Pricing Calendar
          </TabsTrigger>
          <TabsTrigger value="simulator" className="text-xs gap-1.5">
            <Calculator className="h-3.5 w-3.5" />
            Quote Simulator
          </TabsTrigger>
          <TabsTrigger value="overrides" className="text-xs gap-1.5">
            <TrendingUp className="h-3.5 w-3.5" />
            Overrides & Surge
          </TabsTrigger>
          <TabsTrigger value="corporate" className="text-xs gap-1.5">
            <Briefcase className="h-3.5 w-3.5" />
            Corporate Cards
          </TabsTrigger>
        </TabsList>

        {/* 1. Swipeable Pricing Calendar Matrix */}
        <TabsContent value="calendar" className="pt-4 space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    {selectedPlan.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Base rate: ₹{selectedPlan.baseRate.toLocaleString()} &bull; Type:{" "}
                    <span className="font-semibold uppercase text-rentcot-blue">{selectedPlan.pricingType.replace("_", " ")}</span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Normal
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Weekend (+20%)
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Demand Surge
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Swipeable Calendar Strip */}
              <div className="overflow-x-auto pb-3">
                <div className="flex gap-2.5 min-w-[700px]">
                  {calendarDays.map((day) => (
                    <div
                      key={day.date}
                      className={`flex-1 min-w-[90px] p-3 rounded-xl border transition-all text-center space-y-1.5 ${
                        day.isSurge
                          ? "border-rose-300 bg-rose-50/50 dark:bg-rose-950/20"
                          : day.isWeekend
                          ? "border-amber-300 bg-amber-50/50 dark:bg-amber-950/20"
                          : "border-border bg-card hover:border-rentcot-blue/40"
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                        {day.dayName}
                      </span>
                      <strong className="text-sm font-extrabold text-foreground block">
                        {day.dayNum} Sep
                      </strong>
                      <div className="pt-1">
                        <span className="text-xs font-bold text-rentcot-blue block">
                          ₹{day.price.toLocaleString()}
                        </span>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <span className="text-[9px] font-mono text-muted-foreground">
                            {day.occupancy}% occ
                          </span>
                        </div>
                      </div>
                      {day.isSurge && (
                        <Badge variant="dirty" className="text-[9px] px-1 py-0 block truncate">
                          Surge
                        </Badge>
                      )}
                      {day.isWeekend && !day.isSurge && (
                        <Badge variant="occupied" className="text-[9px] px-1 py-0 block truncate">
                          Weekend
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rate Plan Metadata Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-border shadow-2xs">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rentcot-blue/10 text-rentcot-blue">
                  <Percent className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Long-Stay Discounts</span>
                  <span className="text-sm font-bold text-foreground">
                    {selectedPlan.weeklyDiscountPercent}% Weekly &bull; {selectedPlan.monthlyDiscountPercent}% Monthly
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-2xs">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  <PawPrint className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Pet Friendly Policy</span>
                  <span className="text-sm font-bold text-foreground">
                    {selectedPlan.petsAllowed
                      ? `Allowed (₹${selectedPlan.petFeeAmount} ${selectedPlan.petFeeType.replace(/_/g, " ")})`
                      : "Not Allowed"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-2xs">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Extra Guests</span>
                  <span className="text-sm font-bold text-foreground">
                    +₹{selectedPlan.extraAdultRate} Adult &bull; +₹{selectedPlan.extraChildRate} Child
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 2. Interactive Live Quote Simulator */}
        <TabsContent value="simulator" className="pt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Controls */}
            <Card className="lg:col-span-6 border-border shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-bold">Front-Desk Quote Simulator</CardTitle>
                <CardDescription className="text-xs">
                  Test live calculations across any combination of dates, guests, pets, and promo codes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPlan.pricingType === "hourly" ? (
                  <div className="space-y-1.5">
                    <Label>Duration (Hours)</Label>
                    <Input
                      type="number"
                      min={selectedPlan.minHours || 2}
                      value={simHours}
                      onChange={(e) => setSimHours(parseInt(e.target.value) || 2)}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Check-In Date</Label>
                      <Input
                        type="date"
                        value={simCheckIn}
                        onChange={(e) => setSimCheckIn(e.target.value)}
                      />
                    </div>
                    {selectedPlan.pricingType !== "day_use" && (
                      <div className="space-y-1.5">
                        <Label>Check-Out Date</Label>
                        <Input
                          type="date"
                          value={simCheckOut}
                          onChange={(e) => setSimCheckOut(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label>Adults</Label>
                    <Input
                      type="number"
                      min={1}
                      value={simAdults}
                      onChange={(e) => setSimAdults(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Children</Label>
                    <Input
                      type="number"
                      min={0}
                      value={simChildren}
                      onChange={(e) => setSimChildren(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Pets</Label>
                    <Input
                      type="number"
                      min={0}
                      value={simPets}
                      onChange={(e) => setSimPets(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Simulated Occupancy %</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={simOccupancy}
                      onChange={(e) => setSimOccupancy(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Corporate / Partner Code</Label>
                    <Input
                      placeholder="e.g. TCS2026"
                      value={simCorpCode}
                      onChange={(e) => setSimCorpCode(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Real-time Calculation Result */}
            <Card className="lg:col-span-6 border-border shadow-md bg-card">
              <CardHeader className="bg-muted/30 border-b border-border pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold">Itemized Pricing Breakdown</CardTitle>
                  <Badge variant="clean">Live Pure Calculation</Badge>
                </div>
                <CardDescription className="text-xs">
                  Zero channel drift: same formula applies to Direct, OTA & POS
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Base Stay ({calculationResult.totalNights > 0 ? `${calculationResult.totalNights} nights` : `${calculationResult.totalHours} hrs`}):
                    </span>
                    <span className="font-semibold text-foreground">
                      ₹{calculationResult.baseStayAmount.toLocaleString()}
                    </span>
                  </div>

                  {calculationResult.extraAdultsAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Extra Adults Surcharge:</span>
                      <span className="font-semibold">+₹{calculationResult.extraAdultsAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {calculationResult.extraChildrenAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Extra Children Surcharge:</span>
                      <span className="font-semibold">+₹{calculationResult.extraChildrenAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {calculationResult.petFeeAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pet Cleaning Fee:</span>
                      <span className="font-semibold">+₹{calculationResult.petFeeAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {calculationResult.longStayDiscountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>{calculationResult.longStayDiscountName}:</span>
                      <span>-₹{calculationResult.longStayDiscountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {calculationResult.corporateDiscountAmount > 0 && (
                    <div className="flex justify-between text-rentcot-blue font-semibold">
                      <span>Corporate B2B ({calculationResult.corporateDiscountName}):</span>
                      <span>-₹{calculationResult.corporateDiscountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {calculationResult.dynamicAdjustmentAmount !== 0 && (
                    <div className={`flex justify-between font-semibold ${
                      calculationResult.dynamicAdjustmentAmount > 0 ? "text-amber-600" : "text-emerald-600"
                    }`}>
                      <span>{calculationResult.dynamicAdjustmentName}:</span>
                      <span>
                        {calculationResult.dynamicAdjustmentAmount > 0 ? "+" : ""}
                        ₹{calculationResult.dynamicAdjustmentAmount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-border flex justify-between font-medium">
                    <span className="text-muted-foreground">Taxable Subtotal:</span>
                    <span>₹{calculationResult.subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-muted-foreground">
                    <span>GST / Taxes ({calculationResult.taxPercent}%):</span>
                    <span>₹{calculationResult.taxAmount.toLocaleString()}</span>
                  </div>

                  <div className="pt-3 border-t-2 border-border flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-bold text-foreground block">Grand Total:</span>
                      <span className="text-[11px] text-muted-foreground">
                        Avg ₹{calculationResult.averageRatePerNightOrHour.toLocaleString()} / {calculationResult.totalNights > 0 ? "night" : "hour"}
                      </span>
                    </div>
                    <span className="text-2xl font-extrabold text-rentcot-blue">
                      ₹{calculationResult.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 3. Overrides & Dynamic Surge Tab */}
        <TabsContent value="overrides" className="pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seasonal Overrides */}
            <Card className="border-border shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-base font-bold">Seasonal & Festival Overrides</CardTitle>
                  <CardDescription className="text-xs">Diwali, New Year, Long Weekends</CardDescription>
                </div>
                <Button size="sm" className="text-xs bg-rentcot-blue text-white gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  Add Override
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {overrides.map((ov) => (
                  <div
                    key={ov.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">{ov.name}</span>
                        <Badge variant="occupied" className="text-[10px]">
                          +{ov.overrideValue}%
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {ov.startDate} to {ov.endDate} &bull; {ov.daysOfWeek?.length ? "Weekends only" : "All days"}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={ov.isActive}
                      onChange={() => {
                        setOverrides((prev) =>
                          prev.map((o) => (o.id === ov.id ? { ...o, isActive: !o.isActive } : o))
                        );
                      }}
                      className="h-4 w-4 rounded text-rentcot-blue focus:ring-rentcot-blue"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Dynamic Pricing Rules */}
            <Card className="border-border shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-base font-bold">Demand-Based Dynamic Rules</CardTitle>
                  <CardDescription className="text-xs">Rule-based triggers without black-box drift</CardDescription>
                </div>
                <Button size="sm" variant="outline" className="text-xs gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  Add Rule
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {dynamicRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        <Zap className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">{rule.name}</span>
                          <Badge variant={rule.adjustmentPercent > 0 ? "occupied" : "clean"} className="text-[10px]">
                            {rule.adjustmentPercent > 0 ? `+${rule.adjustmentPercent}%` : `${rule.adjustmentPercent}%`}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          When Occupancy {rule.occupancyOperator} {rule.occupancyPercent}%
                          {rule.daysBeforeArrivalMax ? ` within ${rule.daysBeforeArrivalMax} days` : ""}
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={rule.isActive}
                      onChange={() => {
                        setDynamicRules((prev) =>
                          prev.map((r) => (r.id === rule.id ? { ...r, isActive: !r.isActive } : r))
                        );
                      }}
                      className="h-4 w-4 rounded text-rentcot-blue focus:ring-rentcot-blue"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 4. Corporate & Agent Rate Cards */}
        <TabsContent value="corporate" className="pt-4 space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold">B2B Corporate & Travel Agent Rate Cards</CardTitle>
                <CardDescription className="text-xs">
                  Private rate cards attached to repeat corporate offsites and agents, hidden from regular guests
                </CardDescription>
              </div>
              <Button size="sm" className="text-xs bg-rentcot-blue text-white gap-1">
                <Plus className="h-3.5 w-3.5" />
                New Corporate Card
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {corporateCards.map((card) => (
                  <div
                    key={card.id}
                    className="p-4 rounded-xl border border-border bg-background space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-foreground">{card.clientName}</h4>
                      <Badge variant="clean">Active Contract</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Corporate Code</span>
                        <span className="font-mono font-bold text-rentcot-blue">{card.corporateCode}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Negotiated Rate</span>
                        <span className="font-bold text-emerald-600">{card.discountValue}% Off Best Rate</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Valid Through</span>
                        <span className="text-foreground">{card.validUntil}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Channel</span>
                        <span className="text-foreground">Direct B2B Invoice</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

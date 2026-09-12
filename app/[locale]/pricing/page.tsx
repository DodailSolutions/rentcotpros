"use client";

import React, { useState, useMemo } from "react";
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
  type PricingType,
  type OverrideType,
  type PetFeeType,
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
  Search,
  Filter,
  SlidersHorizontal,
  Share2,
  Copy,
  MessageSquare,
  Edit2,
  Trash2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar as CalendarIcon,
  ShieldCheck,
  Users,
  CheckCircle2,
  X,
  Layers,
} from "lucide-react";

export default function PricingEnginePage() {
  const { t } = useTranslation();

  // Toast notification feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3500);
  };

  // -------------------------------------------------------------
  // 1. Initial State: Rate Plans across all 5 pricing models
  // -------------------------------------------------------------
  const [ratePlans, setRatePlans] = useState<RatePlan[]>([
    {
      id: "rp-1",
      organizationId: "org-1",
      propertyId: "prop-1",
      propertyName: "Green Valley Farmhouse & Retreat",
      unitTypeId: "ut-cottage",
      name: "Deluxe Lake View Cottage (Overnight)",
      description: "Standard overnight rate plan with complimentary breakfast & organic pool access.",
      pricingType: "nightly",
      baseRate: 5500,
      weekendRate: 6800,
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
      propertyName: "Wildwoods Luxury Glamping & Tents",
      unitTypeId: "ut-dome",
      name: "Wildwoods Glamping Dome (Per Person / Tent)",
      description: "Charged per person including high-tea, night campfire, and star-gazing sessions.",
      pricingType: "tent_per_person",
      baseRate: 2200,
      weekendRate: 2600,
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
      propertyName: "Green Valley Farmhouse & Retreat",
      unitTypeId: "ut-farmhouse",
      name: "Green Valley Farmhouse Day Picnic (10AM–6PM)",
      description: "Day-use pass for families and groups with private lawn, pool, and buffet lunch.",
      pricingType: "day_use",
      baseRate: 9500,
      weekendRate: 11500,
      dayUseStartTime: "10:00",
      dayUseEndTime: "18:00",
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
      propertyName: "Urban Oasis Sky Villa & Studios",
      unitTypeId: "ut-suite",
      name: "Executive Suite (Hourly Flex / Photoshoot)",
      description: "Flexible hourly slots for business meetings, resting layovers, and pre-wedding shoots.",
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
    {
      id: "rp-5",
      organizationId: "org-1",
      propertyId: "prop-2",
      propertyName: "Wildwoods Luxury Glamping & Tents",
      unitTypeId: "ut-alpine",
      name: "Alpine Group Tent Pitch (Flat Base)",
      description: "Pitch-only ground fee for self-pitching campers with washroom and water hookup.",
      pricingType: "tent_flat",
      baseRate: 1500,
      weekendRate: 1800,
      extraAdultRate: 500,
      extraChildRate: 250,
      weeklyDiscountPercent: 12,
      monthlyDiscountPercent: 25,
      petsAllowed: true,
      petFeeType: "flat_per_stay",
      petFeeAmount: 300,
      taxPercent: 12,
      minNights: 1,
      isActive: true,
    },
  ]);

  // -------------------------------------------------------------
  // 2. Overrides State
  // -------------------------------------------------------------
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

  // -------------------------------------------------------------
  // 3. Corporate Rate Cards
  // -------------------------------------------------------------
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
    {
      id: "corp-3",
      organizationId: "org-1",
      propertyId: "prop-3",
      clientName: "Deloitte India Offsite Card",
      corporateCode: "DELOITTE_CORP",
      discountType: "percent_decrease",
      discountValue: 18,
      validFrom: "2026-01-01",
      validUntil: "2026-12-31",
      isActive: true,
    },
  ]);

  // -------------------------------------------------------------
  // 4. Dynamic Pricing Rules
  // -------------------------------------------------------------
  const [dynamicRules, setDynamicRules] = useState<DynamicPricingRule[]>([
    {
      id: "dr-1",
      organizationId: "org-1",
      propertyId: "prop-1",
      name: "High Demand Surge (≥80% Occupancy)",
      occupancyOperator: ">=",
      occupancyPercent: 80,
      adjustmentPercent: 20,
      isActive: true,
    },
    {
      id: "dr-2",
      organizationId: "org-1",
      propertyId: "prop-1",
      name: "Last-Minute Distress Sale (≤30% Occupancy within 3 days)",
      occupancyOperator: "<=",
      occupancyPercent: 30,
      daysBeforeArrivalMax: 3,
      adjustmentPercent: -20,
      isActive: true,
    },
  ]);

  // -------------------------------------------------------------
  // Active Tab & Filters
  // -------------------------------------------------------------
  const [activeTab, setActiveTab] = useState<string>("catalog");
  const [modelFilter, setModelFilter] = useState<string>("all");
  const [propertyFilter, setPropertyFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Selected Plan for Simulator
  const [selectedPlanId, setSelectedPlanId] = useState<string>("rp-1");
  const selectedPlan = ratePlans.find((p) => p.id === selectedPlanId) || ratePlans[0];

  // -------------------------------------------------------------
  // Simulator Form State
  // -------------------------------------------------------------
  const [simCheckIn, setSimCheckIn] = useState<string>("2026-09-18"); // Friday
  const [simCheckOut, setSimCheckOut] = useState<string>("2026-09-20"); // Sunday (2 nights)
  const [simHours, setSimHours] = useState<number>(4);
  const [simAdults, setSimAdults] = useState<number>(2);
  const [simChildren, setSimChildren] = useState<number>(1);
  const [simPets, setSimPets] = useState<number>(1);
  const [simOccupancy, setSimOccupancy] = useState<number>(85); // 85% triggers High Demand Surge
  const [simLeadDays, setSimLeadDays] = useState<number>(5);
  const [simCorporateCode, setSimCorporateCode] = useState<string>("");
  const [guestPhone, setGuestPhone] = useState<string>("919876543210");

  // Matched Corporate Card
  const matchedCorporateCard = useMemo(() => {
    if (!simCorporateCode.trim()) return null;
    return (
      corporateCards.find(
        (c) => c.corporateCode.toLowerCase() === simCorporateCode.trim().toLowerCase() && c.isActive
      ) || null
    );
  }, [simCorporateCode, corporateCards]);

  // Calculate live stay price
  const simulatedBreakdown: PriceBreakdown = useMemo(() => {
    try {
      return calculateStayPrice({
        ratePlan: selectedPlan,
        checkInDate: simCheckIn,
        checkOutDate: selectedPlan.pricingType === "hourly" ? undefined : simCheckOut,
        hoursDuration: simHours,
        adultsCount: simAdults,
        childrenCount: simChildren,
        petsCount: simPets,
        baseIncludedAdults: 2,
        overrides,
        corporateCard: matchedCorporateCard,
        dynamicRules,
        currentOccupancyPercent: simOccupancy,
        bookingLeadDays: simLeadDays,
      });
    } catch (e) {
      // Fallback
      return {
        pricingType: selectedPlan.pricingType,
        totalNights: 1,
        nightlyDetails: [],
        baseStayAmount: selectedPlan.baseRate,
        extraAdultsAmount: 0,
        extraChildrenAmount: 0,
        petFeeAmount: 0,
        longStayDiscountAmount: 0,
        corporateDiscountAmount: 0,
        dynamicAdjustmentAmount: 0,
        subtotal: selectedPlan.baseRate,
        taxPercent: selectedPlan.taxPercent,
        taxAmount: Math.round(selectedPlan.baseRate * 0.12),
        totalAmount: Math.round(selectedPlan.baseRate * 1.12),
        averageRatePerNightOrHour: selectedPlan.baseRate,
        currency: "INR",
      };
    }
  }, [
    selectedPlan,
    simCheckIn,
    simCheckOut,
    simHours,
    simAdults,
    simChildren,
    simPets,
    overrides,
    matchedCorporateCard,
    dynamicRules,
    simOccupancy,
    simLeadDays,
  ]);

  // -------------------------------------------------------------
  // 14-Day Calendar Matrix Calculation
  // -------------------------------------------------------------
  const calendarDays = useMemo(() => {
    return Array.from({ length: 14 }).map((_, idx) => {
      const d = new Date(2026, 8, 14 + idx);
      const dateStr = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      const isWeekend = d.getDay() === 5 || d.getDay() === 6;
      const occupancy = [65, 55, 70, 85, 95, 90, 60, 45, 50, 75, 88, 92, 70, 65][idx];
      
      // Calculate effective price for this single day
      let effectivePrice = isWeekend && selectedPlan.weekendRate ? selectedPlan.weekendRate : selectedPlan.baseRate;
      
      // Check override
      let overrideTag: string | null = null;
      for (const ov of overrides) {
        if (!ov.isActive) continue;
        const s = new Date(ov.startDate);
        const e = new Date(ov.endDate);
        if (d >= s && d <= e) {
          if (!ov.daysOfWeek || ov.daysOfWeek.length === 0 || ov.daysOfWeek.includes(d.getDay())) {
            overrideTag = ov.name;
            if (ov.overrideType === "percent_increase") {
              effectivePrice = Math.round(effectivePrice * (1 + ov.overrideValue / 100));
            } else if (ov.overrideType === "percent_decrease") {
              effectivePrice = Math.round(effectivePrice * (1 - ov.overrideValue / 100));
            } else if (ov.overrideType === "fixed_rate") {
              effectivePrice = ov.overrideValue;
            }
            break;
          }
        }
      }

      // Dynamic surge check
      let isSurge = false;
      if (occupancy >= 80) {
        isSurge = true;
        effectivePrice = Math.round(effectivePrice * 1.2);
      }

      return {
        date: dateStr,
        dayNum: d.getDate(),
        dayName,
        isWeekend,
        occupancy,
        price: effectivePrice,
        isSurge,
        overrideTag,
      };
    });
  }, [selectedPlan, overrides]);

  // -------------------------------------------------------------
  // Filtered Rate Plans
  // -------------------------------------------------------------
  const filteredRatePlans = useMemo(() => {
    return ratePlans.filter((plan) => {
      if (modelFilter !== "all" && plan.pricingType !== modelFilter) return false;
      if (propertyFilter !== "all" && plan.propertyId !== propertyFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          plan.name.toLowerCase().includes(q) ||
          plan.propertyName?.toLowerCase().includes(q) ||
          plan.description?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [ratePlans, modelFilter, propertyFilter, searchQuery]);

  // -------------------------------------------------------------
  // Modals State
  // -------------------------------------------------------------
  const [isPlanModalOpen, setIsPlanModalOpen] = useState<boolean>(false);
  const [editingPlan, setEditingPlan] = useState<RatePlan | null>(null);

  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState<boolean>(false);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState<boolean>(false);
  const [isCorpModalOpen, setIsCorpModalOpen] = useState<boolean>(false);

  // Form state for Rate Plan Add/Edit
  const [planForm, setPlanForm] = useState<Partial<RatePlan>>({
    propertyId: "prop-1",
    propertyName: "Green Valley Farmhouse & Retreat",
    name: "",
    description: "",
    pricingType: "nightly",
    baseRate: 5000,
    weekendRate: 6500,
    extraAdultRate: 1000,
    extraChildRate: 500,
    pricePerHour: 800,
    minHours: 3,
    weeklyDiscountPercent: 10,
    monthlyDiscountPercent: 25,
    petsAllowed: true,
    petFeeType: "flat_per_stay",
    petFeeAmount: 500,
    taxPercent: 12,
    minNights: 1,
    isActive: true,
  });

  // Form state for Override
  const [overrideForm, setOverrideForm] = useState<Partial<RateOverride>>({
    name: "",
    propertyId: "prop-1",
    startDate: "2026-10-01",
    endDate: "2026-10-05",
    overrideType: "percent_increase",
    overrideValue: 25,
    reason: "festival",
    isActive: true,
  });

  // Form state for Dynamic Rule
  const [ruleForm, setRuleForm] = useState<Partial<DynamicPricingRule>>({
    name: "",
    propertyId: "prop-1",
    occupancyOperator: ">=",
    occupancyPercent: 85,
    daysBeforeArrivalMax: undefined,
    adjustmentPercent: 25,
    isActive: true,
  });

  // Form state for Corporate Card
  const [corpForm, setCorpForm] = useState<Partial<CorporateRateCard>>({
    clientName: "",
    corporateCode: "",
    propertyId: "prop-1",
    discountType: "percent_decrease",
    discountValue: 15,
    validFrom: "2026-01-01",
    validUntil: "2026-12-31",
    isActive: true,
  });

  // Dynamic Rule Testbench State
  const [testbenchOccupancy, setTestbenchOccupancy] = useState<number>(85);
  const [testbenchLeadDays, setTestbenchLeadDays] = useState<number>(2);

  // -------------------------------------------------------------
  // Handlers: Rate Plans CRUD
  // -------------------------------------------------------------
  const handleOpenAddPlan = () => {
    setEditingPlan(null);
    setPlanForm({
      propertyId: "prop-1",
      propertyName: "Green Valley Farmhouse & Retreat",
      name: "",
      description: "",
      pricingType: "nightly",
      baseRate: 5000,
      weekendRate: 6500,
      extraAdultRate: 1000,
      extraChildRate: 500,
      pricePerHour: 800,
      minHours: 3,
      weeklyDiscountPercent: 10,
      monthlyDiscountPercent: 25,
      petsAllowed: true,
      petFeeType: "flat_per_stay",
      petFeeAmount: 500,
      taxPercent: 12,
      minNights: 1,
      isActive: true,
    });
    setIsPlanModalOpen(true);
  };

  const handleOpenEditPlan = (plan: RatePlan) => {
    setEditingPlan(plan);
    setPlanForm({ ...plan });
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.name?.trim()) {
      showToast("Please provide a plan name.");
      return;
    }

    if (editingPlan) {
      setRatePlans((prev) =>
        prev.map((p) => (p.id === editingPlan.id ? ({ ...p, ...planForm } as RatePlan) : p))
      );
      showToast(`Rate plan "${planForm.name}" updated successfully.`);
    } else {
      const newPlan: RatePlan = {
        id: `rp-${Date.now()}`,
        organizationId: "org-1",
        unitTypeId: "ut-custom",
        propertyName:
          planForm.propertyId === "prop-2"
            ? "Wildwoods Luxury Glamping & Tents"
            : planForm.propertyId === "prop-3"
            ? "Urban Oasis Sky Villa & Studios"
            : "Green Valley Farmhouse & Retreat",
        name: planForm.name!,
        description: planForm.description || "",
        pricingType: planForm.pricingType || "nightly",
        baseRate: Number(planForm.baseRate) || 1000,
        weekendRate: Number(planForm.weekendRate) || undefined,
        pricePerHour: Number(planForm.pricePerHour) || undefined,
        minHours: Number(planForm.minHours) || 2,
        extraAdultRate: Number(planForm.extraAdultRate) || 0,
        extraChildRate: Number(planForm.extraChildRate) || 0,
        weeklyDiscountPercent: Number(planForm.weeklyDiscountPercent) || 0,
        monthlyDiscountPercent: Number(planForm.monthlyDiscountPercent) || 0,
        petsAllowed: !!planForm.petsAllowed,
        petFeeType: planForm.petFeeType || "none",
        petFeeAmount: Number(planForm.petFeeAmount) || 0,
        taxPercent: Number(planForm.taxPercent) || 12,
        minNights: Number(planForm.minNights) || 1,
        propertyId: planForm.propertyId || "prop-1",
        isActive: planForm.isActive !== undefined ? planForm.isActive : true,
      };
      setRatePlans((prev) => [newPlan, ...prev]);
      showToast(`New rate plan "${newPlan.name}" created.`);
    }
    setIsPlanModalOpen(false);
  };

  const handleDeletePlan = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete rate plan "${name}"?`)) {
      setRatePlans((prev) => prev.filter((p) => p.id !== id));
      showToast(`Rate plan "${name}" removed.`);
    }
  };

  const handleTogglePlan = (id: string) => {
    setRatePlans((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = !p.isActive;
          showToast(`Rate plan ${next ? "activated" : "deactivated"}.`);
          return { ...p, isActive: next };
        }
        return p;
      })
    );
  };

  // -------------------------------------------------------------
  // Handlers: Overrides CRUD
  // -------------------------------------------------------------
  const handleSaveOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideForm.name?.trim()) {
      showToast("Please enter an override name.");
      return;
    }
    const newOv: RateOverride = {
      id: `ov-${Date.now()}`,
      organizationId: "org-1",
      propertyId: overrideForm.propertyId || "prop-1",
      name: overrideForm.name!,
      startDate: overrideForm.startDate || "2026-10-01",
      endDate: overrideForm.endDate || "2026-10-05",
      daysOfWeek: [],
      overrideType: overrideForm.overrideType || "percent_increase",
      overrideValue: Number(overrideForm.overrideValue) || 20,
      reason: overrideForm.reason || "festival",
      isActive: true,
    };
    setOverrides((prev) => [newOv, ...prev]);
    setIsOverrideModalOpen(false);
    showToast(`Seasonal override "${newOv.name}" added.`);
  };

  const handleDeleteOverride = (id: string, name: string) => {
    setOverrides((prev) => prev.filter((o) => o.id !== id));
    showToast(`Override "${name}" deleted.`);
  };

  // -------------------------------------------------------------
  // Handlers: Dynamic Rules CRUD
  // -------------------------------------------------------------
  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleForm.name?.trim()) {
      showToast("Please enter a rule name.");
      return;
    }
    const newRule: DynamicPricingRule = {
      id: `dr-${Date.now()}`,
      organizationId: "org-1",
      propertyId: ruleForm.propertyId || "prop-1",
      name: ruleForm.name!,
      occupancyOperator: ruleForm.occupancyOperator || ">=",
      occupancyPercent: Number(ruleForm.occupancyPercent) || 80,
      daysBeforeArrivalMax: ruleForm.daysBeforeArrivalMax ? Number(ruleForm.daysBeforeArrivalMax) : null,
      adjustmentPercent: Number(ruleForm.adjustmentPercent) || 20,
      isActive: true,
    };
    setDynamicRules((prev) => [newRule, ...prev]);
    setIsRuleModalOpen(false);
    showToast(`Dynamic rule "${newRule.name}" created.`);
  };

  const handleDeleteRule = (id: string, name: string) => {
    setDynamicRules((prev) => prev.filter((r) => r.id !== id));
    showToast(`Dynamic rule "${name}" removed.`);
  };

  // -------------------------------------------------------------
  // Handlers: Corporate Cards CRUD
  // -------------------------------------------------------------
  const handleSaveCorporate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!corpForm.clientName?.trim() || !corpForm.corporateCode?.trim()) {
      showToast("Client name and Corporate Code are required.");
      return;
    }
    const newCard: CorporateRateCard = {
      id: `corp-${Date.now()}`,
      organizationId: "org-1",
      propertyId: corpForm.propertyId || "prop-1",
      clientName: corpForm.clientName!,
      corporateCode: corpForm.corporateCode!.toUpperCase(),
      discountType: corpForm.discountType || "percent_decrease",
      discountValue: Number(corpForm.discountValue) || 15,
      validFrom: corpForm.validFrom || "2026-01-01",
      validUntil: corpForm.validUntil || "2026-12-31",
      isActive: true,
    };
    setCorporateCards((prev) => [newCard, ...prev]);
    setIsCorpModalOpen(false);
    showToast(`Corporate Rate Card "${newCard.clientName}" created.`);
  };

  const handleDeleteCorporate = (id: string, name: string) => {
    setCorporateCards((prev) => prev.filter((c) => c.id !== id));
    showToast(`Corporate card "${name}" removed.`);
  };

  // -------------------------------------------------------------
  // WhatsApp Quotation Formatter
  // -------------------------------------------------------------
  const generateQuotationText = () => {
    const isHourly = selectedPlan.pricingType === "hourly";
    const isDayUse = selectedPlan.pricingType === "day_use";
    let periodText = `${simCheckIn} to ${simCheckOut} (${simulatedBreakdown.totalNights} Night${simulatedBreakdown.totalNights > 1 ? "s" : ""})`;
    if (isHourly) {
      periodText = `${simCheckIn} (${simHours} Hours Flex Stay)`;
    } else if (isDayUse) {
      periodText = `${simCheckIn} (Day-Picnic: 10:00 AM – 06:00 PM)`;
    }

    const lines = [
      `🌟 *OFFICIAL STAY QUOTATION — ${selectedPlan.propertyName?.toUpperCase()}* 🌟`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🏨 *Plan:* ${selectedPlan.name}`,
      `📅 *Dates:* ${periodText}`,
      `👥 *Guests:* ${simAdults} Adults, ${simChildren} Children${simPets > 0 ? `, 🐾 ${simPets} Pet(s)` : ""}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `💰 *PRICING BREAKDOWN:*`,
      `• Base Stay: ₹${simulatedBreakdown.baseStayAmount.toLocaleString("en-IN")}`,
    ];

    if (simulatedBreakdown.extraAdultsAmount > 0) {
      lines.push(`• Extra Adults Fee: ₹${simulatedBreakdown.extraAdultsAmount.toLocaleString("en-IN")}`);
    }
    if (simulatedBreakdown.extraChildrenAmount > 0) {
      lines.push(`• Extra Children Fee: ₹${simulatedBreakdown.extraChildrenAmount.toLocaleString("en-IN")}`);
    }
    if (simulatedBreakdown.petFeeAmount > 0) {
      lines.push(`• Pet Cleaning Fee: ₹${simulatedBreakdown.petFeeAmount.toLocaleString("en-IN")}`);
    }
    if (simulatedBreakdown.longStayDiscountAmount > 0) {
      lines.push(`• 🏷️ ${simulatedBreakdown.longStayDiscountName}: -₹${simulatedBreakdown.longStayDiscountAmount.toLocaleString("en-IN")}`);
    }
    if (simulatedBreakdown.corporateDiscountAmount > 0) {
      lines.push(`• 🏢 Corporate Discount (${simulatedBreakdown.corporateDiscountName}): -₹${simulatedBreakdown.corporateDiscountAmount.toLocaleString("en-IN")}`);
    }
    if (simulatedBreakdown.dynamicAdjustmentAmount !== 0) {
      const sign = simulatedBreakdown.dynamicAdjustmentAmount > 0 ? "+" : "";
      lines.push(`• ⚡ Dynamic Demand Adjustment: ${sign}₹${simulatedBreakdown.dynamicAdjustmentAmount.toLocaleString("en-IN")}`);
    }

    lines.push(`• GST (${simulatedBreakdown.taxPercent}%): ₹${simulatedBreakdown.taxAmount.toLocaleString("en-IN")}`);
    lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`💎 *NET PAYABLE AMOUNT:* ₹${simulatedBreakdown.totalAmount.toLocaleString("en-IN")}`);
    lines.push(``);
    lines.push(`⚡ *Quote Valid For:* 24 Hours.`);
    lines.push(`📞 *Book directly via Rentcot Property OS concierge.*`);

    return lines.join("\n");
  };

  const handleSendWhatsApp = () => {
    const text = generateQuotationText();
    const encoded = encodeURIComponent(text);
    const cleanPhone = guestPhone.replace(/[^0-9]/g, "");
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, "_blank");
    showToast("Opening WhatsApp with itemized quotation...");
  };

  const handleCopyQuotation = () => {
    const text = generateQuotationText();
    navigator.clipboard.writeText(text);
    showToast("✅ Quotation copied to clipboard in WhatsApp markdown format!");
  };

  // Helper for model badges
  const renderModelBadge = (type: PricingType) => {
    switch (type) {
      case "nightly":
        return (
          <Badge variant="outline" className="text-[11px] gap-1 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
            <Moon className="h-3 w-3" /> Overnight Stay
          </Badge>
        );
      case "hourly":
        return (
          <Badge variant="outline" className="text-[11px] gap-1 bg-amber-50/50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800">
            <Clock className="h-3 w-3" /> Hourly Flex
          </Badge>
        );
      case "day_use":
        return (
          <Badge variant="outline" className="text-[11px] gap-1 bg-emerald-50/50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
            <SunMedium className="h-3 w-3" /> Day-Picnic (10AM–6PM)
          </Badge>
        );
      case "tent_per_person":
        return (
          <Badge variant="outline" className="text-[11px] gap-1 bg-purple-50/50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800">
            <Tent className="h-3 w-3" /> Per-Person Glamping
          </Badge>
        );
      case "tent_flat":
        return (
          <Badge variant="outline" className="text-[11px] gap-1 bg-blue-50/50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800">
            <Tent className="h-3 w-3" /> Tent Pitch Flat
          </Badge>
        );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 bg-zinc-900 text-white rounded-xl shadow-xl text-xs border border-zinc-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Ribbon */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rentcot-blue/10 text-rentcot-blue rounded-xl border border-rentcot-blue/20">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                Pricing Engine & Rate Plans
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
                  Dynamic Yields Active
                </Badge>
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Centralized yield optimization for Overnight, Hourly flex, Day-picnics, Campsite ticketing, and Corporate accounts.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActiveTab("simulator")}
            className="text-xs gap-1.5 border-border shadow-xs hover:bg-muted"
          >
            <Calculator className="h-3.5 w-3.5 text-rentcot-blue" />
            Quote Simulator
          </Button>
          <Button
            size="sm"
            onClick={handleOpenAddPlan}
            className="text-xs bg-rentcot-blue text-white hover:bg-rentcot-blue/90 gap-1.5 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            New Rate Plan
          </Button>
        </div>
      </div>

      {/* Executive Pricing KPI Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <Card className="border-border shadow-xs bg-card/60 backdrop-blur-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span>Active Rate Plans</span>
              <Layers className="h-4 w-4 text-rentcot-blue" />
            </div>
            <div className="mt-2 text-2xl font-black text-foreground">
              {ratePlans.filter((p) => p.isActive).length}
              <span className="text-xs font-normal text-muted-foreground ml-1">/ {ratePlans.length}</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
              <span>5 Models Supported</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs bg-card/60 backdrop-blur-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span>Dynamic Demand Rules</span>
              <Zap className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-foreground">
              {dynamicRules.filter((r) => r.isActive).length}
              <span className="text-xs font-normal text-emerald-600 font-semibold ml-1.5">Live</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600">
              <ArrowUpRight className="h-3 w-3" />
              <span>Surge & Distress active</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs bg-card/60 backdrop-blur-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span>B2B Corporate Cards</span>
              <Briefcase className="h-4 w-4 text-purple-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-foreground">
              {corporateCards.filter((c) => c.isActive).length}
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
              <span>TCS, MMT, Deloitte</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs bg-card/60 backdrop-blur-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span>Seasonal Overrides</span>
              <CalendarIcon className="h-4 w-4 text-rose-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-foreground">
              {overrides.filter((o) => o.isActive).length}
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-rose-600 dark:text-rose-400">
              <span>Diwali, Gandhi Jayanti</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs bg-card/60 backdrop-blur-xs col-span-2 md:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span>Yield Boost Index</span>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
              +26.4%
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
              <span>vs Flat Pricing Baseline</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/60 p-1 border border-border rounded-xl">
          <TabsTrigger value="catalog" className="text-xs font-semibold gap-1.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs">
            <Layers className="h-3.5 w-3.5" /> Rate Plans ({ratePlans.length})
          </TabsTrigger>
          <TabsTrigger value="simulator" className="text-xs font-semibold gap-1.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs">
            <Calculator className="h-3.5 w-3.5" /> Quote Simulator
          </TabsTrigger>
          <TabsTrigger value="calendar" className="text-xs font-semibold gap-1.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs">
            <CalendarDays className="h-3.5 w-3.5" /> 14-Day Calendar Matrix
          </TabsTrigger>
          <TabsTrigger value="rules" className="text-xs font-semibold gap-1.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs">
            <Zap className="h-3.5 w-3.5" /> Dynamic Rules & Surge
          </TabsTrigger>
          <TabsTrigger value="overrides" className="text-xs font-semibold gap-1.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs">
            <Sparkles className="h-3.5 w-3.5" /> Seasonal Overrides ({overrides.length})
          </TabsTrigger>
          <TabsTrigger value="corporate" className="text-xs font-semibold gap-1.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs">
            <Briefcase className="h-3.5 w-3.5" /> Corporate Cards ({corporateCards.length})
          </TabsTrigger>
        </TabsList>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: Rate Plans Catalog */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="catalog" className="space-y-4 pt-1">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-3 rounded-xl border border-border">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search rate plans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 text-xs h-8 border-border"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              {/* Model Filter */}
              <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border text-xs">
                <button
                  type="button"
                  onClick={() => setModelFilter("all")}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    modelFilter === "all" ? "bg-background shadow-xs text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All Models
                </button>
                <button
                  type="button"
                  onClick={() => setModelFilter("nightly")}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    modelFilter === "nightly" ? "bg-background shadow-xs text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Nightly
                </button>
                <button
                  type="button"
                  onClick={() => setModelFilter("hourly")}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    modelFilter === "hourly" ? "bg-background shadow-xs text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Hourly Flex
                </button>
                <button
                  type="button"
                  onClick={() => setModelFilter("day_use")}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    modelFilter === "day_use" ? "bg-background shadow-xs text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Day-Picnic
                </button>
                <button
                  type="button"
                  onClick={() => setModelFilter("tent_per_person")}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    modelFilter === "tent_per_person" ? "bg-background shadow-xs text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Glamping
                </button>
              </div>

              {/* Property Filter */}
              <select
                aria-label="Filter rate plans by property"
                value={propertyFilter}
                onChange={(e) => setPropertyFilter(e.target.value)}
                className="text-xs h-8 px-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-hidden"
              >
                <option value="all">All Properties</option>
                <option value="prop-1">Green Valley Farmhouse</option>
                <option value="prop-2">Wildwoods Luxury Glamping</option>
                <option value="prop-3">Urban Oasis Sky Villa</option>
              </select>
            </div>
          </div>

          {/* Rate Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRatePlans.map((plan) => (
              <Card
                key={plan.id}
                className={`border-border shadow-xs hover:border-rentcot-blue/40 transition-all flex flex-col justify-between ${
                  !plan.isActive ? "opacity-60 bg-muted/20" : "bg-card"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        {renderModelBadge(plan.pricingType)}
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {plan.propertyName?.split(" ")[0]}
                        </span>
                      </div>
                      <CardTitle className="text-base font-bold leading-tight line-clamp-1">
                        {plan.name}
                      </CardTitle>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={plan.isActive}
                        onChange={() => handleTogglePlan(plan.id)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-muted peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-rentcot-blue"></div>
                    </label>
                  </div>
                  {plan.description && (
                    <CardDescription className="text-xs line-clamp-2 mt-1">
                      {plan.description}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="space-y-3.5 pb-4">
                  {/* Price Tag Hero */}
                  <div className="p-3 bg-muted/40 rounded-xl border border-border/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                        Base Price
                      </span>
                      <div className="text-xl font-black text-foreground">
                        ₹{plan.baseRate.toLocaleString("en-IN")}
                        <span className="text-xs font-normal text-muted-foreground ml-1">
                          {plan.pricingType === "hourly"
                            ? `/ ${plan.minHours || 3} hrs min`
                            : plan.pricingType === "tent_per_person"
                            ? "/ person"
                            : plan.pricingType === "day_use"
                            ? "/ day-picnic"
                            : "/ night"}
                        </span>
                      </div>
                    </div>

                    {plan.weekendRate && (
                      <div className="text-right">
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 uppercase font-bold tracking-wider block">
                          Weekend
                        </span>
                        <span className="text-sm font-bold text-foreground">
                          ₹{plan.weekendRate.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Pricing Matrix Detail */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-background border border-border/60">
                      <span className="text-muted-foreground text-[10px] block">Extra Adult</span>
                      <span className="font-semibold text-foreground">
                        ₹{plan.extraAdultRate.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-background border border-border/60">
                      <span className="text-muted-foreground text-[10px] block">Extra Child</span>
                      <span className="font-semibold text-foreground">
                        ₹{plan.extraChildRate.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-background border border-border/60">
                      <span className="text-muted-foreground text-[10px] block">Pet Policy</span>
                      <span className="font-semibold text-foreground flex items-center gap-1">
                        <PawPrint className="h-3 w-3 text-muted-foreground" />
                        {plan.petsAllowed
                          ? plan.petFeeType === "none"
                            ? "Free"
                            : `₹${plan.petFeeAmount}`
                          : "Not Allowed"}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-background border border-border/60">
                      <span className="text-muted-foreground text-[10px] block">GST Rate</span>
                      <span className="font-semibold text-foreground">{plan.taxPercent}%</span>
                    </div>
                  </div>

                  {/* Long Stay Discounts */}
                  {(plan.weeklyDiscountPercent > 0 || plan.monthlyDiscountPercent > 0) && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {plan.weeklyDiscountPercent > 0 && (
                        <Badge variant="clean" className="text-[10px] font-medium">
                          7+ nights: {plan.weeklyDiscountPercent}% off
                        </Badge>
                      )}
                      {plan.monthlyDiscountPercent > 0 && (
                        <Badge variant="clean" className="text-[10px] font-medium">
                          28+ nights: {plan.monthlyDiscountPercent}% off
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Card Actions */}
                  <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedPlanId(plan.id);
                        setActiveTab("simulator");
                      }}
                      className="text-xs h-8 gap-1 border-border flex-1 hover:bg-rentcot-blue/5 hover:text-rentcot-blue hover:border-rentcot-blue/30"
                    >
                      <Calculator className="h-3 w-3" /> Simulate
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenEditPlan(plan)}
                      className="text-xs h-8 px-2.5 border-border hover:bg-muted"
                      title="Edit Rate Plan"
                    >
                      <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeletePlan(plan.id, plan.name)}
                      className="text-xs h-8 px-2.5 border-border hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:hover:bg-rose-950"
                      title="Delete Rate Plan"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRatePlans.length === 0 && (
            <div className="text-center py-12 border border-dashed border-border rounded-xl bg-card">
              <Layers className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <h3 className="text-sm font-bold text-foreground">No Rate Plans Found</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                No rate plans matched your active filter or search query. Try resetting your filter.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setModelFilter("all");
                  setPropertyFilter("all");
                  setSearchQuery("");
                }}
                className="mt-3 text-xs"
              >
                Reset Filters
              </Button>
            </div>
          )}
        </TabsContent>

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: Quote Simulator (Interactive Real-Time Engine) */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="simulator" className="space-y-4 pt-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Input Parameters Panel */}
            <div className="lg:col-span-6 space-y-4">
              <Card className="border-border shadow-xs">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4 text-rentcot-blue" />
                        Reservation & Yield Parameters
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Adjust stay duration, occupancy yield, guests, and corporate codes to see instant calculations.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Select Plan */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Active Rate Plan</Label>
                    <select
                      aria-label="Select Rate Plan for Quote Simulation"
                      value={selectedPlanId}
                      onChange={(e) => setSelectedPlanId(e.target.value)}
                      className="w-full text-xs h-9 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-hidden"
                    >
                      {ratePlans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — ({p.pricingType.toUpperCase()} | ₹{p.baseRate.toLocaleString("en-IN")})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date & Time Pickers */}
                  {selectedPlan.pricingType === "hourly" ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Stay Date</Label>
                        <Input
                          type="date"
                          value={simCheckIn}
                          onChange={(e) => setSimCheckIn(e.target.value)}
                          className="text-xs h-9 border-border"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Duration (Hours)</Label>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            type="button"
                            variant="outline"
                            onClick={() => setSimHours(Math.max(selectedPlan.minHours || 2, simHours - 1))}
                            className="h-9 w-9 p-0 border-border"
                          >
                            -
                          </Button>
                          <span className="flex-1 text-center font-mono font-bold text-sm">
                            {simHours} hrs
                          </span>
                          <Button
                            size="sm"
                            type="button"
                            variant="outline"
                            onClick={() => setSimHours(simHours + 1)}
                            className="h-9 w-9 p-0 border-border"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : selectedPlan.pricingType === "day_use" ? (
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Picnic Date</Label>
                      <Input
                        type="date"
                        value={simCheckIn}
                        onChange={(e) => setSimCheckIn(e.target.value)}
                        className="text-xs h-9 border-border"
                      />
                      <span className="text-[11px] text-muted-foreground block">
                        Operating Hours: 10:00 AM – 06:00 PM (Fixed Day Slot)
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Check-in Date</Label>
                        <Input
                          type="date"
                          value={simCheckIn}
                          onChange={(e) => setSimCheckIn(e.target.value)}
                          className="text-xs h-9 border-border"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Check-out Date</Label>
                        <Input
                          type="date"
                          value={simCheckOut}
                          onChange={(e) => setSimCheckOut(e.target.value)}
                          className="text-xs h-9 border-border"
                        />
                      </div>
                    </div>
                  )}

                  {/* Guests & Pets Counter */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Adults</Label>
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          type="button"
                          variant="outline"
                          onClick={() => setSimAdults(Math.max(1, simAdults - 1))}
                          className="h-8 w-8 p-0 border-border"
                        >
                          -
                        </Button>
                        <span className="flex-1 text-center font-bold text-xs">{simAdults}</span>
                        <Button
                          size="sm"
                          type="button"
                          variant="outline"
                          onClick={() => setSimAdults(simAdults + 1)}
                          className="h-8 w-8 p-0 border-border"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Children</Label>
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          type="button"
                          variant="outline"
                          onClick={() => setSimChildren(Math.max(0, simChildren - 1))}
                          className="h-8 w-8 p-0 border-border"
                        >
                          -
                        </Button>
                        <span className="flex-1 text-center font-bold text-xs">{simChildren}</span>
                        <Button
                          size="sm"
                          type="button"
                          variant="outline"
                          onClick={() => setSimChildren(simChildren + 1)}
                          className="h-8 w-8 p-0 border-border"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Pets</Label>
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          type="button"
                          variant="outline"
                          onClick={() => setSimPets(Math.max(0, simPets - 1))}
                          className="h-8 w-8 p-0 border-border"
                        >
                          -
                        </Button>
                        <span className="flex-1 text-center font-bold text-xs">{simPets}</span>
                        <Button
                          size="sm"
                          type="button"
                          variant="outline"
                          onClick={() => setSimPets(simPets + 1)}
                          className="h-8 w-8 p-0 border-border"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Occupancy Yield Slider */}
                  <div className="p-3 bg-muted/30 rounded-xl border border-border space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold flex items-center gap-1.5 text-foreground">
                        <Zap className="h-3.5 w-3.5 text-amber-500" />
                        Simulate Property Occupancy
                      </span>
                      <span className={`font-mono font-bold ${simOccupancy >= 80 ? "text-amber-600 dark:text-amber-400" : simOccupancy <= 30 ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>
                        {simOccupancy}% Occupied
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={simOccupancy}
                      onChange={(e) => setSimOccupancy(Number(e.target.value))}
                      className="w-full accent-rentcot-blue cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>0% (Distress &lt;=30%)</span>
                      <span>50% (Normal)</span>
                      <span>100% (Surge &gt;=80%)</span>
                    </div>
                  </div>

                  {/* Corporate Code & Lead Days */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold">Corporate / Partner Code</Label>
                      {matchedCorporateCard && (
                        <Badge variant="clean" className="text-[10px]">
                          {matchedCorporateCard.clientName} ({matchedCorporateCard.discountValue}% Off)
                        </Badge>
                      )}
                    </div>
                    <Input
                      placeholder="e.g. TCS2026, MMT_PREFERRED"
                      value={simCorporateCode}
                      onChange={(e) => setSimCorporateCode(e.target.value)}
                      className="text-xs h-9 border-border uppercase font-mono"
                    />
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-muted-foreground">Quick Test:</span>
                      <button
                        type="button"
                        onClick={() => setSimCorporateCode("TCS2026")}
                        className="text-[10px] font-mono px-1.5 py-0.5 bg-muted rounded border border-border hover:bg-muted/80 text-foreground"
                      >
                        TCS2026 (-20%)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSimCorporateCode("MMT_PREFERRED")}
                        className="text-[10px] font-mono px-1.5 py-0.5 bg-muted rounded border border-border hover:bg-muted/80 text-foreground"
                      >
                        MMT_PREFERRED (-15%)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSimCorporateCode("")}
                        className="text-[10px] text-muted-foreground hover:text-foreground"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Proforma Quotation & Delivery Card */}
            <div className="lg:col-span-6 space-y-4">
              <Card className="border-rentcot-blue/30 shadow-md bg-card overflow-hidden">
                <div className="bg-gradient-to-r from-rentcot-blue to-blue-700 text-white p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80 block">
                        Proforma Quotation Breakdown
                      </span>
                      <h3 className="text-lg font-bold">{selectedPlan.name}</h3>
                      <p className="text-xs opacity-90">{selectedPlan.propertyName}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80 block">
                        Net Payable
                      </span>
                      <span className="text-2xl font-black">
                        ₹{simulatedBreakdown.totalAmount.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] block opacity-80">
                        Incl. {simulatedBreakdown.taxPercent}% GST
                      </span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-5 space-y-4">
                  {/* Itemized lines */}
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-border/60">
                      <span className="text-muted-foreground">
                        Base Stay ({simulatedBreakdown.totalNights} Night{simulatedBreakdown.totalNights > 1 ? "s" : ""})
                      </span>
                      <span className="font-semibold text-foreground">
                        ₹{simulatedBreakdown.baseStayAmount.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Nightly breakdown if > 1 night */}
                    {simulatedBreakdown.nightlyDetails.length > 1 && (
                      <div className="pl-3 py-1 space-y-1 bg-muted/30 rounded-lg text-[11px]">
                        {simulatedBreakdown.nightlyDetails.map((nd, idx) => (
                          <div key={idx} className="flex justify-between text-muted-foreground">
                            <span>
                              Night {idx + 1} ({nd.date}) {nd.isWeekend ? "• Weekend" : ""}
                              {nd.appliedOverrideName ? ` [${nd.appliedOverrideName}]` : ""}
                            </span>
                            <span className="font-mono">₹{nd.effectiveNightlyRate.toLocaleString("en-IN")}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {simulatedBreakdown.extraAdultsAmount > 0 && (
                      <div className="flex justify-between items-center py-1 border-b border-border/60">
                        <span className="text-muted-foreground">Extra Adults ({simAdults - 2})</span>
                        <span className="font-semibold text-foreground">
                          +₹{simulatedBreakdown.extraAdultsAmount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}

                    {simulatedBreakdown.extraChildrenAmount > 0 && (
                      <div className="flex justify-between items-center py-1 border-b border-border/60">
                        <span className="text-muted-foreground">Extra Children ({simChildren})</span>
                        <span className="font-semibold text-foreground">
                          +₹{simulatedBreakdown.extraChildrenAmount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}

                    {simulatedBreakdown.petFeeAmount > 0 && (
                      <div className="flex justify-between items-center py-1 border-b border-border/60">
                        <span className="text-muted-foreground">Pet Policy Fee ({simPets} Pet)</span>
                        <span className="font-semibold text-foreground">
                          +₹{simulatedBreakdown.petFeeAmount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}

                    {simulatedBreakdown.longStayDiscountAmount > 0 && (
                      <div className="flex justify-between items-center py-1 border-b border-border/60 text-emerald-600">
                        <span>{simulatedBreakdown.longStayDiscountName}</span>
                        <span className="font-semibold">
                          -₹{simulatedBreakdown.longStayDiscountAmount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}

                    {simulatedBreakdown.corporateDiscountAmount > 0 && (
                      <div className="flex justify-between items-center py-1 border-b border-border/60 text-purple-600 dark:text-purple-400">
                        <span>Corporate Discount ({simulatedBreakdown.corporateDiscountName})</span>
                        <span className="font-semibold">
                          -₹{simulatedBreakdown.corporateDiscountAmount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}

                    {simulatedBreakdown.dynamicAdjustmentAmount !== 0 && (
                      <div className={`flex justify-between items-center py-1 border-b border-border/60 ${
                        simulatedBreakdown.dynamicAdjustmentAmount > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600"
                      }`}>
                        <span>⚡ {simulatedBreakdown.dynamicAdjustmentName}</span>
                        <span className="font-semibold">
                          {simulatedBreakdown.dynamicAdjustmentAmount > 0 ? "+" : ""}
                          ₹{simulatedBreakdown.dynamicAdjustmentAmount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center py-1 text-muted-foreground">
                      <span>GST Taxes ({simulatedBreakdown.taxPercent}%)</span>
                      <span className="font-mono">₹{simulatedBreakdown.taxAmount.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t-2 border-border font-bold text-sm">
                      <span className="text-foreground">Total Quoted Stay</span>
                      <span className="text-rentcot-blue text-base font-black">
                        ₹{simulatedBreakdown.totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* WhatsApp Recipient & Instant Dispatch */}
                  <div className="p-3 bg-muted/40 rounded-xl border border-border space-y-2">
                    <Label className="text-xs font-semibold flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                      Guest WhatsApp Phone (Country Code + Mobile)
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g. 919876543210"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="text-xs h-9 border-border font-mono"
                      />
                      <Button
                        type="button"
                        onClick={handleSendWhatsApp}
                        className="text-xs h-9 bg-emerald-600 hover:bg-emerald-700 text-white gap-1 px-3 shadow-xs shrink-0"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        Send on WhatsApp
                      </Button>
                    </div>
                  </div>

                  {/* Copy & Draft Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCopyQuotation}
                      className="text-xs flex-1 gap-1.5 border-border hover:bg-muted"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copy Itemized Text
                    </Button>
                    <Button
                      type="button"
                      variant="default"
                      onClick={() => showToast("Draft reservation created in Property OS!")}
                      className="text-xs flex-1 bg-rentcot-blue text-white hover:bg-rentcot-blue/90"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Lock & Reserve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: 14-Day Calendar Pricing Matrix */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="calendar" className="space-y-4 pt-1">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-rentcot-blue" />
                  14-Day Dynamic Pricing & Occupancy Matrix
                </CardTitle>
                <CardDescription className="text-xs">
                  Daily rates calculated automatically based on weekday/weekend base, festival overrides, and demand surge.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Preview Plan:</span>
                <select
                  aria-label="Select Plan for Calendar Preview"
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="text-xs h-8 px-2 bg-background border border-border rounded-lg text-foreground"
                >
                  {ratePlans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                {calendarDays.map((day, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                      day.isWeekend
                        ? "bg-amber-500/5 border-amber-500/30"
                        : "bg-background border-border"
                    } hover:border-rentcot-blue`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">
                          {day.dayName}, Sep {day.dayNum}
                        </span>
                        {day.isWeekend && (
                          <Badge variant="outline" className="text-[9px] px-1 py-0 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300">
                            W/E
                          </Badge>
                        )}
                      </div>

                      {/* Occupancy Indicator */}
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>Occ.</span>
                          <span className="font-semibold text-foreground">{day.occupancy}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              day.occupancy >= 80
                                ? "bg-amber-500"
                                : day.occupancy <= 30
                                ? "bg-blue-400"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${day.occupancy}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-border/60">
                      {day.overrideTag && (
                        <span className="text-[9px] text-rose-600 dark:text-rose-400 font-bold block truncate">
                          {day.overrideTag}
                        </span>
                      )}
                      {day.isSurge && (
                        <span className="text-[9px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-0.5">
                          <Zap className="h-2.5 w-2.5" /> Surge +20%
                        </span>
                      )}
                      <div className="text-sm font-black text-foreground mt-0.5">
                        ₹{day.price.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: Dynamic Rules & Surge */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="rules" className="space-y-4 pt-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Rules List */}
            <div className="lg:col-span-7 space-y-4">
              <Card className="border-border shadow-xs">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-500" />
                      Dynamic Demand Yield Rules
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Calibrated thresholds trigger automatic rate adjustments without unpredictable black-box drift.
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setIsRuleModalOpen(true)}
                    className="text-xs bg-rentcot-blue text-white gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Rule
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dynamicRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background hover:border-rentcot-blue/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                          rule.adjustmentPercent > 0
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                        }`}>
                          <Zap className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-foreground">{rule.name}</span>
                            <Badge
                              variant={rule.adjustmentPercent > 0 ? "occupied" : "clean"}
                              className="text-[10px]"
                            >
                              {rule.adjustmentPercent > 0
                                ? `+${rule.adjustmentPercent}% Surge`
                                : `${rule.adjustmentPercent}% Distress`}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Trigger when Occupancy {rule.occupancyOperator} {rule.occupancyPercent}%
                            {rule.daysBeforeArrivalMax ? ` (within ${rule.daysBeforeArrivalMax} days of arrival)` : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rule.isActive}
                            onChange={() => {
                              setDynamicRules((prev) =>
                                prev.map((r) => (r.id === rule.id ? { ...r, isActive: !r.isActive } : r))
                              );
                              showToast(`Dynamic rule status updated.`);
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4 bg-muted peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-rentcot-blue"></div>
                        </label>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteRule(rule.id, rule.name)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Live Dynamic Rules Testbench */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="border-border shadow-xs bg-muted/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
                    Dynamic Engine Testbench
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Simulate occupancy and lead time to test rule triggers live on a ₹5,000 baseline.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-muted-foreground">Occupancy Level</span>
                      <span className="font-mono font-bold text-foreground">{testbenchOccupancy}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={testbenchOccupancy}
                      onChange={(e) => setTestbenchOccupancy(Number(e.target.value))}
                      className="w-full accent-rentcot-blue cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-muted-foreground">Booking Lead Days</span>
                      <span className="font-mono font-bold text-foreground">{testbenchLeadDays} days</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={testbenchLeadDays}
                      onChange={(e) => setTestbenchLeadDays(Number(e.target.value))}
                      className="w-full accent-rentcot-blue cursor-pointer"
                    />
                  </div>

                  {/* Triggered Rule Preview */}
                  <div className="p-4 rounded-xl border border-border bg-background space-y-2">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                      Active Trigger Evaluation
                    </span>
                    {(() => {
                      const triggered = dynamicRules.find((r) => {
                        if (!r.isActive) return false;
                        if (r.occupancyOperator === ">=" && testbenchOccupancy >= r.occupancyPercent) return true;
                        if (r.occupancyOperator === "<=" && testbenchOccupancy <= r.occupancyPercent) {
                          if (r.daysBeforeArrivalMax == null || testbenchLeadDays <= r.daysBeforeArrivalMax) return true;
                        }
                        return false;
                      });

                      const baseline = 5000;
                      const adjusted = triggered
                        ? Math.round(baseline * (1 + triggered.adjustmentPercent / 100))
                        : baseline;

                      return (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-foreground">
                              {triggered ? triggered.name : "Normal Rate (No Dynamic Trigger)"}
                            </span>
                            {triggered && (
                              <Badge variant={triggered.adjustmentPercent > 0 ? "occupied" : "clean"} className="text-[10px]">
                                {triggered.adjustmentPercent > 0 ? `+${triggered.adjustmentPercent}%` : `${triggered.adjustmentPercent}%`}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-baseline justify-between pt-2 border-t border-border">
                            <span className="text-xs text-muted-foreground">Adjusted Rate (₹5,000 Base):</span>
                            <span className="text-lg font-black text-foreground">
                              ₹{adjusted.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ------------------------------------------------------------- */}
        {/* TAB 5: Seasonal & Holiday Overrides */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="overrides" className="space-y-4 pt-1">
          <Card className="border-border shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-rose-500" />
                  Seasonal, Festival & Weekend Overrides
                </CardTitle>
                <CardDescription className="text-xs">
                  Fixed or percentage pricing adjustments for Diwali, New Year, long weekends, and regional holidays.
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => setIsOverrideModalOpen(true)}
                className="text-xs bg-rentcot-blue text-white gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Override
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {overrides.map((ov) => (
                  <div
                    key={ov.id}
                    className="p-4 rounded-xl border border-border bg-background space-y-3 hover:border-rentcot-blue/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Badge variant="clean" className="text-[10px] mb-1">
                          {ov.reason.toUpperCase()}
                        </Badge>
                        <h4 className="text-sm font-bold text-foreground leading-tight">{ov.name}</h4>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteOverride(ov.id, ov.name)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Duration:</span>
                        <span className="font-medium text-foreground">
                          {ov.startDate} to {ov.endDate}
                        </span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Adjustment:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {ov.overrideType === "percent_increase"
                            ? `+${ov.overrideValue}%`
                            : ov.overrideType === "percent_decrease"
                            ? `-${ov.overrideValue}%`
                            : `Fixed ₹${ov.overrideValue}`}
                        </span>
                      </div>
                      {ov.daysOfWeek && ov.daysOfWeek.length > 0 && (
                        <div className="flex justify-between text-muted-foreground">
                          <span>Days:</span>
                          <span className="text-foreground">
                            {ov.daysOfWeek.map((d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d]).join(", ")}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Active Status</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ov.isActive}
                          onChange={() => {
                            setOverrides((prev) =>
                              prev.map((o) => (o.id === ov.id ? { ...o, isActive: !o.isActive } : o))
                            );
                            showToast(`Override status updated.`);
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-muted peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-rentcot-blue"></div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------------------------------------- */}
        {/* TAB 6: Corporate & Travel Agent Rate Cards */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="corporate" className="space-y-4 pt-1">
          <Card className="border-border shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-purple-600" />
                  B2B Corporate & Travel Agent Rate Cards
                </CardTitle>
                <CardDescription className="text-xs">
                  Private negotiated agreements linked to corporate billing accounts, offsites, and travel partners.
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => setIsCorpModalOpen(true)}
                className="text-xs bg-rentcot-blue text-white gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                New Corporate Card
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {corporateCards.map((card) => (
                  <div
                    key={card.id}
                    className="p-4 rounded-xl border border-border bg-background space-y-3 hover:border-rentcot-blue/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Badge variant="clean" className="text-[10px] mb-1">
                          Active Contract
                        </Badge>
                        <h4 className="text-sm font-bold text-foreground leading-tight">{card.clientName}</h4>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteCorporate(card.id, card.clientName)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Corporate Code</span>
                        <span className="font-mono font-bold text-rentcot-blue">{card.corporateCode}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Negotiated Rate</span>
                        <span className="font-bold text-emerald-600">
                          {card.discountValue}% Off Best Rate
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Valid Until</span>
                        <span className="text-foreground">{card.validUntil}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Channel</span>
                        <span className="text-foreground">Direct B2B Invoice</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Contract Active</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={card.isActive}
                          onChange={() => {
                            setCorporateCards((prev) =>
                              prev.map((c) => (c.id === card.id ? { ...c, isActive: !c.isActive } : c))
                            );
                            showToast(`Corporate contract status updated.`);
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-muted peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-rentcot-blue"></div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: Add / Edit Rate Plan Modal */}
      {/* ------------------------------------------------------------- */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {editingPlan ? "Edit Rate Plan" : "Create New Rate Plan"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Configure pricing model, weekend surcharges, extra guest fees, and long-stay incentives.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPlanModalOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSavePlan} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-xs font-semibold">Plan Name *</Label>
                  <Input
                    required
                    placeholder="e.g. Deluxe Lake Cottage (Weekend Stay)"
                    value={planForm.name || ""}
                    onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                    className="text-xs h-9 border-border"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-xs font-semibold">Description</Label>
                  <Input
                    placeholder="Brief highlights for guest invoices & OTA sync"
                    value={planForm.description || ""}
                    onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                    className="text-xs h-9 border-border"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Property</Label>
                  <select
                    aria-label="Select Property for Rate Plan"
                    value={planForm.propertyId || "prop-1"}
                    onChange={(e) => setPlanForm({ ...planForm, propertyId: e.target.value })}
                    className="w-full text-xs h-9 px-3 bg-background border border-border rounded-lg text-foreground"
                  >
                    <option value="prop-1">Green Valley Farmhouse & Retreat</option>
                    <option value="prop-2">Wildwoods Luxury Glamping & Tents</option>
                    <option value="prop-3">Urban Oasis Sky Villa & Studios</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Pricing Model *</Label>
                  <select
                    aria-label="Select Pricing Model"
                    value={planForm.pricingType || "nightly"}
                    onChange={(e) => setPlanForm({ ...planForm, pricingType: e.target.value as PricingType })}
                    className="w-full text-xs h-9 px-3 bg-background border border-border rounded-lg text-foreground font-semibold"
                  >
                    <option value="nightly">Overnight (Per Night)</option>
                    <option value="hourly">Hourly Flex (Day Rest / Shoot)</option>
                    <option value="day_use">Day-Picnic (10:00 AM – 06:00 PM)</option>
                    <option value="tent_per_person">Campsite Ticketing (Per Person / Head)</option>
                    <option value="tent_flat">Tent Pitch (Flat Base Rate)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Base Rate (₹) *</Label>
                  <Input
                    type="number"
                    required
                    min="0"
                    value={planForm.baseRate ?? ""}
                    onChange={(e) => setPlanForm({ ...planForm, baseRate: Number(e.target.value) })}
                    className="text-xs h-9 border-border font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Weekend Rate (₹) (Fri & Sat)</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Optional surge"
                    value={planForm.weekendRate ?? ""}
                    onChange={(e) => setPlanForm({ ...planForm, weekendRate: e.target.value ? Number(e.target.value) : undefined })}
                    className="text-xs h-9 border-border font-mono"
                  />
                </div>

                {planForm.pricingType === "hourly" && (
                  <>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Hourly Rate (₹/hr)</Label>
                      <Input
                        type="number"
                        value={planForm.pricePerHour ?? ""}
                        onChange={(e) => setPlanForm({ ...planForm, pricePerHour: Number(e.target.value) })}
                        className="text-xs h-9 border-border font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Minimum Hours</Label>
                      <Input
                        type="number"
                        min="1"
                        value={planForm.minHours ?? 3}
                        onChange={(e) => setPlanForm({ ...planForm, minHours: Number(e.target.value) })}
                        className="text-xs h-9 border-border font-mono"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Extra Adult Rate (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={planForm.extraAdultRate ?? ""}
                    onChange={(e) => setPlanForm({ ...planForm, extraAdultRate: Number(e.target.value) })}
                    className="text-xs h-9 border-border font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Extra Child Rate (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={planForm.extraChildRate ?? ""}
                    onChange={(e) => setPlanForm({ ...planForm, extraChildRate: Number(e.target.value) })}
                    className="text-xs h-9 border-border font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Weekly Discount (7+ Nights %)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={planForm.weeklyDiscountPercent ?? ""}
                    onChange={(e) => setPlanForm({ ...planForm, weeklyDiscountPercent: Number(e.target.value) })}
                    className="text-xs h-9 border-border font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Monthly Discount (28+ Nights %)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={planForm.monthlyDiscountPercent ?? ""}
                    onChange={(e) => setPlanForm({ ...planForm, monthlyDiscountPercent: Number(e.target.value) })}
                    className="text-xs h-9 border-border font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Pet Cleaning Fee (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={planForm.petFeeAmount ?? ""}
                    onChange={(e) => setPlanForm({ ...planForm, petFeeAmount: Number(e.target.value) })}
                    className="text-xs h-9 border-border font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Tax / GST (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="28"
                    value={planForm.taxPercent ?? 12}
                    onChange={(e) => setPlanForm({ ...planForm, taxPercent: Number(e.target.value) })}
                    className="text-xs h-9 border-border font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs bg-rentcot-blue text-white hover:bg-rentcot-blue/90"
                >
                  {editingPlan ? "Save Plan Changes" : "Create Plan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: Add Dynamic Rule Modal */}
      {/* ------------------------------------------------------------- */}
      {isRuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Add Dynamic Pricing Rule</h3>
                <p className="text-xs text-muted-foreground">Trigger automatic surge or distress discounts based on occupancy.</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRuleModalOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSaveRule} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Rule Name *</Label>
                <Input
                  required
                  placeholder="e.g. Extreme Demand Surge (>=90%)"
                  value={ruleForm.name || ""}
                  onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })}
                  className="text-xs h-9 border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Occupancy Condition</Label>
                  <select
                    aria-label="Occupancy Condition Operator"
                    value={ruleForm.occupancyOperator || ">="}
                    onChange={(e) => setRuleForm({ ...ruleForm, occupancyOperator: e.target.value as ">=" | "<=" })}
                    className="w-full text-xs h-9 px-3 bg-background border border-border rounded-lg text-foreground"
                  >
                    <option value=">=">Greater or Equal (&gt;=)</option>
                    <option value="<=">Less or Equal (&lt;=)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Occupancy Threshold (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={ruleForm.occupancyPercent ?? 80}
                    onChange={(e) => setRuleForm({ ...ruleForm, occupancyPercent: Number(e.target.value) })}
                    className="text-xs h-9 border-border font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Adjustment (%)</Label>
                  <Input
                    type="number"
                    required
                    placeholder="+20 or -15"
                    value={ruleForm.adjustmentPercent ?? 20}
                    onChange={(e) => setRuleForm({ ...ruleForm, adjustmentPercent: Number(e.target.value) })}
                    className="text-xs h-9 border-border font-mono font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Lead Days Max</Label>
                  <Input
                    type="number"
                    placeholder="Optional (e.g. 3)"
                    value={ruleForm.daysBeforeArrivalMax ?? ""}
                    onChange={(e) => setRuleForm({ ...ruleForm, daysBeforeArrivalMax: e.target.value ? Number(e.target.value) : undefined })}
                    className="text-xs h-9 border-border font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRuleModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs bg-rentcot-blue text-white hover:bg-rentcot-blue/90"
                >
                  Create Rule
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 3: Add Seasonal Override Modal */}
      {/* ------------------------------------------------------------- */}
      {isOverrideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Add Seasonal Override</h3>
                <p className="text-xs text-muted-foreground">Apply custom pricing multipliers for festivals and peak events.</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOverrideModalOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSaveOverride} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Override Name *</Label>
                <Input
                  required
                  placeholder="e.g. New Year Eve Surcharge"
                  value={overrideForm.name || ""}
                  onChange={(e) => setOverrideForm({ ...overrideForm, name: e.target.value })}
                  className="text-xs h-9 border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Start Date</Label>
                  <Input
                    type="date"
                    required
                    value={overrideForm.startDate || ""}
                    onChange={(e) => setOverrideForm({ ...overrideForm, startDate: e.target.value })}
                    className="text-xs h-9 border-border"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">End Date</Label>
                  <Input
                    type="date"
                    required
                    value={overrideForm.endDate || ""}
                    onChange={(e) => setOverrideForm({ ...overrideForm, endDate: e.target.value })}
                    className="text-xs h-9 border-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Override Type</Label>
                  <select
                    aria-label="Override Type"
                    value={overrideForm.overrideType || "percent_increase"}
                    onChange={(e) => setOverrideForm({ ...overrideForm, overrideType: e.target.value as OverrideType })}
                    className="w-full text-xs h-9 px-3 bg-background border border-border rounded-lg text-foreground"
                  >
                    <option value="percent_increase">Percent Increase (%)</option>
                    <option value="percent_decrease">Percent Decrease (%)</option>
                    <option value="fixed_rate">Fixed Rate (₹)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Value *</Label>
                  <Input
                    type="number"
                    required
                    value={overrideForm.overrideValue ?? 25}
                    onChange={(e) => setOverrideForm({ ...overrideForm, overrideValue: Number(e.target.value) })}
                    className="text-xs h-9 border-border font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Reason / Category</Label>
                <select
                  aria-label="Reason or Category"
                  value={overrideForm.reason || "festival"}
                  onChange={(e) => setOverrideForm({ ...overrideForm, reason: e.target.value })}
                  className="w-full text-xs h-9 px-3 bg-background border border-border rounded-lg text-foreground"
                >
                  <option value="festival">Festival Surcharge</option>
                  <option value="long_weekend">Long Weekend Holiday</option>
                  <option value="season">Peak Seasonal Demand</option>
                  <option value="event">Local Event / Concert</option>
                </select>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOverrideModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs bg-rentcot-blue text-white hover:bg-rentcot-blue/90"
                >
                  Save Override
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 4: Add Corporate Card Modal */}
      {/* ------------------------------------------------------------- */}
      {isCorpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">New B2B Corporate Card</h3>
                <p className="text-xs text-muted-foreground">Register an exclusive negotiated contract code for corporate partners.</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCorpModalOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSaveCorporate} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Client / Partner Name *</Label>
                <Input
                  required
                  placeholder="e.g. Infosys Technologies Ltd"
                  value={corpForm.clientName || ""}
                  onChange={(e) => setCorpForm({ ...corpForm, clientName: e.target.value })}
                  className="text-xs h-9 border-border"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Corporate Promo Code *</Label>
                <Input
                  required
                  placeholder="e.g. INFOSYS2026"
                  value={corpForm.corporateCode || ""}
                  onChange={(e) => setCorpForm({ ...corpForm, corporateCode: e.target.value.toUpperCase() })}
                  className="text-xs h-9 border-border uppercase font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Discount Type</Label>
                  <select
                    aria-label="Corporate Discount Type"
                    value={corpForm.discountType || "percent_decrease"}
                    onChange={(e) => setCorpForm({ ...corpForm, discountType: e.target.value as OverrideType })}
                    className="w-full text-xs h-9 px-3 bg-background border border-border rounded-lg text-foreground"
                  >
                    <option value="percent_decrease">Percent Off (%)</option>
                    <option value="fixed_rate">Fixed Discount (₹)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Discount Value *</Label>
                  <Input
                    type="number"
                    min="1"
                    required
                    value={corpForm.discountValue ?? 15}
                    onChange={(e) => setCorpForm({ ...corpForm, discountValue: Number(e.target.value) })}
                    className="text-xs h-9 border-border font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Valid From</Label>
                  <Input
                    type="date"
                    value={corpForm.validFrom || "2026-01-01"}
                    onChange={(e) => setCorpForm({ ...corpForm, validFrom: e.target.value })}
                    className="text-xs h-9 border-border"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Valid Until</Label>
                  <Input
                    type="date"
                    value={corpForm.validUntil || "2026-12-31"}
                    onChange={(e) => setCorpForm({ ...corpForm, validUntil: e.target.value })}
                    className="text-xs h-9 border-border"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCorpModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs bg-rentcot-blue text-white hover:bg-rentcot-blue/90"
                >
                  Issue Corporate Card
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  ShieldCheck,
  Building2,
  Users,
  CreditCard,
  Phone,
  Mail,
  X,
  Lock,
  RefreshCw,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Share2,
  Wrench,
  Sparkles,
  BedDouble,
  DollarSign,
  Radio,
  ExternalLink,
  Ban,
  Clock,
  Layers,
} from "lucide-react";

export type BookingSource =
  | "direct"
  | "airbnb"
  | "booking_com"
  | "makemytrip"
  | "agoda"
  | "walk_in"
  | "maintenance";

export type CalendarBookingStatus = "confirmed" | "checked_in" | "checked_out" | "maintenance_hold";

export interface CalendarBooking {
  id: string;
  unitId: string;
  unitName: string;
  propertyName: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  source: BookingSource;
  checkInDate: string; // "YYYY-MM-DD"
  checkOutDate: string; // "YYYY-MM-DD"
  payoutAmount: number;
  adults: number;
  children: number;
  status: CalendarBookingStatus;
  notes?: string;
}

export interface PhysicalUnit {
  id: string;
  name: string;
  type: string;
  property: string;
  category: "suite" | "cottage" | "villa" | "dome" | "tent" | "campsite";
  floorZone: string;
  baseRate: number;
}

export default function UnifiedCalendarPage() {
  const { t } = useTranslation();

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3500);
  };

  // Channel UI styling & logos
  const sourceConfig: Record<
    BookingSource,
    { label: string; bg: string; border: string; badgeVariant: string; isMaintenance?: boolean }
  > = {
    direct: {
      label: "Direct Website",
      bg: "bg-emerald-600 hover:bg-emerald-700 text-white",
      border: "border-emerald-700",
      badgeVariant: "clean",
    },
    airbnb: {
      label: "Airbnb",
      bg: "bg-[#ff5a5f] hover:bg-[#e04e53] text-white",
      border: "border-[#ff5a5f]",
      badgeVariant: "occupied",
    },
    booking_com: {
      label: "Booking.com",
      bg: "bg-[#003580] hover:bg-[#002868] text-white",
      border: "border-[#003580]",
      badgeVariant: "default",
    },
    makemytrip: {
      label: "MakeMyTrip",
      bg: "bg-[#ea2330] hover:bg-[#c91823] text-white",
      border: "border-[#ea2330]",
      badgeVariant: "dirty",
    },
    agoda: {
      label: "Agoda",
      bg: "bg-[#00a699] hover:bg-[#008f83] text-white",
      border: "border-[#00a699]",
      badgeVariant: "clean",
    },
    walk_in: {
      label: "Walk-In / POS",
      bg: "bg-purple-600 hover:bg-purple-700 text-white",
      border: "border-purple-700",
      badgeVariant: "default",
    },
    maintenance: {
      label: "Maintenance Hold",
      bg: "bg-zinc-800 hover:bg-zinc-900 text-amber-300 border border-amber-500/50",
      border: "border-amber-500",
      badgeVariant: "outline",
      isMaintenance: true,
    },
  };

  // -----------------------------------------------------------------
  // 1. Physical Units Inventory across all Estates
  // -----------------------------------------------------------------
  const [units] = useState<PhysicalUnit[]>([
    {
      id: "U-101",
      name: "Suite 101",
      type: "Executive Sky Suite",
      property: "Urban Oasis Sky Villa",
      category: "suite",
      floorZone: "Floor 10 - Sky Deck",
      baseRate: 4500,
    },
    {
      id: "U-102",
      name: "Cottage 102",
      type: "Lake View Cottage",
      property: "Green Valley Farmhouse",
      category: "cottage",
      floorZone: "Lakefront Promenade",
      baseRate: 5500,
    },
    {
      id: "U-103",
      name: "Villa 103",
      type: "Private Pool Garden Villa",
      property: "Green Valley Farmhouse",
      category: "villa",
      floorZone: "West Orchard Campus",
      baseRate: 9500,
    },
    {
      id: "U-FH1",
      name: "Farmhouse Estate",
      type: "3-BHK Heritage Farmhouse",
      property: "Green Valley Farmhouse",
      category: "villa",
      floorZone: "Main Estate Grounds",
      baseRate: 14500,
    },
    {
      id: "U-T01",
      name: "Dome 01 (Lake)",
      type: "Geodesic Glamping Dome",
      property: "Wildwoods Luxury Glamping",
      category: "dome",
      floorZone: "Zone A: Pine Canopy",
      baseRate: 3200,
    },
    {
      id: "U-T02",
      name: "Dome 02 (Forest)",
      type: "Geodesic Glamping Dome",
      property: "Wildwoods Luxury Glamping",
      category: "dome",
      floorZone: "Zone A: Pine Canopy",
      baseRate: 3200,
    },
    {
      id: "U-T03",
      name: "Safari Tent 01",
      type: "Swiss Canvas Luxury Tent",
      property: "Wildwoods Luxury Glamping",
      category: "tent",
      floorZone: "Zone B: Creek Edge",
      baseRate: 2400,
    },
    {
      id: "U-T04",
      name: "Safari Tent 02",
      type: "Swiss Canvas Luxury Tent",
      property: "Wildwoods Luxury Glamping",
      category: "tent",
      floorZone: "Zone B: Creek Edge",
      baseRate: 2400,
    },
  ]);

  // -----------------------------------------------------------------
  // 2. Active Bookings across Channels with Strict Dates
  // -----------------------------------------------------------------
  const [bookings, setBookings] = useState<CalendarBooking[]>([
    {
      id: "BK-DIR-101",
      unitId: "U-101",
      unitName: "Suite 101",
      propertyName: "Urban Oasis Sky Villa",
      guestName: "Ananya Roy",
      guestPhone: "+91 98450 11223",
      guestEmail: "ananya.roy@example.com",
      source: "direct",
      checkInDate: "2026-09-18",
      checkOutDate: "2026-09-20",
      payoutAmount: 11000,
      adults: 2,
      children: 0,
      status: "checked_in",
      notes: "Direct VIP guest. Early check-in requested.",
    },
    {
      id: "BK-ABNB-9988",
      unitId: "U-102",
      unitName: "Cottage 102",
      propertyName: "Green Valley Farmhouse",
      guestName: "Rohit Sharma",
      guestPhone: "+91 98112 34567",
      guestEmail: "rohit.s@example.com",
      source: "airbnb",
      checkInDate: "2026-09-20",
      checkOutDate: "2026-09-23",
      payoutAmount: 16800,
      adults: 2,
      children: 1,
      status: "confirmed",
      notes: "Airbnb reservation HM99881. Barbecue grill kit added.",
    },
    {
      id: "BK-BCOM-4410",
      unitId: "U-103",
      unitName: "Villa 103",
      propertyName: "Green Valley Farmhouse",
      guestName: "David Miller",
      guestPhone: "+44 7700 900123",
      guestEmail: "david.m@example.co.uk",
      source: "booking_com",
      checkInDate: "2026-09-19",
      checkOutDate: "2026-09-23",
      payoutAmount: 38000,
      adults: 4,
      children: 2,
      status: "confirmed",
      notes: "Booking.com Smart Partner. Airport pickup coordinated.",
    },
    {
      id: "BK-MMT-7721",
      unitId: "U-FH1",
      unitName: "Farmhouse Estate",
      propertyName: "Green Valley Farmhouse",
      guestName: "Sanjay Reddy",
      guestPhone: "+91 94400 88776",
      guestEmail: "sanjay.reddy@corp.in",
      source: "makemytrip",
      checkInDate: "2026-09-18",
      checkOutDate: "2026-09-21",
      payoutAmount: 43500,
      adults: 8,
      children: 2,
      status: "checked_in",
      notes: "MMT Black tier booking. Family reunion dinner package.",
    },
    {
      id: "BK-AGD-3019",
      unitId: "U-T01",
      unitName: "Dome 01 (Lake)",
      propertyName: "Wildwoods Luxury Glamping",
      guestName: "Kavita Rao",
      guestPhone: "+91 97000 55443",
      guestEmail: "kavita.rao@tech.io",
      source: "agoda",
      checkInDate: "2026-09-19",
      checkOutDate: "2026-09-21",
      payoutAmount: 6400,
      adults: 2,
      children: 1,
      status: "confirmed",
      notes: "Agoda Express Checkout. High tea at lake deck included.",
    },
    {
      id: "BK-WALK-881",
      unitId: "U-T02",
      unitName: "Dome 02 (Forest)",
      propertyName: "Wildwoods Luxury Glamping",
      guestName: "Deepak Mehta",
      guestPhone: "+91 99880 22114",
      guestEmail: "deepak.m@gmail.com",
      source: "walk_in",
      checkInDate: "2026-09-18",
      checkOutDate: "2026-09-19",
      payoutAmount: 4800,
      adults: 2,
      children: 0,
      status: "checked_in",
      notes: "Walk-in registration via Front-Desk POS.",
    },
    {
      id: "BK-DIR-105",
      unitId: "U-T02",
      unitName: "Dome 02 (Forest)",
      propertyName: "Wildwoods Luxury Glamping",
      guestName: "Pooja Hegde",
      guestPhone: "+91 96111 33445",
      guestEmail: "pooja.h@yahoo.com",
      source: "direct",
      checkInDate: "2026-09-21",
      checkOutDate: "2026-09-24",
      payoutAmount: 14400,
      adults: 2,
      children: 1,
      status: "confirmed",
      notes: "Direct repeat guest.",
    },
    {
      id: "BK-MAINT-990",
      unitId: "U-T03",
      unitName: "Safari Tent 01",
      propertyName: "Wildwoods Luxury Glamping",
      guestName: "Scheduled Waterproofing & Canvas Treatment",
      guestPhone: "+91 98480 34567 (Maintenance Staff Mallesh)",
      source: "maintenance",
      checkInDate: "2026-09-20",
      checkOutDate: "2026-09-22",
      payoutAmount: 0,
      adults: 0,
      children: 0,
      status: "maintenance_hold",
      notes: "Locked down for canvas weather-proofing. No OTA bookings permitted.",
    },
  ]);

  // -----------------------------------------------------------------
  // 3. Navigation & Time Horizon Controls
  // -----------------------------------------------------------------
  const [viewHorizon, setViewHorizon] = useState<"7d" | "14d" | "30d">("7d");
  const [startDateStr, setStartDateStr] = useState<string>("2026-09-18");

  // Filters State
  const [propertyFilter, setPropertyFilter] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Syncing simulation state
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>("Just now");

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncedTime("Just now");
      showToast("✅ Real-Time 2-Way OTA Sync complete: 5 channels synchronized. 0 double-booking collisions.");
    }, 1200);
  };

  // Compute active date range array
  const horizonDaysCount = viewHorizon === "7d" ? 7 : viewHorizon === "14d" ? 14 : 30;

  const currentDays = useMemo(() => {
    const parts = startDateStr.split("-").map(Number);
    const start = new Date(parts[0], parts[1] - 1, parts[2]);

    return Array.from({ length: horizonDaysCount }).map((_, idx) => {
      const d = new Date(start);
      d.setDate(start.getDate() + idx);
      const iso = d.toISOString().split("T")[0];
      const isWeekend = d.getDay() === 5 || d.getDay() === 6;
      const isToday = iso === "2026-09-18"; // Today's mock marker

      return {
        date: iso,
        dayNum: d.getDate(),
        dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
        monthName: d.toLocaleDateString("en-US", { month: "short" }),
        isWeekend,
        isToday,
      };
    });
  }, [startDateStr, horizonDaysCount]);

  // Navigation handlers
  const handleNavPrev = () => {
    const parts = startDateStr.split("-").map(Number);
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    d.setDate(d.getDate() - (viewHorizon === "7d" ? 7 : viewHorizon === "14d" ? 14 : 30));
    setStartDateStr(d.toISOString().split("T")[0]);
  };

  const handleNavNext = () => {
    const parts = startDateStr.split("-").map(Number);
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    d.setDate(d.getDate() + (viewHorizon === "7d" ? 7 : viewHorizon === "14d" ? 14 : 30));
    setStartDateStr(d.toISOString().split("T")[0]);
  };

  const handleNavToday = () => {
    setStartDateStr("2026-09-18");
  };

  // -----------------------------------------------------------------
  // 4. Double-Booking Conflict Guard Function
  // -----------------------------------------------------------------
  const checkCollision = (
    unitId: string,
    checkIn: string,
    checkOut: string,
    excludeBookingId?: string
  ): { hasCollision: boolean; conflictingBooking?: CalendarBooking } => {
    const inTime = new Date(checkIn).getTime();
    const outTime = new Date(checkOut).getTime();

    if (isNaN(inTime) || isNaN(outTime) || inTime >= outTime) {
      return { hasCollision: false };
    }

    const collision = bookings.find((b) => {
      if (b.id === excludeBookingId) return false;
      if (b.unitId !== unitId) return false;

      const bIn = new Date(b.checkInDate).getTime();
      const bOut = new Date(b.checkOutDate).getTime();

      // Overlap condition: inTime < bOut && outTime > bIn
      return inTime < bOut && outTime > bIn;
    });

    return {
      hasCollision: !!collision,
      conflictingBooking: collision,
    };
  };

  // Filtered units
  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      if (propertyFilter !== "all" && u.property !== propertyFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesUnit = u.name.toLowerCase().includes(q) || u.type.toLowerCase().includes(q);
        const matchesGuest = bookings.some(
          (b) => b.unitId === u.id && b.guestName.toLowerCase().includes(q)
        );
        if (!matchesUnit && !matchesGuest) return false;
      }
      return true;
    });
  }, [units, propertyFilter, searchQuery, bookings]);

  // -----------------------------------------------------------------
  // 5. Modals State & Handlers
  // -----------------------------------------------------------------
  const [selectedBooking, setSelectedBooking] = useState<CalendarBooking | null>(null);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState<boolean>(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState<boolean>(false);

  // New Reservation Form
  const [newBookingForm, setNewBookingForm] = useState({
    unitId: "U-101",
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    source: "direct" as BookingSource,
    checkInDate: "2026-09-22",
    checkOutDate: "2026-09-24",
    adults: 2,
    children: 0,
    payoutAmount: 9000,
    notes: "",
  });

  // Maintenance Form
  const [maintenanceForm, setMaintenanceForm] = useState({
    unitId: "U-102",
    reason: "Deep Sanitization & AC Duct Servicing",
    checkInDate: "2026-09-23",
    checkOutDate: "2026-09-25",
    staffNotes: "Mallesh / Caretaker team assigned",
  });

  // Live Collision Check for New Booking Form
  const newBookingCollision = useMemo(() => {
    return checkCollision(
      newBookingForm.unitId,
      newBookingForm.checkInDate,
      newBookingForm.checkOutDate
    );
  }, [newBookingForm.unitId, newBookingForm.checkInDate, newBookingForm.checkOutDate, bookings]);

  // Live Collision Check for Maintenance Form
  const maintenanceCollision = useMemo(() => {
    return checkCollision(
      maintenanceForm.unitId,
      maintenanceForm.checkInDate,
      maintenanceForm.checkOutDate
    );
  }, [maintenanceForm.unitId, maintenanceForm.checkInDate, maintenanceForm.checkOutDate, bookings]);

  // Submit New Booking
  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBookingCollision.hasCollision) {
      showToast("⚠️ Cannot save: Double-booking collision detected!");
      return;
    }
    if (!newBookingForm.guestName.trim()) {
      showToast("Please enter a guest name.");
      return;
    }

    const targetUnit = units.find((u) => u.id === newBookingForm.unitId)!;
    const newBk: CalendarBooking = {
      id: `BK-${newBookingForm.source.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`,
      unitId: targetUnit.id,
      unitName: targetUnit.name,
      propertyName: targetUnit.property,
      guestName: newBookingForm.guestName,
      guestPhone: newBookingForm.guestPhone || "+91 90000 00000",
      guestEmail: newBookingForm.guestEmail,
      source: newBookingForm.source,
      checkInDate: newBookingForm.checkInDate,
      checkOutDate: newBookingForm.checkOutDate,
      payoutAmount: Number(newBookingForm.payoutAmount) || 0,
      adults: Number(newBookingForm.adults) || 1,
      children: Number(newBookingForm.children) || 0,
      status: "confirmed",
      notes: newBookingForm.notes,
    };

    setBookings((prev) => [newBk, ...prev]);
    setIsNewBookingModalOpen(false);
    showToast(`🔒 Reservation ${newBk.id} confirmed & locked on ${targetUnit.name}!`);
  };

  // Submit Maintenance Block
  const handleCreateMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    if (maintenanceCollision.hasCollision) {
      showToast("⚠️ Collision: Unit has guest bookings during these maintenance dates!");
      return;
    }

    const targetUnit = units.find((u) => u.id === maintenanceForm.unitId)!;
    const newMaint: CalendarBooking = {
      id: `MAINT-${Math.floor(1000 + Math.random() * 9000)}`,
      unitId: targetUnit.id,
      unitName: targetUnit.name,
      propertyName: targetUnit.property,
      guestName: `🔧 ${maintenanceForm.reason}`,
      guestPhone: maintenanceForm.staffNotes,
      source: "maintenance",
      checkInDate: maintenanceForm.checkInDate,
      checkOutDate: maintenanceForm.checkOutDate,
      payoutAmount: 0,
      adults: 0,
      children: 0,
      status: "maintenance_hold",
      notes: maintenanceForm.staffNotes,
    };

    setBookings((prev) => [newMaint, ...prev]);
    setIsMaintenanceModalOpen(false);
    showToast(`🔒 ${targetUnit.name} locked out for maintenance.`);
  };

  // Cancel / Release Lock
  const handleCancelBooking = (bookingId: string) => {
    if (confirm("Release this reservation and unlock dates for OTA sync?")) {
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      setSelectedBooking(null);
      showToast("Reservation released and calendar dates unlocked.");
    }
  };

  // Status Progression
  const handleUpdateStatus = (bookingId: string, nextStatus: CalendarBookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: nextStatus } : b))
    );
    setSelectedBooking((prev) => (prev && prev.id === bookingId ? { ...prev, status: nextStatus } : prev));
    showToast(`Booking status updated to ${nextStatus.toUpperCase()}`);
  };

  // Summary Metrics
  const metrics = useMemo(() => {
    const inHouse = bookings.filter((b) => b.status === "checked_in").length;
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const maintenanceCount = bookings.filter((b) => b.status === "maintenance_hold").length;
    const revenueSum = bookings.reduce((sum, b) => sum + b.payoutAmount, 0);

    return {
      totalKeys: units.length,
      inHouse,
      confirmed,
      maintenanceCount,
      revenueSum,
      occupancyPercent: Math.round(((inHouse + confirmed) / (units.length * 1.5)) * 100),
    };
  }, [units, bookings]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 bg-zinc-900 text-white rounded-xl shadow-2xl text-xs border border-zinc-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rentcot-blue/10 text-rentcot-blue rounded-xl border border-rentcot-blue/20">
              <CalendarDays className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-foreground">
                  Unified Booking Calendar
                </h1>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold gap-1"
                >
                  <Lock className="h-3 w-3" />
                  Double-Booking Locked
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Single unified view of physical keys synchronized across Direct, Airbnb, Booking.com, MMT, Agoda & Walk-Ins.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncAll}
            disabled={isSyncing}
            className="text-xs gap-1.5 border-border shadow-xs hover:bg-muted"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-rentcot-blue ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Syncing OTAs..." : "Sync Channels"}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMaintenanceModalOpen(true)}
            className="text-xs gap-1.5 border-border shadow-xs hover:bg-muted"
          >
            <Wrench className="h-3.5 w-3.5 text-amber-500" />
            Hold for Maintenance
          </Button>
          <Button
            size="sm"
            onClick={() => setIsNewBookingModalOpen(true)}
            className="text-xs bg-rentcot-blue text-white hover:bg-rentcot-blue/90 gap-1.5 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            New Reservation
          </Button>
        </div>
      </div>

      {/* Real-Time OTA Channel Sync Status Ribbon */}
      <div className="p-3 bg-muted/40 rounded-2xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-bold text-foreground text-[11px] flex items-center gap-1.5">
            <Radio className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
            Channel Sync Engine:
          </span>
          <div className="flex items-center gap-2 flex-wrap text-[11px]">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Direct Webhook: Live
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Airbnb 2-Way API
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Booking.com Direct XML
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              MakeMyTrip Switch
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-muted-foreground shrink-0">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>Last audit: {lastSyncedTime}</span>
          <span className="text-border">|</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">0 Collisions Active</span>
        </div>
      </div>

      {/* Operational Tally Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <Card className="border-border shadow-xs bg-card/60 backdrop-blur-xs">
          <CardContent className="p-4">
            <span className="text-xs text-muted-foreground block">Active Keys</span>
            <div className="mt-1 text-2xl font-black text-foreground">{metrics.totalKeys}</div>
            <span className="text-[10px] text-muted-foreground">Across 3 properties</span>
          </CardContent>
        </Card>
        <Card className="border-border shadow-xs bg-card/60 backdrop-blur-xs">
          <CardContent className="p-4">
            <span className="text-xs text-muted-foreground block">In-House Guests</span>
            <div className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {metrics.inHouse}
            </div>
            <span className="text-[10px] text-emerald-600">Checked-in & registered</span>
          </CardContent>
        </Card>
        <Card className="border-border shadow-xs bg-card/60 backdrop-blur-xs">
          <CardContent className="p-4">
            <span className="text-xs text-muted-foreground block">Confirmed Upcoming</span>
            <div className="mt-1 text-2xl font-black text-foreground">{metrics.confirmed}</div>
            <span className="text-[10px] text-muted-foreground">Guaranteed reservations</span>
          </CardContent>
        </Card>
        <Card className="border-border shadow-xs bg-card/60 backdrop-blur-xs">
          <CardContent className="p-4">
            <span className="text-xs text-muted-foreground block">Maintenance Holds</span>
            <div className="mt-1 text-2xl font-black text-amber-500">{metrics.maintenanceCount}</div>
            <span className="text-[10px] text-muted-foreground">OTAs locked out</span>
          </CardContent>
        </Card>
        <Card className="border-border shadow-xs bg-card/60 backdrop-blur-xs col-span-2 md:col-span-1">
          <CardContent className="p-4">
            <span className="text-xs text-muted-foreground block">Channel Revenue</span>
            <div className="mt-1 text-2xl font-black text-rentcot-blue">
              ₹{metrics.revenueSum.toLocaleString("en-IN")}
            </div>
            <span className="text-[10px] text-muted-foreground">Confirmed payouts</span>
          </CardContent>
        </Card>
      </div>

      {/* Date Navigation & View Horizons Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3 bg-card rounded-xl border border-border shadow-xs">
        {/* Date Selector & Step Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleNavPrev} className="h-8 px-2">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleNavToday} className="h-8 text-xs font-semibold px-2.5">
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={handleNavNext} className="h-8 px-2">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-xs font-bold text-foreground px-2">
            {currentDays[0].monthName} {currentDays[0].dayNum} –{" "}
            {currentDays[currentDays.length - 1].monthName} {currentDays[currentDays.length - 1].dayNum}, 2026
          </span>
        </div>

        {/* View Horizon Pills & Filters */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border text-xs">
            <button
              type="button"
              onClick={() => setViewHorizon("7d")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                viewHorizon === "7d"
                  ? "bg-background shadow-xs text-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              7 Days
            </button>
            <button
              type="button"
              onClick={() => setViewHorizon("14d")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                viewHorizon === "14d"
                  ? "bg-background shadow-xs text-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              14 Days
            </button>
            <button
              type="button"
              onClick={() => setViewHorizon("30d")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                viewHorizon === "30d"
                  ? "bg-background shadow-xs text-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              30 Days
            </button>
          </div>

          {/* Property Dropdown */}
          <select
            aria-label="Filter by Property"
            value={propertyFilter}
            onChange={(e) => setPropertyFilter(e.target.value)}
            className="text-xs h-8 px-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-hidden"
          >
            <option value="all">All Properties</option>
            <option value="Green Valley Farmhouse">Green Valley Farmhouse</option>
            <option value="Wildwoods Luxury Glamping">Wildwoods Luxury Glamping</option>
            <option value="Urban Oasis Sky Villa">Urban Oasis Sky Villa</option>
          </select>

          {/* Search Box */}
          <div className="relative w-44">
            <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search unit or guest..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs h-8 pl-7 border-border"
            />
          </div>
        </div>
      </div>

      {/* Channel Source Legend */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl border border-border bg-card text-xs">
        <span className="font-semibold text-muted-foreground text-[11px] mr-1">Channel Sources:</span>
        {Object.entries(sourceConfig).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${cfg.bg}`} />
            <span className="text-foreground text-[11px] font-medium">{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* Main Unified Timeline Grid */}
      <Card className="border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div style={{ minWidth: viewHorizon === "30d" ? "1450px" : viewHorizon === "14d" ? "1100px" : "850px" }}>
            {/* Header Row */}
            <div
              className="grid border-b border-border bg-muted/40 text-xs font-bold text-muted-foreground"
              style={{
                gridTemplateColumns: `220px repeat(${currentDays.length}, minmax(0, 1fr))`,
              }}
            >
              <div className="p-3 border-r border-border flex items-center bg-card sticky left-0 z-20">
                <span>Unit / Accommodation</span>
              </div>
              {currentDays.map((day) => (
                <div
                  key={day.date}
                  className={`p-2 text-center border-r last:border-r-0 border-border ${
                    day.isToday
                      ? "bg-rentcot-blue/10 text-rentcot-blue font-black"
                      : day.isWeekend
                      ? "bg-amber-500/5 text-amber-900 dark:text-amber-300"
                      : ""
                  }`}
                >
                  <span className="text-[9px] uppercase font-bold block">{day.dayName}</span>
                  <span className="text-sm font-extrabold text-foreground">{day.dayNum}</span>
                </div>
              ))}
            </div>

            {/* Unit Rows */}
            <div className="divide-y divide-border">
              {filteredUnits.map((unit) => {
                // Find all bookings for this unit
                const unitBookings = bookings.filter((b) => {
                  if (channelFilter !== "all" && b.source !== channelFilter) return false;
                  return b.unitId === unit.id;
                });

                return (
                  <div
                    key={unit.id}
                    className="grid relative hover:bg-muted/15 transition-colors"
                    style={{
                      gridTemplateColumns: `220px repeat(${currentDays.length}, minmax(0, 1fr))`,
                    }}
                  >
                    {/* Unit Info Sticky Column */}
                    <div className="p-3 border-r border-border flex flex-col justify-center bg-card sticky left-0 z-20 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground truncate">{unit.name}</span>
                        <span className="text-[9px] font-mono text-muted-foreground uppercase">
                          ₹{unit.baseRate.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground truncate">{unit.type}</span>
                      <span className="text-[9px] text-muted-foreground/80 truncate">{unit.floorZone}</span>
                    </div>

                    {/* Day Slot Cells */}
                    {currentDays.map((day, dIdx) => {
                      return (
                        <div
                          key={day.date}
                          className={`min-h-[64px] border-r last:border-r-0 border-border relative flex items-center justify-center ${
                            day.isToday ? "bg-rentcot-blue/5" : day.isWeekend ? "bg-amber-500/5" : ""
                          }`}
                        >
                          {/* Render booking block if it starts on this date */}
                          {unitBookings
                            .filter((b) => b.checkInDate === day.date)
                            .map((b) => {
                              const cfg = sourceConfig[b.source];

                              // Calculate duration within view range
                              const checkInIdx = dIdx;
                              const outTime = new Date(b.checkOutDate).getTime();
                              const inTime = new Date(b.checkInDate).getTime();
                              const durationDays = Math.max(
                                1,
                                Math.round((outTime - inTime) / (1000 * 60 * 60 * 24))
                              );
                              const colSpan = durationDays;
                              const widthPercent = colSpan * 100;

                              return (
                                <div
                                  key={b.id}
                                  onClick={() => setSelectedBooking(b)}
                                  style={{
                                    width: `calc(${widthPercent}% - 6px)`,
                                  }}
                                  className={`absolute left-1 z-10 h-12 rounded-lg px-2 py-1 text-xs cursor-pointer shadow-md transition-all hover:scale-[1.01] hover:z-30 flex flex-col justify-between select-none ${cfg.bg}`}
                                  title={`${b.guestName} (${b.source.toUpperCase()}) - ${b.checkInDate} to ${b.checkOutDate}`}
                                >
                                  <div className="flex items-center justify-between gap-1 overflow-hidden">
                                    <span className="font-bold truncate text-[11px] leading-tight flex items-center gap-1">
                                      {b.source === "maintenance" ? (
                                        <Wrench className="h-3 w-3 shrink-0" />
                                      ) : (
                                        <Lock className="h-2.5 w-2.5 shrink-0 opacity-80" />
                                      )}
                                      {b.guestName}
                                    </span>
                                    <span className="text-[9px] uppercase font-mono font-bold shrink-0 opacity-90">
                                      {b.source.replace("_", ".")}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between text-[10px] opacity-90 truncate">
                                    <span>
                                      {b.source === "maintenance"
                                        ? "Hold Active"
                                        : `₹${b.payoutAmount.toLocaleString()} • ${b.adults}A`}
                                    </span>
                                    <span className="text-[9px] uppercase font-semibold">
                                      {b.status === "checked_in"
                                        ? "In-House"
                                        : b.status === "maintenance_hold"
                                        ? "Locked"
                                        : "Confirmed"}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* MODAL 1: New Reservation with Double-Booking Conflict Guard       */}
      {/* ----------------------------------------------------------------- */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Plus className="h-4 w-4 text-rentcot-blue" />
                  New Reservation (Direct / OTA)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Strict collision guard prevents double-booking across any physical key.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsNewBookingModalOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleCreateBooking} className="p-5 space-y-4 overflow-y-auto">
              {/* Collision Alert Banner */}
              {newBookingCollision.hasCollision && newBookingCollision.conflictingBooking && (
                <div className="p-3.5 rounded-xl border border-rose-500/50 bg-rose-500/10 text-rose-700 dark:text-rose-300 space-y-1 text-xs animate-in shake">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="h-4 w-4 text-rose-500" />
                    Double-Booking Collision Detected!
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    This unit is already locked by{" "}
                    <strong>{newBookingCollision.conflictingBooking.guestName}</strong> (
                    {newBookingCollision.conflictingBooking.id} via{" "}
                    {newBookingCollision.conflictingBooking.source.toUpperCase()}) from{" "}
                    <strong>{newBookingCollision.conflictingBooking.checkInDate}</strong> to{" "}
                    <strong>{newBookingCollision.conflictingBooking.checkOutDate}</strong>.
                  </p>
                  <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 block pt-0.5">
                    🚫 Reservation cannot proceed. Select another unit or shift dates.
                  </span>
                </div>
              )}

              {!newBookingCollision.hasCollision && (
                <div className="p-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 flex items-center gap-2 text-xs">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Unit is clear. No schedule collisions detected for these dates.</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 col-span-2">
                  <Label className="text-xs font-semibold">Assigned Physical Unit *</Label>
                  <select
                    aria-label="Select Unit"
                    value={newBookingForm.unitId}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, unitId: e.target.value })}
                    className="w-full text-xs h-9 px-3 bg-background border border-border rounded-lg text-foreground font-semibold"
                  >
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} — {u.property} ({u.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Check-In Date *</Label>
                  <Input
                    type="date"
                    required
                    value={newBookingForm.checkInDate}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, checkInDate: e.target.value })}
                    className="text-xs h-9 border-border"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Check-Out Date *</Label>
                  <Input
                    type="date"
                    required
                    value={newBookingForm.checkOutDate}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, checkOutDate: e.target.value })}
                    className="text-xs h-9 border-border"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Booking Source Channel *</Label>
                  <select
                    aria-label="Booking Channel"
                    value={newBookingForm.source}
                    onChange={(e) =>
                      setNewBookingForm({ ...newBookingForm, source: e.target.value as BookingSource })
                    }
                    className="w-full text-xs h-9 px-3 bg-background border border-border rounded-lg text-foreground capitalize"
                  >
                    <option value="direct">Direct Website</option>
                    <option value="airbnb">Airbnb</option>
                    <option value="booking_com">Booking.com</option>
                    <option value="makemytrip">MakeMyTrip</option>
                    <option value="agoda">Agoda</option>
                    <option value="walk_in">Walk-in / POS</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Total Payout / Amount (₹) *</Label>
                  <Input
                    type="number"
                    min="0"
                    required
                    value={newBookingForm.payoutAmount}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, payoutAmount: Number(e.target.value) })}
                    className="text-xs h-9 border-border font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <Label className="text-xs font-semibold">Primary Guest Name *</Label>
                  <Input
                    required
                    placeholder="e.g. Vikram Malhotra"
                    value={newBookingForm.guestName}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, guestName: e.target.value })}
                    className="text-xs h-9 border-border"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Phone Number</Label>
                  <Input
                    placeholder="+91 98765 43210"
                    value={newBookingForm.guestPhone}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, guestPhone: e.target.value })}
                    className="text-xs h-9 border-border font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="guest@example.com"
                    value={newBookingForm.guestEmail}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, guestEmail: e.target.value })}
                    className="text-xs h-9 border-border"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Adults</Label>
                  <Input
                    type="number"
                    min="1"
                    value={newBookingForm.adults}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, adults: Number(e.target.value) })}
                    className="text-xs h-9 border-border"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Children</Label>
                  <Input
                    type="number"
                    min="0"
                    value={newBookingForm.children}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, children: Number(e.target.value) })}
                    className="text-xs h-9 border-border"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsNewBookingModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={newBookingCollision.hasCollision}
                  size="sm"
                  className="text-xs bg-rentcot-blue text-white hover:bg-rentcot-blue/90 disabled:opacity-50"
                >
                  Lock & Confirm Reservation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* MODAL 2: Quick Maintenance / Housekeeping Hold Modal               */}
      {/* ----------------------------------------------------------------- */}
      {isMaintenanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-amber-500" />
                <h3 className="font-bold text-base text-foreground">Lock Room for Maintenance</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMaintenanceModalOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleCreateMaintenance} className="space-y-3.5">
              {maintenanceCollision.hasCollision && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-700 dark:text-rose-300 text-xs">
                  <strong>Conflict:</strong> A guest booking exists during these dates on this unit.
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Physical Unit</Label>
                <select
                  aria-label="Unit for Maintenance"
                  value={maintenanceForm.unitId}
                  onChange={(e) => setMaintenanceForm({ ...maintenanceForm, unitId: e.target.value })}
                  className="w-full text-xs h-9 px-3 bg-background border border-border rounded-lg text-foreground font-semibold"
                >
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} — {u.property}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Reason for Lockout</Label>
                <Input
                  required
                  placeholder="e.g. AC Gas Refill & Deep Steam Clean"
                  value={maintenanceForm.reason}
                  onChange={(e) => setMaintenanceForm({ ...maintenanceForm, reason: e.target.value })}
                  className="text-xs h-9 border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Lock From Date</Label>
                  <Input
                    type="date"
                    required
                    value={maintenanceForm.checkInDate}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, checkInDate: e.target.value })}
                    className="text-xs h-9 border-border"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Lock Until Date</Label>
                  <Input
                    type="date"
                    required
                    value={maintenanceForm.checkOutDate}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, checkOutDate: e.target.value })}
                    className="text-xs h-9 border-border"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Staff Assignment / Notes</Label>
                <Input
                  placeholder="e.g. Mallesh (Housekeeping Lead)"
                  value={maintenanceForm.staffNotes}
                  onChange={(e) => setMaintenanceForm({ ...maintenanceForm, staffNotes: e.target.value })}
                  className="text-xs h-9 border-border"
                />
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMaintenanceModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={maintenanceCollision.hasCollision}
                  size="sm"
                  className="text-xs bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Lock Down Key
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* MODAL 3: Deep Reservation Inspector / Folio Drawer                */}
      {/* ----------------------------------------------------------------- */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl p-5 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${sourceConfig[selectedBooking.source].bg}`} />
                <h3 className="font-bold text-base text-foreground">Reservation Dossier</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedBooking(null)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-muted/40 border border-border">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Reference</span>
                  <span className="font-mono font-bold text-sm text-rentcot-blue">{selectedBooking.id}</span>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground block text-[10px]">Channel</span>
                  <Badge variant="outline" className="capitalize font-bold text-xs">
                    {selectedBooking.source.replace("_", " ")}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-background border border-border">
                  <span className="text-muted-foreground block text-[10px]">Guest Name</span>
                  <span className="font-bold text-foreground">{selectedBooking.guestName}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-background border border-border">
                  <span className="text-muted-foreground block text-[10px]">Contact</span>
                  <span className="font-mono text-foreground">{selectedBooking.guestPhone}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-background border border-border">
                  <span className="text-muted-foreground block text-[10px]">Stay Window</span>
                  <span className="font-semibold text-foreground">
                    {selectedBooking.checkInDate} to {selectedBooking.checkOutDate}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-background border border-border">
                  <span className="text-muted-foreground block text-[10px]">Assigned Key</span>
                  <span className="font-bold text-foreground">
                    {selectedBooking.unitName} ({selectedBooking.propertyName})
                  </span>
                </div>
              </div>

              {selectedBooking.source !== "maintenance" && (
                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between">
                  <span className="text-muted-foreground">Channel Payout</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    ₹{selectedBooking.payoutAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              {selectedBooking.notes && (
                <div className="p-2.5 rounded-lg bg-muted/30 border border-border text-[11px] text-muted-foreground">
                  <strong>Notes:</strong> {selectedBooking.notes}
                </div>
              )}

              {/* Status Progression Workflow */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-muted-foreground block">
                  Update Stay Status:
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={selectedBooking.status === "confirmed" ? "default" : "outline"}
                    onClick={() => handleUpdateStatus(selectedBooking.id, "confirmed")}
                    className="text-xs flex-1"
                  >
                    Confirmed
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedBooking.status === "checked_in" ? "default" : "outline"}
                    onClick={() => handleUpdateStatus(selectedBooking.id, "checked_in")}
                    className="text-xs flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    In-House
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedBooking.status === "checked_out" ? "default" : "outline"}
                    onClick={() => handleUpdateStatus(selectedBooking.id, "checked_out")}
                    className="text-xs flex-1"
                  >
                    Checked Out
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const cleanPhone = selectedBooking.guestPhone.replace(/[^0-9]/g, "");
                    const msg = encodeURIComponent(
                      `Hello ${selectedBooking.guestName}, this is Rentcot Concierge confirming your reservation ${selectedBooking.id} at ${selectedBooking.unitName}. Let us know if you need check-in directions!`
                    );
                    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
                  }}
                  className="text-xs border-border gap-1 hover:bg-muted"
                >
                  <Share2 className="h-3.5 w-3.5 text-emerald-600" />
                  WhatsApp Guest
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCancelBooking(selectedBooking.id)}
                  className="text-xs text-rose-600 hover:bg-rose-50 hover:border-rose-200 dark:hover:bg-rose-950 border-border"
                >
                  Release Lock / Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

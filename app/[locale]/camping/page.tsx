"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type CampsitePitch,
  type CampfireBbqOrder,
  type GearItem,
  type WeatherSafetyState,
  type TentStatus,
  type CampsiteGuest,
} from "@/lib/camping/types";
import {
  Tent,
  Flame,
  Wind,
  CloudRain,
  Thermometer,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Dog,
  Users,
  Compass,
  Sparkles,
  Bath,
  Plug,
  Layers,
  PhoneCall,
  VolumeX,
  Plus,
  Clock,
  Check,
  Package,
  RefreshCw,
  Download,
  FileText,
  ShoppingCart,
  Tag,
  UserCheck,
  Bell,
  MessageCircle,
  Utensils,
  Search,
  Filter,
  Eye,
  Printer,
  Send,
  QrCode,
  ArrowRight,
  X,
  ChevronRight,
  Calendar,
  FileDown,
  LogOut,
  IndianRupee,
  Sliders,
  BedDouble,
  BarChart3,
  MapPin,
  Coffee,
  CheckSquare,
  Ban,
  Phone,
  Moon,
  Sun,
  Radio,
  SlidersHorizontal,
  Share2,
  TreePine,
  AlertCircle,
} from "lucide-react";

// Generate 200 real-market tents spanning 4 physical zones
const generate200Tents = (): CampsitePitch[] => {
  const tents: CampsitePitch[] = [];

  for (let i = 1; i <= 200; i++) {
    let zone: "A" | "B" | "C" | "D" = "A";
    let zoneName = "Zone A: Lakeside Glamping Domes";
    let type = "Luxury Geodesic Dome";
    let rate = 4500;
    let capacity = 4;
    let groundType: CampsitePitch["groundType"] = "wooden_deck";
    let powerSupply: CampsitePitch["powerSupply"] = "16a_rv_hookup";
    let firePit: CampsitePitch["firePit"] = "private_stone_pit";
    let hasAttachedWashroom = true;
    let distanceToWashroomMeters = 0;

    if (i <= 50) {
      zone = "A";
      zoneName = "Zone A: Lakeside Glamping Domes";
      type = "Luxury Geodesic Dome (AC/Deck)";
      rate = 4500;
      capacity = 4;
      groundType = "wooden_deck";
      powerSupply = "16a_rv_hookup";
      firePit = "private_stone_pit";
      hasAttachedWashroom = true;
      distanceToWashroomMeters = 0;
    } else if (i <= 100) {
      zone = "B";
      zoneName = "Zone B: Pine Forest Swiss Tents";
      type = "Swiss Canvas Cottage Tent";
      rate = 3800;
      capacity = 3;
      groundType = "wooden_deck";
      powerSupply = "5a_standard_plug";
      firePit = "private_stone_pit";
      hasAttachedWashroom = true;
      distanceToWashroomMeters = 0;
    } else if (i <= 150) {
      zone = "C";
      zoneName = "Zone C: Valley Alpine Tents";
      type = "Pre-Pitched Alpine Dome";
      rate = 2800;
      capacity = 2;
      groundType = "grass_lawn";
      powerSupply = "solar_usb_only";
      firePit = "portable_fire_brazier";
      hasAttachedWashroom = false;
      distanceToWashroomMeters = 25;
    } else {
      zone = "D";
      zoneName = "Zone D: Campers Lawn & BYOT";
      type = "Meadow Pitch + 4-Person Coleman";
      rate = 2200;
      capacity = 4;
      groundType = "grass_lawn";
      powerSupply = "16a_rv_hookup";
      firePit = "central_amphitheater";
      hasAttachedWashroom = false;
      distanceToWashroomMeters = 40;
    }

    let status: TentStatus = "available";
    let guest: CampsiteGuest | undefined = undefined;

    // Seed some initial real-life reservations
    if (i === 2) {
      status = "reserved";
      guest = {
        bookingId: "NY26-RC002",
        name: "Rajesh & Sunita Sharma",
        phone: "+91 98480 12345",
        email: "rajesh.sharma@example.com",
        adults: 2,
        children: 1,
        pets: 0,
        checkIn: "31 Dec 2025, 02:00 PM",
        checkOut: "01 Jan 2026, 11:00 AM",
        paidAmount: 4500,
        paymentStatus: "paid",
        mealPlan: "jain",
        bbqOptIn: true,
        firewoodBundles: 1,
        sleepingBagsExtra: 0,
        notes: "Family arriving from Hyderabad by car. Requested extra campfire kit.",
      };
    } else if (i === 12) {
      status = "occupied";
      guest = {
        bookingId: "NY26-RC012",
        name: "Vikram Malhotra & Friends",
        phone: "+91 98201 55432",
        email: "vikram.m@example.com",
        adults: 4,
        children: 0,
        pets: 1,
        checkIn: "30 Dec 2025, 03:00 PM",
        checkOut: "02 Jan 2026, 11:00 AM",
        paidAmount: 9000,
        paymentStatus: "paid",
        mealPlan: "non_veg",
        bbqOptIn: true,
        firewoodBundles: 2,
        sleepingBagsExtra: 2,
        notes: "Pet husky with group. Registered at forest gate.",
      };
    } else if (i === 55) {
      status = "occupied";
      guest = {
        bookingId: "NY26-RC055",
        name: "Ananya Deshmukh",
        phone: "+91 97011 22334",
        email: "ananya.d@example.com",
        adults: 2,
        children: 0,
        pets: 0,
        checkIn: "31 Dec 2025, 01:30 PM",
        checkOut: "01 Jan 2026, 11:00 AM",
        paidAmount: 3800,
        paymentStatus: "paid",
        mealPlan: "veg_special",
        bbqOptIn: false,
        firewoodBundles: 1,
        sleepingBagsExtra: 0,
      };
    } else if (i === 80) {
      status = "dirty";
    } else if (i === 110) {
      status = "maintenance";
    }

    tents.push({
      id: i,
      pitchNumber: `RC-${i}`,
      name: `Pitch #${i} (${type})`,
      zone,
      zoneName,
      type,
      groundType,
      powerSupply,
      firePit,
      maxOccupancy: capacity,
      ratePerNight: rate,
      hasAttachedWashroom,
      distanceToWashroomMeters,
      isShaded: i % 2 === 0,
      status,
      currentGuest: guest,
    });
  }

  return tents;
};

const initialCampfireOrders: CampfireBbqOrder[] = [
  {
    id: "BBQ-101",
    pitchNumber: "RC-2",
    guestName: "Rajesh Sharma",
    phone: "+91 98480 12345",
    scheduledTime: "19:30",
    firewoodBundles: 1,
    bbqPackage: "veg_marinade",
    fireSafetyCleared: true,
    status: "delivered",
    totalAmount: 1200,
  },
  {
    id: "BBQ-102",
    pitchNumber: "RC-12",
    guestName: "Vikram Malhotra",
    phone: "+91 98201 55432",
    scheduledTime: "20:00",
    firewoodBundles: 2,
    bbqPackage: "mixed_grill",
    fireSafetyCleared: true,
    status: "lit",
    totalAmount: 2400,
  },
  {
    id: "BBQ-103",
    pitchNumber: "RC-55",
    guestName: "Ananya Deshmukh",
    phone: "+91 97011 22334",
    scheduledTime: "20:30",
    firewoodBundles: 1,
    bbqPackage: "wood_only",
    fireSafetyCleared: false,
    status: "scheduled",
    totalAmount: 600,
  },
];

const initialGearInventory: GearItem[] = [
  {
    id: "gear-01",
    name: "Sub-Zero Thermal Sleeping Bag (-5°C)",
    category: "sleeping_bag",
    serialTag: "SB-2026-088",
    condition: "ready_sanitized",
    lastSanitized: "Today, 11:30 AM (UV Chamber 2)",
    dailyRate: 350,
  },
  {
    id: "gear-02",
    name: "Self-Inflating Double Camping Mattress",
    category: "air_mattress",
    serialTag: "MAT-2026-014",
    condition: "ready_sanitized",
    lastSanitized: "Today, 09:15 AM (Steam & Dry)",
    dailyRate: 450,
  },
  {
    id: "gear-03",
    name: "Rechargeable 1000lm Forest Lantern",
    category: "headlamp",
    serialTag: "LTN-2026-042",
    condition: "ready_sanitized",
    lastSanitized: "Yesterday",
    dailyRate: 150,
  },
  {
    id: "gear-04",
    name: "Carbon Fiber Trekking Poles (Pair)",
    category: "trekking_pole",
    serialTag: "POLE-2026-019",
    condition: "in_use",
    currentPitch: "RC-12",
    lastSanitized: "28 Dec 2025",
    dailyRate: 200,
  },
  {
    id: "gear-05",
    name: "High-Altitude Butane Camp Stove",
    category: "portable_stove",
    serialTag: "STV-2026-007",
    condition: "needs_cleaning",
    lastSanitized: "Awaiting Cleaning",
    dailyRate: 300,
  },
];

export default function CampingOperationsPage() {
  const { t, locale } = useTranslation();

  // Toast notification feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3500);
  };

  // Active Tab: 5 production operations views
  const [activeTab, setActiveTab] = useState<
    "tents" | "campfire_bbq" | "gear_rentals" | "safety_wildlife" | "bookings"
  >("tents");

  // State: 200 physical tents
  const [tents, setTents] = useState<CampsitePitch[]>(generate200Tents);
  const [selectedTent, setSelectedTent] = useState<CampsitePitch | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  // Filters & Search for Tents Matrix
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState<"ALL" | "A" | "B" | "C" | "D">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | TentStatus>("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "zones" | "table">("grid");

  // Walk-in form state
  const [walkInName, setWalkInName] = useState("");
  const [walkInPhone, setWalkInPhone] = useState("");
  const [walkInAdults, setWalkInAdults] = useState(2);
  const [walkInMeal, setWalkInMeal] = useState<"veg_special" | "jain" | "standard_veg" | "non_veg">("veg_special");

  // Campfire orders & Gear
  const [bbqOrders, setBbqOrders] = useState<CampfireBbqOrder[]>(initialCampfireOrders);
  const [gearInventory, setGearInventory] = useState<GearItem[]>(initialGearInventory);

  // Weather & Forest Safety State
  const [windSpeed, setWindSpeed] = useState<number>(18);
  const [isHighWindBan, setIsHighWindBan] = useState<boolean>(false);
  const [isCurfewSent, setIsCurfewSent] = useState<boolean>(false);

  // Modals
  const [isNewBbqModalOpen, setIsNewBbqModalOpen] = useState(false);
  const [newBbqPitch, setNewBbqPitch] = useState("RC-1");
  const [newBbqGuest, setNewBbqGuest] = useState("");
  const [newBbqPhone, setNewBbqPhone] = useState("");
  const [newBbqTime, setNewBbqTime] = useState("20:00");
  const [newBbqPackage, setNewBbqPackage] = useState<"veg_marinade" | "mixed_grill" | "wood_only">("mixed_grill");
  const [newBbqBundles, setNewBbqBundles] = useState(2);

  // Filtered Tents
  const filteredTents = useMemo(() => {
    return tents.filter((tent) => {
      if (selectedZone !== "ALL" && tent.zone !== selectedZone) return false;
      if (statusFilter !== "ALL" && tent.status !== statusFilter) return false;

      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchesNumber = tent.id.toString() === q || tent.pitchNumber.toLowerCase().includes(q);
        const matchesGuest = tent.currentGuest?.name.toLowerCase().includes(q) || false;
        const matchesPhone = tent.currentGuest?.phone.includes(q) || false;
        if (!matchesNumber && !matchesGuest && !matchesPhone) return false;
      }

      return true;
    });
  }, [tents, selectedZone, statusFilter, searchQuery]);

  // Operational Counts
  const counts = useMemo(() => {
    const total = tents.length;
    const reserved = tents.filter((t) => t.status === "reserved").length;
    const occupied = tents.filter((t) => t.status === "occupied").length;
    const available = tents.filter((t) => t.status === "available").length;
    const maintenance = tents.filter((t) => t.status === "maintenance").length;
    const dirty = tents.filter((t) => t.status === "dirty").length;

    const totalGuests = tents.reduce((acc, curr) => {
      if (curr.currentGuest) {
        return acc + (curr.currentGuest.adults || 0) + (curr.currentGuest.children || 0);
      }
      return acc;
    }, 0);

    const totalRevenue = tents.reduce((acc, curr) => {
      return acc + (curr.currentGuest?.paidAmount || 0);
    }, 0);

    return {
      total,
      reserved,
      occupied,
      available,
      maintenance,
      dirty,
      confirmedBookings: reserved + occupied,
      totalGuests: totalGuests || 8,
      totalRevenue: totalRevenue || 17300,
    };
  }, [tents]);

  const handleTentClick = (tent: CampsitePitch) => {
    setSelectedTent(tent);
    setIsDetailDrawerOpen(true);
    setWalkInName("");
    setWalkInPhone("");
  };

  const updateTentStatus = (tentId: string | number, newStatus: TentStatus) => {
    setTents((prev) =>
      prev.map((t) => {
        if (t.id === tentId) {
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
    if (selectedTent && selectedTent.id === tentId) {
      setSelectedTent((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`Pitch #${tentId} updated to ${newStatus.toUpperCase()}`);
  };

  const handleWalkInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTent || !walkInName.trim()) {
      showToast("Please provide guest name.");
      return;
    }

    const newGuest: CampsiteGuest = {
      bookingId: `WALK-${selectedTent.id}-${Date.now().toString().slice(-4)}`,
      name: walkInName,
      phone: walkInPhone || "+91 98480 00000",
      email: `${walkInName.toLowerCase().replace(/\s+/g, "")}@example.com`,
      adults: walkInAdults,
      children: 0,
      pets: 0,
      checkIn: "Today, Front Desk Express Walk-In",
      checkOut: "Tomorrow, 11:00 AM",
      paidAmount: selectedTent.ratePerNight,
      paymentStatus: "paid",
      mealPlan: walkInMeal,
      bbqOptIn: true,
      firewoodBundles: 1,
      sleepingBagsExtra: 0,
      notes: "Walk-in registration at camp reception",
    };

    setTents((prev) =>
      prev.map((t) => {
        if (t.id === selectedTent.id) {
          return {
            ...t,
            status: "occupied",
            currentGuest: newGuest,
          };
        }
        return t;
      })
    );

    setSelectedTent((prev) => (prev ? { ...prev, status: "occupied", currentGuest: newGuest } : null));
    setWalkInName("");
    setWalkInPhone("");
    showToast(`✅ Pitch #${selectedTent.id} allocated & checked in for ${walkInName}!`);
  };

  const handleReleaseTent = (tentId: string | number) => {
    setTents((prev) =>
      prev.map((t) => {
        if (t.id === tentId) {
          return { ...t, status: "dirty", currentGuest: undefined };
        }
        return t;
      })
    );
    if (selectedTent && selectedTent.id === tentId) {
      setSelectedTent((prev) => (prev ? { ...prev, status: "dirty", currentGuest: undefined } : null));
    }
    showToast(`Pitch #${tentId} checked out and routed to Housekeeping Turnover.`);
  };

  const handleOrderSafetyToggle = (orderId: string) => {
    setBbqOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const next = !o.fireSafetyCleared;
          showToast(`Order ${orderId} fire safety ${next ? "cleared & verified" : "marked pending"}.`);
          return { ...o, fireSafetyCleared: next };
        }
        return o;
      })
    );
  };

  const handleOrderStatusTransition = (orderId: string, nextStatus: CampfireBbqOrder["status"]) => {
    setBbqOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
    showToast(`Order ${orderId} transitioned to ${nextStatus.toUpperCase()}`);
  };

  const handleCreateBbqOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBbqGuest.trim()) {
      showToast("Please enter guest name.");
      return;
    }
    const orderCost = newBbqPackage === "mixed_grill" ? 2400 : newBbqPackage === "veg_marinade" ? 1200 : 600;
    const newOrder: CampfireBbqOrder = {
      id: `BBQ-${Math.floor(100 + Math.random() * 900)}`,
      pitchNumber: newBbqPitch,
      guestName: newBbqGuest,
      phone: newBbqPhone || "+91 98480 00000",
      scheduledTime: newBbqTime,
      firewoodBundles: newBbqBundles,
      bbqPackage: newBbqPackage,
      fireSafetyCleared: true,
      status: "scheduled",
      totalAmount: orderCost * newBbqBundles,
    };
    setBbqOrders((prev) => [newOrder, ...prev]);
    setIsNewBbqModalOpen(false);
    showToast(`🔥 Campfire & BBQ order confirmed for ${newOrder.pitchNumber}!`);
  };

  const handleGearStatusToggle = (gearId: string) => {
    setGearInventory((prev) =>
      prev.map((g) => {
        if (g.id === gearId) {
          const nextCondition = g.condition === "ready_sanitized" ? "in_use" : "ready_sanitized";
          showToast(`Gear ${g.name} marked ${nextCondition === "ready_sanitized" ? "UV Sanitized" : "Dispatched to Pitch"}.`);
          return {
            ...g,
            condition: nextCondition,
            lastSanitized: nextCondition === "ready_sanitized" ? "Just Now (UV Chamber 1)" : g.lastSanitized,
          };
        }
        return g;
      })
    );
  };

  const handleCurfewBroadcast = () => {
    setIsCurfewSent(true);
    showToast("📢 10:30 PM Silence & Campfire Curfew broadcast sent to all in-house campers via SMS/WhatsApp.");
    setTimeout(() => setIsCurfewSent(false), 5000);
  };

  const handleExportPitchManifest = () => {
    const headers = [
      "Tent #",
      "Zone",
      "Category",
      "Status",
      "Rate (INR)",
      "Guest Name",
      "Phone",
      "Check-In",
      "Meal Plan",
      "Paid (INR)",
    ];

    const rows = tents.map((t) => [
      t.pitchNumber,
      `"${t.zoneName}"`,
      `"${t.type}"`,
      t.status,
      t.ratePerNight,
      t.currentGuest ? `"${t.currentGuest.name}"` : "Vacant",
      t.currentGuest ? `"${t.currentGuest.phone}"` : "-",
      t.currentGuest ? `"${t.currentGuest.checkIn}"` : "-",
      t.currentGuest ? t.currentGuest.mealPlan : "-",
      t.currentGuest ? t.currentGuest.paidAmount : 0,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rentcot_Wildwoods_Ananthagiri_Manifest_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("📥 Exported 200-pitch manifest CSV for forest checkpost authorities.");
  };

  return (
    <div className="space-y-6 pb-20 p-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 bg-zinc-900 text-white rounded-xl shadow-2xl text-xs border border-zinc-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header with Forest Range Micro-Climate Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-border/85 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md">
            <TreePine className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                Campsite Operations & PMS
              </h1>
              <Badge variant="outline" className="text-[11px] font-bold py-0.5 px-2.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300">
                200-Pitch Ground Cockpit
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
              <span>Wildwoods Glamping & Campsite • Ananthagiri Hills, Vikarabad Range • Alt: 710m</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Telemetry Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Live Ground Telemetry</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsNewBbqModalOpen(true)}
            className="text-xs h-9 gap-1.5 border-border hover:bg-muted font-medium"
          >
            <Flame className="h-3.5 w-3.5 text-amber-500" />
            <span>Order Campfire</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCurfewBroadcast}
            className="text-xs h-9 gap-1.5 border-border hover:bg-muted font-medium"
          >
            <VolumeX className="h-3.5 w-3.5 text-purple-500" />
            <span>Curfew Broadcast</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPitchManifest}
            className="text-xs h-9 gap-1.5 border-border hover:bg-muted font-semibold"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Checkpost CSV</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setTents(generate200Tents());
              showToast("Ground allocation grid reloaded to real-time state.");
            }}
            className="text-xs h-9 gap-1.5 border-border hover:bg-muted font-medium"
            title="Reload live tent assignments"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Grid</span>
          </Button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <Card className="border border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs hover:border-emerald-500/40 transition-all">
          <CardContent className="p-3.5 sm:p-4 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 font-mono">Active</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-foreground">
              {counts.confirmedBookings}
            </div>
            <div className="text-xs font-bold text-foreground">
              Confirmed Guests
            </div>
            <div className="text-[11px] text-muted-foreground">
              {counts.occupied} checked in
            </div>
          </CardContent>
        </Card>

        <Card className="border border-amber-500/20 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs hover:border-amber-500/40 transition-all">
          <CardContent className="p-3.5 sm:p-4 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-white">
                <Flame className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 font-mono">Evening</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-foreground">
              {bbqOrders.length}
            </div>
            <div className="text-xs font-bold text-foreground">
              Campfire & BBQ Kits
            </div>
            <div className="text-[11px] text-muted-foreground">
              {bbqOrders.filter((o) => o.fireSafetyCleared).length} safety verified
            </div>
          </CardContent>
        </Card>

        <Card className="border border-blue-500/20 bg-blue-50/40 dark:bg-blue-950/20 shadow-xs hover:border-blue-500/40 transition-all">
          <CardContent className="p-3.5 sm:p-4 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rentcot-blue text-white">
                <Tent className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold text-rentcot-blue font-mono">200 Ground</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-foreground">
              {counts.available}
            </div>
            <div className="text-xs font-bold text-foreground">
              Vacant Pitches
            </div>
            <div className="text-[11px] text-muted-foreground">
              Ready for instant walk-ins
            </div>
          </CardContent>
        </Card>

        <Card className="border border-purple-500/20 bg-purple-50/40 dark:bg-purple-950/20 shadow-xs hover:border-purple-500/40 transition-all">
          <CardContent className="p-3.5 sm:p-4 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 font-mono">Turnover</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-foreground">
              {counts.dirty}
            </div>
            <div className="text-xs font-bold text-foreground">
              Cleaning Roster
            </div>
            <div className="text-[11px] text-muted-foreground">
              {counts.maintenance} in maintenance
            </div>
          </CardContent>
        </Card>

        <Card className="border border-teal-500/20 bg-teal-50/40 dark:bg-teal-950/20 shadow-xs hover:border-teal-500/40 transition-all">
          <CardContent className="p-3.5 sm:p-4 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
                <Users className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 font-mono">Campers</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-foreground">
              {counts.totalGuests}
            </div>
            <div className="text-xs font-bold text-foreground">
              Campers on Ground
            </div>
            <div className="text-[11px] text-muted-foreground">
              Kitchen headcount plan
            </div>
          </CardContent>
        </Card>

        <Card className="border border-orange-500/20 bg-orange-50/40 dark:bg-orange-950/20 shadow-xs hover:border-orange-500/40 transition-all">
          <CardContent className="p-3.5 sm:p-4 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white">
                <IndianRupee className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold text-orange-700 dark:text-orange-300 font-mono">Revenue</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-foreground">
              ₹{counts.totalRevenue.toLocaleString("en-IN")}
            </div>
            <div className="text-xs font-bold text-foreground">
              Live Folio Sum
            </div>
            <div className="text-[11px] text-muted-foreground">
              100% verified & prepaid
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operations Navigation Tabs */}
      <div className="overflow-x-auto pb-1">
        <div className="inline-flex p-1 rounded-xl bg-card border border-border text-xs font-semibold gap-1 min-w-max shadow-xs">
          {[
            { id: "tents" as const, label: "200-Pitch Matrix & Zones", icon: Tent },
            { id: "campfire_bbq" as const, label: "Campfire & BBQ Orders", icon: Flame },
            { id: "gear_rentals" as const, label: "Adventure Gear & UV Chamber", icon: Package },
            { id: "safety_wildlife" as const, label: "Weather & Forest Wildlife Safety", icon: ShieldAlert },
            { id: "bookings" as const, label: "Campers Manifest & Arrivals", icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? "bg-rentcot-blue text-white shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-muted-foreground"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: 200-PITCH MATRIX & ZONES                                */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "tents" && (
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="p-4 sm:p-6 pb-4 border-b border-border/80">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rentcot-blue/10 text-rentcot-blue">
                    <Tent className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg sm:text-xl font-bold text-foreground">
                        Live Ground Allocation Matrix
                      </CardTitle>
                      <Badge className="bg-rentcot-blue text-white font-mono text-[11px] py-0 px-2 font-bold">
                        RC-1 to RC-200
                      </Badge>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground mt-0.5">
                      Operational ground grid for Ananthagiri Hills. Click any pitch to inspect, register walk-ins, or manage checkouts.
                    </CardDescription>
                  </div>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold bg-muted/40 px-3 py-1.5 rounded-lg border border-border">
                <button
                  onClick={() => setStatusFilter(statusFilter === "available" ? "ALL" : "available")}
                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors ${
                    statusFilter === "available" ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold" : "text-foreground"
                  }`}
                >
                  <span className="h-3 w-3 rounded-md border-2 border-emerald-500 bg-emerald-500/20" />
                  <span>Available ({counts.available})</span>
                </button>
                <button
                  onClick={() => setStatusFilter(statusFilter === "occupied" ? "ALL" : "occupied")}
                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors ${
                    statusFilter === "occupied" ? "bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold" : "text-foreground"
                  }`}
                >
                  <span className="h-3 w-3 rounded-md border-2 border-rose-500 bg-rose-500/30" />
                  <span>Occupied ({counts.occupied})</span>
                </button>
                <button
                  onClick={() => setStatusFilter(statusFilter === "reserved" ? "ALL" : "reserved")}
                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors ${
                    statusFilter === "reserved" ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold" : "text-foreground"
                  }`}
                >
                  <span className="h-3 w-3 rounded-md border-2 border-amber-500 bg-amber-500/30" />
                  <span>Reserved ({counts.reserved})</span>
                </button>
                <button
                  onClick={() => setStatusFilter(statusFilter === "dirty" ? "ALL" : "dirty")}
                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors ${
                    statusFilter === "dirty" ? "bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold" : "text-foreground"
                  }`}
                >
                  <span className="h-3 w-3 rounded-md border-2 border-purple-500 bg-purple-500/30" />
                  <span>Cleaning ({counts.dirty})</span>
                </button>
                {statusFilter !== "ALL" && (
                  <button
                    onClick={() => setStatusFilter("ALL")}
                    className="text-[10px] text-muted-foreground hover:text-foreground underline ml-1"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>

            {/* Zone Filters & View Modes */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-4 border-t border-border/60 mt-4">
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {[
                  { key: "ALL" as const, label: "All 200 Pitches", count: counts.total },
                  { key: "A" as const, label: "Zone A: Lakeside Domes (1-50)", count: 50 },
                  { key: "B" as const, label: "Zone B: Pine Forest (51-100)", count: 50 },
                  { key: "C" as const, label: "Zone C: Valley Alpine (101-150)", count: 50 },
                  { key: "D" as const, label: "Zone D: Campers Lawn (151-200)", count: 50 },
                ].map((z) => (
                  <button
                    key={z.key}
                    onClick={() => setSelectedZone(z.key)}
                    className={`px-3 py-1 rounded-md font-semibold transition-all ${
                      selectedZone === z.key
                        ? "bg-foreground text-background shadow-xs font-bold"
                        : "bg-muted/60 text-muted-foreground hover:text-foreground border border-border/60"
                    }`}
                  >
                    {z.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-56 sm:w-64">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Find pitch # or guest name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 text-xs pl-8 pr-3 bg-background border-border"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>

                <div className="inline-flex p-0.5 rounded-lg bg-muted border border-border text-xs">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-2.5 py-1 rounded-md font-semibold ${
                      viewMode === "grid" ? "bg-background text-foreground shadow-xs font-bold" : "text-muted-foreground"
                    }`}
                    title="Grid Matrix View"
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode("zones")}
                    className={`px-2.5 py-1 rounded-md font-semibold ${
                      viewMode === "zones" ? "bg-background text-foreground shadow-xs font-bold" : "text-muted-foreground"
                    }`}
                    title="Zone Cards"
                  >
                    Zones
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`px-2.5 py-1 rounded-md font-semibold ${
                      viewMode === "table" ? "bg-background text-foreground shadow-xs font-bold" : "text-muted-foreground"
                    }`}
                    title="Table Manifest View"
                  >
                    Manifest
                  </button>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            {viewMode === "grid" && (
              <div className="space-y-4">
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16 2xl:grid-cols-20 gap-2">
                  {filteredTents.map((tent) => {
                    const isReserved = tent.status === "reserved";
                    const isOccupied = tent.status === "occupied";
                    const isMaintenance = tent.status === "maintenance";
                    const isDirty = tent.status === "dirty";

                    let badgeStyles =
                      "border-emerald-500/60 bg-emerald-50/50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300 hover:bg-emerald-100 hover:border-emerald-600";

                    if (isReserved) {
                      badgeStyles =
                        "border-amber-500 bg-amber-100 text-amber-950 dark:bg-amber-950/70 dark:text-amber-200 font-bold ring-2 ring-amber-400/40 shadow-sm";
                    } else if (isOccupied) {
                      badgeStyles =
                        "border-rose-500 bg-rose-100 text-rose-950 dark:bg-rose-950/70 dark:text-rose-200 font-bold ring-2 ring-rose-400/40 shadow-sm";
                    } else if (isDirty) {
                      badgeStyles =
                        "border-purple-500 bg-purple-100 text-purple-950 dark:bg-purple-950/70 dark:text-purple-200";
                    } else if (isMaintenance) {
                      badgeStyles =
                        "border-muted bg-muted/60 text-muted-foreground opacity-60";
                    }

                    return (
                      <button
                        key={tent.id}
                        onClick={() => handleTentClick(tent)}
                        title={`Pitch #${tent.id} (${tent.type}) - ${tent.status.toUpperCase()}${
                          tent.currentGuest ? ` • Guest: ${tent.currentGuest.name}` : ""
                        }`}
                        className={`group relative flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all active:scale-95 text-center min-h-[54px] ${badgeStyles}`}
                      >
                        <Tent className={`h-4 w-4 mb-0.5 transition-transform group-hover:scale-110 ${
                          isReserved
                            ? "text-amber-700 dark:text-amber-300"
                            : isOccupied
                            ? "text-rose-700 dark:text-rose-300"
                            : "text-emerald-600 dark:text-emerald-400"
                        }`} />
                        <span className="font-mono text-xs font-black leading-none">
                          {tent.id}
                        </span>

                        {tent.currentGuest && (
                          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-600 dark:bg-rose-400 ring-2 ring-white dark:ring-black" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {filteredTents.length === 0 && (
                  <div className="py-12 text-center text-muted-foreground text-sm border border-dashed border-border rounded-xl">
                    No pitches match the selected zone or search criteria.
                  </div>
                )}
              </div>
            )}

            {viewMode === "zones" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "A" as const, name: "Zone A: Lakeside Domes", range: "RC-1 to RC-50", type: "Geodesic Glamping Dome", rate: "₹4,500/nt", power: "16A RV Hookup", bath: "En-suite bathroom & deck" },
                  { key: "B" as const, name: "Zone B: Pine Forest", range: "RC-51 to RC-100", type: "Swiss Canvas Cottage", rate: "₹3,800/nt", power: "5A Standard Plug", bath: "Attached toilet tent" },
                  { key: "C" as const, name: "Zone C: Valley Alpine", range: "RC-101 to RC-150", type: "Alpine Dome Tent", rate: "₹2,800/nt", power: "Solar USB Station", bath: "Central bathhouse (25m)" },
                  { key: "D" as const, name: "Zone D: Campers Lawn", range: "RC-151 to RC-200", type: "Meadow Ground Pitch", rate: "₹2,200/nt", power: "16A RV Hookup", bath: "Central bathhouse (40m)" },
                ].map((z) => {
                  const zoneTents = tents.filter((t) => t.zone === z.key);
                  const zoneReserved = zoneTents.filter((t) => t.status === "reserved").length;
                  const zoneOccupied = zoneTents.filter((t) => t.status === "occupied").length;
                  const zoneAvailable = zoneTents.filter((t) => t.status === "available").length;

                  return (
                    <Card key={z.key} className="border border-border bg-card shadow-xs">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-base font-bold text-foreground">{z.name}</CardTitle>
                            <span className="text-xs text-muted-foreground font-mono">{z.range} • {z.rate}</span>
                          </div>
                          <Badge variant="outline" className="text-xs font-mono font-bold">
                            {zoneOccupied + zoneReserved} / 50 Occupied
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2 space-y-3">
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p><strong>Accommodations:</strong> {z.type}</p>
                          <p><strong>Power Hookup:</strong> {z.power}</p>
                          <p><strong>Washroom:</strong> {z.bath}</p>
                        </div>

                        {/* Occupancy bar */}
                        <div className="space-y-1">
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-rentcot-blue h-2 rounded-full"
                              style={{ width: `${((zoneOccupied + zoneReserved) / 50) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                          <span className="text-emerald-600 font-bold">{zoneAvailable} Available</span>
                          <span className="text-rose-600 font-bold">{zoneOccupied} Occupied</span>
                          <span className="text-amber-600 font-bold">{zoneReserved} Reserved</span>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedZone(z.key);
                            setViewMode("grid");
                          }}
                          className="w-full text-xs h-8 font-semibold"
                        >
                          Filter to Zone {z.key} Grid
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {viewMode === "table" && (
              <div className="overflow-x-auto border rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted text-muted-foreground uppercase text-[10px] font-bold border-b">
                    <tr>
                      <th className="p-3">Pitch #</th>
                      <th className="p-3">Zone & Type</th>
                      <th className="p-3">Rate</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Guest</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Meal</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredTents.slice(0, 50).map((t) => (
                      <tr key={t.id} className="hover:bg-muted/40">
                        <td className="p-3 font-mono font-bold">{t.pitchNumber}</td>
                        <td className="p-3">
                          <div className="font-semibold text-foreground">{t.zoneName.split(":")[0]}</div>
                          <div className="text-[11px] text-muted-foreground">{t.type}</div>
                        </td>
                        <td className="p-3 font-mono">₹{t.ratePerNight}</td>
                        <td className="p-3">
                          <Badge
                            className={`text-[10px] font-bold ${
                              t.status === "available"
                                ? "bg-emerald-600 text-white"
                                : t.status === "occupied"
                                ? "bg-rose-600 text-white"
                                : t.status === "reserved"
                                ? "bg-amber-600 text-white"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {t.status}
                          </Badge>
                        </td>
                        <td className="p-3 font-medium text-foreground">
                          {t.currentGuest ? t.currentGuest.name : "—"}
                        </td>
                        <td className="p-3 font-mono text-muted-foreground">
                          {t.currentGuest ? t.currentGuest.phone : "—"}
                        </td>
                        <td className="p-3 capitalize">
                          {t.currentGuest ? t.currentGuest.mealPlan.replace("_", " ") : "—"}
                        </td>
                        <td className="p-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTentClick(t)}
                            className="text-[10px] h-7 px-2"
                          >
                            Inspect
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: CAMPFIRE & BBQ ORDERS                                   */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "campfire_bbq" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                    <Flame className="h-5 w-5 text-amber-600" />
                    <span>Evening Campfire & BBQ Schedule</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Firewood bundle allocations, food safety clearances, and delivery roster.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setIsNewBbqModalOpen(true)}
                  className="bg-rentcot-blue text-white text-xs h-8 gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> New Order
                </Button>
              </div>

              {bbqOrders.map((order) => (
                <Card key={order.id} className="border border-border hover:border-amber-500/40 transition-all bg-card">
                  <CardContent className="p-4 sm:p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded">
                            {order.pitchNumber}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                            <Clock className="h-3.5 w-3.5 text-rentcot-blue" />
                            {order.scheduledTime}
                          </span>
                          <Badge
                            className={`text-[10px] capitalize font-bold ${
                              order.status === "lit"
                                ? "bg-orange-600 text-white"
                                : order.status === "delivered"
                                ? "bg-emerald-600 text-white"
                                : "bg-amber-500 text-white"
                            }`}
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <h4 className="font-bold text-base text-foreground">{order.guestName}</h4>
                        <span className="text-xs text-muted-foreground font-mono">{order.phone}</span>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="text-xs text-muted-foreground">Total Bill</div>
                        <div className="text-base font-bold font-mono text-foreground">₹{order.totalAmount}</div>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-3 bg-muted/40 p-2.5 rounded-lg border border-border">
                      <span>📦 {order.firewoodBundles} Bundles (15kg Seasoned Wood)</span>
                      <span>•</span>
                      <span className="capitalize font-semibold text-foreground">
                        🍢 {order.bbqPackage.replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border">
                      {/* Safety Clearance Toggle */}
                      <button
                        onClick={() => handleOrderSafetyToggle(order.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold border transition-colors ${
                          order.fireSafetyCleared
                            ? "border-emerald-500/40 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : "border-destructive/40 bg-destructive/10 text-destructive"
                        }`}
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>{order.fireSafetyCleared ? "Fire Safety Checklist Verified" : "Awaiting Sand & Extinguisher Check"}</span>
                      </button>

                      {/* Status Transition Buttons */}
                      <div className="flex items-center gap-1.5">
                        {order.status === "scheduled" && (
                          <Button
                            size="sm"
                            className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-8"
                            onClick={() => handleOrderStatusTransition(order.id, "delivered")}
                          >
                            Mark Delivered
                          </Button>
                        )}
                        {order.status === "delivered" && (
                          <Button
                            size="sm"
                            className="bg-orange-600 hover:bg-orange-700 text-white text-xs h-8"
                            disabled={isHighWindBan}
                            onClick={() => handleOrderStatusTransition(order.id, "lit")}
                          >
                            {isHighWindBan ? "Locked (High Wind Ban)" : "Bonfire Lit 🔥"}
                          </Button>
                        )}
                        {order.status === "lit" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-8 text-blue-600 border-blue-300"
                            onClick={() => handleOrderStatusTransition(order.id, "extinguished")}
                          >
                            Damped with Water 💧
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Forest Fire Safety SOP Card */}
            <Card className="border-amber-500/30 bg-card h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-600" />
                  <span>Forest Fire Safety SOP</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Mandatory protocols for all outdoor fire pits.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>2 Metal Sand Buckets & 1 ABC Dry Powder Extinguisher within 15 meters of each pit.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Keep 3-meter cleared perimeter free of dry pine needles and leaves.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Strict 11:00 PM water damping round conducted by night patrol Mallesh.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Emergency water hose pressure test verified daily at 5:00 PM.</span>
                </div>

                <div className="pt-3 border-t border-border">
                  <div className="font-bold text-foreground mb-1">High Wind Auto-Lockout:</div>
                  <p className="text-[11px] text-muted-foreground">
                    If ground wind speed exceeds 25 km/h, the system prevents bonfire ignitions until wind subsides.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: ADVENTURE GEAR & UV SANITIZATION                        */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "gear_rentals" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Package className="h-5 w-5 text-rentcot-blue" />
                <span>Adventure Gear & UV Chamber Roster</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Every sleeping bag and mattress is UV-sanitized and sealed in hygienic sleeves between camper stays.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gearInventory.map((gear) => (
              <Card key={gear.id} className="border border-border hover:border-rentcot-blue/40 transition-all bg-card">
                <CardContent className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-muted-foreground">{gear.serialTag}</span>
                      <h4 className="font-bold text-sm text-foreground mt-0.5">{gear.name}</h4>
                    </div>
                    {gear.condition === "ready_sanitized" ? (
                      <Badge className="bg-emerald-600 text-white text-[10px] gap-1 font-bold">
                        <Sparkles className="h-2.5 w-2.5" /> UV Sanitized
                      </Badge>
                    ) : gear.condition === "in_use" ? (
                      <Badge variant="secondary" className="text-[10px]">
                        In Use ({gear.currentPitch})
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-[10px]">
                        Cleaning Needed
                      </Badge>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground flex justify-between bg-muted/40 p-2.5 rounded-lg border border-border">
                    <span>Daily Rental: <strong className="text-foreground font-mono">₹{gear.dailyRate}</strong></span>
                    <span>Sanitized: <strong className="text-foreground">{gear.lastSanitized}</strong></span>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGearStatusToggle(gear.id)}
                      className="text-xs h-8 w-full font-semibold"
                    >
                      {gear.condition === "ready_sanitized" ? "Assign to Tent / Pitch" : "UV Sanitize & Restock"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: WEATHER & FOREST SAFETY COCKPIT                         */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "safety_wildlife" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Weather & Fire Ban Controller */}
            <Card className="border border-border bg-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Wind className="h-5 w-5 text-sky-600" />
                  <CardTitle className="text-base font-bold">Forest Micro-Climate & Wind Hazard Monitor</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Ground weather telemetry synced with forest fire mitigation controls.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-muted/40 border border-border text-center">
                    <Wind className="h-4 w-4 mx-auto text-sky-600 mb-1" />
                    <span className="text-muted-foreground text-[10px] block">Wind Speed</span>
                    <span className="text-lg font-bold font-mono text-foreground">{windSpeed} km/h</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border border-border text-center">
                    <Thermometer className="h-4 w-4 mx-auto text-amber-600 mb-1" />
                    <span className="text-muted-foreground text-[10px] block">Night Temp</span>
                    <span className="text-lg font-bold font-mono text-foreground">16°C</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border border-border text-center">
                    <CloudRain className="h-4 w-4 mx-auto text-blue-600 mb-1" />
                    <span className="text-muted-foreground text-[10px] block">Rain Risk</span>
                    <span className="text-lg font-bold font-mono text-foreground">5%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border border-border text-center">
                    <Moon className="h-4 w-4 mx-auto text-purple-600 mb-1" />
                    <span className="text-muted-foreground text-[10px] block">Quiet Hours</span>
                    <span className="text-xs font-bold text-foreground">10:30 PM</span>
                  </div>
                </div>

                {/* Wind Simulation Slider */}
                <div className="space-y-1.5 p-3 rounded-xl bg-muted/20 border border-border">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Simulate Ananthagiri Wind Velocity</span>
                    <span className="font-mono">{windSpeed} km/h</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="45"
                    value={windSpeed}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setWindSpeed(val);
                      if (val > 25) {
                        setIsHighWindBan(true);
                        showToast("⚠️ High wind threshold (>25 km/h) reached! Automatic bonfire ban activated.");
                      } else {
                        setIsHighWindBan(false);
                      }
                    }}
                    className="w-full accent-rentcot-blue cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Calm (5 km/h)</span>
                    <span>Threshold: 25 km/h</span>
                    <span>High Gusts (45 km/h)</span>
                  </div>
                </div>

                {/* Emergency Campfire Ban Button */}
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      <Flame className="h-4 w-4 text-amber-600" />
                      <span>Campfire High-Wind Lockout:</span>
                    </div>
                    <Badge
                      className={`text-[10px] font-bold ${
                        isHighWindBan ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"
                      }`}
                    >
                      {isHighWindBan ? "ACTIVE BAN ENFORCED" : "OPEN PIT CLEARED"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Instantly suspends all outdoor bonfires and notifies pit marshals via push broadcast.
                  </p>
                  <Button
                    size="sm"
                    variant={isHighWindBan ? "destructive" : "outline"}
                    onClick={() => {
                      const next = !isHighWindBan;
                      setIsHighWindBan(next);
                      showToast(next ? "Emergency campfire ban enforced!" : "Campfire ban lifted.");
                    }}
                    className="w-full text-xs h-8 font-bold"
                  >
                    {isHighWindBan ? "Lift Campfire Ban (Safe Winds)" : "Trigger Emergency Campfire Ban"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Wildlife & Forest Boundary Telemetry */}
            <Card className="border border-border bg-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Compass className="h-5 w-5 text-emerald-600" />
                  <CardTitle className="text-base font-bold">Forest Boundary & Wildlife Monitoring</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Infrared perimeter sensor logs and forest ranger dispatch coordinates.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-2">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      Perimeter Fence Solar Sensors: All Active
                    </span>
                    <Badge variant="outline" className="text-[10px] bg-emerald-100 dark:bg-emerald-950 font-mono">
                      8/8 ONLINE
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Solar infrared tripwire along Ananthagiri reserve forest perimeter functioning normally.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-foreground">Recent Forest Animal Activity:</div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border">
                      <span>Wild Boar Herd detected near Creek Sector 4</span>
                      <span className="text-[10px] font-mono text-muted-foreground">Today, 03:15 AM</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border">
                      <span>Spotted Deer grazing in Zone B Pine Clearing</span>
                      <span className="text-[10px] font-mono text-muted-foreground">Yesterday, 06:40 PM</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border space-y-2">
                  <div className="font-bold text-foreground">Emergency Forest Ranger Dispatch:</div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => showToast("Calling Vikarabad Forest Range Officer: +91 94408 12345")}
                      className="text-xs flex-1 gap-1"
                    >
                      <Phone className="h-3 w-3 text-emerald-600" />
                      Vikarabad Forest RO
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => showToast("Calling Camp Caretaker Mallesh: +91 98481 11223")}
                      className="text-xs flex-1 gap-1"
                    >
                      <Phone className="h-3 w-3 text-rentcot-blue" />
                      Head Ranger Mallesh
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: GUEST MANIFEST & ARRIVALS                               */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "bookings" && (
        <Card className="border border-border bg-card">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Camper Manifest & Forest Checkpost Log</CardTitle>
              <CardDescription className="text-xs">
                Official register for Ananthagiri Forest Checkpost authorities and camp kitchen planning.
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportPitchManifest}
              className="text-xs gap-1"
            >
              <Download className="h-3 w-3" /> Export CSV
            </Button>
          </CardHeader>
          <CardContent className="p-4">
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted text-muted-foreground uppercase text-[10px] font-bold border-b">
                  <tr>
                    <th className="p-3">Pitch #</th>
                    <th className="p-3">Guest Name</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Party</th>
                    <th className="p-3">Meal Plan</th>
                    <th className="p-3">Campfire</th>
                    <th className="p-3">Check-In</th>
                    <th className="p-3">Paid Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tents
                    .filter((t) => t.currentGuest)
                    .map((t) => (
                      <tr key={t.id} className="hover:bg-muted/40">
                        <td className="p-3 font-mono font-bold text-rentcot-blue">{t.pitchNumber}</td>
                        <td className="p-3 font-bold text-foreground">{t.currentGuest?.name}</td>
                        <td className="p-3 font-mono text-muted-foreground">{t.currentGuest?.phone}</td>
                        <td className="p-3 font-semibold">
                          {t.currentGuest?.adults} Adults, {t.currentGuest?.children} Kids
                        </td>
                        <td className="p-3 capitalize font-medium">{t.currentGuest?.mealPlan.replace("_", " ")}</td>
                        <td className="p-3">
                          {t.currentGuest?.bbqOptIn ? (
                            <Badge className="bg-amber-600 text-white text-[10px]">Active</Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="p-3 text-[11px] text-muted-foreground">{t.currentGuest?.checkIn}</td>
                        <td className="p-3 font-mono font-bold text-emerald-600">
                          ₹{t.currentGuest?.paidAmount.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SLIDE-OVER PITCH 360° INSPECTION DRAWER                       */}
      {/* ------------------------------------------------------------- */}
      {isDetailDrawerOpen && selectedTent && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border-l border-border w-full max-w-md h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2">
                <Tent className="h-5 w-5 text-rentcot-blue" />
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    Pitch #{selectedTent.id} ({selectedTent.pitchNumber})
                  </h3>
                  <span className="text-[11px] text-muted-foreground">{selectedTent.zoneName}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDetailDrawerOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Drawer Content */}
            <div className="p-5 space-y-4 overflow-y-auto text-xs flex-1">
              {/* Pitch Status & Quick Status Switcher */}
              <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-semibold">Current Operational Status:</span>
                  <Badge
                    className={`capitalize font-bold text-xs ${
                      selectedTent.status === "available"
                        ? "bg-emerald-600 text-white"
                        : selectedTent.status === "occupied"
                        ? "bg-rose-600 text-white"
                        : selectedTent.status === "reserved"
                        ? "bg-amber-600 text-white"
                        : "bg-purple-600 text-white"
                    }`}
                  >
                    {selectedTent.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <Button
                    size="sm"
                    variant={selectedTent.status === "available" ? "default" : "outline"}
                    onClick={() => updateTentStatus(selectedTent.id, "available")}
                    className="text-[10px] h-7 px-2 flex-1"
                  >
                    Available
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedTent.status === "dirty" ? "default" : "outline"}
                    onClick={() => updateTentStatus(selectedTent.id, "dirty")}
                    className="text-[10px] h-7 px-2 flex-1"
                  >
                    Clean Queue
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedTent.status === "maintenance" ? "default" : "outline"}
                    onClick={() => updateTentStatus(selectedTent.id, "maintenance")}
                    className="text-[10px] h-7 px-2 flex-1"
                  >
                    Repair
                  </Button>
                </div>
              </div>

              {/* Pitch Ground Specs */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-background border border-border">
                  <span className="text-muted-foreground block text-[10px]">Nightly Base Rate</span>
                  <span className="font-mono font-bold text-foreground">₹{selectedTent.ratePerNight}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-background border border-border">
                  <span className="text-muted-foreground block text-[10px]">Max Sleeping Capacity</span>
                  <span className="font-bold text-foreground">{selectedTent.maxOccupancy} Campers</span>
                </div>
                <div className="p-2.5 rounded-lg bg-background border border-border">
                  <span className="text-muted-foreground block text-[10px]">Power Hookup</span>
                  <span className="font-semibold text-foreground capitalize">{selectedTent.powerSupply.replace("_", " ")}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-background border border-border">
                  <span className="text-muted-foreground block text-[10px]">Washroom</span>
                  <span className="font-semibold text-foreground">
                    {selectedTent.hasAttachedWashroom ? "Attached En-suite" : `${selectedTent.distanceToWashroomMeters}m to Bathhouse`}
                  </span>
                </div>
              </div>

              {/* IN-HOUSE GUEST FOLIO (If occupied or reserved) */}
              {selectedTent.currentGuest ? (
                <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400">
                        In-House Camper Folio
                      </span>
                      <h4 className="font-bold text-base text-foreground mt-0.5">{selectedTent.currentGuest.name}</h4>
                    </div>
                    <Badge variant="clean" className="text-[10px]">
                      {selectedTent.currentGuest.bookingId}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-mono font-semibold">{selectedTent.currentGuest.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Party Size:</span>
                      <span>{selectedTent.currentGuest.adults} Adults, {selectedTent.currentGuest.children} Children</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Meal Preference:</span>
                      <span className="capitalize font-semibold">{selectedTent.currentGuest.mealPlan.replace("_", " ")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Paid Amount:</span>
                      <span className="font-mono font-bold text-emerald-600">₹{selectedTent.currentGuest.paidAmount}</span>
                    </div>
                  </div>

                  {selectedTent.currentGuest.notes && (
                    <p className="text-[11px] text-muted-foreground italic bg-background/60 p-2 rounded border border-border">
                      {selectedTent.currentGuest.notes}
                    </p>
                  )}

                  {/* Communication & Checkout Actions */}
                  <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const cleanPhone = selectedTent.currentGuest?.phone.replace(/[^0-9]/g, "") || "";
                        const msg = encodeURIComponent(
                          `Hello ${selectedTent.currentGuest?.name}, this is Wildwoods Campsite Concierge at Ananthagiri Hills. Please let us know if you need firewood, water, or dinner service at Pitch ${selectedTent.pitchNumber}!`
                        );
                        window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
                      }}
                      className="text-xs flex-1 gap-1 border-border hover:bg-muted"
                    >
                      <Share2 className="h-3 w-3 text-emerald-600" />
                      WhatsApp
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReleaseTent(selectedTent.id)}
                      className="text-xs text-rose-600 hover:bg-rose-50 hover:border-rose-300 dark:hover:bg-rose-950 flex-1 border-border"
                    >
                      Check Out
                    </Button>
                  </div>
                </div>
              ) : (
                /* VACANT PITCH: FRONT DESK EXPRESS WALK-IN FORM */
                <form onSubmit={handleWalkInSubmit} className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">
                      Pitch is Available
                    </span>
                    <h4 className="font-bold text-sm text-foreground">Front-Desk Walk-In Registration</h4>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <Label className="text-[11px] font-semibold">Camper Name *</Label>
                      <Input
                        required
                        placeholder="e.g. Sravan Kumar"
                        value={walkInName}
                        onChange={(e) => setWalkInName(e.target.value)}
                        className="text-xs h-8 border-border mt-0.5"
                      />
                    </div>

                    <div>
                      <Label className="text-[11px] font-semibold">Phone Number</Label>
                      <Input
                        placeholder="+91 98480 00000"
                        value={walkInPhone}
                        onChange={(e) => setWalkInPhone(e.target.value)}
                        className="text-xs h-8 border-border mt-0.5 font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-[11px] font-semibold">Adults</Label>
                        <Input
                          type="number"
                          min="1"
                          max={selectedTent.maxOccupancy}
                          value={walkInAdults}
                          onChange={(e) => setWalkInAdults(Number(e.target.value))}
                          className="text-xs h-8 border-border mt-0.5"
                        />
                      </div>
                      <div>
                        <Label className="text-[11px] font-semibold">Meal Preference</Label>
                        <select
                          aria-label="Walk-in Meal Preference"
                          value={walkInMeal}
                          onChange={(e) => setWalkInMeal(e.target.value as any)}
                          className="w-full text-xs h-8 px-2 bg-background border border-border rounded-lg text-foreground mt-0.5"
                        >
                          <option value="veg_special">Special Veg</option>
                          <option value="jain">Jain Pure Veg</option>
                          <option value="non_veg">Non-Veg BBQ</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      size="sm"
                      className="w-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8"
                    >
                      Instant Check-In (₹{selectedTent.ratePerNight})
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: NEW CAMPFIRE / BBQ ORDER                                */}
      {/* ------------------------------------------------------------- */}
      {isNewBbqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Flame className="h-4 w-4 text-amber-500" />
                  Order Evening Campfire & BBQ Kit
                </h3>
                <p className="text-xs text-muted-foreground">Assign seasoned firewood & marination package to a pitch.</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsNewBbqModalOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleCreateBbqOrder} className="p-5 space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Target Pitch Number *</Label>
                <select
                  aria-label="Select Target Pitch"
                  value={newBbqPitch}
                  onChange={(e) => setNewBbqPitch(e.target.value)}
                  className="w-full text-xs h-9 px-3 bg-background border border-border rounded-lg text-foreground font-mono font-bold"
                >
                  {tents.slice(0, 50).map((t) => (
                    <option key={t.id} value={t.pitchNumber}>
                      {t.pitchNumber} — {t.type} {t.currentGuest ? `(${t.currentGuest.name})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Guest Name *</Label>
                <Input
                  required
                  placeholder="e.g. Vikram Malhotra"
                  value={newBbqGuest}
                  onChange={(e) => setNewBbqGuest(e.target.value)}
                  className="text-xs h-9 border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Delivery Time</Label>
                  <Input
                    type="time"
                    value={newBbqTime}
                    onChange={(e) => setNewBbqTime(e.target.value)}
                    className="text-xs h-9 border-border font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Wood Bundles (15kg ea)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={newBbqBundles}
                    onChange={(e) => setNewBbqBundles(Number(e.target.value))}
                    className="text-xs h-9 border-border font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">BBQ Package</Label>
                <select
                  aria-label="BBQ Package Selection"
                  value={newBbqPackage}
                  onChange={(e) => setNewBbqPackage(e.target.value as any)}
                  className="w-full text-xs h-9 px-3 bg-background border border-border rounded-lg text-foreground"
                >
                  <option value="mixed_grill">Mixed Grill Meat & Marinade (₹2,400)</option>
                  <option value="veg_marinade">Paneer & Mushroom Veg Skewers (₹1,200)</option>
                  <option value="wood_only">Seasoned Firewood Bundles Only (₹600)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsNewBbqModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs bg-rentcot-blue text-white hover:bg-rentcot-blue/90 font-bold"
                >
                  Confirm Campfire Order
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

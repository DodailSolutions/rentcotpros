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
import {
  Globe,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Settings,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Search,
  ExternalLink,
  Plus,
  Sliders,
  Share2,
  Lock,
  Radio,
  SlidersHorizontal,
  DollarSign,
  TrendingUp,
  X,
  Edit2,
  Trash2,
  Layers,
  ArrowUpRight,
  Check,
  Wrench,
} from "lucide-react";
import type { OTAChannel } from "@/lib/ota/types";

interface ChannelConnection {
  id: OTAChannel;
  name: string;
  category: string;
  hotelId: string;
  apiKey?: string;
  secretKey?: string;
  icalUrl?: string;
  status: "active" | "paused" | "error" | "disconnected";
  lastSync: string;
  mappedUnits: number;
  markupPercent: number;
  syncRates: boolean;
  syncAvailability: boolean;
  syncIntervalMinutes: number;
  color: string;
  badgeBg: string;
}

interface UnitMappingItem {
  id: string;
  unitTypeId: string;
  unitTypeName: string;
  channel: OTAChannel;
  channelName: string;
  otaRoomTypeId: string;
  directRate: number;
  markupPercent: number;
  isActive: boolean;
}

interface ParityDiscrepancy {
  id: string;
  channel: string;
  room: string;
  date: string;
  directPrice: number;
  otaPrice: number;
  diff: number;
  diffPercent: number;
  risk: "high" | "medium";
  reason: string;
}

interface SyncLogItem {
  id: string;
  channel: string;
  direction: "push_rates" | "push_availability" | "pull_bookings" | "rate_parity_check";
  status: "success" | "warning" | "failed";
  summary: string;
  latency: string;
  time: string;
}

export default function ChannelsPage() {
  const { t } = useTranslation();

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3500);
  };

  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [activeSyncingChannelId, setActiveSyncingChannelId] = useState<string | null>(null);

  // -------------------------------------------------------------
  // 1. Channel Connections State (All 5 major OTAs + Vrbo)
  // -------------------------------------------------------------
  const [channels, setChannels] = useState<ChannelConnection[]>([
    {
      id: "airbnb",
      name: "Airbnb",
      category: "Homestays & Villas",
      hotelId: "ABNB_88924",
      apiKey: "abnb_live_99882736",
      icalUrl: "https://www.airbnb.com/calendar/ical/88924.ics",
      status: "active",
      lastSync: "2 mins ago",
      mappedUnits: 4,
      markupPercent: 12,
      syncRates: true,
      syncAvailability: true,
      syncIntervalMinutes: 5,
      color: "border-[#ff5a5f]/40 bg-[#ff5a5f]/5 text-[#ff5a5f]",
      badgeBg: "bg-[#ff5a5f] text-white",
    },
    {
      id: "booking_com",
      name: "Booking.com",
      category: "Global Travel OTA",
      hotelId: "BCOM_44102",
      apiKey: "bcom_xml_direct_441",
      status: "active",
      lastSync: "4 mins ago",
      mappedUnits: 6,
      markupPercent: 15,
      syncRates: true,
      syncAvailability: true,
      syncIntervalMinutes: 5,
      color: "border-[#003580]/40 bg-[#003580]/5 text-[#003580]",
      badgeBg: "bg-[#003580] text-white",
    },
    {
      id: "makemytrip",
      name: "MakeMyTrip",
      category: "India Domestic OTA",
      hotelId: "MMT_7721",
      apiKey: "mmt_channex_switch_88",
      status: "active",
      lastSync: "7 mins ago",
      mappedUnits: 6,
      markupPercent: 15,
      syncRates: true,
      syncAvailability: true,
      syncIntervalMinutes: 5,
      color: "border-[#ea2330]/40 bg-[#ea2330]/5 text-[#ea2330]",
      badgeBg: "bg-[#ea2330] text-white",
    },
    {
      id: "agoda",
      name: "Agoda",
      category: "Asia-Pacific YCS",
      hotelId: "AGD_3019",
      apiKey: "agoda_ycs_api_301",
      status: "active",
      lastSync: "12 mins ago",
      mappedUnits: 4,
      markupPercent: 14,
      syncRates: true,
      syncAvailability: true,
      syncIntervalMinutes: 10,
      color: "border-[#00a699]/40 bg-[#00a699]/5 text-[#00a699]",
      badgeBg: "bg-[#00a699] text-white",
    },
    {
      id: "goibibo",
      name: "Goibibo",
      category: "IngoMMT Unified Network",
      hotelId: "GIB_9182",
      apiKey: "gib_ingommt_7721",
      status: "active",
      lastSync: "15 mins ago",
      mappedUnits: 4,
      markupPercent: 15,
      syncRates: true,
      syncAvailability: true,
      syncIntervalMinutes: 10,
      color: "border-orange-300 bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300",
      badgeBg: "bg-orange-600 text-white",
    },
    {
      id: "vrbo",
      name: "Vrbo",
      category: "Expedia Vacation Rentals",
      hotelId: "VRBO_5510",
      apiKey: "vrbo_expedia_5510",
      status: "paused",
      lastSync: "Yesterday",
      mappedUnits: 2,
      markupPercent: 10,
      syncRates: false,
      syncAvailability: true,
      syncIntervalMinutes: 15,
      color: "border-slate-300 bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
      badgeBg: "bg-slate-600 text-white",
    },
  ]);

  // -------------------------------------------------------------
  // 2. Unit Type Mappings (Rentcot Unit Types <-> OTA Rooms)
  // -------------------------------------------------------------
  const [unitMappings, setUnitMappings] = useState<UnitMappingItem[]>([
    {
      id: "map-1",
      unitTypeId: "ut-cottage",
      unitTypeName: "Deluxe Lake View Cottage",
      channel: "airbnb",
      channelName: "Airbnb",
      otaRoomTypeId: "ABNB_LAKE_COTTAGE_101",
      directRate: 5500,
      markupPercent: 12,
      isActive: true,
    },
    {
      id: "map-2",
      unitTypeId: "ut-cottage",
      unitTypeName: "Deluxe Lake View Cottage",
      channel: "booking_com",
      channelName: "Booking.com",
      otaRoomTypeId: "BCOM_DLX_LAKE_401",
      directRate: 5500,
      markupPercent: 15,
      isActive: true,
    },
    {
      id: "map-3",
      unitTypeId: "ut-dome",
      unitTypeName: "Wildwoods Glamping Dome",
      channel: "makemytrip",
      channelName: "MakeMyTrip",
      otaRoomTypeId: "MMT_DOME_LUXURY_A1",
      directRate: 6500,
      markupPercent: 15,
      isActive: true,
    },
    {
      id: "map-4",
      unitTypeId: "ut-farmhouse",
      unitTypeName: "Executive Farmhouse Villa",
      channel: "booking_com",
      channelName: "Booking.com",
      otaRoomTypeId: "BCOM_ESTATE_VILLA_9",
      directRate: 14500,
      markupPercent: 15,
      isActive: true,
    },
    {
      id: "map-5",
      unitTypeId: "ut-dome",
      unitTypeName: "Wildwoods Glamping Dome",
      channel: "agoda",
      channelName: "Agoda",
      otaRoomTypeId: "AGD_GLAMP_DOME_10",
      directRate: 6500,
      markupPercent: 14,
      isActive: true,
    },
    {
      id: "map-6",
      unitTypeId: "ut-suite",
      unitTypeName: "Urban Sky Villa Studio",
      channel: "goibibo",
      channelName: "Goibibo",
      otaRoomTypeId: "GIB_SKY_STUDIO_201",
      directRate: 4500,
      markupPercent: 15,
      isActive: true,
    },
  ]);

  // -------------------------------------------------------------
  // 3. Rate Parity Watchdog Discrepancies
  // -------------------------------------------------------------
  const [parityDiscrepancies, setParityDiscrepancies] = useState<ParityDiscrepancy[]>([
    {
      id: "par-1",
      channel: "Agoda",
      room: "Deluxe Lake View Cottage",
      date: "Sep 22, 2026",
      directPrice: 5500,
      otaPrice: 4890,
      diff: -610,
      diffPercent: -11,
      risk: "high",
      reason: "Agoda Private Member Promotion automatically applied on listing",
    },
    {
      id: "par-2",
      channel: "MakeMyTrip",
      room: "Wildwoods Glamping Dome",
      date: "Sep 25, 2026",
      directPrice: 6500,
      otaPrice: 5900,
      diff: -600,
      diffPercent: -9,
      risk: "high",
      reason: "MMT App Flash Discount active on Friday check-in",
    },
    {
      id: "par-3",
      channel: "Booking.com",
      room: "Executive Farmhouse Villa",
      date: "Sep 28, 2026",
      directPrice: 14500,
      otaPrice: 16675,
      diff: 2175,
      diffPercent: 15,
      risk: "medium",
      reason: "Commission markup (+15%) correctly pushed to protect direct margins",
    },
  ]);

  // -------------------------------------------------------------
  // 4. Sync Event Audit History
  // -------------------------------------------------------------
  const [syncLogs, setSyncLogs] = useState<SyncLogItem[]>([
    {
      id: "log-1",
      channel: "Airbnb",
      direction: "pull_bookings",
      status: "success",
      summary: "Imported 1 reservation (ABNB-99882) for Rohit Sharma. Physical unit Cottage 102 locked.",
      latency: "42ms",
      time: "2 mins ago",
    },
    {
      id: "log-2",
      channel: "Booking.com",
      direction: "push_availability",
      status: "success",
      summary: "Closed availability on Villa 103 for Sep 20-22 across Booking.com.",
      latency: "38ms",
      time: "4 mins ago",
    },
    {
      id: "log-3",
      channel: "MakeMyTrip",
      direction: "push_rates",
      status: "success",
      summary: "Pushed 30-day rate matrix with +15% commission offset markup.",
      latency: "65ms",
      time: "7 mins ago",
    },
    {
      id: "log-4",
      channel: "Agoda",
      direction: "rate_parity_check",
      status: "warning",
      summary: "Parity discrepancy detected on Deluxe Lake View Cottage (OTA undercutting by 11%).",
      latency: "112ms",
      time: "12 mins ago",
    },
    {
      id: "log-5",
      channel: "Goibibo",
      direction: "push_availability",
      status: "success",
      summary: "Synchronized inventory for IngoMMT distribution network.",
      latency: "58ms",
      time: "15 mins ago",
    },
  ]);

  // -------------------------------------------------------------
  // 5. Inbound Double-Booking Collision Simulator State
  // -------------------------------------------------------------
  const [isTestbenchOpen, setIsTestbenchOpen] = useState(false);
  const [testChannel, setTestChannel] = useState<OTAChannel>("airbnb");
  const [testUnit, setTestUnit] = useState<string>("U-102"); // Cottage 102
  const [testCheckIn, setTestCheckIn] = useState<string>("2026-09-20");
  const [testCheckOut, setTestCheckOut] = useState<string>("2026-09-23");
  const [testGuestName, setTestGuestName] = useState<string>("Amitabh Sen");

  // Existing mock occupied ranges to test double-booking collision
  const occupiedMockRanges = [
    { unitId: "U-101", checkIn: "2026-09-18", checkOut: "2026-09-20", guest: "Ananya Roy (Direct)" },
    { unitId: "U-102", checkIn: "2026-09-20", checkOut: "2026-09-23", guest: "Rohit Sharma (Airbnb)" },
    { unitId: "U-103", checkIn: "2026-09-19", checkOut: "2026-09-23", guest: "David Miller (Booking.com)" },
    { unitId: "U-FH1", checkIn: "2026-09-18", checkOut: "2026-09-21", guest: "Sanjay Reddy (MakeMyTrip)" },
  ];

  const testCollisionCheck = useMemo(() => {
    const tIn = new Date(testCheckIn).getTime();
    const tOut = new Date(testCheckOut).getTime();
    if (isNaN(tIn) || isNaN(tOut) || tIn >= tOut) return { hasCollision: false };

    const match = occupiedMockRanges.find((o) => {
      if (o.unitId !== testUnit) return false;
      const oIn = new Date(o.checkIn).getTime();
      const oOut = new Date(o.checkOut).getTime();
      return tIn < oOut && tOut > oIn;
    });

    return {
      hasCollision: !!match,
      conflictingStay: match,
    };
  }, [testUnit, testCheckIn, testCheckOut]);

  const handleSimulateInboundBooking = () => {
    if (testCollisionCheck.hasCollision) {
      showToast(
        `🛑 DOUBLE-BOOKING PREVENTED: Unit is already locked by ${testCollisionCheck.conflictingStay?.guest}. Inbound rejected.`
      );
      setSyncLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          channel: testChannel.toUpperCase(),
          direction: "pull_bookings",
          status: "failed",
          summary: `COLLISION PREVENTED: Inbound reservation from ${testGuestName} rejected. Unit ${testUnit} already locked.`,
          latency: "28ms",
          time: "Just now",
        },
        ...prev,
      ]);
      return;
    }

    // Success lock simulation
    showToast(
      `🔒 Inbound booking confirmed! Unit ${testUnit} locked. Pushed 0-availability stop-sell to other 4 OTAs.`
    );
    setSyncLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        channel: testChannel.toUpperCase(),
        direction: "pull_bookings",
        status: "success",
        summary: `Inbound reservation for ${testGuestName} accepted. Physical key ${testUnit} locked; stop-sell broadcasted.`,
        latency: "34ms",
        time: "Just now",
      },
      ...prev,
    ]);
    setIsTestbenchOpen(false);
  };

  // -------------------------------------------------------------
  // Modals: Configure Connection Modal
  // -------------------------------------------------------------
  const [editingConnection, setEditingConnection] = useState<ChannelConnection | null>(null);
  const [connForm, setConnForm] = useState<Partial<ChannelConnection>>({});

  const handleOpenConfig = (conn: ChannelConnection) => {
    setEditingConnection(conn);
    setConnForm({ ...conn });
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingConnection) return;
    setChannels((prev) =>
      prev.map((c) => (c.id === editingConnection.id ? ({ ...c, ...connForm } as ChannelConnection) : c))
    );
    setEditingConnection(null);
    showToast(`Updated ${connForm.name || "channel"} connection settings.`);
  };

  // -------------------------------------------------------------
  // Modals: Add Unit Mapping Modal
  // -------------------------------------------------------------
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
  const [mappingForm, setMappingForm] = useState<Partial<UnitMappingItem>>({
    unitTypeId: "ut-cottage",
    unitTypeName: "Deluxe Lake View Cottage",
    channel: "airbnb",
    channelName: "Airbnb",
    otaRoomTypeId: "",
    directRate: 5500,
    markupPercent: 15,
  });

  const handleSaveMapping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mappingForm.otaRoomTypeId?.trim()) {
      showToast("Please provide the OTA Room Code.");
      return;
    }
    const newItem: UnitMappingItem = {
      id: `map-${Date.now()}`,
      unitTypeId: mappingForm.unitTypeId || "ut-cottage",
      unitTypeName:
        mappingForm.unitTypeId === "ut-dome"
          ? "Wildwoods Glamping Dome"
          : mappingForm.unitTypeId === "ut-farmhouse"
          ? "Executive Farmhouse Villa"
          : "Deluxe Lake View Cottage",
      channel: mappingForm.channel || "airbnb",
      channelName: channels.find((c) => c.id === mappingForm.channel)?.name || "Airbnb",
      otaRoomTypeId: mappingForm.otaRoomTypeId!,
      directRate: Number(mappingForm.directRate) || 5000,
      markupPercent: Number(mappingForm.markupPercent) || 15,
      isActive: true,
    };
    setUnitMappings((prev) => [newItem, ...prev]);
    setIsMappingModalOpen(false);
    showToast(`Room mapping for ${newItem.channelName} created.`);
  };

  const handleDeleteMapping = (id: string) => {
    setUnitMappings((prev) => prev.filter((m) => m.id !== id));
    showToast("Mapping removed.");
  };

  // -------------------------------------------------------------
  // Modals: Connect New Channel Modal
  // -------------------------------------------------------------
  const [isConnectNewModalOpen, setIsConnectNewModalOpen] = useState(false);
  const [newChannelForm, setNewChannelForm] = useState({
    name: "Trip.com",
    category: "Global Travel Switch",
    hotelId: "TRIP_8801",
    apiKey: "trip_api_key_88",
    markupPercent: 15,
  });

  const handleSaveNewChannel = (e: React.FormEvent) => {
    e.preventDefault();
    const newChan: ChannelConnection = {
      id: "mock_sandbox",
      name: newChannelForm.name,
      category: newChannelForm.category,
      hotelId: newChannelForm.hotelId,
      apiKey: newChannelForm.apiKey,
      status: "active",
      lastSync: "Just now",
      mappedUnits: 2,
      markupPercent: Number(newChannelForm.markupPercent) || 15,
      syncRates: true,
      syncAvailability: true,
      syncIntervalMinutes: 5,
      color: "border-blue-300 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
      badgeBg: "bg-blue-600 text-white",
    };
    setChannels((prev) => [...prev, newChan]);
    setIsConnectNewModalOpen(false);
    showToast(`Connected ${newChan.name} to Property OS!`);
  };

  // -------------------------------------------------------------
  // Handlers: Sync Actions
  // -------------------------------------------------------------
  const handleSyncChannel = (chanId: string, chanName: string) => {
    setActiveSyncingChannelId(chanId);
    setTimeout(() => {
      setActiveSyncingChannelId(null);
      setChannels((prev) =>
        prev.map((c) => (c.id === chanId ? { ...c, lastSync: "Just now" } : c))
      );
      setSyncLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          channel: chanName,
          direction: "push_availability",
          status: "success",
          summary: `2-Way Sync completed for ${chanName}. 0 rate discrepancies, inventory aligned.`,
          latency: "44ms",
          time: "Just now",
        },
        ...prev,
      ]);
      showToast(`✅ ${chanName} 2-Way Sync completed successfully.`);
    }, 900);
  };

  const handleSyncAll = () => {
    setIsSyncingAll(true);
    setTimeout(() => {
      setIsSyncingAll(false);
      setChannels((prev) => prev.map((c) => ({ ...c, lastSync: "Just now" })));
      setSyncLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          channel: "All Channels",
          direction: "push_rates",
          status: "success",
          summary: "Bulk push: Synchronized 30-day rates and availability across Airbnb, Booking.com, MMT, Agoda, and Goibibo.",
          latency: "68ms",
          time: "Just now",
        },
        ...prev,
      ]);
      showToast("✅ Real-Time 2-Way Sync complete: All 5 OTA channels updated with 0 collisions.");
    }, 1200);
  };

  const handleAutoFixParity = (parityId: string, room: string, channel: string) => {
    setParityDiscrepancies((prev) => prev.filter((p) => p.id !== parityId));
    setSyncLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        channel,
        direction: "push_rates",
        status: "success",
        summary: `Parity Auto-Fix: Overwrote undercut OTA promo rate with Rentcot Best Available Rate on ${room}.`,
        latency: "52ms",
        time: "Just now",
      },
      ...prev,
    ]);
    showToast(`✅ Rate parity fixed for ${channel} on ${room}. Direct price re-enforced.`);
  };

  // Metrics
  const activeChannelsCount = channels.filter((c) => c.status === "active").length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 bg-zinc-900 text-white rounded-xl shadow-2xl text-xs border border-zinc-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rentcot-blue/10 text-rentcot-blue rounded-xl border border-rentcot-blue/20">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-foreground">
                  OTA Channel Manager
                </h1>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold gap-1"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Double-Booking Lock Active
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Two-way live synchronization with Airbnb, Booking.com, MakeMyTrip, Agoda & Goibibo with instant stop-sell protection.
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTestbenchOpen(true)}
            className="text-xs gap-1.5 border-border shadow-xs hover:bg-muted"
          >
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            Inbound Lock Testbench
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsConnectNewModalOpen(true)}
            className="text-xs gap-1.5 border-border shadow-xs hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" />
            Connect Platform
          </Button>
          <Button
            size="sm"
            onClick={handleSyncAll}
            disabled={isSyncingAll}
            className="text-xs bg-rentcot-blue text-white hover:bg-rentcot-blue/90 gap-1.5 shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncingAll ? "animate-spin" : ""}`} />
            <span>{isSyncingAll ? "Synchronizing All..." : "Sync All Channels Now"}</span>
          </Button>
        </div>
      </div>

      {/* Executive Channel KPI Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <Card className="border-border shadow-xs bg-card/60 backdrop-blur-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span>Active Connectors</span>
              <Globe className="h-4 w-4 text-rentcot-blue" />
            </div>
            <div className="mt-2 text-2xl font-black text-foreground">
              {activeChannelsCount}
              <span className="text-xs font-normal text-muted-foreground ml-1">/ {channels.length}</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400">
              <Check className="h-3 w-3" />
              <span>Airbnb, B.com, MMT, Agoda, Goibibo</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs bg-card/60 backdrop-blur-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span>Double-Booking Guard</span>
              <Lock className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
              Locked
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
              <span>0 Overlapping Conflicts</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs bg-card/60 backdrop-blur-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span>Daily Sync Events</span>
              <Zap className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-foreground">284</div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
              <span>Push rates & inventory</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs bg-card/60 backdrop-blur-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span>Average API Latency</span>
              <Clock className="h-4 w-4 text-purple-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-foreground">48ms</div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600">
              <span>Ultra-fast 2-way sync</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs bg-card/60 backdrop-blur-xs col-span-2 md:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span>Rate Parity Score</span>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
              97.4%
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
              <span>{parityDiscrepancies.length} minor variances flagged</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs defaultValue="connectors" className="space-y-4">
        <TabsList className="bg-muted/60 p-1 border border-border rounded-xl">
          <TabsTrigger value="connectors" className="text-xs font-semibold gap-1.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs">
            <Globe className="h-3.5 w-3.5" />
            OTA Connectors ({activeChannelsCount}/{channels.length})
          </TabsTrigger>
          <TabsTrigger value="mappings" className="text-xs font-semibold gap-1.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs">
            <Layers className="h-3.5 w-3.5" />
            Room & Rate Mappings ({unitMappings.length})
          </TabsTrigger>
          <TabsTrigger value="parity" className="text-xs font-semibold gap-1.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs">
            <AlertTriangle className="h-3.5 w-3.5" />
            Rate Parity Watchdog ({parityDiscrepancies.length})
          </TabsTrigger>
          <TabsTrigger value="logs" className="text-xs font-semibold gap-1.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs">
            <Clock className="h-3.5 w-3.5" />
            Sync Audit Logs ({syncLogs.length})
          </TabsTrigger>
        </TabsList>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: Channel Connectors Grid */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="connectors" className="space-y-4 pt-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {channels.map((chan) => {
              const isSyncingThis = activeSyncingChannelId === chan.id;
              return (
                <Card
                  key={chan.id}
                  className={`border-border shadow-xs hover:border-rentcot-blue/40 transition-all flex flex-col justify-between ${
                    chan.status !== "active" ? "opacity-75 bg-muted/20" : "bg-card"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold text-sm ${chan.color}`}>
                          {chan.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <CardTitle className="text-base font-bold flex items-center gap-1.5">
                            {chan.name}
                            {chan.status === "active" && (
                              <span className="h-2 w-2 rounded-full bg-emerald-500" title="Connected"></span>
                            )}
                          </CardTitle>
                          <span className="text-[11px] text-muted-foreground">{chan.category}</span>
                        </div>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={chan.status === "active"}
                          onChange={() => {
                            setChannels((prev) =>
                              prev.map((c) =>
                                c.id === chan.id
                                  ? { ...c, status: c.status === "active" ? "paused" : "active" }
                                  : c
                              )
                            );
                            showToast(`${chan.name} ${chan.status === "active" ? "paused" : "activated"}.`);
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-muted peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-rentcot-blue"></div>
                      </label>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3.5 pb-4">
                    {/* Channel Detail Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-muted/30 border border-border">
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Hotel / Property ID</span>
                        <span className="font-mono font-semibold text-foreground text-xs">{chan.hotelId}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Mapped Units</span>
                        <span className="font-semibold text-foreground">{chan.mappedUnits} Unit Types</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Commission Markup</span>
                        <span className="font-semibold text-rentcot-blue">+{chan.markupPercent}% offset</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Last Synced</span>
                        <span className="text-foreground">{chan.lastSync}</span>
                      </div>
                    </div>

                    {/* Sync Features Badge Strip */}
                    <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium">
                        Rates: {chan.syncRates ? "Auto-Push" : "Manual"}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 font-medium">
                        Inventory: {chan.syncAvailability ? "Real-Time Lock" : "Off"}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 font-medium">
                        {chan.syncIntervalMinutes}m interval
                      </span>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSyncChannel(chan.id, chan.name)}
                        disabled={isSyncingThis || chan.status !== "active"}
                        className="text-xs h-8 flex-1 gap-1 border-border hover:bg-rentcot-blue/5 hover:text-rentcot-blue"
                      >
                        <RefreshCw className={`h-3 w-3 ${isSyncingThis ? "animate-spin text-rentcot-blue" : ""}`} />
                        <span>{isSyncingThis ? "Syncing..." : "Sync Now"}</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenConfig(chan)}
                        className="text-xs h-8 px-2.5 border-border hover:bg-muted"
                        title="Configure Connection"
                      >
                        <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: Unit Type & Rate Mapping Manager */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="mappings" className="space-y-4 pt-1">
          <Card className="border-border shadow-xs">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Layers className="h-4 w-4 text-rentcot-blue" />
                  Room Type & Commission Markup Mappings
                </CardTitle>
                <CardDescription className="text-xs">
                  Map Rentcot physical unit types to OTA room codes with commission offset markup so you keep 100% net earnings.
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => setIsMappingModalOpen(true)}
                className="text-xs bg-rentcot-blue text-white gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Room Mapping
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] font-bold border-y border-border">
                    <tr>
                      <th className="py-2.5 px-3">Rentcot Accommodation</th>
                      <th className="py-2.5 px-3">Channel Platform</th>
                      <th className="py-2.5 px-3">OTA Room Code</th>
                      <th className="py-2.5 px-3">Direct Base Rate</th>
                      <th className="py-2.5 px-3">Markup %</th>
                      <th className="py-2.5 px-3">Live Pushed Rate</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {unitMappings.map((m) => {
                      const pushedRate = Math.round(m.directRate * (1 + m.markupPercent / 100));
                      return (
                        <tr key={m.id} className="hover:bg-muted/20 transition-colors">
                          <td className="py-3 px-3 font-semibold text-foreground">{m.unitTypeName}</td>
                          <td className="py-3 px-3">
                            <Badge variant="outline" className="text-[10px] font-bold">
                              {m.channelName}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-rentcot-blue">{m.otaRoomTypeId}</td>
                          <td className="py-3 px-3 font-mono">₹{m.directRate.toLocaleString("en-IN")}</td>
                          <td className="py-3 px-3 text-emerald-600 font-bold">+{m.markupPercent}%</td>
                          <td className="py-3 px-3 font-mono font-black text-foreground">
                            ₹{pushedRate.toLocaleString("en-IN")}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteMapping(m.id)}
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-rose-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: Rate Parity Watchdog */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="parity" className="space-y-4 pt-1">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Live Rate Parity Watchdog
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Detects discrepancies between Rentcot Best Available Rates and live OTA listing prices to avoid penalties or revenue leak.
                  </CardDescription>
                </div>
                <Badge variant="occupied" className="text-xs font-semibold">
                  {parityDiscrepancies.length} Discrepancies Flagged
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {parityDiscrepancies.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-border bg-background hover:border-rentcot-blue/40 transition-colors space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-bold text-xs">
                          {item.channel}
                        </Badge>
                        <h4 className="text-sm font-bold text-foreground">{item.room}</h4>
                        <span className="text-xs text-muted-foreground">&bull; {item.date}</span>
                      </div>

                      <Badge variant={item.risk === "high" ? "destructive" : "occupied"} className="text-[10px]">
                        {item.risk === "high" ? "High Penalty Risk (Undercutting)" : "Margin Variance"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-muted/40 border border-border text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Rentcot Direct Rate:</span>
                        <strong className="text-foreground font-mono">₹{item.directPrice.toLocaleString("en-IN")}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Live OTA Price:</span>
                        <strong className={`font-mono ${item.diff < 0 ? "text-rose-600 font-bold" : "text-emerald-600 font-bold"}`}>
                          ₹{item.otaPrice.toLocaleString("en-IN")}
                        </strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Variance:</span>
                        <strong className={`font-mono ${item.diff < 0 ? "text-rose-600" : "text-emerald-600"}`}>
                          {item.diff < 0
                            ? `₹${item.diff} (${item.diffPercent}%)`
                            : `+₹${item.diff} (+${item.diffPercent}%)`}
                        </strong>
                      </div>
                      <div className="flex items-center sm:justify-end">
                        <Button
                          size="sm"
                          className="h-8 text-[11px] bg-rentcot-blue hover:bg-rentcot-blue/90 text-white"
                          onClick={() => handleAutoFixParity(item.id, item.room, item.channel)}
                        >
                          Auto-Fix Parity
                        </Button>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground italic">
                      Cause: {item.reason}
                    </p>
                  </div>
                ))}

                {parityDiscrepancies.length === 0 && (
                  <div className="text-center py-10 border border-dashed border-border rounded-xl">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                    <h3 className="text-sm font-bold text-foreground">100% Rate Parity Maintained</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      No OTA is undercutting your direct prices across any accommodation.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: Sync Audit Event Logs */}
        {/* ------------------------------------------------------------- */}
        <TabsContent value="logs" className="space-y-4 pt-1">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  Sync Event Audit Trail & Diagnostics
                </CardTitle>
                <CardDescription className="text-xs">
                  Auditable 2-way push/pull transaction logs with real-time latency and status telemetry.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSyncAll}
                className="text-xs gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Refresh Logs
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {syncLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-border bg-background hover:bg-muted/30 transition-colors gap-2 text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {log.status === "success" ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : log.status === "warning" ? (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-rose-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-foreground">{log.channel}</strong>
                          <Badge variant="outline" className="text-[10px] font-mono uppercase">
                            {log.direction.replace("_", " ")}
                          </Badge>
                          <span className="text-[10px] font-mono text-muted-foreground">{log.latency}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{log.summary}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 sm:self-center ml-7 sm:ml-0">
                      <span className="text-[10px] text-muted-foreground">{log.time}</span>
                      {log.status === "failed" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            showToast("Retrying failed sync...");
                            setTimeout(() => {
                              setSyncLogs((prev) =>
                                prev.map((l) => (l.id === log.id ? { ...l, status: "success", summary: "Resolved via manual retry." } : l))
                              );
                              showToast("Sync retry succeeded.");
                            }, 800);
                          }}
                          className="h-7 text-[10px]"
                        >
                          Retry Sync
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: Inbound Double-Booking Collision Testbench           */}
      {/* ------------------------------------------------------------- */}
      {isTestbenchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  Inbound OTA Double-Booking Collision Testbench
                </h3>
                <p className="text-xs text-muted-foreground">
                  Simulate an incoming reservation from any channel to verify instant collision prevention.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsTestbenchOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Collision Alert Banner */}
              {testCollisionCheck.hasCollision && testCollisionCheck.conflictingStay && (
                <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="h-4 w-4 text-rose-500" />
                    Double-Booking Guard Active: Inbound Collision Detected!
                  </div>
                  <p className="text-[11px]">
                    Unit <strong>{testUnit}</strong> is already locked by{" "}
                    <strong>{testCollisionCheck.conflictingStay.guest}</strong> from{" "}
                    <strong>{testCollisionCheck.conflictingStay.checkIn}</strong> to{" "}
                    <strong>{testCollisionCheck.conflictingStay.checkOut}</strong>.
                  </p>
                  <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 block">
                    🛑 Inbound reservation cannot create an overlap.
                  </span>
                </div>
              )}

              {!testCollisionCheck.hasCollision && (
                <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Unit is vacant for these dates. Reservation will lock key & push stop-sells.</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Incoming OTA Channel</Label>
                  <select
                    aria-label="Select OTA Channel"
                    value={testChannel}
                    onChange={(e) => setTestChannel(e.target.value as OTAChannel)}
                    className="w-full text-xs h-9 px-3 bg-background border border-border rounded-lg text-foreground font-semibold"
                  >
                    <option value="airbnb">Airbnb</option>
                    <option value="booking_com">Booking.com</option>
                    <option value="makemytrip">MakeMyTrip</option>
                    <option value="agoda">Agoda</option>
                    <option value="goibibo">Goibibo</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Target Physical Unit</Label>
                  <select
                    aria-label="Select Target Unit"
                    value={testUnit}
                    onChange={(e) => setTestUnit(e.target.value)}
                    className="w-full text-xs h-9 px-3 bg-background border border-border rounded-lg text-foreground font-semibold"
                  >
                    <option value="U-101">Suite 101 (Occupied Sep 18-20)</option>
                    <option value="U-102">Cottage 102 (Occupied Sep 20-23)</option>
                    <option value="U-103">Villa 103 (Occupied Sep 19-23)</option>
                    <option value="U-FH1">Farmhouse Estate (Occupied Sep 18-21)</option>
                    <option value="U-T01">Dome 01 (Lake - Vacant)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Check-in Date</Label>
                  <Input
                    type="date"
                    value={testCheckIn}
                    onChange={(e) => setTestCheckIn(e.target.value)}
                    className="text-xs h-9 border-border"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Check-out Date</Label>
                  <Input
                    type="date"
                    value={testCheckOut}
                    onChange={(e) => setTestCheckOut(e.target.value)}
                    className="text-xs h-9 border-border"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <Label className="text-xs font-semibold">Simulated Guest Name</Label>
                  <Input
                    value={testGuestName}
                    onChange={(e) => setTestGuestName(e.target.value)}
                    className="text-xs h-9 border-border"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTestbenchOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSimulateInboundBooking}
                  size="sm"
                  className={`text-xs text-white ${
                    testCollisionCheck.hasCollision
                      ? "bg-rose-600 hover:bg-rose-700"
                      : "bg-rentcot-blue hover:bg-rentcot-blue/90"
                  }`}
                >
                  {testCollisionCheck.hasCollision ? "Test Rejection Alert" : "Simulate Inbound Lock"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: Configure Connection Modal                           */}
      {/* ------------------------------------------------------------- */}
      {editingConnection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Configure {editingConnection.name}
                </h3>
                <p className="text-xs text-muted-foreground">Manage API keys, synchronization intervals & commission markup.</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingConnection(null)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSaveConfig} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">OTA Property / Hotel ID *</Label>
                <Input
                  required
                  value={connForm.hotelId || ""}
                  onChange={(e) => setConnForm({ ...connForm, hotelId: e.target.value })}
                  className="text-xs h-9 border-border font-mono font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">API Key / Content Token</Label>
                <Input
                  type="password"
                  value={connForm.apiKey || ""}
                  onChange={(e) => setConnForm({ ...connForm, apiKey: e.target.value })}
                  className="text-xs h-9 border-border font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Commission Markup (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="40"
                    value={connForm.markupPercent ?? 15}
                    onChange={(e) => setConnForm({ ...connForm, markupPercent: Number(e.target.value) })}
                    className="text-xs h-9 border-border font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Sync Interval (Min)</Label>
                  <Input
                    type="number"
                    min="5"
                    max="60"
                    value={connForm.syncIntervalMinutes ?? 5}
                    onChange={(e) => setConnForm({ ...connForm, syncIntervalMinutes: Number(e.target.value) })}
                    className="text-xs h-9 border-border font-mono"
                  />
                </div>
              </div>

              {editingConnection.id === "airbnb" && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Airbnb iCal Export Feed</Label>
                  <Input
                    value={connForm.icalUrl || ""}
                    onChange={(e) => setConnForm({ ...connForm, icalUrl: e.target.value })}
                    className="text-xs h-9 border-border font-mono text-[11px]"
                  />
                </div>
              )}

              <div className="space-y-2 pt-1 border-t border-border">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={connForm.syncRates ?? true}
                    onChange={(e) => setConnForm({ ...connForm, syncRates: e.target.checked })}
                    className="rounded border-border text-rentcot-blue"
                  />
                  <span className="font-semibold text-foreground">Auto-Push Rates & Seasonal Surcharges</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={connForm.syncAvailability ?? true}
                    onChange={(e) => setConnForm({ ...connForm, syncAvailability: e.target.checked })}
                    className="rounded border-border text-rentcot-blue"
                  />
                  <span className="font-semibold text-foreground">Real-Time Double-Booking Lock & Stop-Sell</span>
                </label>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingConnection(null)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs bg-rentcot-blue text-white hover:bg-rentcot-blue/90"
                >
                  Save Connection
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 3: Add Room Mapping Modal                               */}
      {/* ------------------------------------------------------------- */}
      {isMappingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Add Room & Rate Mapping</h3>
                <p className="text-xs text-muted-foreground">Connect a physical unit type to an OTA listing room code.</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMappingModalOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSaveMapping} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Rentcot Unit Type</Label>
                <select
                  aria-label="Rentcot Unit Type"
                  value={mappingForm.unitTypeId}
                  onChange={(e) => setMappingForm({ ...mappingForm, unitTypeId: e.target.value })}
                  className="w-full text-xs h-9 px-3 bg-background border border-border rounded-lg text-foreground font-semibold"
                >
                  <option value="ut-cottage">Deluxe Lake View Cottage</option>
                  <option value="ut-dome">Wildwoods Glamping Dome</option>
                  <option value="ut-farmhouse">Executive Farmhouse Villa</option>
                  <option value="ut-suite">Urban Sky Villa Studio</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Channel Platform</Label>
                <select
                  aria-label="Channel Platform"
                  value={mappingForm.channel}
                  onChange={(e) => setMappingForm({ ...mappingForm, channel: e.target.value as OTAChannel })}
                  className="w-full text-xs h-9 px-3 bg-background border border-border rounded-lg text-foreground font-semibold"
                >
                  {channels.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">OTA Room Type Code *</Label>
                <Input
                  required
                  placeholder="e.g. BCOM_LAKE_COTTAGE_DLX"
                  value={mappingForm.otaRoomTypeId || ""}
                  onChange={(e) => setMappingForm({ ...mappingForm, otaRoomTypeId: e.target.value })}
                  className="text-xs h-9 border-border font-mono uppercase font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Direct Rate (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={mappingForm.directRate ?? 5500}
                    onChange={(e) => setMappingForm({ ...mappingForm, directRate: Number(e.target.value) })}
                    className="text-xs h-9 border-border font-mono font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Markup Offset (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="40"
                    value={mappingForm.markupPercent ?? 15}
                    onChange={(e) => setMappingForm({ ...mappingForm, markupPercent: Number(e.target.value) })}
                    className="text-xs h-9 border-border font-mono font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-muted/40 rounded-xl border border-border flex items-center justify-between">
                <span className="text-muted-foreground">Calculated Pushed OTA Price:</span>
                <span className="text-sm font-black text-foreground font-mono">
                  ₹{Math.round(
                    (Number(mappingForm.directRate) || 5000) *
                      (1 + (Number(mappingForm.markupPercent) || 15) / 100)
                  ).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMappingModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs bg-rentcot-blue text-white hover:bg-rentcot-blue/90"
                >
                  Create Mapping
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 4: Connect New Platform Modal                           */}
      {/* ------------------------------------------------------------- */}
      {isConnectNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Connect New Channel Platform</h3>
                <p className="text-xs text-muted-foreground">Add a new OTA connection to expand inventory distribution.</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsConnectNewModalOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSaveNewChannel} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Platform Name *</Label>
                <Input
                  required
                  value={newChannelForm.name}
                  onChange={(e) => setNewChannelForm({ ...newChannelForm, name: e.target.value })}
                  className="text-xs h-9 border-border"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Category</Label>
                <Input
                  value={newChannelForm.category}
                  onChange={(e) => setNewChannelForm({ ...newChannelForm, category: e.target.value })}
                  className="text-xs h-9 border-border"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Listing / Hotel ID *</Label>
                <Input
                  required
                  value={newChannelForm.hotelId}
                  onChange={(e) => setNewChannelForm({ ...newChannelForm, hotelId: e.target.value })}
                  className="text-xs h-9 border-border font-mono font-bold uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">API Key / Token</Label>
                <Input
                  type="password"
                  value={newChannelForm.apiKey}
                  onChange={(e) => setNewChannelForm({ ...newChannelForm, apiKey: e.target.value })}
                  className="text-xs h-9 border-border font-mono"
                />
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsConnectNewModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs bg-rentcot-blue text-white hover:bg-rentcot-blue/90"
                >
                  Connect & Verify
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

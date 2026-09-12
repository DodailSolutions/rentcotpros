"use client";

import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  type CampsitePitch,
  type CampfireBbqOrder,
  type GearItem,
  type WeatherSafetyState,
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
  Moon,
  Sun,
  Package,
} from "lucide-react";

const initialPitches: CampsitePitch[] = [
  {
    id: "pitch-1",
    pitchNumber: "DOME-01",
    name: "Luxury Lakefront Geodesic Dome",
    type: "luxury_glamping_dome",
    groundType: "wooden_deck",
    powerSupply: "16a_rv_hookup",
    firePit: "private_stone_pit",
    maxOccupancy: 4,
    hasAttachedWashroom: true,
    distanceToWashroomMeters: 0,
    isShaded: true,
    status: "occupied",
    currentGuest: {
      name: "Aditya Verma",
      phone: "+91 98480 12345",
      adults: 2,
      children: 1,
      pets: 1,
      checkIn: "12 Sep",
      checkOut: "14 Sep",
    },
  },
  {
    id: "pitch-2",
    pitchNumber: "DOME-02",
    name: "Hilltop Sunset Glamping Dome",
    type: "luxury_glamping_dome",
    groundType: "wooden_deck",
    powerSupply: "16a_rv_hookup",
    firePit: "private_stone_pit",
    maxOccupancy: 4,
    hasAttachedWashroom: true,
    distanceToWashroomMeters: 0,
    isShaded: false,
    status: "available",
  },
  {
    id: "pitch-3",
    pitchNumber: "TENT-A1",
    name: "Pinecrest Alpine Tent (Pre-Pitched)",
    type: "pre_pitched_tent",
    groundType: "grass_lawn",
    powerSupply: "5a_standard_plug",
    firePit: "private_stone_pit",
    maxOccupancy: 3,
    hasAttachedWashroom: false,
    distanceToWashroomMeters: 20,
    isShaded: true,
    status: "occupied",
    currentGuest: {
      name: "Rohan & Priyam Mehra",
      phone: "+91 98200 99881",
      adults: 2,
      children: 0,
      pets: 0,
      checkIn: "11 Sep",
      checkOut: "13 Sep",
    },
  },
  {
    id: "pitch-4",
    pitchNumber: "TENT-A2",
    name: "Meadow View Alpine Tent",
    type: "pre_pitched_tent",
    groundType: "grass_lawn",
    powerSupply: "5a_standard_plug",
    firePit: "private_stone_pit",
    maxOccupancy: 3,
    hasAttachedWashroom: false,
    distanceToWashroomMeters: 25,
    isShaded: true,
    status: "available",
  },
  {
    id: "pitch-5",
    pitchNumber: "BYOT-G1",
    name: "Campers Lawn Pitch (BYOT - Pitch Your Own)",
    type: "byot_ground_pitch",
    groundType: "grass_lawn",
    powerSupply: "solar_usb_only",
    firePit: "central_amphitheater",
    maxOccupancy: 6,
    hasAttachedWashroom: false,
    distanceToWashroomMeters: 35,
    isShaded: true,
    status: "occupied",
    currentGuest: {
      name: "Hyderabad Bikers Collective",
      phone: "+91 97000 44551",
      adults: 4,
      children: 0,
      pets: 0,
      checkIn: "12 Sep",
      checkOut: "13 Sep",
    },
  },
  {
    id: "pitch-6",
    pitchNumber: "RV-BAY-01",
    name: "Campervan & Rooftop Tent Bay",
    type: "rv_campervan_bay",
    groundType: "gravel_pad",
    powerSupply: "16a_rv_hookup",
    firePit: "portable_fire_brazier",
    maxOccupancy: 5,
    hasAttachedWashroom: false,
    distanceToWashroomMeters: 40,
    isShaded: false,
    status: "available",
  },
];

const initialBbqOrders: CampfireBbqOrder[] = [
  {
    id: "BBQ-101",
    pitchNumber: "DOME-01",
    guestName: "Aditya Verma",
    phone: "+91 98480 12345",
    scheduledTime: "07:30 PM",
    firewoodBundles: 2,
    bbqPackage: "mixed_grill",
    fireSafetyCleared: true,
    status: "scheduled",
    totalAmount: 2400,
  },
  {
    id: "BBQ-102",
    pitchNumber: "TENT-A1",
    guestName: "Rohan Mehra",
    phone: "+91 98200 99881",
    scheduledTime: "08:00 PM",
    firewoodBundles: 1,
    bbqPackage: "veg_marinade",
    fireSafetyCleared: true,
    status: "scheduled",
    totalAmount: 1400,
  },
  {
    id: "BBQ-103",
    pitchNumber: "CENTRAL",
    guestName: "All Campers (Community Amphitheater)",
    phone: "+91 98490 00112",
    scheduledTime: "08:45 PM",
    firewoodBundles: 4,
    bbqPackage: "wood_only",
    fireSafetyCleared: true,
    status: "scheduled",
    totalAmount: 1600,
  },
];

const initialGearInventory: GearItem[] = [
  { id: "g-1", name: "Down Winter Sleeping Bag (0°C to 10°C)", category: "sleeping_bag", serialTag: "SB-088", condition: "ready_sanitized", lastSanitized: "Today, 11:30 AM", dailyRate: 250 },
  { id: "g-2", name: "Down Winter Sleeping Bag (0°C to 10°C)", category: "sleeping_bag", serialTag: "SB-089", condition: "in_use", lastSanitized: "11 Sep", currentPitch: "DOME-01", dailyRate: 250 },
  { id: "g-3", name: "Twin Air Mattress + Electric Pump", category: "air_mattress", serialTag: "MAT-012", condition: "ready_sanitized", lastSanitized: "Yesterday", dailyRate: 350 },
  { id: "g-4", name: "Ultra-Bright 1000L Rechargeable Lantern", category: "headlamp", serialTag: "LAN-044", condition: "ready_sanitized", lastSanitized: "Today", dailyRate: 150 },
  { id: "g-5", name: "Heavy-Duty Reclining Camp Chair", category: "camp_chair", serialTag: "CHR-021", condition: "ready_sanitized", lastSanitized: "10 Sep", dailyRate: 100 },
  { id: "g-6", name: "Carbon Fiber Anti-Shock Trekking Poles", category: "trekking_pole", serialTag: "TRK-005", condition: "ready_sanitized", lastSanitized: "Yesterday", dailyRate: 150 },
];

export default function CampingOperationsPage() {
  const { t } = useTranslation();
  const [pitches, setPitches] = useState<CampsitePitch[]>(initialPitches);
  const [bbqOrders, setBbqOrders] = useState<CampfireBbqOrder[]>(initialBbqOrders);
  const [gearItems, setGearItems] = useState<GearItem[]>(initialGearInventory);

  // Weather & Fire Watchdog State
  const [windSpeed, setWindSpeed] = useState<number>(18);
  const [isManualBan, setIsManualBan] = useState<boolean>(false);
  const [curfewAnnounced, setCurfewAnnounced] = useState<boolean>(false);

  // High wind threshold: gusts > 28 km/h trigger fire warnings/bans
  const isHighWind = windSpeed >= 28;
  const isCampfireBanned = isHighWind || isManualBan;

  const handleOrderSafetyToggle = (orderId: string) => {
    setBbqOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, fireSafetyCleared: !o.fireSafetyCleared } : o))
    );
  };

  const handleOrderStatusTransition = (orderId: string, status: CampfireBbqOrder["status"]) => {
    setBbqOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Campsite & Glamping Operations Hub
            </h1>
            <Badge className="bg-amber-600 text-white gap-1 font-semibold">
              <Tent className="h-3 w-3" /> Outdoor Retreat
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Wildwoods Glamping & Campsite (Vikarabad) • Ground pitches, weather safety, campfire logistics & gear sanitization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="text-xs h-10 border-border font-medium gap-1.5"
            onClick={() => setCurfewAnnounced(true)}
          >
            <VolumeX className="h-4 w-4 text-purple-600" />
            <span>{curfewAnnounced ? "10:30 PM Curfew Sent" : "Send 10:30 PM Quiet Curfew"}</span>
          </Button>
          <Button className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-10 font-semibold gap-1.5">
            <Plus className="h-4 w-4" />
            <span>New Pitch Check-In</span>
          </Button>
        </div>
      </div>

      {/* Live Environmental Safety Watchdog Banner */}
      <Card className={`border-2 transition-all ${
        isCampfireBanned
          ? "border-destructive bg-destructive/5 dark:bg-destructive/10"
          : "border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20"
      }`}>
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Status Indicator */}
            <div className="flex items-start sm:items-center gap-3">
              <div className={`flex h-12 w-12 rounded-xl items-center justify-center shrink-0 ${
                isCampfireBanned ? "bg-destructive text-destructive-foreground animate-pulse" : "bg-emerald-600 text-white"
              }`}>
                {isCampfireBanned ? <ShieldAlert className="h-6 w-6" /> : <Flame className="h-6 w-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    {isCampfireBanned ? "CAMPFIRE RESTRICTION ACTIVE" : "CAMPFIRE & OPEN GRILL PERMITTED"}
                  </h3>
                  <Badge variant={isCampfireBanned ? "destructive" : "clean"} className="text-[10px] uppercase font-bold tracking-wider">
                    {isCampfireBanned ? "High Wind Risk" : "Safety Clear"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">
                  {isCampfireBanned
                    ? "Wind speeds exceed 28 km/h. Open wood bonfires prohibited; use covered spark-screen fire pits with sand bucket on standby."
                    : "Wind conditions are calm. Bonfires and BBQ grills approved at designated stone pits until 11:00 PM ember damping."}
                </p>
              </div>
            </div>

            {/* Environmental Sensors & Interactive Wind Slider */}
            <div className="flex flex-wrap items-center gap-4 bg-background/80 p-3 rounded-xl border border-border shrink-0">
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-rentcot-blue" />
                <div className="text-xs">
                  <div className="text-muted-foreground font-medium">Wind Speed</div>
                  <div className="font-bold text-foreground">{windSpeed} km/h</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-amber-500" />
                <div className="text-xs">
                  <div className="text-muted-foreground font-medium">Night Low</div>
                  <div className="font-bold text-foreground">16°C (Chilly)</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CloudRain className="h-4 w-4 text-sky-500" />
                <div className="text-xs">
                  <div className="text-muted-foreground font-medium">Precipitation</div>
                  <div className="font-bold text-foreground">10% (Dry)</div>
                </div>
              </div>

              {/* Interactive Wind Simulator Slider */}
              <div className="flex flex-col gap-1 pl-2 border-l border-border">
                <label className="text-[10px] font-semibold text-muted-foreground flex justify-between">
                  <span>Simulate Wind:</span>
                  <span className="font-mono font-bold text-foreground">{windSpeed} km/h</span>
                </label>
                <input
                  type="range"
                  min="8"
                  max="45"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(Number(e.target.value))}
                  className="w-28 h-1.5 bg-muted rounded-lg accent-amber-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="pitches" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto p-1 gap-1">
          <TabsTrigger value="pitches" className="text-xs py-2 gap-1.5">
            <Tent className="h-3.5 w-3.5" />
            <span>Pitches & Grounds ({pitches.length})</span>
          </TabsTrigger>
          <TabsTrigger value="campfire_bbq" className="text-xs py-2 gap-1.5">
            <Flame className="h-3.5 w-3.5" />
            <span>Campfire & BBQ ({bbqOrders.length})</span>
          </TabsTrigger>
          <TabsTrigger value="gear_rentals" className="text-xs py-2 gap-1.5">
            <Package className="h-3.5 w-3.5" />
            <span>Gear & Sanitization ({gearItems.length})</span>
          </TabsTrigger>
          <TabsTrigger value="safety_wildlife" className="text-xs py-2 gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Wildlife & Night Protocol</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Pitches & Ground Allocations */}
        <TabsContent value="pitches" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pitches.map((p) => {
              const isOccupied = p.status === "occupied";
              return (
                <Card key={p.id} className="hover:border-primary/50 transition-colors flex flex-col justify-between">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 px-2 py-0.5 rounded-md">
                            {p.pitchNumber}
                          </span>
                          <Badge variant={isOccupied ? "occupied" : "clean"} className="text-[10px]">
                            {isOccupied ? "Occupied" : "Vacant & Ready"}
                          </Badge>
                        </div>
                        <CardTitle className="text-base font-bold text-foreground mt-1.5">
                          {p.name}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Pitch Specifications */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-muted/40 p-2.5 rounded-lg">
                      <div className="flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="capitalize">{p.groundType.replace("_", " ")}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Plug className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="capitalize">{p.powerSupply.replace(/_/g, " ")}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Bath className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{p.hasAttachedWashroom ? "En-suite Washroom" : `${p.distanceToWashroomMeters}m to Washrooms`}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Up to {p.maxOccupancy} Guests</span>
                      </div>
                    </div>

                    {/* Occupant Info */}
                    {isOccupied && p.currentGuest ? (
                      <div className="p-2.5 rounded-lg border border-border bg-card space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground">{p.currentGuest.name}</span>
                          {p.currentGuest.pets > 0 && (
                            <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50 dark:bg-purple-950/30 gap-1 text-[10px]">
                              <Dog className="h-3 w-3" /> {p.currentGuest.pets} Pet
                            </Badge>
                          )}
                        </div>
                        <div className="text-muted-foreground flex justify-between">
                          <span>{p.currentGuest.adults} Adults {p.currentGuest.children > 0 ? `, ${p.currentGuest.children} Kids` : ""}</span>
                          <span className="font-mono">{p.currentGuest.checkIn} → {p.currentGuest.checkOut}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg border border-dashed border-border text-center text-xs text-muted-foreground">
                        Ready for instant walk-in or online guest arrival
                      </div>
                    )}

                    <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                      <Button variant="outline" size="sm" className="flex-1 text-xs h-9">
                        {isOccupied ? "View Tent Folio" : "Assign Booking"}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-9 px-2.5 text-xs text-amber-600">
                        <Flame className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Tab 2: Campfire & BBQ Logistics */}
        <TabsContent value="campfire_bbq" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Flame className="h-4 w-4 text-amber-600" />
                  <span>Evening Campfire & BBQ Schedule</span>
                </h3>
                <span className="text-xs text-muted-foreground">Ember Damping: Strict 11:00 PM</span>
              </div>

              {bbqOrders.map((order) => (
                <Card key={order.id} className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded">
                            {order.pitchNumber}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                            <Clock className="h-3.5 w-3.5 text-rentcot-blue" />
                            {order.scheduledTime}
                          </span>
                          <Badge variant={order.status === "delivered" ? "clean" : "outline"} className="text-[10px] capitalize">
                            {order.status}
                          </Badge>
                        </div>

                        <div className="font-bold text-base text-foreground">
                          {order.guestName}
                        </div>

                        <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-3">
                          <span>📦 {order.firewoodBundles} Bundles (15kg Seasoned Wood)</span>
                          <span>•</span>
                          <span className="capitalize font-medium text-foreground">
                            🍢 {order.bbqPackage.replace("_", " ")}
                          </span>
                        </div>

                        {/* Safety Clearance Toggle */}
                        <div className="pt-2 flex items-center gap-2">
                          <button
                            onClick={() => handleOrderSafetyToggle(order.id)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors ${
                              order.fireSafetyCleared
                                ? "border-emerald-500/40 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                                : "border-destructive/40 bg-destructive/10 text-destructive"
                            }`}
                          >
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span>{order.fireSafetyCleared ? "Fire Safety Checklist Verified" : "Awaiting Sand & Extinguisher Check"}</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-start sm:items-end justify-between gap-3 border-t sm:border-t-0 pt-3 sm:pt-0">
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Order Total</div>
                          <div className="text-base font-bold text-foreground">₹{order.totalAmount}</div>
                        </div>

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
                              variant="outline"
                              className="text-xs h-8 text-emerald-600 border-emerald-300"
                              onClick={() => handleOrderStatusTransition(order.id, "lit")}
                            >
                              Bonfire Lit 🔥
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Fire Safety Standard SOP Card */}
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
                  <span>Strict 11:00 PM water damping round conducted by night patrol.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Emergency water hose test verified at 5:00 PM daily.</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Gear Rental & Sanitization Counter */}
        <TabsContent value="gear_rentals" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-foreground">Adventure Gear & Sanitization Roster</h3>
              <p className="text-xs text-muted-foreground">Every sleeping bag and mattress is UV sanitized and sealed between guest stays.</p>
            </div>
            <Button size="sm" className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white text-xs h-9">
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span>Issue Gear to Guest</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gearItems.map((gear) => (
              <Card key={gear.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-muted-foreground">{gear.serialTag}</span>
                      <h4 className="font-bold text-sm text-foreground mt-0.5">{gear.name}</h4>
                    </div>
                    {gear.condition === "ready_sanitized" ? (
                      <Badge className="bg-emerald-600 text-white text-[10px] gap-1">
                        <Sparkles className="h-2.5 w-2.5" /> UV Sanitized
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">
                        In Use ({gear.currentPitch})
                      </Badge>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground flex justify-between bg-muted/40 p-2 rounded-md">
                    <span>Daily Rental: <strong className="text-foreground">₹{gear.dailyRate}</strong></span>
                    <span>Last Sanitized: <strong className="text-foreground">{gear.lastSanitized}</strong></span>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <Button variant="outline" size="sm" className="text-xs h-8 w-full">
                      {gear.condition === "ready_sanitized" ? "Assign to Tent / Pitch" : "Check-in & Inspect"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 4: Wildlife & Night Forest Protocol */}
        <TabsContent value="safety_wildlife" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Wildlife & Camp Rules */}
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-amber-600" />
                  <CardTitle className="text-base font-bold">Wildlife Safety Protocols (Forest Buffer Zone)</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Proactive measures to ensure safe co-existence with local fauna.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200">
                  <div className="font-bold mb-1">🍌 Food In Tents Strictly Prohibited</div>
                  <p className="text-[11px] leading-relaxed">
                    Food scraps, chips, or fruit kept inside canvas tents attract monkeys, wild boars, and desert ants. All guest provisions must be locked in the central metal camp locker.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-border bg-muted/30">
                  <div className="font-bold mb-1">🥾 Footwear Inside Tent Porch</div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Shoes must be kept zipped inside the tent entry vestibule, never exposed overnight outside where scorpions or spiders seek shelter.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-purple-500/30 bg-purple-50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-200">
                  <div className="font-bold mb-1">🌙 10:30 PM Forest Quiet Hours Curfew</div>
                  <p className="text-[11px] leading-relaxed">
                    Strict noise curfew for acoustic harmony and wildlife tranquility. Acoustic guitar allowed until 10:30 PM; no amplified Bluetooth speakers permitted after hours.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts & Anti-Venom Protocol */}
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <PhoneCall className="h-5 w-5 text-destructive" />
                  <CardTitle className="text-base font-bold">Emergency & Forest Quick Contacts</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Immediate 24/7 emergency dispatch directory for the front desk.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: "Vikarabad Forest Range Officer", phone: "+91 84162 55432", desc: "Permits & Wildlife Rescue Dispatch" },
                  { title: "Certified Snake Rescue Volunteer", phone: "+91 94401 88765", desc: "Local NGO volunteer (15 min ETA)" },
                  { title: "Area Government Hospital (Anti-Venom)", phone: "+91 84162 22100", desc: "Polyvalent ASV stocks verified" },
                  { title: "Local Fire Station (Tandur Road)", phone: "101 / +91 84162 22101", desc: "Brush fire & emergency tender" },
                ].map((contact, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                    <div>
                      <div className="font-bold text-xs text-foreground">{contact.title}</div>
                      <div className="text-[11px] text-muted-foreground">{contact.desc}</div>
                    </div>
                    <a
                      href={`tel:${contact.phone.replace(/[^0-9+]/g, "")}`}
                      className="inline-flex items-center gap-1 text-xs font-mono font-bold text-rentcot-blue hover:underline bg-rentcot-blue/10 px-2.5 py-1.5 rounded-md"
                    >
                      <PhoneCall className="h-3 w-3" />
                      <span>{contact.phone}</span>
                    </a>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

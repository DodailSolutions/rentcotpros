"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Compass,
  TreePine,
  Tent,
  Building2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  BedDouble,
  ChevronDown,
  ChevronUp,
  Flame,
  ShieldCheck,
  Ban,
  Calendar,
  ArrowUpRight,
  Filter,
  Check,
  User,
  Users,
  ExternalLink,
  Phone,
  Layers,
} from "lucide-react";

export interface PropertyAvailabilityData {
  id: string;
  name: string;
  type: "resort" | "farmhouse" | "camping_zone";
  typeLabel: string;
  location: string;
  coverImage: string;
  totalUnits: number;
  availableUnits: number;
  occupiedUnits: number;
  dirtyUnits: number;
  maintenanceUnits: number;
  status: "open" | "seasonal_closure" | "maintenance";
  units: {
    id: string;
    name: string;
    type: string;
    floor: string;
    status: "clean" | "occupied" | "dirty" | "out_of_service";
    rate: number;
    guestName?: string;
  }[];
}

const mockPropertiesAvailability: PropertyAvailabilityData[] = [
  {
    id: "prop-1",
    name: "Green Valley Farmhouse & Retreat",
    type: "farmhouse",
    typeLabel: "Farmhouse Estate",
    location: "Shamirpet, Hyderabad",
    coverImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=80",
    totalUnits: 8,
    availableUnits: 1,
    occupiedUnits: 6,
    dirtyUnits: 1,
    maintenanceUnits: 0,
    status: "open",
    units: [
      { id: "u-101", name: "Heritage Villa 1 (3BHK)", type: "Villa", floor: "Ground + 1st", status: "occupied", rate: 18500, guestName: "K. Reddy (6 guests)" },
      { id: "u-102", name: "Heritage Villa 2 (3BHK)", type: "Villa", floor: "Ground + 1st", status: "dirty", rate: 18500 },
      { id: "u-103", name: "Garden Cottage A", type: "Cottage", floor: "Lawn Level", status: "occupied", rate: 6500, guestName: "A. Chawla" },
      { id: "u-104", name: "Garden Cottage B", type: "Cottage", floor: "Lawn Level", status: "occupied", rate: 6500, guestName: "V. Nair" },
      { id: "u-105", name: "Poolside Gazebo Suite", type: "Suite", floor: "Pool Deck", status: "clean", rate: 8500 },
      { id: "u-106", name: "Mango Orchard Room 1", type: "Room", floor: "East Wing", status: "occupied", rate: 4500, guestName: "P. Sharma" },
      { id: "u-107", name: "Mango Orchard Room 2", type: "Room", floor: "East Wing", status: "occupied", rate: 4500, guestName: "R. Gupta" },
      { id: "u-108", name: "Lakeview Wedding Lawn", type: "Lawn", floor: "Waterfront", status: "occupied", rate: 65000, guestName: "Sangeet Event (120 Pax)" },
    ],
  },
  {
    id: "prop-2",
    name: "Wildwoods Glamping & Campsite",
    type: "camping_zone",
    typeLabel: "Campsite & Glamping",
    location: "Ananthagiri Hills, Vikarabad",
    coverImage: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&auto=format&fit=crop&q=80",
    totalUnits: 12,
    availableUnits: 0,
    occupiedUnits: 11,
    dirtyUnits: 1,
    maintenanceUnits: 0,
    status: "open",
    units: [
      { id: "t-01", name: "Geodesic Glamping Dome 01", type: "Dome Tent", floor: "Zone A Deck", status: "occupied", rate: 5500, guestName: "R. Sharma" },
      { id: "t-02", name: "Geodesic Glamping Dome 02", type: "Dome Tent", floor: "Zone A Deck", status: "occupied", rate: 5500, guestName: "T. Bose" },
      { id: "t-03", name: "Luxury Safari Tent 01", type: "Safari Tent", floor: "Zone B Pine", status: "occupied", rate: 4200, guestName: "S. Kulkarni" },
      { id: "t-04", name: "Luxury Safari Tent 02", type: "Safari Tent", floor: "Zone B Pine", status: "occupied", rate: 4200, guestName: "M. Khan" },
      { id: "t-05", name: "Alpine Pre-Pitched Tent A1", type: "Alpine Tent", floor: "Zone C Valley", status: "occupied", rate: 2500, guestName: "K. Patel" },
      { id: "t-06", name: "Alpine Pre-Pitched Tent A2", type: "Alpine Tent", floor: "Zone C Valley", status: "dirty", rate: 2500 },
      { id: "t-07", name: "Alpine Pre-Pitched Tent A3", type: "Alpine Tent", floor: "Zone C Valley", status: "occupied", rate: 2500, guestName: "N. Rao" },
      { id: "t-08", name: "Alpine Pre-Pitched Tent A4", type: "Alpine Tent", floor: "Zone C Valley", status: "occupied", rate: 2500, guestName: "G. Menon" },
      { id: "t-09", name: "BYOT Lawn Pitch G1", type: "BYOT Pitch", floor: "Zone D Meadow", status: "occupied", rate: 1200, guestName: "D. Roy" },
      { id: "t-10", name: "BYOT Lawn Pitch G2", type: "BYOT Pitch", floor: "Zone D Meadow", status: "occupied", rate: 1200, guestName: "P. Das" },
      { id: "t-11", name: "Campervan RV Bay 01", type: "RV Bay", floor: "Zone D Meadow", status: "occupied", rate: 1800, guestName: "A. Verma" },
      { id: "t-12", name: "Campfire Amphitheater", type: "Amphitheater", floor: "Central Arena", status: "occupied", rate: 18000, guestName: "Acoustic Night" },
    ],
  },
  {
    id: "prop-3",
    name: "Palm Oasis Luxury Resort",
    type: "resort",
    typeLabel: "Luxury Resort",
    location: "Gandipet Lakefront, Hyderabad",
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80",
    totalUnits: 24,
    availableUnits: 6,
    occupiedUnits: 16,
    dirtyUnits: 1,
    maintenanceUnits: 1,
    status: "open",
    units: [
      { id: "p-101", name: "Presidential Pool Villa 01", type: "Pool Villa", floor: "Lake Front", status: "occupied", rate: 28000, guestName: "B. Agarwal" },
      { id: "p-102", name: "Presidential Pool Villa 02", type: "Pool Villa", floor: "Lake Front", status: "clean", rate: 28000 },
      { id: "p-103", name: "Executive Lake Suite 201", type: "Suite", floor: "2nd Floor", status: "clean", rate: 14000 },
      { id: "p-104", name: "Executive Lake Suite 202", type: "Suite", floor: "2nd Floor", status: "occupied", rate: 14000, guestName: "L. Singhania" },
      { id: "p-105", name: "Deluxe Pool View Room 301", type: "Deluxe", floor: "3rd Floor", status: "clean", rate: 9500 },
      { id: "p-106", name: "Deluxe Pool View Room 302", type: "Deluxe", floor: "3rd Floor", status: "dirty", rate: 9500 },
      { id: "p-107", name: "Deluxe Pool View Room 303", type: "Deluxe", floor: "3rd Floor", status: "out_of_service", rate: 9500 },
      { id: "p-108", name: "Grand Palm Banquet Hall", type: "Banquet", floor: "Clubhouse", status: "clean", rate: 50000 },
    ],
  },
];

export function VisualAvailabilityRadar() {
  const [properties, setProperties] = useState<PropertyAvailabilityData[]>(mockPropertiesAvailability);
  const [expandedPropertyId, setExpandedPropertyId] = useState<string | null>("prop-1");
  const [selectedHorizon, setSelectedHorizon] = useState<"today" | "tomorrow" | "weekend" | "week">("today");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<"all" | "resort" | "farmhouse" | "camping_zone">("all");
  const [unitFilterStatus, setUnitFilterStatus] = useState<"all" | "clean" | "occupied" | "dirty" | "out_of_service">("all");

  const getAvailabilityMeta = (p: PropertyAvailabilityData) => {
    if (p.status === "seasonal_closure" || p.status === "maintenance") {
      return {
        label: "Closed for Season",
        badgeStyle: "bg-muted text-muted-foreground border-border",
        accentBar: "bg-muted-foreground",
        indicator: "bg-muted-foreground",
        statusTone: "text-muted-foreground",
      };
    }
    if (p.availableUnits === 0) {
      return {
        label: "100% Full • Sold Out",
        badgeStyle: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
        accentBar: "bg-rose-500",
        indicator: "bg-rose-500 animate-pulse",
        statusTone: "text-rose-600 dark:text-rose-400",
      };
    }
    if (p.availableUnits <= 2) {
      return {
        label: `Fast Filling • ${p.availableUnits} Left`,
        badgeStyle: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
        accentBar: "bg-amber-500",
        indicator: "bg-amber-500",
        statusTone: "text-amber-600 dark:text-amber-400",
      };
    }
    return {
      label: `Available • ${p.availableUnits} Free`,
      badgeStyle: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
      accentBar: "bg-emerald-500",
      indicator: "bg-emerald-500",
      statusTone: "text-emerald-600 dark:text-emerald-400",
    };
  };

  const getUnitStatusBadge = (status: "clean" | "occupied" | "dirty" | "out_of_service") => {
    switch (status) {
      case "clean":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            <Sparkles className="h-2.5 w-2.5 text-emerald-600" /> Vacant Ready
          </span>
        );
      case "occupied":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rentcot-blue/15 text-rentcot-blue border border-rentcot-blue/20">
            <User className="h-2.5 w-2.5" /> Occupied
          </span>
        );
      case "dirty":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20">
            <Clock className="h-2.5 w-2.5 text-amber-600" /> Turnover
          </span>
        );
      case "out_of_service":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/20">
            <Ban className="h-2.5 w-2.5" /> Maintenance
          </span>
        );
    }
  };

  const togglePropertyStatus = (id: string, newStatus: PropertyAvailabilityData["status"]) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  const handleQuickUnitStatusChange = (propertyId: string, unitId: string, nextStatus: "clean" | "dirty" | "out_of_service") => {
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id !== propertyId) return p;
        const updatedUnits = p.units.map((u) => {
          if (u.id === unitId) {
            return { ...u, status: nextStatus };
          }
          return u;
        });
        const cleanCount = updatedUnits.filter((u) => u.status === "clean").length;
        const dirtyCount = updatedUnits.filter((u) => u.status === "dirty").length;
        const outCount = updatedUnits.filter((u) => u.status === "out_of_service").length;
        return {
          ...p,
          units: updatedUnits,
          availableUnits: cleanCount,
          dirtyUnits: dirtyCount,
          maintenanceUnits: outCount,
        };
      })
    );
  };

  const filteredProperties = properties.filter((p) => {
    if (selectedTypeFilter !== "all" && p.type !== selectedTypeFilter) return false;
    return true;
  });

  const activeExpandedProperty = properties.find((p) => p.id === expandedPropertyId);

  const displayedUnits = useMemo(() => {
    if (!activeExpandedProperty) return [];
    if (unitFilterStatus === "all") return activeExpandedProperty.units;
    return activeExpandedProperty.units.filter((u) => u.status === unitFilterStatus);
  }, [activeExpandedProperty, unitFilterStatus]);

  return (
    <Card className="border border-border/80 shadow-xs bg-card overflow-hidden rounded-2xl">
      {/* Consolidated Top Header */}
      <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/70 bg-muted/10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-rentcot-blue/10 text-rentcot-blue flex items-center justify-center shrink-0">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                  Visual Availability Radar & Live Room Heatmap
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30 text-emerald-600 bg-emerald-500/5 font-bold">
                  Live Engine
                </Badge>
              </div>
              <CardDescription className="text-xs mt-0.5 text-muted-foreground">
                Real-time multi-estate occupancy radar with instant unit housekeeping state advancement.
              </CardDescription>
            </div>
          </div>

          {/* Unified Controls Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Horizon Filter */}
            <div className="inline-flex p-1 rounded-xl bg-muted/60 border border-border text-xs">
              {[
                { id: "today" as const, label: "Today" },
                { id: "tomorrow" as const, label: "Tomorrow" },
                { id: "weekend" as const, label: "Weekend" },
                { id: "week" as const, label: "7 Days" },
              ].map((h) => (
                <button
                  key={h.id}
                  onClick={() => setSelectedHorizon(h.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedHorizon === h.id
                      ? "bg-card text-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>

            {/* Property Type Filter */}
            <div className="inline-flex p-1 rounded-xl bg-muted/60 border border-border text-xs">
              {[
                { id: "all" as const, label: "All" },
                { id: "farmhouse" as const, label: "Farmhouses" },
                { id: "camping_zone" as const, label: "Campsites" },
                { id: "resort" as const, label: "Resorts" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTypeFilter(t.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedTypeFilter === t.id
                      ? "bg-rentcot-blue text-white shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-5">
        {/* Properties Radar Cards (Modern Refined Cards without Garish Borders) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredProperties.map((p) => {
            const avail = getAvailabilityMeta(p);
            const occPercent = Math.round(((p.totalUnits - p.availableUnits) / p.totalUnits) * 100);
            const isExpanded = expandedPropertyId === p.id;

            return (
              <div
                key={p.id}
                className={`relative rounded-2xl border transition-all bg-card overflow-hidden flex flex-col justify-between group ${
                  isExpanded
                    ? "border-rentcot-blue/60 shadow-sm ring-1 ring-rentcot-blue/30"
                    : "border-border/80 hover:border-border hover:shadow-xs"
                }`}
              >
                {/* Top Subtle Status Accent Bar */}
                <div className={`h-1 w-full ${avail.accentBar}`} />

                <div className="p-4 space-y-3">
                  {/* Property Header & Cover Thumbnail */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden shrink-0 border border-border bg-muted">
                        <img
                          src={p.coverImage}
                          alt={p.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-foreground leading-snug line-clamp-1">
                          {p.name}
                        </h3>
                        <p className="text-[11px] text-muted-foreground">{p.location}</p>
                        <span className="text-[10px] text-rentcot-blue font-semibold">{p.typeLabel}</span>
                      </div>
                    </div>

                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold border ${avail.badgeStyle}`}>
                      <span className={`h-2 w-2 rounded-full shrink-0 ${avail.indicator}`} />
                      <span>{avail.label}</span>
                    </span>
                  </div>

                  {/* Occupancy Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-muted-foreground">
                        Live Occupancy: <strong className="text-foreground">{occPercent}%</strong>
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {p.availableUnits} of {p.totalUnits} Units Free
                      </span>
                    </div>
                    <div className="w-full bg-muted/80 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          p.availableUnits === 0
                            ? "bg-rose-500"
                            : p.availableUnits <= 2
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${occPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick Distribution Summary */}
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/60">
                    <span>{p.occupiedUnits} Occupied</span>
                    <span>•</span>
                    <span>{p.dirtyUnits} In Turnover</span>
                    <span>•</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{p.availableUnits} Vacant</span>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-3 bg-muted/20 border-t border-border/70 flex items-center justify-between gap-2">
                  <Button
                    variant={isExpanded ? "default" : "outline"}
                    size="sm"
                    onClick={() => setExpandedPropertyId(isExpanded ? null : p.id)}
                    className={`text-xs h-8 flex-1 gap-1 font-semibold ${
                      isExpanded ? "bg-rentcot-blue text-white" : "border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    <span>{isExpanded ? "Hide Unit Grid" : "Inspect Unit Grid"}</span>
                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </Button>

                  {p.status === "open" ? (
                    <button
                      onClick={() => togglePropertyStatus(p.id, "seasonal_closure")}
                      className="text-[11px] text-muted-foreground hover:text-destructive px-2.5 py-1 rounded-lg border border-border hover:bg-muted/80 transition-colors font-medium"
                      title="Pause bookings for seasonal closure"
                    >
                      Close Season
                    </button>
                  ) : (
                    <button
                      onClick={() => togglePropertyStatus(p.id, "open")}
                      className="text-[11px] text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30 font-bold"
                    >
                      Re-Open
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Expanded Physical Unit Heatmap Matrix */}
        {activeExpandedProperty && (
          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-muted/20 space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-border/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-rentcot-blue/10 flex items-center justify-center text-rentcot-blue">
                  <BedDouble className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Physical Unit Ground Matrix: {activeExpandedProperty.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    {activeExpandedProperty.units.length} total operational keys • Click status to advance housekeeping
                  </p>
                </div>
              </div>

              {/* Status Filter for Expanded Units */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {[
                  { id: "all" as const, label: `All (${activeExpandedProperty.units.length})` },
                  { id: "clean" as const, label: `Vacant (${activeExpandedProperty.availableUnits})` },
                  { id: "occupied" as const, label: `Occupied (${activeExpandedProperty.occupiedUnits})` },
                  { id: "dirty" as const, label: `Turnover (${activeExpandedProperty.dirtyUnits})` },
                  { id: "out_of_service" as const, label: `Maintenance (${activeExpandedProperty.maintenanceUnits})` },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setUnitFilterStatus(f.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      unitFilterStatus === f.id
                        ? "bg-foreground text-background shadow-xs font-bold"
                        : "bg-muted/80 text-muted-foreground hover:text-foreground border border-border/50"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Units Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {displayedUnits.map((u) => (
                <div
                  key={u.id}
                  className={`p-3.5 rounded-xl border bg-card text-xs space-y-2.5 transition-all shadow-2xs hover:shadow-xs ${
                    u.status === "clean"
                      ? "border-emerald-500/30 hover:border-emerald-500"
                      : u.status === "occupied"
                      ? "border-rentcot-blue/30 bg-blue-50/20 dark:bg-blue-950/10"
                      : u.status === "dirty"
                      ? "border-amber-500/30"
                      : "border-border opacity-75"
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <span className="font-bold text-foreground block truncate">{u.name}</span>
                      <span className="text-[11px] text-muted-foreground">{u.type} • {u.floor}</span>
                    </div>
                    <span className="font-mono font-bold text-xs text-foreground shrink-0">
                      ₹{u.rate.toLocaleString()}
                    </span>
                  </div>

                  {u.guestName ? (
                    <div className="text-[11px] text-rentcot-blue font-medium truncate bg-rentcot-blue/5 border border-rentcot-blue/15 px-2 py-1 rounded-md">
                      👤 {u.guestName}
                    </div>
                  ) : (
                    <div className="text-[11px] text-muted-foreground italic px-1">
                      Ready for guest arrival
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-border/60">
                    <div>{getUnitStatusBadge(u.status)}</div>

                    {/* Housekeeping state toggle */}
                    <div className="flex items-center gap-1">
                      {u.status === "dirty" && (
                        <Button
                          size="sm"
                          onClick={() => handleQuickUnitStatusChange(activeExpandedProperty.id, u.id, "clean")}
                          className="text-[10px] h-6 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md"
                        >
                          Mark Ready
                        </Button>
                      )}
                      {u.status === "clean" && (
                        <button
                          onClick={() => handleQuickUnitStatusChange(activeExpandedProperty.id, u.id, "dirty")}
                          className="text-[10px] text-muted-foreground hover:text-foreground px-2 py-0.5 rounded border border-border"
                          title="Mark for turnover cleaning"
                        >
                          Turnover
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {displayedUnits.length === 0 && (
              <div className="py-8 text-center text-muted-foreground text-xs">
                No units match the selected filter.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

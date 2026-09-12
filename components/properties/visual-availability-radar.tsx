"use client";

import React, { useState } from "react";
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
} from "lucide-react";

export interface PropertyAvailabilityData {
  id: string;
  name: string;
  type: "resort" | "farmhouse" | "camping_zone";
  location: string;
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
    location: "Shamirpet, Hyderabad",
    totalUnits: 8,
    availableUnits: 1,
    occupiedUnits: 6,
    dirtyUnits: 1,
    maintenanceUnits: 0,
    status: "open",
    units: [
      { id: "u-101", name: "Heritage Villa 1 (3BHK)", type: "Villa", status: "occupied", rate: 18500, guestName: "K. Reddy (6 guests)" },
      { id: "u-102", name: "Heritage Villa 2 (3BHK)", type: "Villa", status: "dirty", rate: 18500 },
      { id: "u-103", name: "Garden Cottage A", type: "Cottage", status: "occupied", rate: 6500, guestName: "A. Chawla" },
      { id: "u-104", name: "Garden Cottage B", type: "Cottage", status: "occupied", rate: 6500, guestName: "V. Nair" },
      { id: "u-105", name: "Poolside Gazebo Suite", type: "Suite", status: "clean", rate: 8500 },
      { id: "u-106", name: "Mango Orchard Room 1", type: "Room", status: "occupied", rate: 4500, guestName: "P. Sharma" },
      { id: "u-107", name: "Mango Orchard Room 2", type: "Room", status: "occupied", rate: 4500, guestName: "R. Gupta" },
      { id: "u-108", name: "Lakeview Wedding Lawn", type: "Lawn", status: "occupied", rate: 65000, guestName: "Sangeet Event (120 Pax)" },
    ],
  },
  {
    id: "prop-2",
    name: "Wildwoods Glamping & Campsite",
    type: "camping_zone",
    location: "Ananthagiri Hills, Vikarabad",
    totalUnits: 12,
    availableUnits: 0,
    occupiedUnits: 11,
    dirtyUnits: 1,
    maintenanceUnits: 0,
    status: "open",
    units: [
      { id: "t-01", name: "Geodesic Glamping Dome 01", type: "Dome Tent", status: "occupied", rate: 5500, guestName: "R. Sharma" },
      { id: "t-02", name: "Geodesic Glamping Dome 02", type: "Dome Tent", status: "occupied", rate: 5500, guestName: "T. Bose" },
      { id: "t-03", name: "Luxury Safari Tent 01", type: "Safari Tent", status: "occupied", rate: 4200, guestName: "S. Kulkarni" },
      { id: "t-04", name: "Luxury Safari Tent 02", type: "Safari Tent", status: "occupied", rate: 4200, guestName: "M. Khan" },
      { id: "t-05", name: "Alpine Pre-Pitched Tent A1", type: "Alpine Tent", status: "occupied", rate: 2500, guestName: "K. Patel" },
      { id: "t-06", name: "Alpine Pre-Pitched Tent A2", type: "Alpine Tent", status: "dirty", rate: 2500 },
      { id: "t-07", name: "Alpine Pre-Pitched Tent A3", type: "Alpine Tent", status: "occupied", rate: 2500, guestName: "N. Rao" },
      { id: "t-08", name: "Alpine Pre-Pitched Tent A4", type: "Alpine Tent", status: "occupied", rate: 2500, guestName: "G. Menon" },
      { id: "t-09", name: "BYOT Lawn Pitch G1", type: "BYOT Pitch", status: "occupied", rate: 1200, guestName: "D. Roy" },
      { id: "t-10", name: "BYOT Lawn Pitch G2", type: "BYOT Pitch", status: "occupied", rate: 1200, guestName: "P. Das" },
      { id: "t-11", name: "Campervan RV Bay 01", type: "RV Bay", status: "occupied", rate: 1800, guestName: "A. Verma" },
      { id: "t-12", name: "Campfire Amphitheater", type: "Amphitheater", status: "occupied", rate: 18000, guestName: "Acoustic Night" },
    ],
  },
  {
    id: "prop-3",
    name: "Palm Oasis Luxury Resort",
    type: "resort",
    location: "Gandipet Lakefront, Hyderabad",
    totalUnits: 24,
    availableUnits: 6,
    occupiedUnits: 16,
    dirtyUnits: 1,
    maintenanceUnits: 1,
    status: "open",
    units: [
      { id: "p-101", name: "Presidential Pool Villa 01", type: "Pool Villa", status: "occupied", rate: 28000, guestName: "B. Agarwal" },
      { id: "p-102", name: "Presidential Pool Villa 02", type: "Pool Villa", status: "clean", rate: 28000 },
      { id: "p-103", name: "Executive Lake Suite 201", type: "Suite", status: "clean", rate: 14000 },
      { id: "p-104", name: "Executive Lake Suite 202", type: "Suite", status: "occupied", rate: 14000, guestName: "L. Singhania" },
      { id: "p-105", name: "Deluxe Pool View Room 301", type: "Deluxe", status: "clean", rate: 9500 },
      { id: "p-106", name: "Deluxe Pool View Room 302", type: "Deluxe", status: "dirty", rate: 9500 },
      { id: "p-107", name: "Deluxe Pool View Room 303", type: "Deluxe", status: "out_of_service", rate: 9500 },
      { id: "p-108", name: "Grand Palm Banquet Hall", type: "Banquet", status: "clean", rate: 50000 },
    ],
  },
];

export function VisualAvailabilityRadar() {
  const [properties, setProperties] = useState<PropertyAvailabilityData[]>(mockPropertiesAvailability);
  const [expandedPropertyId, setExpandedPropertyId] = useState<string | null>("prop-1");
  const [selectedHorizon, setSelectedHorizon] = useState<"today" | "tomorrow" | "weekend" | "week">("today");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<"all" | "resort" | "farmhouse" | "camping_zone">("all");

  const getAvailabilityStatus = (p: PropertyAvailabilityData) => {
    if (p.status === "seasonal_closure" || p.status === "maintenance") {
      return {
        label: "Closed for Season",
        badgeClass: "bg-muted text-muted-foreground border-border",
        cardBorder: "border-border",
        indicator: "bg-muted-foreground",
      };
    }
    if (p.availableUnits === 0) {
      return {
        label: "SOLD OUT (100% Full)",
        badgeClass: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-300",
        cardBorder: "border-rose-300/80 dark:border-rose-900/60",
        indicator: "bg-rose-600 animate-pulse",
      };
    }
    if (p.availableUnits <= 2) {
      return {
        label: `Fast Filling (${p.availableUnits} Left)`,
        badgeClass: "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300",
        cardBorder: "border-amber-400/80 dark:border-amber-800/60",
        indicator: "bg-amber-500",
      };
    }
    return {
      label: `Available (${p.availableUnits} Keys Free)`,
      badgeClass: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300",
      cardBorder: "border-emerald-400/60 dark:border-emerald-900/40",
      indicator: "bg-emerald-500",
    };
  };

  const getUnitStatusBadge = (status: "clean" | "occupied" | "dirty" | "out_of_service") => {
    switch (status) {
      case "clean":
        return <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] gap-1"><Sparkles className="h-2.5 w-2.5" /> Vacant Ready</Badge>;
      case "occupied":
        return <Badge className="bg-rentcot-blue text-white text-[10px]">Occupied</Badge>;
      case "dirty":
        return <Badge className="bg-amber-500 text-white text-[10px] gap-1"><Clock className="h-2.5 w-2.5" /> In Turnover</Badge>;
      case "out_of_service":
        return <Badge variant="destructive" className="text-[10px] gap-1"><Ban className="h-2.5 w-2.5" /> Out of Service</Badge>;
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

  return (
    <Card className="border-rentcot-blue/30 shadow-xs bg-card">
      <CardHeader className="pb-3 border-b border-border/80">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-rentcot-blue/10 flex items-center justify-center text-rentcot-blue">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base sm:text-lg font-bold">
                  Visual Availability Radar & Live Room Heatmap
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30 text-emerald-600 bg-emerald-500/5">
                  Live Engine
                </Badge>
              </div>
              <CardDescription className="text-xs mt-0.5">
                Real-time visual occupancy and instant unit vacancy across your farmhouses, resorts, and camping zones.
              </CardDescription>
            </div>
          </div>

          {/* Controls: Horizon & Category filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex p-0.5 rounded-lg bg-muted border border-border text-xs">
              {[
                { id: "today" as const, label: "Today" },
                { id: "tomorrow" as const, label: "Tomorrow" },
                { id: "weekend" as const, label: "Weekend" },
                { id: "week" as const, label: "7 Days" },
              ].map((h) => (
                <button
                  key={h.id}
                  onClick={() => setSelectedHorizon(h.id)}
                  className={`px-2.5 py-1 rounded-md font-semibold text-xs transition-colors ${
                    selectedHorizon === h.id
                      ? "bg-background text-foreground shadow-2xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>

            <div className="inline-flex p-0.5 rounded-lg bg-muted border border-border text-xs">
              {[
                { id: "all" as const, label: "All Types" },
                { id: "farmhouse" as const, label: "Farmhouses" },
                { id: "camping_zone" as const, label: "Campsites" },
                { id: "resort" as const, label: "Resorts" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTypeFilter(t.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    selectedTypeFilter === t.id
                      ? "bg-rentcot-blue text-white shadow-2xs"
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

      <CardContent className="space-y-4 pt-4">
        {/* Properties Availability Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredProperties.map((p) => {
            const avail = getAvailabilityStatus(p);
            const occPercent = Math.round(((p.totalUnits - p.availableUnits) / p.totalUnits) * 100);
            const isExpanded = expandedPropertyId === p.id;

            return (
              <div
                key={p.id}
                className={`p-4 rounded-xl border-2 transition-all bg-card flex flex-col justify-between ${avail.cardBorder}`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`h-3 w-3 rounded-full shrink-0 ${avail.indicator}`} />
                      <div>
                        <h3 className="font-bold text-sm text-foreground leading-tight">
                          {p.name}
                        </h3>
                        <p className="text-[11px] text-muted-foreground">{p.location}</p>
                      </div>
                    </div>
                  </div>

                  <Badge variant="outline" className={`text-xs font-semibold ${avail.badgeClass}`}>
                    {avail.label}
                  </Badge>

                  {/* Occupancy Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                      <span>Occupancy: <strong className="text-foreground">{occPercent}%</strong></span>
                      <span>{p.availableUnits} of {p.totalUnits} Units Free</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          p.availableUnits === 0
                            ? "bg-rose-600"
                            : p.availableUnits <= 2
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${occPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1.5 border-t border-border/60">
                    <span>{p.occupiedUnits} Occupied</span>
                    <span>•</span>
                    <span>{p.dirtyUnits} In Turnover</span>
                    <span>•</span>
                    <span className="font-bold text-emerald-600">{p.availableUnits} Vacant</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedPropertyId(isExpanded ? null : p.id)}
                    className="text-xs h-8 flex-1 gap-1 border-border font-medium"
                  >
                    <span>{isExpanded ? "Hide Unit Grid" : "Inspect Units"}</span>
                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </Button>

                  {p.status === "open" ? (
                    <button
                      onClick={() => togglePropertyStatus(p.id, "seasonal_closure")}
                      className="text-[10px] text-muted-foreground hover:text-destructive px-2 py-1 rounded border border-border transition-colors"
                      title="Pause bookings for seasonal closure"
                    >
                      Close Season
                    </button>
                  ) : (
                    <button
                      onClick={() => togglePropertyStatus(p.id, "open")}
                      className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded border border-emerald-300 font-bold"
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
        {expandedPropertyId && (
          <div className="pt-2">
            {(() => {
              const activeProp = properties.find((p) => p.id === expandedPropertyId);
              if (!activeProp) return null;
              return (
                <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <BedDouble className="h-4 w-4 text-rentcot-blue" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Physical Room & Unit Ground Matrix: {activeProp.name}
                      </h4>
                      <Badge variant="outline" className="text-[10px]">
                        {activeProp.units.length} keys
                      </Badge>
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      Click status tags below to advance housekeeping status
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {activeProp.units.map((u) => (
                      <div
                        key={u.id}
                        className={`p-3 rounded-lg border bg-card text-xs space-y-2 transition-all ${
                          u.status === "clean"
                            ? "border-emerald-500/40 hover:border-emerald-600 shadow-2xs"
                            : u.status === "occupied"
                            ? "border-rentcot-blue/30 bg-blue-50/20 dark:bg-blue-950/10"
                            : u.status === "dirty"
                            ? "border-amber-500/40"
                            : "border-border opacity-70"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <span className="font-bold text-foreground block truncate">{u.name}</span>
                            <span className="text-[11px] text-muted-foreground">{u.type}</span>
                          </div>
                          <span className="font-mono font-bold text-xs text-foreground">
                            ₹{u.rate.toLocaleString()}
                          </span>
                        </div>

                        {u.guestName && (
                          <div className="text-[11px] text-rentcot-blue font-medium truncate bg-rentcot-blue/5 p-1 rounded">
                            Guest: {u.guestName}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1.5 border-t border-border/60">
                          <div>{getUnitStatusBadge(u.status)}</div>

                          {/* Quick turnover state buttons */}
                          <div className="flex items-center gap-1">
                            {u.status === "dirty" && (
                              <button
                                onClick={() => handleQuickUnitStatusChange(activeProp.id, u.id, "clean")}
                                className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-semibold hover:bg-emerald-700"
                                title="Mark as Cleaned & Inspected"
                              >
                                Ready
                              </button>
                            )}
                            {u.status === "clean" && (
                              <button
                                onClick={() => handleQuickUnitStatusChange(activeProp.id, u.id, "dirty")}
                                className="text-[10px] text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded border border-border"
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
                </div>
              );
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

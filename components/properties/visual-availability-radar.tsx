"use client";

import React, { useState } from "react";
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
} from "lucide-react";

export interface PropertyAvailabilityData {
  id: string;
  name: string;
  type: "resort" | "farmhouse" | "camping_zone";
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
  }[];
}

const mockPropertiesAvailability: PropertyAvailabilityData[] = [
  {
    id: "prop-1",
    name: "Green Valley Farmhouse & Retreat",
    type: "farmhouse",
    totalUnits: 8,
    availableUnits: 1,
    occupiedUnits: 6,
    dirtyUnits: 1,
    maintenanceUnits: 0,
    status: "open",
    units: [
      { id: "u-101", name: "Heritage Villa 1 (3BHK)", type: "Villa", status: "occupied", rate: 18500 },
      { id: "u-102", name: "Heritage Villa 2 (3BHK)", type: "Villa", status: "dirty", rate: 18500 },
      { id: "u-103", name: "Garden Cottage A", type: "Cottage", status: "occupied", rate: 6500 },
      { id: "u-104", name: "Garden Cottage B", type: "Cottage", status: "occupied", rate: 6500 },
      { id: "u-105", name: "Poolside Gazebo Suite", type: "Suite", status: "clean", rate: 8500 },
      { id: "u-106", name: "Mango Orchard Room 1", type: "Room", status: "occupied", rate: 4500 },
      { id: "u-107", name: "Mango Orchard Room 2", type: "Room", status: "occupied", rate: 4500 },
      { id: "u-108", name: "Lakeview Wedding Lawn", type: "Lawn", status: "occupied", rate: 65000 },
    ],
  },
  {
    id: "prop-2",
    name: "Wildwoods Glamping & Campsite",
    type: "camping_zone",
    totalUnits: 12,
    availableUnits: 0,
    occupiedUnits: 11,
    dirtyUnits: 1,
    maintenanceUnits: 0,
    status: "open",
    units: [
      { id: "t-01", name: "Geodesic Glamping Dome 01", type: "Dome Tent", status: "occupied", rate: 5500 },
      { id: "t-02", name: "Geodesic Glamping Dome 02", type: "Dome Tent", status: "occupied", rate: 5500 },
      { id: "t-03", name: "Luxury Safari Tent 01", type: "Safari Tent", status: "occupied", rate: 4200 },
      { id: "t-04", name: "Luxury Safari Tent 02", type: "Safari Tent", status: "occupied", rate: 4200 },
      { id: "t-05", name: "Alpine Pre-Pitched Tent A1", type: "Alpine Tent", status: "occupied", rate: 2500 },
      { id: "t-06", name: "Alpine Pre-Pitched Tent A2", type: "Alpine Tent", status: "dirty", rate: 2500 },
      { id: "t-07", name: "Alpine Pre-Pitched Tent A3", type: "Alpine Tent", status: "occupied", rate: 2500 },
      { id: "t-08", name: "Alpine Pre-Pitched Tent A4", type: "Alpine Tent", status: "occupied", rate: 2500 },
      { id: "t-09", name: "BYOT Lawn Pitch G1", type: "BYOT Pitch", status: "occupied", rate: 1200 },
      { id: "t-10", name: "BYOT Lawn Pitch G2", type: "BYOT Pitch", status: "occupied", rate: 1200 },
      { id: "t-11", name: "Campervan RV Bay 01", type: "RV Bay", status: "occupied", rate: 1800 },
      { id: "t-12", name: "Campfire Amphitheater", type: "Amphitheater", status: "occupied", rate: 18000 },
    ],
  },
  {
    id: "prop-3",
    name: "Palm Oasis Luxury Resort",
    type: "resort",
    totalUnits: 24,
    availableUnits: 6,
    occupiedUnits: 16,
    dirtyUnits: 1,
    maintenanceUnits: 1,
    status: "open",
    units: [
      { id: "p-101", name: "Presidential Pool Villa 01", type: "Pool Villa", status: "occupied", rate: 28000 },
      { id: "p-102", name: "Presidential Pool Villa 02", type: "Pool Villa", status: "clean", rate: 28000 },
      { id: "p-103", name: "Executive Lake Suite 201", type: "Suite", status: "clean", rate: 14000 },
      { id: "p-104", name: "Executive Lake Suite 202", type: "Suite", status: "occupied", rate: 14000 },
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
        label: `Fast Filling (Only ${p.availableUnits} Left!)`,
        badgeClass: "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300",
        cardBorder: "border-amber-400/80 dark:border-amber-800/60",
        indicator: "bg-amber-500",
      };
    }
    return {
      label: `Available (${p.availableUnits} Units Free)`,
      badgeClass: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300",
      cardBorder: "border-emerald-400/60 dark:border-emerald-900/40",
      indicator: "bg-emerald-500",
    };
  };

  const getUnitStatusBadge = (status: "clean" | "occupied" | "dirty" | "out_of_service") => {
    switch (status) {
      case "clean":
        return <Badge className="bg-emerald-600 text-white text-[10px] gap-1"><Sparkles className="h-2.5 w-2.5" /> Vacant Ready</Badge>;
      case "occupied":
        return <Badge className="bg-rentcot-blue text-white text-[10px]">Occupied</Badge>;
      case "dirty":
        return <Badge className="bg-amber-500 text-white text-[10px] gap-1"><Clock className="h-2.5 w-2.5" /> Turnover</Badge>;
      case "out_of_service":
        return <Badge variant="destructive" className="text-[10px] gap-1"><Ban className="h-2.5 w-2.5" /> Maintenance</Badge>;
    }
  };

  const togglePropertyStatus = (id: string, newStatus: PropertyAvailabilityData["status"]) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  return (
    <Card className="border-rentcot-blue/30 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-rentcot-blue" />
              <CardTitle className="text-base sm:text-lg font-bold">
                Live Multi-Property Availability Radar
              </CardTitle>
            </div>
            <CardDescription className="text-xs mt-0.5">
              Real-time visual occupancy and instant unit vacancy across your farmhouses, resorts, and camping zones.
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span>Available</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span>Fast Filling</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-600" />
              <span>Sold Out</span>
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Properties Availability Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {properties.map((p) => {
            const avail = getAvailabilityStatus(p);
            const occPercent = Math.round(((p.totalUnits - p.availableUnits) / p.totalUnits) * 100);
            const isExpanded = expandedPropertyId === p.id;

            return (
              <div
                key={p.id}
                className={`p-4 rounded-xl border-2 transition-all bg-card flex flex-col justify-between ${avail.cardBorder}`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`h-3 w-3 rounded-full ${avail.indicator}`} />
                      <h3 className="font-bold text-sm text-foreground leading-tight">
                        {p.name}
                      </h3>
                    </div>
                  </div>

                  <Badge variant="outline" className={`text-xs font-semibold ${avail.badgeClass}`}>
                    {avail.label}
                  </Badge>

                  {/* Occupancy Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>Occupancy: {occPercent}%</span>
                      <span>{p.availableUnits} of {p.totalUnits} Units Free</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${
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

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/60">
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
                    className="text-xs h-8 flex-1 gap-1"
                  >
                    <span>{isExpanded ? "Hide Unit Grid" : "Inspect Units"}</span>
                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </Button>

                  {p.status === "open" ? (
                    <button
                      onClick={() => togglePropertyStatus(p.id, "seasonal_closure")}
                      className="text-[10px] text-muted-foreground hover:text-destructive px-2 py-1 rounded border border-border"
                      title="Pause bookings for off-season or maintenance"
                    >
                      Close Season
                    </button>
                  ) : (
                    <button
                      onClick={() => togglePropertyStatus(p.id, "open")}
                      className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded border border-emerald-300 font-bold"
                    >
                      Re-Open Property
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Expanded Unit Heatmap Visual Grid */}
        {expandedPropertyId && (
          <div className="pt-2">
            {(() => {
              const activeProp = properties.find((p) => p.id === expandedPropertyId);
              if (!activeProp) return null;
              return (
                <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <BedDouble className="h-3.5 w-3.5 text-rentcot-blue" />
                      <span>Physical Unit Availability Map: {activeProp.name}</span>
                    </h4>
                    <span className="text-xs text-muted-foreground">Click any clean unit to book</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    {activeProp.units.map((u) => (
                      <div
                        key={u.id}
                        className={`p-3 rounded-lg border bg-card text-xs space-y-1.5 transition-all ${
                          u.status === "clean"
                            ? "border-emerald-500/50 hover:border-emerald-600 shadow-2xs cursor-pointer"
                            : u.status === "occupied"
                            ? "border-rentcot-blue/30 opacity-90"
                            : "border-border"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-bold text-foreground truncate">{u.name}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground">{u.type}</div>
                        <div className="flex items-center justify-between pt-1 border-t border-border/60">
                          <span className="font-bold text-foreground">₹{u.rate.toLocaleString()}</span>
                          {getUnitStatusBadge(u.status)}
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

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BedDouble,
  Sparkles,
  Plus,
  Filter,
  PawPrint,
  Users,
  CheckCircle2,
  Wrench,
  Brush,
} from "lucide-react";

export default function UnitsPage() {
  const { t, locale } = useTranslation();
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [units, setUnits] = useState([
    { id: "101", name: "Suite 101", property: "Palm Oasis Resort", type: "Executive Suite", status: "clean" as const, floor: "1st Floor", capacity: "2 Adults", pets: false },
    { id: "102", name: "Cottage 102", property: "Palm Oasis Resort", type: "Lake View Cottage", status: "occupied" as const, floor: "Ground", capacity: "3 Adults", pets: true },
    { id: "103", name: "Villa 103", property: "Palm Oasis Resort", type: "Garden Villa", status: "dirty" as const, floor: "Ground", capacity: "4 Adults", pets: true },
    { id: "FH-1", name: "Main Farmhouse Villa", property: "Green Valley Farmhouse", type: "Estate", status: "inspected" as const, floor: "All", capacity: "8 Adults", pets: true },
    { id: "T-01", name: "Glamping Dome 01", property: "Wildwoods Campsite", type: "Glamping Dome", status: "vacant" as const, floor: "Deck 1", capacity: "2 Adults", pets: true },
    { id: "T-02", name: "Glamping Dome 02", property: "Wildwoods Campsite", type: "Glamping Dome", status: "occupied" as const, floor: "Deck 2", capacity: "2 Adults", pets: true },
    { id: "T-03", name: "Safari Tent 01", property: "Wildwoods Campsite", type: "Safari Canvas Tent", status: "clean" as const, floor: "Ground", capacity: "4 Adults", pets: false },
    { id: "T-04", name: "Safari Tent 02", property: "Wildwoods Campsite", type: "Safari Canvas Tent", status: "out_of_service" as const, floor: "Ground", capacity: "4 Adults", pets: false },
  ]);

  const filteredUnits = filterStatus === "all" ? units : units.filter((u) => u.status === filterStatus);

  const toggleStatus = (id: string, newStatus: any) => {
    setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u)));
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Units & Accommodations
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Physical rooms, tents, cottages, and villas across all properties
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white text-xs font-semibold gap-1.5">
            <Plus className="h-4 w-4" />
            Add Unit Type / Room
          </Button>
        </div>
      </div>

      {/* Filter status buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {["all", "clean", "dirty", "inspected", "occupied", "vacant", "out_of_service"].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
              filterStatus === st
                ? "bg-rentcot-blue text-white shadow-2xs"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {st.replace("_", " ")} {st !== "all" ? `(${units.filter((u) => u.status === st).length})` : `(${units.length})`}
          </button>
        ))}
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredUnits.map((u) => (
          <Card key={u.id} className="border-border shadow-2xs hover:border-rentcot-blue/40 transition-all">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground font-mono font-bold text-xs">
                    {u.id}
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold">{u.name}</CardTitle>
                    <span className="text-[11px] text-muted-foreground block">{u.property}</span>
                  </div>
                </div>
                <Badge variant={u.status} className="text-[10px]">
                  {u.status.replace("_", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-medium text-foreground">{u.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Capacity:</span>
                  <span className="font-medium text-foreground">{u.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pets:</span>
                  <span className="font-medium text-foreground">{u.pets ? "Allowed" : "No Pets"}</span>
                </div>
              </div>

              {/* Quick Status Change Actions */}
              <div className="pt-2 border-t border-border flex items-center justify-between gap-1 text-[10px]">
                <button
                  onClick={() => toggleStatus(u.id, "clean")}
                  className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold"
                >
                  Clean
                </button>
                <button
                  onClick={() => toggleStatus(u.id, "dirty")}
                  className="px-2 py-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold"
                >
                  Dirty
                </button>
                <button
                  onClick={() => toggleStatus(u.id, "inspected")}
                  className="px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold"
                >
                  Inspect
                </button>
                <button
                  onClick={() => toggleStatus(u.id, "out_of_service")}
                  className="px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold"
                >
                  OOS
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

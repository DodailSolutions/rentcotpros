"use client";

import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Wrench,
  Search,
  Filter,
  RefreshCw,
  BedDouble,
  ShieldCheck,
  Ban,
  TreePine,
  Tent,
} from "lucide-react";

type UnitOperationalStatus = "clean" | "dirty" | "inspected" | "occupied" | "vacant" | "out_of_service";

interface HousekeepingUnit {
  id: string;
  name: string;
  property: string;
  type: string;
  status: UnitOperationalStatus;
  assignedStaff: string;
  lastCleaned: string;
  notes?: string;
  hasMaintenanceIssue?: boolean;
}

const initialUnits: HousekeepingUnit[] = [
  {
    id: "u-101",
    name: "Heritage Villa 1",
    property: "Green Valley Farmhouse",
    type: "3BHK Villa",
    status: "occupied",
    assignedStaff: "Ramesh K.",
    lastCleaned: "Today, 10:30 AM",
    notes: "Guest in room until Sunday. Regular towel refresh only.",
  },
  {
    id: "u-102",
    name: "Heritage Villa 2",
    property: "Green Valley Farmhouse",
    type: "3BHK Villa",
    status: "dirty",
    assignedStaff: "Lakshmi S.",
    lastCleaned: "Yesterday, 4:00 PM",
    notes: "Checkout completed at 11am. Full linen turnover required.",
  },
  {
    id: "u-103",
    name: "Pool Cottage 01",
    property: "Palm Oasis Resort",
    type: "Pool Cottage",
    status: "inspected",
    assignedStaff: "Suresh P.",
    lastCleaned: "Today, 11:15 AM",
    notes: "Supervised by Head Housekeeper. Ready for 2 PM check-in.",
  },
  {
    id: "u-104",
    name: "Pool Cottage 02",
    property: "Palm Oasis Resort",
    type: "Pool Cottage",
    status: "clean",
    assignedStaff: "Lakshmi S.",
    lastCleaned: "Today, 12:00 PM",
    notes: "Awaiting supervisor final inspection.",
  },
  {
    id: "u-105",
    name: "Luxury Glamping Tent 04",
    property: "Wildwoods Campsite",
    type: "Glamping Tent",
    status: "occupied",
    assignedStaff: "Ramesh K.",
    lastCleaned: "Today, 09:45 AM",
    notes: "Campfire embers cleared safely.",
  },
  {
    id: "u-106",
    name: "Safari Dome Tent 02",
    property: "Wildwoods Campsite",
    type: "Safari Tent",
    status: "dirty",
    assignedStaff: "Unassigned",
    lastCleaned: "Yesterday, 11:00 AM",
    notes: "Guest departed with pet. Sanitize carpet and replace mattress protector.",
  },
  {
    id: "u-107",
    name: "Garden Suite 105",
    property: "Green Valley Farmhouse",
    type: "Deluxe Suite",
    status: "out_of_service",
    assignedStaff: "Maintenance Team",
    lastCleaned: "3 days ago",
    notes: "AC compressor replacement in progress. ETA 5:00 PM.",
    hasMaintenanceIssue: true,
  },
];

export default function HousekeepingPage() {
  const { t } = useTranslation();
  const [units, setUnits] = useState<HousekeepingUnit[]>(initialUnits);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const handleStatusTransition = (unitId: string, newStatus: UnitOperationalStatus) => {
    setUnits((prev) =>
      prev.map((u) => (u.id === unitId ? { ...u, status: newStatus } : u))
    );
  };

  const filteredUnits = units.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.property.toLowerCase().includes(search.toLowerCase()) ||
      u.assignedStaff.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: UnitOperationalStatus) => {
    switch (status) {
      case "inspected":
        return <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"><ShieldCheck className="h-3 w-3" /> Inspected (Ready)</Badge>;
      case "clean":
        return <Badge className="bg-sky-500 hover:bg-sky-600 text-white gap-1"><Sparkles className="h-3 w-3" /> Clean</Badge>;
      case "dirty":
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white gap-1"><Clock className="h-3 w-3" /> Needs Cleaning</Badge>;
      case "occupied":
        return <Badge className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white gap-1"><User className="h-3 w-3" /> In-House Occupied</Badge>;
      case "vacant":
        return <Badge variant="secondary" className="gap-1"><BedDouble className="h-3 w-3" /> Vacant</Badge>;
      case "out_of_service":
        return <Badge variant="destructive" className="gap-1"><Wrench className="h-3 w-3" /> Out of Service</Badge>;
    }
  };

  const countByStatus = (status: UnitOperationalStatus) =>
    units.filter((u) => u.status === status).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {t("nav.housekeeping", "Housekeeping & Turnover Board")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time room operational state machine: clean, dirty, inspected, occupied, and out of service.
          </p>
        </div>
      </div>

      {/* KPI Status Tickers */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Inspected & Ready", count: countByStatus("inspected"), color: "text-emerald-600 border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/20" },
          { label: "Clean (Pending Insp.)", count: countByStatus("clean"), color: "text-sky-600 border-sky-500/20 bg-sky-50 dark:bg-sky-950/20" },
          { label: "Needs Cleaning", count: countByStatus("dirty"), color: "text-amber-600 border-amber-500/20 bg-amber-50 dark:bg-amber-950/20" },
          { label: "Occupied Guests", count: countByStatus("occupied"), color: "text-rentcot-blue border-rentcot-blue/20 bg-rentcot-blue/10" },
          { label: "Vacant", count: countByStatus("vacant"), color: "text-muted-foreground border-border bg-card" },
          { label: "Maintenance", count: countByStatus("out_of_service"), color: "text-destructive border-destructive/20 bg-destructive/10" },
        ].map((item, idx) => (
          <div key={idx} className={`p-3 rounded-xl border ${item.color}`}>
            <div className="text-2xl font-bold">{item.count}</div>
            <div className="text-xs font-semibold leading-tight mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Search & Status Filter */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search room name, property, or housekeeper..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {["all", "dirty", "clean", "inspected", "occupied", "out_of_service"].map((st) => (
                <Button
                  key={st}
                  variant={statusFilter === st ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(st)}
                  className="capitalize whitespace-nowrap text-xs h-9 min-h-[36px]"
                >
                  {st.replace("_", " ")}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Housekeeping Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUnits.map((unit) => (
          <Card key={unit.id} className="hover:border-primary/50 transition-colors flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-bold text-foreground">
                    {unit.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-0.5">
                    {unit.property} • {unit.type}
                  </CardDescription>
                </div>
                {getStatusBadge(unit.status)}
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pb-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/40 p-2 rounded-lg">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-rentcot-blue" />
                  <span>{unit.assignedStaff}</span>
                </span>
                <span>{unit.lastCleaned}</span>
              </div>

              {unit.notes && (
                <div className={`text-xs p-2.5 rounded-lg border ${
                  unit.hasMaintenanceIssue
                    ? "border-destructive/30 bg-destructive/10 text-destructive font-medium"
                    : "border-border bg-muted/20 text-muted-foreground"
                }`}>
                  {unit.hasMaintenanceIssue && (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-destructive mb-1 uppercase tracking-wider">
                      <AlertTriangle className="h-3 w-3" /> Maintenance Active
                    </div>
                  )}
                  {unit.notes}
                </div>
              )}

              {/* State Machine Transition Buttons */}
              <div className="pt-2 border-t border-border flex flex-wrap items-center gap-1.5">
                {unit.status === "dirty" && (
                  <Button
                    size="sm"
                    className="flex-1 bg-sky-500 hover:bg-sky-600 text-white text-xs h-9 min-h-[36px]"
                    onClick={() => handleStatusTransition(unit.id, "clean")}
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-1" />
                    Mark Clean
                  </Button>
                )}

                {unit.status === "clean" && (
                  <Button
                    size="sm"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 min-h-[36px]"
                    onClick={() => handleStatusTransition(unit.id, "inspected")}
                  >
                    <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                    Inspect & Ready
                  </Button>
                )}

                {unit.status === "inspected" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs h-9 min-h-[36px]"
                    onClick={() => handleStatusTransition(unit.id, "occupied")}
                  >
                    <User className="h-3.5 w-3.5 mr-1" />
                    Assign Check-In
                  </Button>
                )}

                {unit.status === "occupied" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs h-9 min-h-[36px] text-amber-600 border-amber-500/30 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                    onClick={() => handleStatusTransition(unit.id, "dirty")}
                  >
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    Turnover (Checkout)
                  </Button>
                )}

                {unit.status !== "out_of_service" ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-9 px-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-xs"
                    onClick={() => handleStatusTransition(unit.id, "out_of_service")}
                    title="Take Out of Service for Maintenance"
                  >
                    <Wrench className="h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs h-9 min-h-[36px] border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                    onClick={() => handleStatusTransition(unit.id, "clean")}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    Maintenance Fixed → Clean
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

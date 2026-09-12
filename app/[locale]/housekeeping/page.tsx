"use client";

import React, { useState, useMemo } from "react";
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
  Building,
  Check,
  X,
  ArrowRight,
  ChevronRight,
  ListFilter,
  Kanban,
  LayoutGrid,
  History,
  AlertCircle,
  FileText,
  UserCheck,
  Zap,
  Phone,
  Timer,
  SlidersHorizontal,
} from "lucide-react";

type OperationalState = "dirty" | "clean" | "inspected" | "occupied" | "out_of_service";

interface MaintenanceTicket {
  id: string;
  issue: string;
  category: "hvac" | "plumbing" | "electrical" | "furniture" | "pest_control" | "other";
  severity: "low" | "medium" | "critical";
  reportedAt: string;
  technician: string;
  estimatedCost: number;
  notes?: string;
}

interface InspectionChecklist {
  linenFresh: boolean;
  bathroomSanitized: boolean;
  acTested: boolean;
  odorPestFree: boolean;
  amenitiesPlaced: boolean;
}

interface HousekeepingUnit {
  id: string;
  name: string;
  property: string;
  propertyId: string;
  type: string;
  category: "villa" | "cottage" | "tent" | "dome" | "suite";
  status: OperationalState;
  assignedStaff: string;
  lastCleaned: string;
  timeInStatus: string; // e.g. "35m in state"
  turnoverPriority?: "urgent_vip" | "high" | "normal" | "low";
  nextArrival?: {
    guestName: string;
    checkInTime: string;
    isVip?: boolean;
  };
  notes?: string;
  checklist?: InspectionChecklist;
  maintenanceTicket?: MaintenanceTicket;
}

interface StateAuditLog {
  id: string;
  unitName: string;
  fromStatus: OperationalState;
  toStatus: OperationalState;
  timestamp: string;
  actor: string;
  note?: string;
}

// State Machine Configuration
const OPERATIONAL_STATE_CONFIG: Record<
  OperationalState,
  {
    label: string;
    shortLabel: string;
    badgeVariant: string;
    badgeBg: string;
    borderClass: string;
    bgTint: string;
    textClass: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    allowedTransitions: OperationalState[];
    actionLabel: string;
  }
> = {
  dirty: {
    label: "Needs Cleaning",
    shortLabel: "Dirty",
    badgeVariant: "amber",
    badgeBg: "bg-amber-500 hover:bg-amber-600 text-white",
    borderClass: "border-amber-500/30",
    bgTint: "bg-amber-500/5",
    textClass: "text-amber-600 dark:text-amber-400",
    icon: Clock,
    description: "Checkout complete or stayover refresh. Linen stripped & needs turnover.",
    allowedTransitions: ["clean", "out_of_service"],
    actionLabel: "Start Turnover",
  },
  clean: {
    label: "Cleaned (Pending QC)",
    shortLabel: "Clean",
    badgeVariant: "sky",
    badgeBg: "bg-sky-500 hover:bg-sky-600 text-white",
    borderClass: "border-sky-500/30",
    bgTint: "bg-sky-500/5",
    textClass: "text-sky-600 dark:text-sky-400",
    icon: Sparkles,
    description: "Housekeeper completed sanitization. Awaiting supervisor inspection.",
    allowedTransitions: ["inspected", "dirty", "out_of_service"],
    actionLabel: "Supervisor QC",
  },
  inspected: {
    label: "Inspected & Ready",
    shortLabel: "Inspected",
    badgeVariant: "emerald",
    badgeBg: "bg-emerald-600 hover:bg-emerald-700 text-white",
    borderClass: "border-emerald-500/30",
    bgTint: "bg-emerald-500/5",
    textClass: "text-emerald-600 dark:text-emerald-400",
    icon: ShieldCheck,
    description: "Quality-checked by supervisor. AC tested, key coded & ready for arrival.",
    allowedTransitions: ["occupied", "dirty", "out_of_service"],
    actionLabel: "Guest Check-In",
  },
  occupied: {
    label: "In-House (Occupied)",
    shortLabel: "Occupied",
    badgeVariant: "blue",
    badgeBg: "bg-rentcot-blue hover:bg-rentcot-blue/90 text-white",
    borderClass: "border-rentcot-blue/30",
    bgTint: "bg-rentcot-blue/5",
    textClass: "text-rentcot-blue dark:text-sky-300",
    icon: User,
    description: "Guest currently residing in room. Daily towel & trash service available.",
    allowedTransitions: ["dirty", "clean", "out_of_service"],
    actionLabel: "Checkout Turnover",
  },
  out_of_service: {
    label: "Out of Service",
    shortLabel: "OOS / Maintenance",
    badgeVariant: "rose",
    badgeBg: "bg-rose-600 hover:bg-rose-700 text-white",
    borderClass: "border-rose-500/30",
    bgTint: "bg-rose-500/5",
    textClass: "text-rose-600 dark:text-rose-400",
    icon: Wrench,
    description: "Blocked for maintenance repairs, AC servicing, plumbing or fumigation.",
    allowedTransitions: ["dirty", "clean"],
    actionLabel: "Resolve Ticket",
  },
};

const initialUnits: HousekeepingUnit[] = [
  {
    id: "u-101",
    name: "Heritage Villa 1",
    property: "Green Valley Farmhouse",
    propertyId: "prop-1",
    type: "3BHK Private Pool Villa",
    category: "villa",
    status: "occupied",
    assignedStaff: "Ramesh K.",
    lastCleaned: "Today, 10:30 AM",
    timeInStatus: "1h 45m in state",
    turnoverPriority: "normal",
    notes: "Guest in room until Sunday. Regular towel refresh & pool skim done.",
    checklist: {
      linenFresh: true,
      bathroomSanitized: true,
      acTested: true,
      odorPestFree: true,
      amenitiesPlaced: true,
    },
  },
  {
    id: "u-102",
    name: "Heritage Villa 2",
    property: "Green Valley Farmhouse",
    propertyId: "prop-1",
    type: "3BHK Private Lawn Villa",
    category: "villa",
    status: "dirty",
    assignedStaff: "Lakshmi S.",
    lastCleaned: "Yesterday, 4:00 PM",
    timeInStatus: "42m in state",
    turnoverPriority: "urgent_vip",
    nextArrival: {
      guestName: "Vikram Malhotra",
      checkInTime: "01:30 PM Today",
      isVip: true,
    },
    notes: "Checkout completed at 11:00 AM. VIP arrival requires full linen swap & welcome fruit basket.",
  },
  {
    id: "u-103",
    name: "Pool Cottage 01",
    property: "Palm Oasis Resort",
    propertyId: "prop-3",
    type: "Waterfront Pool Cottage",
    category: "cottage",
    status: "inspected",
    assignedStaff: "Suresh P.",
    lastCleaned: "Today, 11:15 AM",
    timeInStatus: "28m in state",
    turnoverPriority: "high",
    nextArrival: {
      guestName: "Pooja Hegde",
      checkInTime: "02:00 PM Today",
    },
    notes: "Supervised by Head Housekeeper. AC set to 22°C, welcome letter placed.",
    checklist: {
      linenFresh: true,
      bathroomSanitized: true,
      acTested: true,
      odorPestFree: true,
      amenitiesPlaced: true,
    },
  },
  {
    id: "u-104",
    name: "Pool Cottage 02",
    property: "Palm Oasis Resort",
    propertyId: "prop-3",
    type: "Waterfront Pool Cottage",
    category: "cottage",
    status: "clean",
    assignedStaff: "Lakshmi S.",
    lastCleaned: "Today, 12:00 PM",
    timeInStatus: "15m in state",
    turnoverPriority: "high",
    nextArrival: {
      guestName: "Aditya Roy",
      checkInTime: "02:30 PM Today",
    },
    notes: "Turnover completed with organic citrus cleaner. Ready for supervisor inspection.",
    checklist: {
      linenFresh: true,
      bathroomSanitized: true,
      acTested: true,
      odorPestFree: true,
      amenitiesPlaced: true,
    },
  },
  {
    id: "u-105",
    name: "Luxury Glamping Tent 04",
    property: "Wildwoods Campsite",
    propertyId: "prop-2",
    type: "Air-Conditioned Glamping Tent",
    category: "tent",
    status: "occupied",
    assignedStaff: "Ramesh K.",
    lastCleaned: "Today, 09:45 AM",
    timeInStatus: "3h 10m in state",
    turnoverPriority: "low",
    notes: "Campfire embers cleared safely. Requested extra blanket for evening.",
  },
  {
    id: "u-106",
    name: "Safari Dome Tent 02",
    property: "Wildwoods Campsite",
    propertyId: "prop-2",
    type: "Geodesic Glamping Dome",
    category: "dome",
    status: "dirty",
    assignedStaff: "Unassigned",
    lastCleaned: "Yesterday, 11:00 AM",
    timeInStatus: "1h 15m in state",
    turnoverPriority: "normal",
    nextArrival: {
      guestName: "Karan Johar Group",
      checkInTime: "04:00 PM Today",
    },
    notes: "Guest departed with pet. Deep sanitization of rug & UV ozone sterilization required.",
  },
  {
    id: "u-107",
    name: "Garden Suite 105",
    property: "Green Valley Farmhouse",
    propertyId: "prop-1",
    type: "Deluxe Garden Suite",
    category: "suite",
    status: "out_of_service",
    assignedStaff: "Suresh P.",
    lastCleaned: "3 days ago",
    timeInStatus: "2d 4h in state",
    turnoverPriority: "high",
    notes: "Inverter AC compressor failed cooling test. Technician on-site.",
    maintenanceTicket: {
      id: "MNT-409",
      issue: "Inverter AC compressor cooling failure",
      category: "hvac",
      severity: "critical",
      reportedAt: "Yesterday, 3:30 PM",
      technician: "Voltas Authorized Engineer",
      estimatedCost: 3800,
      notes: "Parts arriving by 2 PM. Post-repair testing required.",
    },
  },
  {
    id: "u-108",
    name: "Private Farmhouse Cottage 101",
    property: "Green Valley Farmhouse",
    propertyId: "prop-1",
    type: "Rustic Stone Cottage",
    category: "cottage",
    status: "clean",
    assignedStaff: "Meena R.",
    lastCleaned: "Today, 12:20 PM",
    timeInStatus: "8m in state",
    turnoverPriority: "normal",
    notes: "New Egyptian cotton bedsheets placed. Mini fridge restocked with cold water.",
  },
  {
    id: "u-109",
    name: "Lakeside Luxury Cottage 03",
    property: "Palm Oasis Resort",
    propertyId: "prop-3",
    type: "Waterfront Pool Cottage",
    category: "cottage",
    status: "dirty",
    assignedStaff: "Meena R.",
    lastCleaned: "Yesterday, 5:00 PM",
    timeInStatus: "20m in state",
    turnoverPriority: "urgent_vip",
    nextArrival: {
      guestName: "Dr. Ananya Rao (Honeymoon)",
      checkInTime: "01:00 PM Today",
      isVip: true,
    },
    notes: "Departure turnover in progress. Decorate bed with fresh jasmine flowers.",
  },
];

const initialAuditLogs: StateAuditLog[] = [
  {
    id: "log-1",
    unitName: "Pool Cottage 01",
    fromStatus: "clean",
    toStatus: "inspected",
    timestamp: "11:15 AM",
    actor: "Supervisor Rajesh",
    note: "All 5 QC checks passed. Welcome kit verified.",
  },
  {
    id: "log-2",
    unitName: "Pool Cottage 02",
    fromStatus: "dirty",
    toStatus: "clean",
    timestamp: "12:00 PM",
    actor: "Lakshmi S.",
    note: "Linen turnover and floor polish completed.",
  },
  {
    id: "log-3",
    unitName: "Heritage Villa 2",
    fromStatus: "occupied",
    toStatus: "dirty",
    timestamp: "11:00 AM",
    actor: "Front-Desk Reception",
    note: "Guest checkout folio closed. Turnover triggered.",
  },
];

const onDutyStaff = ["Lakshmi S.", "Ramesh K.", "Suresh P.", "Meena R.", "Unassigned"];

export default function HousekeepingPage() {
  const { t } = useTranslation();
  const [units, setUnits] = useState<HousekeepingUnit[]>(initialUnits);
  const [auditLogs, setAuditLogs] = useState<StateAuditLog[]>(initialAuditLogs);

  // Filters & Views
  const [search, setSearch] = useState("");
  const [propertyFilter, setPropertyFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [staffFilter, setStaffFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"kanban" | "grid">("kanban");

  // Inspection QC Modal State
  const [inspectingUnit, setInspectingUnit] = useState<HousekeepingUnit | null>(null);
  const [qcChecklist, setQcChecklist] = useState<InspectionChecklist>({
    linenFresh: true,
    bathroomSanitized: true,
    acTested: true,
    odorPestFree: true,
    amenitiesPlaced: true,
  });
  const [qcNotes, setQcNotes] = useState("");

  // Maintenance / OOS Modal State
  const [maintenanceUnit, setMaintenanceUnit] = useState<HousekeepingUnit | null>(null);
  const [maintenanceForm, setMaintenanceForm] = useState<{
    issue: string;
    category: MaintenanceTicket["category"];
    severity: MaintenanceTicket["severity"];
    technician: string;
    estimatedCost: number;
    notes: string;
  }>({
    issue: "",
    category: "hvac",
    severity: "medium",
    technician: "",
    estimatedCost: 1500,
    notes: "",
  });

  // Reassign Staff Modal / Popover State
  const [reassigningUnit, setReassigningUnit] = useState<HousekeepingUnit | null>(null);

  // State Machine Transition Handler
  const handleTransition = (
    unitId: string,
    newStatus: OperationalState,
    customActor = "Current User",
    customNote?: string
  ) => {
    const targetUnit = units.find((u) => u.id === unitId);
    if (!targetUnit) return;

    // Validate Transition against Allowed Rules
    const allowed = OPERATIONAL_STATE_CONFIG[targetUnit.status].allowedTransitions;
    if (!allowed.includes(newStatus)) {
      console.warn(`Invalid state transition from ${targetUnit.status} to ${newStatus}`);
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Update Unit
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id === unitId) {
          return {
            ...u,
            status: newStatus,
            timeInStatus: "Just now",
            lastCleaned: newStatus === "clean" ? `Today, ${timeString}` : u.lastCleaned,
            notes: customNote !== undefined ? customNote : u.notes,
            // If leaving out_of_service, clear maintenanceTicket
            maintenanceTicket: newStatus === "out_of_service" ? u.maintenanceTicket : undefined,
          };
        }
        return u;
      })
    );

    // Record Audit Log
    const newLog: StateAuditLog = {
      id: `log-${Date.now()}`,
      unitName: targetUnit.name,
      fromStatus: targetUnit.status,
      toStatus: newStatus,
      timestamp: timeString,
      actor: customActor,
      note: customNote || `State transitioned to ${OPERATIONAL_STATE_CONFIG[newStatus].label}`,
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 19)]);
  };

  // Open Inspection QC Modal
  const openInspectionModal = (unit: HousekeepingUnit) => {
    setInspectingUnit(unit);
    setQcChecklist({
      linenFresh: true,
      bathroomSanitized: true,
      acTested: true,
      odorPestFree: true,
      amenitiesPlaced: true,
    });
    setQcNotes(unit.notes || "");
  };

  // Submit Inspection (Pass or Fail)
  const handleCompleteInspection = (passed: boolean) => {
    if (!inspectingUnit) return;

    if (passed) {
      handleTransition(
        inspectingUnit.id,
        "inspected",
        "Supervisor (QC Passed)",
        qcNotes || "QC Approved: All 5 hygiene & operational standards verified."
      );
    } else {
      // Failed QC: Return back to dirty with reason
      handleTransition(
        inspectingUnit.id,
        "dirty",
        "Supervisor (QC Failed)",
        `Inspection Failed: ${qcNotes || "Defects detected. Requires rework by attendant."}`
      );
    }
    setInspectingUnit(null);
  };

  // Open Maintenance Modal
  const openMaintenanceModal = (unit: HousekeepingUnit) => {
    setMaintenanceUnit(unit);
    setMaintenanceForm({
      issue: unit.maintenanceTicket?.issue || "Emergency repair reported",
      category: unit.maintenanceTicket?.category || "hvac",
      severity: unit.maintenanceTicket?.severity || "critical",
      technician: unit.maintenanceTicket?.technician || "On-Call Technician",
      estimatedCost: unit.maintenanceTicket?.estimatedCost || 1200,
      notes: unit.maintenanceTicket?.notes || "",
    });
  };

  // Save Maintenance Out of Service
  const handleSaveMaintenance = () => {
    if (!maintenanceUnit) return;

    const ticket: MaintenanceTicket = {
      id: `MNT-${Date.now().toString().slice(-4)}`,
      issue: maintenanceForm.issue,
      category: maintenanceForm.category,
      severity: maintenanceForm.severity,
      reportedAt: "Today, Just now",
      technician: maintenanceForm.technician || "Internal Maintenance Team",
      estimatedCost: maintenanceForm.estimatedCost,
      notes: maintenanceForm.notes,
    };

    setUnits((prev) =>
      prev.map((u) =>
        u.id === maintenanceUnit.id
          ? {
              ...u,
              status: "out_of_service",
              timeInStatus: "Just now",
              maintenanceTicket: ticket,
              notes: `[Maintenance Active] ${ticket.issue} (Tech: ${ticket.technician})`,
            }
          : u
      )
    );

    const newLog: StateAuditLog = {
      id: `log-${Date.now()}`,
      unitName: maintenanceUnit.name,
      fromStatus: maintenanceUnit.status,
      toStatus: "out_of_service",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      actor: "Maintenance Lead",
      note: `OOS Ticket ${ticket.id}: ${ticket.issue}`,
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 19)]);
    setMaintenanceUnit(null);
  };

  // Staff Reassignment
  const handleAssignStaff = (unitId: string, newStaff: string) => {
    setUnits((prev) =>
      prev.map((u) => (u.id === unitId ? { ...u, assignedStaff: newStaff } : u))
    );
    setReassigningUnit(null);
  };

  // Filtered Units Calculation
  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.property.toLowerCase().includes(search.toLowerCase()) ||
        u.assignedStaff.toLowerCase().includes(search.toLowerCase()) ||
        (u.notes && u.notes.toLowerCase().includes(search.toLowerCase()));

      const matchesProperty = propertyFilter === "all" || u.propertyId === propertyFilter;
      const matchesStatus = statusFilter === "all" || u.status === statusFilter;
      const matchesStaff = staffFilter === "all" || u.assignedStaff === staffFilter;

      return matchesSearch && matchesProperty && matchesStatus && matchesStaff;
    });
  }, [units, search, propertyFilter, statusFilter, staffFilter]);

  // Counts by Operational State
  const counts = useMemo(() => {
    return {
      dirty: units.filter((u) => u.status === "dirty").length,
      clean: units.filter((u) => u.status === "clean").length,
      inspected: units.filter((u) => u.status === "inspected").length,
      occupied: units.filter((u) => u.status === "occupied").length,
      out_of_service: units.filter((u) => u.status === "out_of_service").length,
      total: units.length,
    };
  }, [units]);

  // Staff Cleaning Workload
  const staffWorkload = useMemo(() => {
    const map: Record<string, { total: number; dirty: number; clean: number }> = {};
    units.forEach((u) => {
      if (!map[u.assignedStaff]) {
        map[u.assignedStaff] = { total: 0, dirty: 0, clean: 0 };
      }
      map[u.assignedStaff].total++;
      if (u.status === "dirty") map[u.assignedStaff].dirty++;
      if (u.status === "clean") map[u.assignedStaff].clean++;
    });
    return map;
  }, [units]);

  return (
    <div className="space-y-5 pb-16">
      {/* Top Header & Context */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
              <span>{t("nav.housekeeping", "Housekeeping Operations")}</span>
              <Sparkles className="h-6 w-6 text-rentcot-blue" />
            </h1>
            <Badge variant="outline" className="text-xs font-mono font-bold bg-emerald-500/10 text-emerald-700 border-emerald-500/30">
              Live State Machine
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
            Real-time room operational state machine: clean, dirty, inspected, occupied, and out of service with supervisor QC inspection, maintenance tagging, and turnaround intelligence.
          </p>
        </div>

        {/* View Switcher & Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-muted p-0.5 rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === "kanban"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Kanban className="h-3.5 w-3.5" />
              <span>Kanban Board</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === "grid"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Grid View</span>
            </button>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="text-xs h-8 gap-1.5 border-border shadow-2xs"
            onClick={() => {
              // Quick mock trigger: mark oldest dirty room clean
              const oldestDirty = units.find((u) => u.status === "dirty");
              if (oldestDirty) {
                handleTransition(oldestDirty.id, "clean", "Housekeeping Attendant", "Turnover completed by attendant");
              }
            }}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Advance Oldest</span>
          </Button>
        </div>
      </div>

      {/* State Machine Operational Life-Cycle Flow Strip */}
      <div className="p-3 rounded-2xl border border-border bg-card shadow-xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/60">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-rentcot-blue" />
            <span>Turnover Operational State Machine (Click state to filter)</span>
          </span>
          <span className="text-[11px] font-mono text-muted-foreground">
            {counts.total} Registered Units
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(["dirty", "clean", "inspected", "occupied", "out_of_service"] as OperationalState[]).map(
            (stateKey, index) => {
              const cfg = OPERATIONAL_STATE_CONFIG[stateKey];
              const Icon = cfg.icon;
              const count = counts[stateKey];
              const isSelected = statusFilter === stateKey;

              return (
                <button
                  key={stateKey}
                  type="button"
                  onClick={() => setStatusFilter(isSelected ? "all" : stateKey)}
                  className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                    isSelected
                      ? `ring-2 ring-primary ${cfg.bgTint} ${cfg.borderClass}`
                      : `${cfg.bgTint} ${cfg.borderClass} hover:shadow-xs`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Step {index + 1}
                    </span>
                    <Icon className={`h-4 w-4 ${cfg.textClass}`} />
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-xl font-black font-mono">{count}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {Math.round((count / counts.total) * 100)}%
                    </span>
                  </div>
                  <div className="text-xs font-bold text-foreground mt-0.5 truncate">
                    {cfg.shortLabel}
                  </div>
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-3 rounded-xl border border-border bg-card shadow-2xs space-y-2.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search room name, villa, tent, guest name, or housekeeper..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            )}
          </div>

          {/* Property Selector */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <select
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              className="p-2 text-xs rounded-lg border border-border bg-background text-foreground font-semibold"
            >
              <option value="all">All Properties ({units.length})</option>
              <option value="prop-1">Green Valley Farmhouse</option>
              <option value="prop-2">Wildwoods Campsite</option>
              <option value="prop-3">Palm Oasis Luxury Resort</option>
            </select>

            {/* Staff Filter */}
            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              className="p-2 text-xs rounded-lg border border-border bg-background text-foreground font-semibold"
            >
              <option value="all">All Attendants</option>
              {onDutyStaff.map((staff) => (
                <option key={staff} value={staff}>
                  {staff} {staffWorkload[staff] ? `(${staffWorkload[staff].total})` : ""}
                </option>
              ))}
            </select>

            {/* Reset Filter button */}
            {(search || propertyFilter !== "all" || statusFilter !== "all" || staffFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8 px-2 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setSearch("");
                  setPropertyFilter("all");
                  setStatusFilter("all");
                  setStaffFilter("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-muted-foreground mr-1 shrink-0">
            Quick Status:
          </span>
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors shrink-0 ${
              statusFilter === "all"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            All Units ({units.length})
          </button>
          {(["dirty", "clean", "inspected", "occupied", "out_of_service"] as OperationalState[]).map(
            (st) => {
              const cfg = OPERATIONAL_STATE_CONFIG[st];
              const count = counts[st];
              const isSel = statusFilter === st;

              return (
                <button
                  key={st}
                  onClick={() => setStatusFilter(isSel ? "all" : st)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors shrink-0 flex items-center gap-1.5 ${
                    isSel
                      ? `${cfg.badgeBg} shadow-2xs`
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <cfg.icon className="h-3 w-3" />
                  <span>{cfg.shortLabel}</span>
                  <span className="font-mono opacity-80">({count})</span>
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Main Board Area: KANBAN vs GRID */}
      {viewMode === "kanban" ? (
        /* KANBAN BOARD: 5 Real-Time Operational State Columns */
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 items-start">
          {(["dirty", "clean", "inspected", "occupied", "out_of_service"] as OperationalState[]).map(
            (colState) => {
              const cfg = OPERATIONAL_STATE_CONFIG[colState];
              const Icon = cfg.icon;
              const colUnits = filteredUnits.filter((u) => u.status === colState);

              return (
                <div
                  key={colState}
                  className={`rounded-2xl border ${cfg.borderClass} ${cfg.bgTint} p-2.5 flex flex-col min-h-[500px] shadow-2xs`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/60">
                    <div className="flex items-center gap-1.5">
                      <div className={`p-1 rounded-md ${cfg.badgeBg}`}>
                        <Icon className="h-3.5 w-3.5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-foreground">{cfg.shortLabel}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {colUnits.length} {colUnits.length === 1 ? "room" : "rooms"}
                        </div>
                      </div>
                    </div>

                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-background border border-border">
                      {colUnits.length}
                    </span>
                  </div>

                  {/* Cards inside Column */}
                  <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[620px] pr-0.5">
                    {colUnits.length === 0 ? (
                      <div className="py-10 text-center text-muted-foreground/60 text-xs border border-dashed border-border/80 rounded-xl p-3">
                        No units in {cfg.shortLabel.toLowerCase()}
                      </div>
                    ) : (
                      colUnits.map((unit) => (
                        <Card
                          key={unit.id}
                          className="bg-card shadow-xs hover:shadow-md transition-all border border-border/80 group"
                        >
                          <CardContent className="p-3 space-y-2.5">
                            {/* Card Top: Unit Name & Property */}
                            <div className="flex items-start justify-between gap-1.5">
                              <div>
                                <div className="font-extrabold text-xs text-foreground leading-snug">
                                  {unit.name}
                                </div>
                                <div className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                                  {unit.property} • {unit.type}
                                </div>
                              </div>

                              {/* Priority Tag */}
                              {unit.turnoverPriority === "urgent_vip" && (
                                <Badge className="text-[9px] px-1.5 py-0.2 bg-rose-500 text-white font-bold animate-pulse">
                                  VIP Urgent
                                </Badge>
                              )}
                              {unit.turnoverPriority === "high" && (
                                <Badge className="text-[9px] px-1.5 py-0.2 bg-amber-500 text-white font-bold">
                                  Check-in Today
                                </Badge>
                              )}
                            </div>

                            {/* Next Arrival Banner if any */}
                            {unit.nextArrival && (
                              <div className="p-1.5 px-2 rounded-md bg-muted/60 border border-border/60 text-[10px] flex items-center justify-between">
                                <span className="font-semibold truncate">
                                  {unit.nextArrival.guestName}
                                </span>
                                <span className="font-mono text-primary font-bold shrink-0 ml-1">
                                  {unit.nextArrival.checkInTime}
                                </span>
                              </div>
                            )}

                            {/* Attendant & Time in State */}
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                              <button
                                type="button"
                                onClick={() => setReassigningUnit(unit)}
                                className="flex items-center gap-1 hover:text-foreground font-semibold transition-colors"
                                title="Click to reassign attendant"
                              >
                                <User className="h-3 w-3 text-rentcot-blue" />
                                <span>{unit.assignedStaff}</span>
                              </button>
                              <span className="flex items-center gap-1 font-mono">
                                <Timer className="h-3 w-3 opacity-60" />
                                <span>{unit.timeInStatus}</span>
                              </span>
                            </div>

                            {/* Maintenance Notice if OOS */}
                            {unit.maintenanceTicket && (
                              <div className="p-1.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-700 dark:text-rose-300">
                                <div className="font-bold flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3 shrink-0" />
                                  <span>{unit.maintenanceTicket.issue}</span>
                                </div>
                                <div className="text-[9px] text-muted-foreground mt-0.5">
                                  Tech: {unit.maintenanceTicket.technician} • Est: ₹{unit.maintenanceTicket.estimatedCost.toLocaleString()}
                                </div>
                              </div>
                            )}

                            {/* Direct State Transition Buttons */}
                            <div className="pt-2 border-t border-border/70 flex flex-col gap-1.5">
                              {/* Primary Forward Progression Button */}
                              {unit.status === "dirty" && (
                                <Button
                                  size="sm"
                                  className="w-full h-7 text-[11px] font-bold bg-sky-500 hover:bg-sky-600 text-white gap-1 shadow-2xs"
                                  onClick={() => handleTransition(unit.id, "clean", "Housekeeper")}
                                >
                                  <Sparkles className="h-3 w-3" />
                                  <span>Mark Clean (Turnover Done)</span>
                                </Button>
                              )}

                              {unit.status === "clean" && (
                                <Button
                                  size="sm"
                                  className="w-full h-7 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1 shadow-2xs"
                                  onClick={() => openInspectionModal(unit)}
                                >
                                  <ShieldCheck className="h-3 w-3" />
                                  <span>Supervisor QC Inspection</span>
                                </Button>
                              )}

                              {unit.status === "inspected" && (
                                <Button
                                  size="sm"
                                  className="w-full h-7 text-[11px] font-bold bg-rentcot-blue hover:bg-rentcot-blue/90 text-white gap-1 shadow-2xs"
                                  onClick={() => handleTransition(unit.id, "occupied", "Front-Desk Check-in")}
                                >
                                  <User className="h-3 w-3" />
                                  <span>Check-In Guest (Occupied)</span>
                                </Button>
                              )}

                              {unit.status === "occupied" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full h-7 text-[11px] font-bold text-amber-600 border-amber-500/30 hover:bg-amber-50 dark:hover:bg-amber-950/20 gap-1"
                                  onClick={() => handleTransition(unit.id, "dirty", "Front-Desk Checkout", "Guest departed at 11:00 AM")}
                                >
                                  <Clock className="h-3 w-3" />
                                  <span>Checkout Turnover (Dirty)</span>
                                </Button>
                              )}

                              {unit.status === "out_of_service" && (
                                <Button
                                  size="sm"
                                  className="w-full h-7 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1 shadow-2xs"
                                  onClick={() => handleTransition(unit.id, "clean", "Maintenance Lead", "Repairs inspected & approved")}
                                >
                                  <CheckCircle2 className="h-3 w-3" />
                                  <span>Repairs Fixed → Clean</span>
                                </Button>
                              )}

                              {/* Secondary Actions: Flag Maintenance or Reject QC */}
                              <div className="flex items-center justify-between gap-1 text-[10px]">
                                {unit.status !== "out_of_service" ? (
                                  <button
                                    type="button"
                                    onClick={() => openMaintenanceModal(unit)}
                                    className="text-muted-foreground hover:text-rose-600 flex items-center gap-1 transition-colors py-0.5"
                                  >
                                    <Wrench className="h-2.5 w-2.5" />
                                    <span>Flag Maintenance</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleTransition(unit.id, "dirty", "Maintenance")}
                                    className="text-muted-foreground hover:text-foreground text-[10px]"
                                  >
                                    Send to Dirty Turnover
                                  </button>
                                )}

                                {unit.status === "clean" && (
                                  <button
                                    type="button"
                                    onClick={() => handleTransition(unit.id, "dirty", "Supervisor", "QC Rejected: Needs re-vacuuming")}
                                    className="text-amber-600 hover:text-amber-700 font-semibold"
                                  >
                                    Reject QC
                                  </button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      ) : (
        /* GRID VIEW: Dense Room Card Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredUnits.length === 0 ? (
            <div className="col-span-full py-16 text-center text-muted-foreground border border-dashed border-border rounded-xl">
              <Sparkles className="h-8 w-8 mx-auto opacity-30 text-muted-foreground mb-2" />
              <div className="text-sm font-bold text-foreground">No units match your filter</div>
              <div className="text-xs text-muted-foreground">Adjust your search term, property, or status filter.</div>
            </div>
          ) : (
            filteredUnits.map((unit) => {
              const cfg = OPERATIONAL_STATE_CONFIG[unit.status];
              const Icon = cfg.icon;

              return (
                <Card
                  key={unit.id}
                  className={`hover:border-primary/50 transition-all flex flex-col justify-between border ${cfg.borderClass}`}
                >
                  <CardHeader className="pb-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
                          <span>{unit.name}</span>
                          {unit.turnoverPriority === "urgent_vip" && (
                            <Badge className="text-[9px] px-1 bg-rose-500 text-white font-bold">
                              VIP
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground mt-0.5">
                          {unit.property} • {unit.type}
                        </CardDescription>
                      </div>

                      <Badge className={`${cfg.badgeBg} gap-1 text-[11px]`}>
                        <Icon className="h-3 w-3" />
                        <span>{cfg.shortLabel}</span>
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pb-3">
                    {/* Next Arrival Banner */}
                    {unit.nextArrival && (
                      <div className="p-2 rounded-lg bg-muted/60 border border-border/70 flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground truncate">
                          Next: {unit.nextArrival.guestName}
                        </span>
                        <span className="font-mono text-primary font-bold text-[11px] shrink-0">
                          {unit.nextArrival.checkInTime}
                        </span>
                      </div>
                    )}

                    {/* Attendant & Time */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setReassigningUnit(unit)}
                        className="flex items-center gap-1.5 hover:text-foreground font-semibold transition-colors"
                      >
                        <User className="h-3.5 w-3.5 text-rentcot-blue" />
                        <span>{unit.assignedStaff}</span>
                      </button>
                      <span className="font-mono text-[11px]">{unit.timeInStatus}</span>
                    </div>

                    {/* Notes & Maintenance info */}
                    {unit.notes && (
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed bg-background p-2 rounded-md border border-border/60">
                        {unit.notes}
                      </p>
                    )}

                    {/* Operational Transition Buttons */}
                    <div className="pt-2 border-t border-border flex items-center justify-between gap-1.5">
                      {unit.status === "dirty" && (
                        <Button
                          size="sm"
                          className="flex-1 bg-sky-500 hover:bg-sky-600 text-white text-xs h-8 min-h-[32px] gap-1"
                          onClick={() => handleTransition(unit.id, "clean", "Housekeeper")}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Mark Clean</span>
                        </Button>
                      )}

                      {unit.status === "clean" && (
                        <Button
                          size="sm"
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 min-h-[32px] gap-1"
                          onClick={() => openInspectionModal(unit)}
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>Supervisor QC</span>
                        </Button>
                      )}

                      {unit.status === "inspected" && (
                        <Button
                          size="sm"
                          className="flex-1 bg-rentcot-blue hover:bg-rentcot-blue/90 text-white text-xs h-8 min-h-[32px] gap-1"
                          onClick={() => handleTransition(unit.id, "occupied", "Front-Desk Check-in")}
                        >
                          <User className="h-3.5 w-3.5" />
                          <span>Check-In Guest</span>
                        </Button>
                      )}

                      {unit.status === "occupied" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs h-8 min-h-[32px] text-amber-600 border-amber-500/30 hover:bg-amber-50 dark:hover:bg-amber-950/20 gap-1"
                          onClick={() => handleTransition(unit.id, "dirty", "Front-Desk Checkout")}
                        >
                          <Clock className="h-3.5 w-3.5" />
                          <span>Checkout Turnover</span>
                        </Button>
                      )}

                      {unit.status === "out_of_service" && (
                        <Button
                          size="sm"
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 min-h-[32px] gap-1"
                          onClick={() => handleTransition(unit.id, "clean", "Maintenance")}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Fixed → Clean</span>
                        </Button>
                      )}

                      {/* Maintenance Trigger */}
                      {unit.status !== "out_of_service" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-xs"
                          onClick={() => openMaintenanceModal(unit)}
                          title="Take Out of Service for Maintenance"
                        >
                          <Wrench className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Live Operational Audit Trail Feed */}
      <Card className="shadow-xs border-border">
        <CardHeader className="pb-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-rentcot-blue" />
              <CardTitle className="text-sm font-bold text-foreground">
                Real-Time Operational Audit Trail
              </CardTitle>
            </div>
            <span className="text-[11px] text-muted-foreground font-mono">
              Auto-logged state transitions
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="divide-y divide-border/60">
            {auditLogs.map((log) => {
              const fromCfg = OPERATIONAL_STATE_CONFIG[log.fromStatus];
              const toCfg = OPERATIONAL_STATE_CONFIG[log.toStatus];

              return (
                <div key={log.id} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-extrabold text-foreground truncate">{log.unitName}</span>
                    <span className="flex items-center gap-1 font-mono text-[10px] shrink-0">
                      <span className={`px-1.5 py-0.2 rounded ${fromCfg.bgTint} ${fromCfg.textClass} font-bold`}>
                        {fromCfg.shortLabel}
                      </span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className={`px-1.5 py-0.2 rounded ${toCfg.bgTint} ${toCfg.textClass} font-bold`}>
                        {toCfg.shortLabel}
                      </span>
                    </span>
                    {log.note && (
                      <span className="text-muted-foreground text-[11px] truncate hidden sm:inline">
                        — {log.note}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-[11px] text-muted-foreground font-mono">
                    <span className="hidden md:inline font-semibold">{log.actor}</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* MODAL 1: Supervisor Quality Control (QC) Inspection Modal */}
      {inspectingUnit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-base font-black text-foreground">
                    Supervisor QC Inspection
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {inspectingUnit.name} • {inspectingUnit.property}
                </p>
              </div>
              <button
                onClick={() => setInspectingUnit(null)}
                className="p-1 rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-foreground">
                5-Point Guest Readiness Checklist:
              </div>

              <div className="space-y-2">
                {[
                  { key: "linenFresh", label: "Fresh bed linens taut & pillows fluffed with protectors" },
                  { key: "bathroomSanitized", label: "Bathroom deep sanitized, glass dry & organic toiletries set" },
                  { key: "acTested", label: "Air conditioner tested (22°C) & remote batteries verified" },
                  { key: "odorPestFree", label: "Zero food odor, pest inspection clear & floors mopped" },
                  { key: "amenitiesPlaced", label: "Fresh bottled water, electric kettle tea-set & Wi-Fi card placed" },
                ].map(({ key, label }) => {
                  const isChecked = qcChecklist[key as keyof InspectionChecklist];
                  return (
                    <label
                      key={key}
                      className="flex items-center gap-2.5 p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                          setQcChecklist((prev) => ({
                            ...prev,
                            [key]: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded border-border text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className={isChecked ? "text-foreground font-medium" : "text-muted-foreground line-through"}>
                        {label}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Supervisor Notes / QC Remarks:
                </label>
                <textarea
                  rows={2}
                  value={qcNotes}
                  onChange={(e) => setQcNotes(e.target.value)}
                  placeholder="e.g. Bed spotless, AC chilled, welcome fruit basket placed."
                  className="w-full p-2.5 text-xs rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs text-rose-600 border-rose-500/30 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                onClick={() => handleCompleteInspection(false)}
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Fail QC → Return to Dirty
              </Button>

              <Button
                type="button"
                size="sm"
                className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                onClick={() => handleCompleteInspection(true)}
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Approve &amp; Mark Inspected (Ready)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Flag Maintenance / Out of Service (OOS) Modal */}
      {maintenanceUnit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-rose-600" />
                  <h3 className="text-base font-black text-foreground">
                    Take Out of Service (OOS)
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Block {maintenanceUnit.name} for repairs &amp; prevent new bookings
                </p>
              </div>
              <button
                onClick={() => setMaintenanceUnit(null)}
                className="p-1 rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-foreground block mb-1">Issue Description:</label>
                <input
                  type="text"
                  value={maintenanceForm.issue}
                  onChange={(e) => setMaintenanceForm({ ...maintenanceForm, issue: e.target.value })}
                  placeholder="e.g. AC compressor failure, geyser plumbing leak"
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-foreground block mb-1">Category:</label>
                  <select
                    value={maintenanceForm.category}
                    onChange={(e) =>
                      setMaintenanceForm({ ...maintenanceForm, category: e.target.value as any })
                    }
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground font-semibold"
                  >
                    <option value="hvac">HVAC / Air Conditioning</option>
                    <option value="plumbing">Plumbing & Geyser</option>
                    <option value="electrical">Electrical & Lighting</option>
                    <option value="furniture">Furniture / Linen</option>
                    <option value="pest_control">Pest Control & Sanitization</option>
                    <option value="other">General Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">Severity Level:</label>
                  <select
                    value={maintenanceForm.severity}
                    onChange={(e) =>
                      setMaintenanceForm({ ...maintenanceForm, severity: e.target.value as any })
                    }
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground font-semibold"
                  >
                    <option value="low">Low (Cosmetic)</option>
                    <option value="medium">Medium (Requires attention)</option>
                    <option value="critical">Critical (Unusable)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-foreground block mb-1">Assigned Technician:</label>
                  <input
                    type="text"
                    value={maintenanceForm.technician}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, technician: e.target.value })}
                    placeholder="e.g. Ramesh K. / Electrician"
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">Estimated Cost in INR (₹):</label>
                  <input
                    type="number"
                    value={maintenanceForm.estimatedCost}
                    onChange={(e) =>
                      setMaintenanceForm({ ...maintenanceForm, estimatedCost: Number(e.target.value) })
                    }
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Internal Notes:</label>
                <textarea
                  rows={2}
                  value={maintenanceForm.notes}
                  onChange={(e) => setMaintenanceForm({ ...maintenanceForm, notes: e.target.value })}
                  placeholder="Expected parts arrival, warranty details..."
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMaintenanceUnit(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
                onClick={handleSaveMaintenance}
              >
                <Ban className="h-3.5 w-3.5 mr-1" />
                Block Unit &amp; Tag OOS
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Reassign Attendant Modal */}
      {reassigningUnit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-card border border-border w-full max-w-xs rounded-2xl p-4 shadow-2xl space-y-3 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-xs font-bold text-foreground">
                Assign Attendant: {reassigningUnit.name}
              </span>
              <button
                onClick={() => setReassigningUnit(null)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              {onDutyStaff.map((staff) => (
                <button
                  key={staff}
                  type="button"
                  onClick={() => handleAssignStaff(reassigningUnit.id, staff)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold transition-colors ${
                    reassigningUnit.assignedStaff === staff
                      ? "bg-primary text-primary-foreground font-bold"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <span>{staff}</span>
                  {staffWorkload[staff] && (
                    <span className="text-[10px] opacity-75 font-mono">
                      {staffWorkload[staff].total} rooms
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VisualAvailabilityRadar } from "@/components/properties/visual-availability-radar";
import {
  type PropertyType,
  type PropertyStatus,
  type Property,
} from "@/modules/properties/types";
import {
  Building2,
  TreePine,
  Tent,
  Compass,
  MapPin,
  Clock,
  Plus,
  ArrowRight,
  Trash2,
  Power,
  BedDouble,
  Sparkles,
  X,
  CheckCircle2,
  Layers,
  Search,
  Download,
  Phone,
  FileCheck,
  Zap,
  Dog,
  DollarSign,
  TrendingUp,
  Percent,
  Edit,
  ShieldCheck,
  AlertTriangle,
  Flame,
} from "lucide-react";

export interface RichPropertyItem {
  id: string;
  name: string;
  type: "Farmhouse Estate" | "Campsite & Glamping" | "Luxury Resort" | "Luxury Villa" | "Eco-Lodge";
  location: string;
  cityState: string;
  unitsCount: number;
  occupancy: number; // percentage e.g. 88
  checkIn: string;
  checkOut: string;
  currency: string;
  status: "active" | "seasonal_closure" | "renovation";
  iconName: "treepine" | "tent" | "compass" | "building";
  color: string;
  adr: number; // Average Daily Rate in INR
  monthlyEstRevenue: number;
  taxId: string; // GSTIN / Tourism license
  managerName: string;
  managerPhone: string;
  powerBackup: "100% DG Generator" | "Solar + Inverter" | "Standard Grid" | "Off-Grid";
  petFriendly: boolean;
  quietHours: string;
  amenities: string[];
}

const initialProperties: RichPropertyItem[] = [
  {
    id: "prop-1",
    name: "Green Valley Farmhouse & Retreat",
    type: "Farmhouse Estate",
    location: "Main Shamirpet Lake Bypass, Shamirpet",
    cityState: "Hyderabad, Telangana",
    unitsCount: 8,
    occupancy: 88,
    checkIn: "14:00",
    checkOut: "11:00",
    currency: "INR",
    status: "active",
    iconName: "treepine",
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    adr: 14500,
    monthlyEstRevenue: 3480000,
    taxId: "36AABCU9603R1ZM",
    managerName: "Suresh Reddy",
    managerPhone: "+91 98480 34567",
    powerBackup: "100% DG Generator",
    petFriendly: true,
    quietHours: "22:30 - 06:30",
    amenities: ["Private Pool", "Organic Kitchen", "Cricket Turf", "Pet Zone", "High-speed Wi-Fi"],
  },
  {
    id: "prop-2",
    name: "Wildwoods Glamping & Campsite",
    type: "Campsite & Glamping",
    location: "Ananthagiri Hills Forest Road, Vikarabad",
    cityState: "Vikarabad, Telangana",
    unitsCount: 200,
    occupancy: 95,
    checkIn: "14:00",
    checkOut: "11:00",
    currency: "INR",
    status: "active",
    iconName: "tent",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    adr: 3800,
    monthlyEstRevenue: 7220000,
    taxId: "36AAECW1029K1ZX",
    managerName: "Vikram Rathore",
    managerPhone: "+91 98200 44556",
    powerBackup: "Solar + Inverter",
    petFriendly: true,
    quietHours: "22:30 - 06:00",
    amenities: ["Campfire Pits", "Stargazing Deck", "Hiking Trails", "BBQ Stations", "UV Gear Sanitizer"],
  },
  {
    id: "prop-3",
    name: "Palm Oasis Luxury Resort",
    type: "Luxury Resort",
    location: "Gandipet Lakefront Promenade",
    cityState: "Hyderabad, Telangana",
    unitsCount: 24,
    occupancy: 75,
    checkIn: "14:00",
    checkOut: "11:00",
    currency: "INR",
    status: "active",
    iconName: "compass",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
    adr: 18500,
    monthlyEstRevenue: 9990000,
    taxId: "36AACCR4421P1ZQ",
    managerName: "Pooja Hegde",
    managerPhone: "+91 99011 88223",
    powerBackup: "100% DG Generator",
    petFriendly: false,
    quietHours: "23:00 - 07:00",
    amenities: ["Infinity Pool", "Banquet Hall", "EV Charging", "Spa & Wellness", "Fine Dining Lounge"],
  },
];

export default function PropertiesPage() {
  const { t, locale } = useTranslation();
  const [properties, setProperties] = useState<RichPropertyItem[]>(initialProperties);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<RichPropertyItem | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<RichPropertyItem["type"]>("Campsite & Glamping");
  const [formLocation, setFormLocation] = useState("");
  const [formCityState, setFormCityState] = useState("");
  const [formUnits, setFormUnits] = useState(12);
  const [formAdr, setFormAdr] = useState(4500);
  const [formTaxId, setFormTaxId] = useState("");
  const [formManagerName, setFormManagerName] = useState("");
  const [formManagerPhone, setFormManagerPhone] = useState("");
  const [formCheckIn, setFormCheckIn] = useState("14:00");
  const [formCheckOut, setFormCheckOut] = useState("11:00");
  const [formQuietHours, setFormQuietHours] = useState("22:30 - 06:30");
  const [formPowerBackup, setFormPowerBackup] = useState<RichPropertyItem["powerBackup"]>("100% DG Generator");
  const [formPetFriendly, setFormPetFriendly] = useState(true);

  // KPI Calculations
  const kpis = useMemo(() => {
    const totalProps = properties.length;
    const activeProps = properties.filter((p) => p.status === "active").length;
    const totalKeys = properties.reduce((acc, p) => acc + p.unitsCount, 0);

    const weightedOccupancySum = properties.reduce((acc, p) => acc + p.occupancy * p.unitsCount, 0);
    const blendedOccupancy = totalKeys > 0 ? Math.round(weightedOccupancySum / totalKeys) : 0;

    const blendedAdr =
      properties.length > 0
        ? Math.round(properties.reduce((acc, p) => acc + p.adr, 0) / properties.length)
        : 0;

    const totalMonthlyRevenue = properties.reduce((acc, p) => acc + p.monthlyEstRevenue, 0);

    return {
      totalProps,
      activeProps,
      totalKeys,
      blendedOccupancy,
      blendedAdr,
      totalMonthlyRevenue,
    };
  }, [properties]);

  // Filtered Properties
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (categoryFilter !== "ALL" && p.type !== categoryFilter) return false;
      if (statusFilter !== "ALL" && p.status !== statusFilter) return false;

      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesLoc = p.location.toLowerCase().includes(q) || p.cityState.toLowerCase().includes(q);
        const matchesMgr = p.managerName.toLowerCase().includes(q);
        const matchesTax = p.taxId.toLowerCase().includes(q);
        if (!matchesName && !matchesLoc && !matchesMgr && !matchesTax) return false;
      }

      return true;
    });
  }, [properties, categoryFilter, statusFilter, searchQuery]);

  const handleOpenAddModal = () => {
    setFormName("");
    setFormType("Campsite & Glamping");
    setFormLocation("");
    setFormCityState("Telangana, India");
    setFormUnits(10);
    setFormAdr(4200);
    setFormTaxId("36AABCU" + Math.floor(1000 + Math.random() * 9000) + "R1ZM");
    setFormManagerName("");
    setFormManagerPhone("+91 ");
    setFormCheckIn("14:00");
    setFormCheckOut("11:00");
    setFormQuietHours("22:30 - 06:30");
    setFormPowerBackup("100% DG Generator");
    setFormPetFriendly(true);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (p: RichPropertyItem) => {
    setEditingProperty(p);
    setFormName(p.name);
    setFormType(p.type);
    setFormLocation(p.location);
    setFormCityState(p.cityState);
    setFormUnits(p.unitsCount);
    setFormAdr(p.adr);
    setFormTaxId(p.taxId);
    setFormManagerName(p.managerName);
    setFormManagerPhone(p.managerPhone);
    setFormCheckIn(p.checkIn);
    setFormCheckOut(p.checkOut);
    setFormQuietHours(p.quietHours);
    setFormPowerBackup(p.powerBackup);
    setFormPetFriendly(p.petFriendly);
  };

  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formLocation.trim()) return;

    let iconName: RichPropertyItem["iconName"] = "building";
    let color = "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300";

    if (formType === "Campsite & Glamping") {
      iconName = "tent";
      color = "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";
    } else if (formType === "Farmhouse Estate") {
      iconName = "treepine";
      color = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
    } else if (formType === "Luxury Resort") {
      iconName = "compass";
      color = "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300";
    }

    if (editingProperty) {
      // Update existing
      setProperties((prev) =>
        prev.map((p) =>
          p.id === editingProperty.id
            ? {
                ...p,
                name: formName,
                type: formType,
                location: formLocation,
                cityState: formCityState,
                unitsCount: Number(formUnits),
                adr: Number(formAdr),
                monthlyEstRevenue: Math.round(Number(formUnits) * Number(formAdr) * 30 * 0.75),
                taxId: formTaxId,
                managerName: formManagerName || p.managerName,
                managerPhone: formManagerPhone || p.managerPhone,
                checkIn: formCheckIn,
                checkOut: formCheckOut,
                quietHours: formQuietHours,
                powerBackup: formPowerBackup,
                petFriendly: formPetFriendly,
                iconName,
                color,
              }
            : p
        )
      );
      setEditingProperty(null);
    } else {
      // Create new
      const created: RichPropertyItem = {
        id: `prop-${Date.now()}`,
        name: formName,
        type: formType,
        location: formLocation,
        cityState: formCityState,
        unitsCount: Number(formUnits),
        occupancy: 0,
        checkIn: formCheckIn,
        checkOut: formCheckOut,
        currency: "INR",
        status: "active",
        iconName,
        color,
        adr: Number(formAdr),
        monthlyEstRevenue: Math.round(Number(formUnits) * Number(formAdr) * 30 * 0.5),
        taxId: formTaxId,
        managerName: formManagerName || "Front Desk Lead",
        managerPhone: formManagerPhone || "+91 98480 00000",
        powerBackup: formPowerBackup,
        petFriendly: formPetFriendly,
        quietHours: formQuietHours,
        amenities: ["Power Backup", "Wi-Fi", "Dedicated Caretaker", "Parking"],
      };
      setProperties((prev) => [...prev, created]);
      setIsAddModalOpen(false);
    }
  };

  const handleToggleStatus = (id: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "active" ? "seasonal_closure" : "active" }
          : p
      )
    );
  };

  const handleRemoveProperty = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from your portfolio? This will archive all historic booking linkages.`)) {
      setProperties((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleExportPortfolioCSV = () => {
    const headers = [
      "Property ID",
      "Property Name",
      "Category",
      "Address",
      "Keys Count",
      "Occupancy (%)",
      "ADR (INR)",
      "Est. Monthly Gross (INR)",
      "GSTIN / Tax ID",
      "Manager Name",
      "Manager Phone",
      "Status",
    ];

    const rows = properties.map((p) => [
      p.id,
      `"${p.name}"`,
      `"${p.type}"`,
      `"${p.location}, ${p.cityState}"`,
      p.unitsCount,
      p.occupancy,
      p.adr,
      p.monthlyEstRevenue,
      p.taxId,
      `"${p.managerName}"`,
      `"${p.managerPhone}"`,
      p.status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rentcot_Properties_Portfolio_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderIcon = (name: RichPropertyItem["iconName"]) => {
    switch (name) {
      case "tent":
        return <Tent className="h-5 w-5" />;
      case "treepine":
        return <TreePine className="h-5 w-5" />;
      case "compass":
        return <Compass className="h-5 w-5" />;
      default:
        return <Building2 className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-rentcot-blue text-white flex items-center justify-center shadow-xs">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                  Properties & Campsites Portfolio
                </h1>
                <Badge variant="outline" className="text-[11px] font-bold border-rentcot-blue/40 text-rentcot-blue bg-rentcot-blue/5">
                  Multi-Estate PMS
                </Badge>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5 font-medium">
                Enterprise real-market portfolio management across farmhouses, glamping camps, luxury villas, and lakefront resorts.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPortfolioCSV}
            className="text-xs h-9 gap-1.5 border-border hover:bg-muted font-semibold"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Portfolio CSV</span>
          </Button>

          <Button
            onClick={handleOpenAddModal}
            className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white text-xs font-bold gap-1.5 h-9 shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Property / Campsite</span>
          </Button>
        </div>
      </div>

      {/* Real-Market KPI Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <Card className="border border-border bg-card shadow-2xs">
          <CardContent className="p-3.5 sm:p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Properties</span>
              <Building2 className="h-4 w-4 text-rentcot-blue" />
            </div>
            <div className="text-2xl font-black font-mono text-foreground">
              {kpis.totalProps}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium">
              {kpis.activeProps} active estates
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-2xs">
          <CardContent className="p-3.5 sm:p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Total Operational Keys</span>
              <BedDouble className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black font-mono text-foreground">
              {kpis.totalKeys}
            </div>
            <div className="text-[11px] text-muted-foreground">
              Rooms, Tents & Domes
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-2xs">
          <CardContent className="p-3.5 sm:p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Blended Occupancy</span>
              <Percent className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black font-mono text-foreground">
              {kpis.blendedOccupancy}%
            </div>
            <div className="text-[11px] text-emerald-600 font-medium">
              Live ground utilization
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-2xs">
          <CardContent className="p-3.5 sm:p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Portfolio ADR</span>
              <TrendingUp className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black font-mono text-foreground">
              ₹{kpis.blendedAdr.toLocaleString()}
            </div>
            <div className="text-[11px] text-muted-foreground">
              Avg Daily Rate / Key
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-2xs">
          <CardContent className="p-3.5 sm:p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Est. Monthly Gross</span>
              <DollarSign className="h-4 w-4 text-teal-600" />
            </div>
            <div className="text-2xl font-black font-mono text-foreground">
              ₹{(kpis.totalMonthlyRevenue / 100000).toFixed(1)}L
            </div>
            <div className="text-[11px] text-muted-foreground font-medium">
              Run rate this month
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-2xs">
          <CardContent className="p-3.5 sm:p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Compliance & Tax</span>
              <ShieldCheck className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black font-mono text-emerald-600">
              100%
            </div>
            <div className="text-[11px] text-muted-foreground">
              GSTIN & Fire certified
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Real-Time Availability Radar Component */}
      <VisualAvailabilityRadar />

      {/* Properties Cards Grid & Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-muted/40 p-3 rounded-xl border border-border">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {[
              { id: "ALL", label: "All Properties" },
              { id: "Campsite & Glamping", label: "Campsites & Glamping" },
              { id: "Farmhouse Estate", label: "Farmhouses" },
              { id: "Luxury Resort", label: "Luxury Resorts" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  categoryFilter === cat.id
                    ? "bg-foreground text-background shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search property, location, manager..."
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

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 text-xs px-2.5 rounded-lg border border-border bg-background text-foreground font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="active">Active (Open)</option>
              <option value="seasonal_closure">Seasonal Closure</option>
            </select>
          </div>
        </div>

        {/* Properties Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((p) => {
            const isActive = p.status === "active";
            return (
              <Card
                key={p.id}
                className={`border shadow-xs transition-all flex flex-col justify-between ${
                  isActive ? "border-border hover:border-rentcot-blue/50" : "border-border/60 opacity-80 bg-muted/20"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl shrink-0 ${p.color}`}>
                        {renderIcon(p.iconName)}
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold text-foreground leading-snug">
                          {p.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-semibold text-muted-foreground">{p.type}</span>
                          <span className="text-[10px] font-mono text-muted-foreground">ID: {p.id}</span>
                        </div>
                      </div>
                    </div>
                    {isActive ? (
                      <Badge variant="clean" className="text-[10px] font-bold">Open</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px] font-bold">Seasonal Closure</Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3.5">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-rentcot-blue" />
                      <span className="truncate">{p.location}</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground pl-5">
                      {p.cityState}
                    </p>
                  </div>

                  {/* Commercials & Operational Specs Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-muted/30 border border-border">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Total Keys / Pitches</span>
                      <span className="font-bold text-foreground">{p.unitsCount} Units</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Live Occupancy</span>
                      <span className="font-bold text-emerald-600">{p.occupancy}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Target ADR</span>
                      <span className="font-bold font-mono text-foreground">₹{p.adr.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Monthly Gross (Est.)</span>
                      <span className="font-bold font-mono text-foreground">₹{(p.monthlyEstRevenue / 100000).toFixed(1)}L</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Check-In / Out</span>
                      <span className="font-medium text-[11px]">{p.checkIn} - {p.checkOut}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Power Backup</span>
                      <span className="font-medium text-[11px] truncate block" title={p.powerBackup}>{p.powerBackup}</span>
                    </div>
                  </div>

                  {/* Operational Contacts & Compliance */}
                  <div className="text-xs space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3 text-rentcot-blue" /> Manager:
                      </span>
                      <span className="font-medium text-foreground">{p.managerName} ({p.managerPhone})</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <FileCheck className="h-3 w-3 text-emerald-600" /> GSTIN:
                      </span>
                      <span className="font-mono text-muted-foreground">{p.taxId}</span>
                    </div>
                  </div>

                  {/* Amenities Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {p.amenities.slice(0, 3).map((am, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border font-medium">
                        {am}
                      </span>
                    ))}
                    {p.amenities.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md text-muted-foreground">
                        +{p.amenities.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Actions & Lifecycle Navigation */}
                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-border">
                    <Link
                      href={p.type === "Campsite & Glamping" ? `/${locale}/camping` : `/${locale}/units`}
                      className="text-xs font-bold text-rentcot-blue hover:underline flex items-center gap-1"
                    >
                      <BedDouble className="h-3.5 w-3.5" />
                      <span>{p.type === "Campsite & Glamping" ? "Campsite Matrix & Ops" : "Manage Units"}</span>
                    </Link>

                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenEditModal(p)}
                        className="h-8 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                        title="Edit property details & commercials"
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        <span>Edit</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleStatus(p.id)}
                        className={`h-8 px-2 text-xs font-medium ${
                          isActive ? "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20" : "text-emerald-600 hover:bg-emerald-50"
                        }`}
                        title={isActive ? "Pause bookings for season" : "Re-open for bookings"}
                      >
                        <Power className="h-3.5 w-3.5 mr-1" />
                        <span>{isActive ? "Pause" : "Re-open"}</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveProperty(p.id, p.name)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Remove property"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredProperties.length === 0 && (
          <div className="p-12 text-center border rounded-xl bg-card">
            <Building2 className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
            <h3 className="font-bold text-base text-foreground">No properties match criteria</h3>
            <p className="text-xs text-muted-foreground mt-1">Try resetting the category filter or search keyword.</p>
          </div>
        )}
      </div>

      {/* Modal: Add or Edit Property */}
      {(isAddModalOpen || editingProperty) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-rentcot-blue/10 flex items-center justify-center text-rentcot-blue">
                  {editingProperty ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {editingProperty ? `Edit Property: ${editingProperty.name}` : "Add New Property or Campsite"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Configure real-market commercial, compliance, and ground operational parameters
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProperty(null);
                }}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProperty} className="space-y-4 text-xs">
              {/* Basic Details */}
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Property Commercial Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Whispering Pines Glamping Zone & Resort"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Property Category</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-medium"
                  >
                    <option value="Campsite & Glamping">Campsite & Glamping</option>
                    <option value="Farmhouse Estate">Farmhouse Estate</option>
                    <option value="Luxury Resort">Luxury Resort</option>
                    <option value="Luxury Villa">Luxury Villa</option>
                    <option value="Eco-Lodge">Eco-Lodge</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Operational Units / Pitches Count</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={formUnits}
                    onChange={(e) => setFormUnits(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-medium"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Physical Address / Landmark</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Ananthagiri Hills Road"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">City, State</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Vikarabad, Telangana"
                    value={formCityState}
                    onChange={(e) => setFormCityState(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs"
                  />
                </div>
              </div>

              {/* Commercials & Tax */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Target ADR (₹ / Night)</label>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    value={formAdr}
                    onChange={(e) => setFormAdr(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">GSTIN / Tourism License ID</label>
                  <input
                    type="text"
                    placeholder="e.g., 36AABCU9603R1ZM"
                    value={formTaxId}
                    onChange={(e) => setFormTaxId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-mono uppercase"
                  />
                </div>
              </div>

              {/* Management Contacts */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">General Manager / Caretaker Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Ramesh Babu"
                    value={formManagerName}
                    onChange={(e) => setFormManagerName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Manager Phone (Emergency)</label>
                  <input
                    type="text"
                    placeholder="e.g., +91 98480 12345"
                    value={formManagerPhone}
                    onChange={(e) => setFormManagerPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-mono"
                  />
                </div>
              </div>

              {/* Check in / Check out / Quiet Hours */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Standard Check-In</label>
                  <input
                    type="text"
                    value={formCheckIn}
                    onChange={(e) => setFormCheckIn(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-background text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Standard Check-Out</label>
                  <input
                    type="text"
                    value={formCheckOut}
                    onChange={(e) => setFormCheckOut(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-background text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Quiet Hours Policy</label>
                  <input
                    type="text"
                    value={formQuietHours}
                    onChange={(e) => setFormQuietHours(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-background text-xs"
                  />
                </div>
              </div>

              {/* Operations & Power */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Power Infrastructure</label>
                  <select
                    value={formPowerBackup}
                    onChange={(e) => setFormPowerBackup(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs"
                  >
                    <option value="100% DG Generator">100% DG Generator Backup</option>
                    <option value="Solar + Inverter">Solar + Inverter Power</option>
                    <option value="Standard Grid">Standard Grid Only</option>
                    <option value="Off-Grid">Off-Grid / Primitive</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Pet Policy</label>
                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={formPetFriendly}
                        onChange={() => setFormPetFriendly(true)}
                        className="text-rentcot-blue"
                      />
                      <span>Pet Friendly</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={!formPetFriendly}
                        onChange={() => setFormPetFriendly(false)}
                        className="text-rentcot-blue"
                      />
                      <span>No Pets Allowed</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProperty(null);
                  }}
                  className="text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white text-xs font-bold h-9"
                >
                  {editingProperty ? "Save Changes" : "Create & Launch Property"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

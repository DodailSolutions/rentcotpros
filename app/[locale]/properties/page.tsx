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
  Star,
  Globe,
  Share2,
  Copy,
  QrCode,
  Eye,
  ExternalLink,
  MessageCircle,
  LayoutGrid,
  List,
  BarChart3,
  CalendarCheck,
  CalendarX,
  Users,
  Check,
  Coffee,
  Waves,
  Car,
  Wifi,
} from "lucide-react";

export interface RichPropertyItem {
  id: string;
  name: string;
  slug: string;
  type: "Farmhouse Estate" | "Campsite & Glamping" | "Luxury Resort" | "Luxury Villa" | "Eco-Lodge";
  coverImage: string;
  galleryImages: string[];
  location: string;
  cityState: string;
  googleMapsUrl: string;
  unitsCount: number;
  occupancy: number; // percentage e.g. 88
  checkIn: string;
  checkOut: string;
  currency: string;
  status: "active" | "seasonal_closure" | "renovation";
  rating: number;
  reviewCount: number;
  adr: number; // Average Daily Rate in INR
  revPar: number;
  monthlyEstRevenue: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  currentInHouse: number;
  taxId: string; // GSTIN / Tourism license
  managerName: string;
  managerPhone: string;
  caretakerName: string;
  caretakerPhone: string;
  powerBackup: "100% DG Generator" | "Solar + Inverter" | "Standard Grid" | "Off-Grid";
  petFriendly: boolean;
  quietHours: string;
  amenities: string[];
  connectedChannels: { name: string; status: "synced" | "pending" }[];
}

const initialProperties: RichPropertyItem[] = [
  {
    id: "prop-1",
    name: "Green Valley Farmhouse & Retreat",
    slug: "green-valley-farmhouse",
    type: "Farmhouse Estate",
    coverImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop&q=80",
    ],
    location: "Main Shamirpet Lake Bypass, Shamirpet",
    cityState: "Hyderabad, Telangana",
    googleMapsUrl: "https://maps.google.com/?q=Shamirpet+Hyderabad",
    unitsCount: 8,
    occupancy: 88,
    checkIn: "14:00",
    checkOut: "11:00",
    currency: "INR",
    status: "active",
    rating: 4.92,
    reviewCount: 148,
    adr: 14500,
    revPar: 12760,
    monthlyEstRevenue: 3480000,
    todayCheckIns: 2,
    todayCheckOuts: 1,
    currentInHouse: 14,
    taxId: "36AABCU9603R1ZM",
    managerName: "Suresh Reddy",
    managerPhone: "+91 98480 34567",
    caretakerName: "Mallesh",
    caretakerPhone: "+91 98481 11223",
    powerBackup: "100% DG Generator",
    petFriendly: true,
    quietHours: "22:30 - 06:30",
    amenities: ["Private Pool", "Organic Kitchen", "Cricket Turf", "Pet Friendly", "High-speed Wi-Fi", "100% DG Power"],
    connectedChannels: [
      { name: "Airbnb", status: "synced" },
      { name: "Booking.com", status: "synced" },
      { name: "Direct Site", status: "synced" },
    ],
  },
  {
    id: "prop-2",
    name: "Wildwoods Glamping & Campsite",
    slug: "wildwoods-glamping",
    type: "Campsite & Glamping",
    coverImage: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&auto=format&fit=crop&q=80",
    ],
    location: "Ananthagiri Hills Forest Road, Vikarabad",
    cityState: "Vikarabad, Telangana",
    googleMapsUrl: "https://maps.google.com/?q=Ananthagiri+Hills+Vikarabad",
    unitsCount: 200,
    occupancy: 95,
    checkIn: "14:00",
    checkOut: "11:00",
    currency: "INR",
    status: "active",
    rating: 4.88,
    reviewCount: 312,
    adr: 3800,
    revPar: 3610,
    monthlyEstRevenue: 7220000,
    todayCheckIns: 18,
    todayCheckOuts: 12,
    currentInHouse: 142,
    taxId: "36AAECW1029K1ZX",
    managerName: "Vikram Rathore",
    managerPhone: "+91 98200 44556",
    caretakerName: "Balram Guard",
    caretakerPhone: "+91 98201 99887",
    powerBackup: "Solar + Inverter",
    petFriendly: true,
    quietHours: "22:30 - 06:00",
    amenities: ["Campfire Pits", "Stargazing Deck", "Hiking Trails", "BBQ Stations", "UV Gear Sanitizer", "Solar Power"],
    connectedChannels: [
      { name: "Airbnb", status: "synced" },
      { name: "MakeMyTrip", status: "synced" },
      { name: "Direct Site", status: "synced" },
    ],
  },
  {
    id: "prop-3",
    name: "Palm Oasis Luxury Resort",
    slug: "palm-oasis-resort",
    type: "Luxury Resort",
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80",
    ],
    location: "Gandipet Lakefront Promenade",
    cityState: "Hyderabad, Telangana",
    googleMapsUrl: "https://maps.google.com/?q=Gandipet+Lake+Hyderabad",
    unitsCount: 24,
    occupancy: 75,
    checkIn: "14:00",
    checkOut: "11:00",
    currency: "INR",
    status: "active",
    rating: 4.96,
    reviewCount: 235,
    adr: 18500,
    revPar: 13875,
    monthlyEstRevenue: 9990000,
    todayCheckIns: 4,
    todayCheckOuts: 3,
    currentInHouse: 38,
    taxId: "36AACCR4421P1ZQ",
    managerName: "Pooja Hegde",
    managerPhone: "+91 99011 88223",
    caretakerName: "Ashok Front Desk",
    caretakerPhone: "+91 99012 33445",
    powerBackup: "100% DG Generator",
    petFriendly: false,
    quietHours: "23:00 - 07:00",
    amenities: ["Infinity Pool", "Banquet Hall", "EV Charging", "Spa & Wellness", "Fine Dining Lounge", "Lakefront Deck"],
    connectedChannels: [
      { name: "Booking.com", status: "synced" },
      { name: "Agoda", status: "synced" },
      { name: "Expedia", status: "synced" },
      { name: "Direct Site", status: "synced" },
    ],
  },
];

export default function PropertiesPage() {
  const { t, locale } = useTranslation();
  const [properties, setProperties] = useState<RichPropertyItem[]>(initialProperties);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [amenityFilter, setAmenityFilter] = useState<string>("ALL");
  const [activeViewMode, setActiveViewMode] = useState<"grid" | "table" | "analytics">("grid");

  // Drawer & Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<RichPropertyItem | null>(null);
  const [dossierProperty, setDossierProperty] = useState<RichPropertyItem | null>(null);
  const [shareModalProperty, setShareModalProperty] = useState<RichPropertyItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form State for Add / Edit
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<RichPropertyItem["type"]>("Campsite & Glamping");
  const [formLocation, setFormLocation] = useState("");
  const [formCityState, setFormCityState] = useState("");
  const [formCoverImage, setFormCoverImage] = useState("");
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

    const todayCheckIns = properties.reduce((acc, p) => acc + p.todayCheckIns, 0);
    const todayCheckOuts = properties.reduce((acc, p) => acc + p.todayCheckOuts, 0);
    const totalInHouse = properties.reduce((acc, p) => acc + p.currentInHouse, 0);

    return {
      totalProps,
      activeProps,
      totalKeys,
      blendedOccupancy,
      blendedAdr,
      totalMonthlyRevenue,
      todayCheckIns,
      todayCheckOuts,
      totalInHouse,
    };
  }, [properties]);

  // Filtered Properties
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (categoryFilter !== "ALL" && p.type !== categoryFilter) return false;
      if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
      if (amenityFilter !== "ALL" && !p.amenities.includes(amenityFilter)) return false;

      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesLoc = p.location.toLowerCase().includes(q) || p.cityState.toLowerCase().includes(q);
        const matchesMgr = p.managerName.toLowerCase().includes(q) || p.caretakerName.toLowerCase().includes(q);
        const matchesTax = p.taxId.toLowerCase().includes(q);
        if (!matchesName && !matchesLoc && !matchesMgr && !matchesTax) return false;
      }

      return true;
    });
  }, [properties, categoryFilter, statusFilter, amenityFilter, searchQuery]);

  const handleOpenAddModal = () => {
    setFormName("");
    setFormType("Campsite & Glamping");
    setFormLocation("");
    setFormCityState("Telangana, India");
    setFormCoverImage("https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&auto=format&fit=crop&q=80");
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
    setFormCoverImage(p.coverImage);
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

    if (editingProperty) {
      setProperties((prev) =>
        prev.map((p) =>
          p.id === editingProperty.id
            ? {
                ...p,
                name: formName,
                type: formType,
                location: formLocation,
                cityState: formCityState,
                coverImage: formCoverImage || p.coverImage,
                unitsCount: Number(formUnits),
                adr: Number(formAdr),
                revPar: Math.round(Number(formAdr) * (p.occupancy / 100)),
                monthlyEstRevenue: Math.round(Number(formUnits) * Number(formAdr) * 30 * 0.75),
                taxId: formTaxId,
                managerName: formManagerName || p.managerName,
                managerPhone: formManagerPhone || p.managerPhone,
                checkIn: formCheckIn,
                checkOut: formCheckOut,
                quietHours: formQuietHours,
                powerBackup: formPowerBackup,
                petFriendly: formPetFriendly,
              }
            : p
        )
      );
      setEditingProperty(null);
    } else {
      const slug = formName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const created: RichPropertyItem = {
        id: `prop-${Date.now()}`,
        name: formName,
        slug,
        type: formType,
        coverImage: formCoverImage || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80",
        galleryImages: [formCoverImage || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80"],
        location: formLocation,
        cityState: formCityState,
        googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(formLocation)}`,
        unitsCount: Number(formUnits),
        occupancy: 0,
        checkIn: formCheckIn,
        checkOut: formCheckOut,
        currency: "INR",
        status: "active",
        rating: 5.0,
        reviewCount: 0,
        adr: Number(formAdr),
        revPar: 0,
        monthlyEstRevenue: Math.round(Number(formUnits) * Number(formAdr) * 30 * 0.5),
        todayCheckIns: 0,
        todayCheckOuts: 0,
        currentInHouse: 0,
        taxId: formTaxId,
        managerName: formManagerName || "Operations Lead",
        managerPhone: formManagerPhone || "+91 98480 00000",
        caretakerName: "On-site Caretaker",
        caretakerPhone: "+91 98480 00001",
        powerBackup: formPowerBackup,
        petFriendly: formPetFriendly,
        quietHours: formQuietHours,
        amenities: ["Power Backup", "Wi-Fi", "Dedicated Caretaker", "Parking"],
        connectedChannels: [
          { name: "Direct Site", status: "synced" },
        ],
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
    if (confirm(`Are you sure you want to remove "${name}" from your portfolio?`)) {
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
      "RevPAR (INR)",
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
      p.revPar,
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
    link.setAttribute("download", `Rentcot_Portfolio_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyShareLink = (slug: string) => {
    const fullUrl = `https://rentcot.com/stay/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-rentcot-blue text-white flex items-center justify-center shadow-xs">
              <Building2 className="h-6 w-6" />
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

      {/* Executive Commercial KPI Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <Card className="border border-border/80 bg-card shadow-2xs hover:shadow-xs transition-all rounded-2xl">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Properties</span>
              <div className="h-7 w-7 rounded-lg bg-rentcot-blue/10 text-rentcot-blue flex items-center justify-center">
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-foreground">
              {kpis.totalProps}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <span>{kpis.activeProps} Active Estates</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card shadow-2xs hover:shadow-xs transition-all rounded-2xl">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Total Operational Keys</span>
              <div className="h-7 w-7 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <BedDouble className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-foreground">
              {kpis.totalKeys}
            </div>
            <div className="text-[11px] text-muted-foreground font-medium">
              Rooms, Domes & Tents
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card shadow-2xs hover:shadow-xs transition-all rounded-2xl">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Blended Occupancy</span>
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Percent className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-foreground">
              {kpis.blendedOccupancy}%
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold">
              Live ground utilization
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card shadow-2xs hover:shadow-xs transition-all rounded-2xl">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Portfolio ADR</span>
              <div className="h-7 w-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-foreground">
              ₹{kpis.blendedAdr.toLocaleString()}
            </div>
            <div className="text-[11px] text-muted-foreground font-medium">
              Average Daily Rate
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card shadow-2xs hover:shadow-xs transition-all rounded-2xl">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Est. Monthly Gross</span>
              <div className="h-7 w-7 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-foreground">
              ₹{(kpis.totalMonthlyRevenue / 100000).toFixed(1)}L
            </div>
            <div className="text-[11px] text-muted-foreground font-medium">
              Current run-rate
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card shadow-2xs hover:shadow-xs transition-all rounded-2xl">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Compliance & Tax</span>
              <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600">
              100%
            </div>
            <div className="text-[11px] text-muted-foreground font-medium">
              GSTIN & Fire certified
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-Market Missing Feature: Daily Movement & Ground Pulse Cockpit */}
      <div className="p-3.5 sm:p-4 rounded-2xl border border-border bg-gradient-to-r from-card via-muted/20 to-card flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <CalendarCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-foreground block">
              Today's Portfolio Ground Movement:
            </span>
            <span className="text-xs text-muted-foreground">
              Live guest transitions across all properties
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            <CalendarCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>{kpis.todayCheckIns} Check-Ins Today</span>
          </div>

          <div className="flex items-center gap-1.5 bg-rose-500/10 text-rose-700 dark:text-rose-300 px-2.5 py-1 rounded-lg border border-rose-500/20">
            <CalendarX className="h-3.5 w-3.5 text-rose-600" />
            <span>{kpis.todayCheckOuts} Check-Outs Today</span>
          </div>

          <div className="flex items-center gap-1.5 bg-rentcot-blue/10 text-rentcot-blue px-2.5 py-1 rounded-lg border border-rentcot-blue/20">
            <Users className="h-3.5 w-3.5 text-rentcot-blue" />
            <span>{kpis.totalInHouse} Guests In-House</span>
          </div>

          <Link
            href={`/${locale}/housekeeping`}
            className="text-xs text-muted-foreground hover:text-foreground font-medium underline flex items-center gap-1"
          >
            <span>Housekeeping Queue</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Visual Real-Time Availability Radar Component */}
      <VisualAvailabilityRadar />

      {/* Properties Section Header & Filter Toolbar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-muted/40 p-3 sm:p-3.5 rounded-2xl border border-border">
          {/* Category Tabs with Count Badges */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {[
              { id: "ALL", label: "All Properties", count: properties.length },
              { id: "Campsite & Glamping", label: "Campsites & Glamping", count: properties.filter((p) => p.type === "Campsite & Glamping").length },
              { id: "Farmhouse Estate", label: "Farmhouses", count: properties.filter((p) => p.type === "Farmhouse Estate").length },
              { id: "Luxury Resort", label: "Luxury Resorts", count: properties.filter((p) => p.type === "Luxury Resort").length },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  categoryFilter === cat.id
                    ? "bg-rentcot-blue text-white shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    categoryFilter === cat.id ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search, Status, Amenities & View Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search property, manager, GSTIN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 text-xs pl-8 pr-3 bg-background border-border rounded-xl"
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
              className="h-8 text-xs px-2.5 rounded-xl border border-border bg-background text-foreground font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="active">Active (Open)</option>
              <option value="seasonal_closure">Seasonal Closure</option>
            </select>

            {/* View Switcher: Grid, Table, Analytics */}
            <div className="inline-flex p-0.5 rounded-xl bg-muted border border-border text-xs">
              <button
                onClick={() => setActiveViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${
                  activeViewMode === "grid" ? "bg-background text-foreground shadow-2xs font-bold" : "text-muted-foreground"
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setActiveViewMode("table")}
                className={`p-1.5 rounded-lg transition-colors ${
                  activeViewMode === "table" ? "bg-background text-foreground shadow-2xs font-bold" : "text-muted-foreground"
                }`}
                title="Table Ledger View"
              >
                <List className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setActiveViewMode("analytics")}
                className={`p-1.5 rounded-lg transition-colors ${
                  activeViewMode === "analytics" ? "bg-background text-foreground shadow-2xs font-bold" : "text-muted-foreground"
                }`}
                title="Performance Comparison View"
              >
                <BarChart3 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* VIEW 1: MODERN PHOTO GRID VIEW */}
        {activeViewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((p) => {
              const isActive = p.status === "active";
              return (
                <Card
                  key={p.id}
                  className={`group rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between bg-card hover:shadow-md ${
                    isActive ? "border-border/80 hover:border-border" : "border-border/60 opacity-80 bg-muted/20"
                  }`}
                >
                  <div>
                    {/* Hero Cover Image & Badges */}
                    <div className="relative h-44 w-full overflow-hidden bg-muted">
                      <img
                        src={p.coverImage}
                        alt={p.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/60 text-white backdrop-blur-xs border border-white/20">
                          {p.type}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {isActive ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/90 text-white backdrop-blur-xs shadow-xs">
                              Open
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/90 text-white backdrop-blur-xs shadow-xs">
                              Seasonal Closure
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bottom Title & Rating Overlay */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono text-white/80 block uppercase tracking-wider">
                            ID: {p.id}
                          </span>
                          <h3 className="text-base font-bold text-white leading-tight drop-shadow-xs line-clamp-1">
                            {p.name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md text-amber-300 text-xs font-bold border border-white/10 shrink-0">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span>{p.rating}</span>
                          <span className="text-[10px] text-white/70 font-normal">({p.reviewCount})</span>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4 space-y-3.5">
                      {/* Address & Google Maps link */}
                      <div className="space-y-0.5">
                        <p className="text-xs text-foreground font-medium flex items-center justify-between gap-2">
                          <span className="truncate flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-rentcot-blue" />
                            <span className="truncate">{p.location}</span>
                          </span>
                          <a
                            href={p.googleMapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-rentcot-blue hover:underline shrink-0 font-semibold inline-flex items-center gap-0.5"
                          >
                            <span>Map</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        </p>
                        <p className="text-[11px] text-muted-foreground pl-5">{p.cityState}</p>
                      </div>

                      {/* Commercials & Occupancy Grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-muted/40 border border-border/70">
                        <div>
                          <span className="text-muted-foreground block text-[10px]">Accommodations</span>
                          <span className="font-bold text-foreground">{p.unitsCount} Units / Keys</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px]">Live Occupancy</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{p.occupancy}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px]">Target ADR</span>
                          <span className="font-bold font-mono text-foreground">₹{p.adr.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px]">Monthly Gross (Est.)</span>
                          <span className="font-bold font-mono text-foreground">₹{(p.monthlyEstRevenue / 100000).toFixed(1)}L</span>
                        </div>
                      </div>

                      {/* Connected Distribution OTA Channels */}
                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Globe className="h-3 w-3 text-rentcot-blue" /> OTA Channels:
                        </span>
                        <div className="flex items-center gap-1.5">
                          {p.connectedChannels.map((c, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 text-[10px] font-semibold text-foreground bg-muted px-1.5 py-0.5 rounded border border-border"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              <span>{c.name}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* On-Site Manager & Direct Contact */}
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-border/60">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <span className="text-muted-foreground">Manager:</span>
                          <span className="font-semibold text-foreground">{p.managerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${p.managerPhone.replace(/[^0-9+]/g, "")}`}
                            className="text-[11px] font-mono font-bold text-rentcot-blue hover:underline inline-flex items-center gap-1"
                          >
                            <Phone className="h-3 w-3" />
                            <span>Call</span>
                          </a>
                          <span>•</span>
                          <button
                            onClick={() => setShareModalProperty(p)}
                            className="text-[11px] font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                            title="Share public booking link"
                          >
                            <Share2 className="h-3 w-3" />
                            <span>Share</span>
                          </button>
                        </div>
                      </div>

                      {/* Amenities Chips */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {p.amenities.slice(0, 3).map((am, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border font-medium"
                          >
                            {am}
                          </span>
                        ))}
                        {p.amenities.length > 3 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md text-muted-foreground">
                            +{p.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </div>

                  {/* Actions & Deep-Links */}
                  <div className="p-3.5 bg-muted/20 border-t border-border/70 flex items-center justify-between gap-2">
                    <Link
                      href={p.type === "Campsite & Glamping" ? `/${locale}/camping` : `/${locale}/units`}
                      className="text-xs font-bold text-rentcot-blue hover:underline flex items-center gap-1"
                    >
                      <BedDouble className="h-3.5 w-3.5" />
                      <span>{p.type === "Campsite & Glamping" ? "Campsite Ops" : "Manage Units"}</span>
                    </Link>

                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDossierProperty(p)}
                        className="h-8 px-2 text-xs font-semibold"
                        title="View complete property 360 dossier"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        <span>Dossier</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenEditModal(p)}
                        className="h-8 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="h-3.5 w-3.5" />
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
                        <Power className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveProperty(p.id, p.name)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* VIEW 2: COMPACT ENTERPRISE TABLE VIEW */}
        {activeViewMode === "table" && (
          <div className="overflow-x-auto border rounded-2xl bg-card shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/70 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
                <tr>
                  <th className="p-3.5">Property & Location</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Keys</th>
                  <th className="p-3.5">Occupancy</th>
                  <th className="p-3.5">ADR</th>
                  <th className="p-3.5">RevPAR</th>
                  <th className="p-3.5">Est. Monthly</th>
                  <th className="p-3.5">Manager</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProperties.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-foreground text-sm">{p.name}</div>
                      <div className="text-[11px] text-muted-foreground">{p.location}, {p.cityState}</div>
                    </td>
                    <td className="p-3.5 font-semibold text-foreground">{p.type}</td>
                    <td className="p-3.5 font-mono font-bold">{p.unitsCount}</td>
                    <td className="p-3.5 font-mono font-bold text-emerald-600">{p.occupancy}%</td>
                    <td className="p-3.5 font-mono">₹{p.adr.toLocaleString()}</td>
                    <td className="p-3.5 font-mono font-bold">₹{p.revPar.toLocaleString()}</td>
                    <td className="p-3.5 font-mono font-bold">₹{(p.monthlyEstRevenue / 100000).toFixed(1)}L</td>
                    <td className="p-3.5">
                      <div className="font-medium text-foreground">{p.managerName}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">{p.managerPhone}</div>
                    </td>
                    <td className="p-3.5">
                      <Badge className={p.status === "active" ? "bg-emerald-600 font-bold" : "bg-muted text-muted-foreground"}>
                        {p.status === "active" ? "Open" : "Closed"}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDossierProperty(p)}
                        className="text-[11px] h-7 px-2 font-semibold"
                      >
                        Inspect
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenEditModal(p)}
                        className="text-[11px] h-7 px-2 text-muted-foreground hover:text-foreground"
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* VIEW 3: PERFORMANCE ANALYTICS VIEW */}
        {activeViewMode === "analytics" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProperties.map((p) => (
              <Card key={p.id} className="rounded-2xl border border-border bg-card shadow-xs p-5 space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h4 className="font-bold text-sm text-foreground">{p.name}</h4>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {p.type}
                  </Badge>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-muted-foreground mb-1">
                      <span>Occupancy:</span>
                      <strong className="text-foreground">{p.occupancy}%</strong>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${p.occupancy}%` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                      <span className="text-[10px] text-muted-foreground block">ADR</span>
                      <span className="text-base font-bold font-mono text-foreground">₹{p.adr.toLocaleString()}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                      <span className="text-[10px] text-muted-foreground block">RevPAR</span>
                      <span className="text-base font-bold font-mono text-emerald-600">₹{p.revPar.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Monthly Gross Run-rate</span>
                      <span className="text-lg font-black font-mono text-foreground">₹{(p.monthlyEstRevenue / 100000).toFixed(1)} Lakhs</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDossierProperty(p)}
                      className="text-xs h-8 font-semibold"
                    >
                      Dossier
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {filteredProperties.length === 0 && (
          <div className="p-12 text-center border rounded-2xl bg-card">
            <Building2 className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
            <h3 className="font-bold text-base text-foreground">No properties match your filter</h3>
            <p className="text-xs text-muted-foreground mt-1">Try resetting the category filter or search keyword.</p>
          </div>
        )}
      </div>

      {/* 360° PROPERTY DOSSIER SLIDE-OVER DRAWER (New Market Feature!) */}
      {dossierProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-foreground/30 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl h-full bg-card border-l border-border p-6 shadow-2xl flex flex-col justify-between overflow-y-auto space-y-6">
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <span className="text-[11px] font-mono text-rentcot-blue font-bold uppercase tracking-wider">
                    {dossierProperty.type} • 360° Dossier
                  </span>
                  <h3 className="text-lg font-bold text-foreground mt-0.5">{dossierProperty.name}</h3>
                  <p className="text-xs text-muted-foreground">{dossierProperty.location}, {dossierProperty.cityState}</p>
                </div>
                <button
                  onClick={() => setDossierProperty(null)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Photo Banner */}
              <div className="relative h-48 w-full rounded-xl overflow-hidden border border-border">
                <img
                  src={dossierProperty.coverImage}
                  alt={dossierProperty.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full text-white text-xs font-bold">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{dossierProperty.rating}</span>
                  <span className="text-white/70">({dossierProperty.reviewCount} verified reviews)</span>
                </div>
              </div>

              {/* Public Booking Link Bar */}
              <div className="p-3.5 rounded-xl border border-rentcot-blue/30 bg-blue-50/20 dark:bg-blue-950/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-rentcot-blue" /> Direct Guest Booking URL
                  </span>
                  <span className="text-emerald-600 font-bold text-[11px]">0% Commission</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://rentcot.com/stay/${dossierProperty.slug}`}
                    className="flex-1 p-2 rounded-lg border border-border bg-background text-xs font-mono"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleCopyShareLink(dossierProperty.slug)}
                    className="h-8 text-xs font-semibold bg-rentcot-blue text-white shrink-0"
                  >
                    {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedLink ? "Copied" : "Copy"}</span>
                  </Button>
                </div>
              </div>

              {/* Commercials Summary */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-muted/40 border border-border text-center">
                  <span className="text-muted-foreground text-[10px] block">Target ADR</span>
                  <span className="text-base font-bold font-mono text-foreground">₹{dossierProperty.adr.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 border border-border text-center">
                  <span className="text-muted-foreground text-[10px] block">Current RevPAR</span>
                  <span className="text-base font-bold font-mono text-emerald-600">₹{dossierProperty.revPar.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 border border-border text-center">
                  <span className="text-muted-foreground text-[10px] block">Live Keys</span>
                  <span className="text-base font-bold font-mono text-foreground">{dossierProperty.unitsCount} Units</span>
                </div>
              </div>

              {/* Contacts & Caretaker Direct Actions */}
              <div className="p-4 rounded-xl border border-border bg-card space-y-3 text-xs">
                <div className="font-bold text-foreground">Operational Team & Contacts</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-[11px] block">Estate Manager:</span>
                    <strong className="text-foreground">{dossierProperty.managerName}</strong>
                    <a
                      href={`tel:${dossierProperty.managerPhone}`}
                      className="text-rentcot-blue font-mono text-[11px] block hover:underline"
                    >
                      {dossierProperty.managerPhone}
                    </a>
                  </div>

                  <div className="space-y-1">
                    <span className="text-muted-foreground text-[11px] block">On-Site Caretaker:</span>
                    <strong className="text-foreground">{dossierProperty.caretakerName}</strong>
                    <a
                      href={`tel:${dossierProperty.caretakerPhone}`}
                      className="text-rentcot-blue font-mono text-[11px] block hover:underline"
                    >
                      {dossierProperty.caretakerPhone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Operational Policies */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1">
                  <span className="text-muted-foreground text-[10px] block">Check-In / Out</span>
                  <span className="font-semibold text-foreground">{dossierProperty.checkIn} - {dossierProperty.checkOut}</span>
                </div>
                <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1">
                  <span className="text-muted-foreground text-[10px] block">Quiet Hours</span>
                  <span className="font-semibold text-foreground">{dossierProperty.quietHours}</span>
                </div>
                <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1">
                  <span className="text-muted-foreground text-[10px] block">Power Backup</span>
                  <span className="font-semibold text-foreground">{dossierProperty.powerBackup}</span>
                </div>
                <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1">
                  <span className="text-muted-foreground text-[10px] block">Pet Policy</span>
                  <span className="font-semibold text-foreground">
                    {dossierProperty.petFriendly ? "Allowed (Pet Friendly)" : "No Pets Permitted"}
                  </span>
                </div>
              </div>

              {/* Compliance & GSTIN */}
              <div className="p-3.5 rounded-xl border border-border bg-muted/30 text-xs flex items-center justify-between">
                <div>
                  <span className="text-muted-foreground text-[10px] block">GSTIN / Tourism License</span>
                  <span className="font-mono font-bold text-foreground">{dossierProperty.taxId}</span>
                </div>
                <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
                  Verified Active
                </Badge>
              </div>

              {/* Amenities List */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-foreground">Property Amenities & Facilities</span>
                <div className="flex flex-wrap gap-1.5">
                  {dossierProperty.amenities.map((am, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-card border border-border text-foreground text-xs font-medium"
                    >
                      {am}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Links */}
            <div className="pt-4 border-t border-border flex items-center justify-between gap-2">
              <Button
                variant="outline"
                onClick={() => setDossierProperty(null)}
                className="text-xs h-9"
              >
                Close
              </Button>

              <Link
                href={dossierProperty.type === "Campsite & Glamping" ? `/${locale}/camping` : `/${locale}/units`}
                className="flex-1"
              >
                <Button className="w-full bg-rentcot-blue hover:bg-rentcot-blue/90 text-white text-xs font-bold h-9">
                  Launch Operational Ground Matrix
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* SHARE / QR CODE MODAL (New Market Feature!) */}
      {shareModalProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-between border-b pb-3 text-left">
              <div>
                <h3 className="font-bold text-base text-foreground">Share Public Booking Link</h3>
                <p className="text-xs text-muted-foreground">{shareModalProperty.name}</p>
              </div>
              <button
                onClick={() => setShareModalProperty(null)}
                className="p-1 rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 bg-muted/30 rounded-2xl border border-border inline-flex flex-col items-center justify-center mx-auto space-y-2">
              <QrCode className="h-28 w-28 text-foreground" />
              <span className="text-[11px] text-muted-foreground font-mono">Scan to open guest portal</span>
            </div>

            <div className="space-y-1.5 text-left text-xs">
              <label className="font-semibold text-foreground">Direct Link</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`https://rentcot.com/stay/${shareModalProperty.slug}`}
                  className="flex-1 p-2.5 rounded-lg border border-border bg-background text-xs font-mono"
                />
                <Button
                  onClick={() => handleCopyShareLink(shareModalProperty.slug)}
                  className="h-9 px-3 bg-rentcot-blue text-white text-xs font-bold"
                >
                  {copiedLink ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2">
              <a
                href={`https://api.whatsapp.com/send?text=Book%20your%20stay%20at%20${encodeURIComponent(shareModalProperty.name)}:%20https://rentcot.com/stay/${shareModalProperty.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Share via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

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

              {/* Cover Photo URL */}
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Cover Photo URL (High-Res Image)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={formCoverImage}
                  onChange={(e) => setFormCoverImage(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-background text-xs"
                />
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

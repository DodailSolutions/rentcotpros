"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type RichUnit,
  type UnitOperationalStatus,
  type UnitCategory,
} from "@/modules/units/types";
import {
  BedDouble,
  Sparkles,
  Plus,
  Filter,
  Users,
  CheckCircle2,
  Wrench,
  Brush,
  Search,
  Download,
  Building2,
  Tent,
  TreePine,
  Clock,
  Key,
  Copy,
  Check,
  X,
  ExternalLink,
  Edit,
  Eye,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  PawPrint,
  Waves,
  Wind,
  Layers,
  LayoutGrid,
  List,
  FolderTree,
  User,
  Phone,
  Calendar,
  IndianRupee,
} from "lucide-react";

const propertyOwnerCatalog: Record<
  string,
  { id: string; name: string; owner: string; phone: string; payout: string; defaultPricing: "per_unit" | "single_tent" }
> = {
  "Wildwoods Glamping & Campsite": {
    id: "prop-2",
    name: "Wildwoods Glamping & Campsite",
    owner: "Rajesh Sharma",
    phone: "+91 98490 12345",
    payout: "80% Owner / 20% Rentcot",
    defaultPricing: "per_unit",
  },
  "Green Valley Farmhouse & Retreat": {
    id: "prop-1",
    name: "Green Valley Farmhouse & Retreat",
    owner: "Dr. K. V. Rao",
    phone: "+91 98480 88990",
    payout: "85% Owner / 15% Rentcot",
    defaultPricing: "per_unit",
  },
  "Palm Oasis Luxury Resort": {
    id: "prop-3",
    name: "Palm Oasis Luxury Resort",
    owner: "Sunita Devi",
    phone: "+91 99080 77661",
    payout: "82% Owner / 18% Rentcot",
    defaultPricing: "per_unit",
  },
};

const initialUnits: RichUnit[] = [
  {
    id: "u-101",
    unit_number: "Suite 101",
    name: "Executive Lake Suite 101",
    property_id: "prop-3",
    property_name: "Palm Oasis Luxury Resort",
    category: "suite",
    category_label: "Executive Suite",
    zone_or_floor: "Lake Wing 1st Floor",
    status: "clean",
    rate_per_night: 14000,
    weekend_rate: 16500,
    adults_capacity: 2,
    children_capacity: 1,
    bedding: { kingBeds: 1, queenBeds: 0, singleBeds: 0, bunkBeds: 0, extraRollawayAllowed: true },
    has_attached_bath: true,
    has_ac: true,
    has_private_pool: false,
    pet_friendly: false,
    door_lock_code: "1014#",
    assigned_cleaner: "Lakshmi (HK Staff)",
    last_cleaned_at: "Today, 10:30 AM",
    last_inspected_by: "Supervisor Rajesh",
    image_url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80",
    owner_name: "Sunita Devi",
    owner_phone: "+91 99080 77661",
    pricing_model: "per_unit",
  },
  {
    id: "u-102",
    unit_number: "Cottage 102",
    name: "Lake View Garden Cottage",
    property_id: "prop-3",
    property_name: "Palm Oasis Luxury Resort",
    category: "cottage",
    category_label: "Lakefront Cottage",
    zone_or_floor: "Waterfront Lawn",
    status: "occupied",
    rate_per_night: 18500,
    weekend_rate: 21000,
    adults_capacity: 3,
    children_capacity: 1,
    bedding: { kingBeds: 1, queenBeds: 0, singleBeds: 1, bunkBeds: 0, extraRollawayAllowed: false },
    has_attached_bath: true,
    has_ac: true,
    has_private_pool: false,
    pet_friendly: true,
    door_lock_code: "8821#",
    assigned_cleaner: "Ravi Kumar",
    last_cleaned_at: "Yesterday, 03:00 PM",
    current_guest: {
      bookingId: "BK-PO-9912",
      name: "Venkat Nair & Family",
      phone: "+91 98480 77665",
      adults: 3,
      children: 1,
      checkIn: "11 Sep 2026, 02:00 PM",
      checkOut: "14 Sep 2026, 11:00 AM",
      paidAmount: 55500,
      source: "airbnb",
    },
    image_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&auto=format&fit=crop&q=80",
    owner_name: "Sunita Devi",
    owner_phone: "+91 99080 77661",
    pricing_model: "per_unit",
  },
  {
    id: "u-103",
    unit_number: "Villa 103",
    name: "Presidential Pool Villa 01",
    property_id: "prop-3",
    property_name: "Palm Oasis Luxury Resort",
    category: "villa",
    category_label: "Pool Villa",
    zone_or_floor: "Exclusive Villa Enclave",
    status: "dirty",
    rate_per_night: 28000,
    weekend_rate: 32000,
    adults_capacity: 6,
    children_capacity: 2,
    bedding: { kingBeds: 2, queenBeds: 1, singleBeds: 0, bunkBeds: 0, extraRollawayAllowed: true },
    has_attached_bath: true,
    has_ac: true,
    has_private_pool: true,
    pet_friendly: false,
    door_lock_code: "9002#",
    assigned_cleaner: "Unassigned (Queue #1)",
    last_cleaned_at: "Awaiting Departure Cleaning",
    maintenance_notes: "Checked out 11:00 AM. Requires full linen change & plunge pool chlorine test.",
    image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80",
    owner_name: "Sunita Devi",
    owner_phone: "+91 99080 77661",
    pricing_model: "per_unit",
  },
  {
    id: "u-104",
    unit_number: "FH-1",
    name: "Heritage Farmhouse Villa (3BHK)",
    property_id: "prop-1",
    property_name: "Green Valley Farmhouse & Retreat",
    category: "villa",
    category_label: "Farmhouse Estate",
    zone_or_floor: "Main Orchard Campus",
    status: "inspected",
    rate_per_night: 18500,
    weekend_rate: 22000,
    adults_capacity: 8,
    children_capacity: 4,
    bedding: { kingBeds: 3, queenBeds: 0, singleBeds: 2, bunkBeds: 0, extraRollawayAllowed: true },
    has_attached_bath: true,
    has_ac: true,
    has_private_pool: true,
    pet_friendly: true,
    door_lock_code: "4412#",
    assigned_cleaner: "Mallesh (Farmhouse Lead)",
    last_cleaned_at: "Today, 09:00 AM",
    last_inspected_by: "Manager Suresh Reddy",
    image_url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=80",
    owner_name: "Dr. K. V. Rao",
    owner_phone: "+91 98480 88990",
    pricing_model: "per_unit",
  },
  {
    id: "u-105",
    unit_number: "FH-2",
    name: "Garden Cottage A",
    property_id: "prop-1",
    property_name: "Green Valley Farmhouse & Retreat",
    category: "cottage",
    category_label: "Garden Cottage",
    zone_or_floor: "Mango Orchard Lawn",
    status: "occupied",
    rate_per_night: 6500,
    weekend_rate: 7500,
    adults_capacity: 2,
    children_capacity: 1,
    bedding: { kingBeds: 1, queenBeds: 0, singleBeds: 0, bunkBeds: 0, extraRollawayAllowed: true },
    has_attached_bath: true,
    has_ac: true,
    has_private_pool: false,
    pet_friendly: true,
    door_lock_code: "5512#",
    assigned_cleaner: "Mallesh",
    last_cleaned_at: "Yesterday",
    current_guest: {
      bookingId: "BK-GV-108",
      name: "Amit Chawla",
      phone: "+91 99011 22334",
      adults: 2,
      children: 1,
      checkIn: "12 Sep 2026, 02:00 PM",
      checkOut: "14 Sep 2026, 11:00 AM",
      paidAmount: 13000,
      source: "direct",
    },
    image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80",
    owner_name: "Dr. K. V. Rao",
    owner_phone: "+91 98480 88990",
    pricing_model: "per_unit",
  },
  {
    id: "u-106",
    unit_number: "T-01",
    name: "Geodesic Glamping Dome 01",
    property_id: "prop-2",
    property_name: "Wildwoods Glamping & Campsite",
    category: "glamping_dome",
    category_label: "Luxury Geodesic Dome",
    zone_or_floor: "Zone A: Lakeside Deck",
    status: "clean",
    rate_per_night: 5500,
    weekend_rate: 6500,
    adults_capacity: 3,
    children_capacity: 1,
    bedding: { kingBeds: 1, queenBeds: 0, singleBeds: 1, bunkBeds: 0, extraRollawayAllowed: false },
    has_attached_bath: true,
    has_ac: true,
    has_private_pool: false,
    pet_friendly: true,
    door_lock_code: "Lockbox #01 (Code: 7721)",
    assigned_cleaner: "Santhosh Camp Staff",
    last_cleaned_at: "Today, 11:15 AM",
    last_inspected_by: "Supervisor Vikram",
    image_url: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&auto=format&fit=crop&q=80",
    owner_name: "Rajesh Sharma",
    owner_phone: "+91 98490 12345",
    pricing_model: "per_unit",
    tent_type: "glamping_dome",
    washroom_type: "attached_private",
    ground_type: "wooden_deck",
  },
  {
    id: "u-107",
    unit_number: "T-02",
    name: "Geodesic Glamping Dome 02",
    property_id: "prop-2",
    property_name: "Wildwoods Glamping & Campsite",
    category: "glamping_dome",
    category_label: "Luxury Geodesic Dome",
    zone_or_floor: "Zone A: Lakeside Deck",
    status: "occupied",
    rate_per_night: 5500,
    weekend_rate: 6500,
    adults_capacity: 4,
    children_capacity: 0,
    bedding: { kingBeds: 1, queenBeds: 1, singleBeds: 0, bunkBeds: 0, extraRollawayAllowed: false },
    has_attached_bath: true,
    has_ac: true,
    has_private_pool: false,
    pet_friendly: true,
    door_lock_code: "Lockbox #02 (Code: 8812)",
    assigned_cleaner: "Santhosh",
    last_cleaned_at: "Yesterday, 02:00 PM",
    current_guest: {
      bookingId: "BK-WW-304",
      name: "Tanvi Bose & Friends",
      phone: "+91 97011 44556",
      adults: 4,
      children: 0,
      checkIn: "12 Sep 2026, 03:00 PM",
      checkOut: "13 Sep 2026, 11:00 AM",
      paidAmount: 5500,
      source: "direct",
    },
    image_url: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&auto=format&fit=crop&q=80",
    owner_name: "Rajesh Sharma",
    owner_phone: "+91 98490 12345",
    pricing_model: "per_unit",
    tent_type: "glamping_dome",
    washroom_type: "attached_private",
    ground_type: "wooden_deck",
  },
  {
    id: "u-108",
    unit_number: "T-03",
    name: "Swiss Canvas Cottage Tent 01",
    property_id: "prop-2",
    property_name: "Wildwoods Glamping & Campsite",
    category: "tent",
    category_label: "Swiss Canvas Tent",
    zone_or_floor: "Zone B: Pine Forest",
    status: "clean",
    rate_per_night: 3800,
    weekend_rate: 4500,
    adults_capacity: 3,
    children_capacity: 1,
    bedding: { kingBeds: 0, queenBeds: 1, singleBeds: 1, bunkBeds: 0, extraRollawayAllowed: false },
    has_attached_bath: true,
    has_ac: false,
    has_private_pool: false,
    pet_friendly: true,
    door_lock_code: "Padlock #03 (Key: T-03)",
    assigned_cleaner: "Ramu",
    last_cleaned_at: "Today, 10:00 AM",
    last_inspected_by: "Supervisor Vikram",
    image_url: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=600&auto=format&fit=crop&q=80",
    owner_name: "Rajesh Sharma",
    owner_phone: "+91 98490 12345",
    pricing_model: "per_unit",
    tent_type: "swiss_canvas",
    washroom_type: "attached_private",
    ground_type: "wooden_deck",
  },
  {
    id: "u-109",
    unit_number: "T-04",
    name: "Swiss Canvas Cottage Tent 02",
    property_id: "prop-2",
    property_name: "Wildwoods Glamping & Campsite",
    category: "tent",
    category_label: "Swiss Canvas Tent",
    zone_or_floor: "Zone B: Pine Forest",
    status: "out_of_service",
    rate_per_night: 3800,
    weekend_rate: 4500,
    adults_capacity: 3,
    children_capacity: 0,
    bedding: { kingBeds: 0, queenBeds: 1, singleBeds: 1, bunkBeds: 0, extraRollawayAllowed: false },
    has_attached_bath: true,
    has_ac: false,
    has_private_pool: false,
    pet_friendly: false,
    door_lock_code: "Padlock #04",
    assigned_cleaner: "Under Repair",
    last_cleaned_at: "Maintenance Active",
    maintenance_notes: "Zipper slider replacement & rainfly waterproofing coat scheduled.",
    image_url: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600&auto=format&fit=crop&q=80",
    owner_name: "Rajesh Sharma",
    owner_phone: "+91 98490 12345",
    pricing_model: "per_unit",
    tent_type: "swiss_canvas",
    washroom_type: "attached_private",
    ground_type: "wooden_deck",
  },
  {
    id: "u-110",
    unit_number: "ALP-01",
    name: "Alpine 2-Man Trekker Tent 01",
    property_id: "prop-2",
    property_name: "Wildwoods Glamping & Campsite",
    category: "tent",
    category_label: "Alpine Dome Tent",
    zone_or_floor: "Zone C: Valley Ridge",
    status: "clean",
    rate_per_night: 1200,
    weekend_rate: 1500,
    adults_capacity: 2,
    children_capacity: 0,
    bedding: { kingBeds: 0, queenBeds: 0, singleBeds: 2, bunkBeds: 0, extraRollawayAllowed: false },
    has_attached_bath: false,
    has_ac: false,
    has_private_pool: false,
    pet_friendly: true,
    door_lock_code: "Zipper Lock #05",
    assigned_cleaner: "Balram Guard",
    last_cleaned_at: "Today, 09:30 AM",
    last_inspected_by: "Supervisor Vikram",
    image_url: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600&auto=format&fit=crop&q=80",
    owner_name: "Rajesh Sharma",
    owner_phone: "+91 98490 12345",
    pricing_model: "single_tent",
    per_person_rate: 1200,
    tent_type: "alpine_tent",
    washroom_type: "shared_bathhouse",
    ground_type: "grass_pitch",
  },
  {
    id: "u-111",
    unit_number: "BYOT-01",
    name: "BYOT Lawn Pitch Slot 01",
    property_id: "prop-2",
    property_name: "Wildwoods Glamping & Campsite",
    category: "tent",
    category_label: "BYOT Grass Pitch",
    zone_or_floor: "Zone D: Campers Lawn",
    status: "clean",
    rate_per_night: 800,
    weekend_rate: 950,
    adults_capacity: 4,
    children_capacity: 2,
    bedding: { kingBeds: 0, queenBeds: 0, singleBeds: 0, bunkBeds: 0, extraRollawayAllowed: true },
    has_attached_bath: false,
    has_ac: false,
    has_private_pool: false,
    pet_friendly: true,
    door_lock_code: "Ground Peg Slot #01",
    assigned_cleaner: "Camp Ground Team",
    last_cleaned_at: "Today, 08:45 AM",
    last_inspected_by: "Supervisor Vikram",
    image_url: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=600&auto=format&fit=crop&q=80",
    owner_name: "Rajesh Sharma",
    owner_phone: "+91 98490 12345",
    pricing_model: "single_tent",
    per_person_rate: 800,
    tent_type: "byot_pitch",
    washroom_type: "shared_bathhouse",
    ground_type: "grass_pitch",
  },
  {
    id: "u-112",
    unit_number: "BELL-01",
    name: "Orchard Glamping Bell Tent 01",
    property_id: "prop-1",
    property_name: "Green Valley Farmhouse & Retreat",
    category: "glamping_dome",
    category_label: "Safari Bell Tent",
    zone_or_floor: "Mango Orchard Lawn",
    status: "clean",
    rate_per_night: 4500,
    weekend_rate: 5500,
    adults_capacity: 3,
    children_capacity: 1,
    bedding: { kingBeds: 1, queenBeds: 0, singleBeds: 1, bunkBeds: 0, extraRollawayAllowed: true },
    has_attached_bath: true,
    has_ac: true,
    has_private_pool: false,
    pet_friendly: true,
    door_lock_code: "Lockbox #01 (Code: 5521)",
    assigned_cleaner: "Mallesh",
    last_cleaned_at: "Today, 11:00 AM",
    last_inspected_by: "Manager Suresh Reddy",
    image_url: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&auto=format&fit=crop&q=80",
    owner_name: "Dr. K. V. Rao",
    owner_phone: "+91 98480 88990",
    pricing_model: "per_unit",
    tent_type: "safari_bell",
    washroom_type: "attached_private",
    ground_type: "grass_pitch",
  },
];

export default function UnitsPage() {
  const { t, locale } = useTranslation();

  const [units, setUnits] = useState<RichUnit[]>(initialUnits);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPricingModel, setFilterPricingModel] = useState<"all" | "per_unit" | "single_tent">("all");
  const [filterPetFriendly, setFilterPetFriendly] = useState(false);
  const [filterAC, setFilterAC] = useState(false);
  const [filterPool, setFilterPool] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "grouped" | "table">("grid");

  // Inspection Drawer & Add/Edit Modals
  const [selectedUnitForDossier, setSelectedUnitForDossier] = useState<RichUnit | null>(null);
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [isAddTentModalOpen, setIsAddTentModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<RichUnit | null>(null);
  const [copiedLockCode, setCopiedLockCode] = useState(false);
  const [tentActionToast, setTentActionToast] = useState<string | null>(null);

  // Add Tent Specific Form State
  const [tentFormPropertyId, setTentFormPropertyId] = useState("prop-2");
  const [tentFormPropertyName, setTentFormPropertyName] = useState("Wildwoods Glamping & Campsite");
  const [tentFormOwnerName, setTentFormOwnerName] = useState("Rajesh Sharma");
  const [tentFormOwnerPhone, setTentFormOwnerPhone] = useState("+91 98490 12345");
  const [tentFormUnitNumber, setTentFormUnitNumber] = useState("T-05");
  const [tentFormName, setTentFormName] = useState("Geodesic Glamping Dome 03");
  const [tentFormCategory, setTentFormCategory] = useState<UnitCategory>("glamping_dome");
  const [tentFormPricingModel, setTentFormPricingModel] = useState<"per_unit" | "single_tent">("per_unit");
  const [tentFormRate, setTentFormRate] = useState(5500);
  const [tentFormWeekendRate, setTentFormWeekendRate] = useState(6500);
  const [tentFormPerPersonRate, setTentFormPerPersonRate] = useState(1200);
  const [tentFormAdults, setTentFormAdults] = useState(3);
  const [tentFormChildren, setTentFormChildren] = useState(1);
  const [tentFormZone, setTentFormZone] = useState("Zone A: Lakeside Deck");
  const [tentFormWashroom, setTentFormWashroom] = useState<"attached_private" | "shared_bathhouse">("attached_private");
  const [tentFormGround, setTentFormGround] = useState<"wooden_deck" | "grass_pitch" | "stone_plinth">("wooden_deck");
  const [tentFormHasAC, setTentFormHasAC] = useState(true);
  const [tentFormHasPower, setTentFormHasPower] = useState(true);
  const [tentFormPetFriendly, setTentFormPetFriendly] = useState(true);
  const [tentFormLockCode, setTentFormLockCode] = useState("Lockbox #05 (Code: 1944)");

  // Add / Edit Unit Form State
  const [formUnitNumber, setFormUnitNumber] = useState("");
  const [formName, setFormName] = useState("");
  const [formPropertyName, setFormPropertyName] = useState("Palm Oasis Luxury Resort");
  const [formCategory, setFormCategory] = useState<UnitCategory>("suite");
  const [formZone, setFormZone] = useState("");
  const [formRate, setFormRate] = useState(8500);
  const [formWeekendRate, setFormWeekendRate] = useState(9500);
  const [formAdults, setFormAdults] = useState(2);
  const [formChildren, setFormChildren] = useState(1);
  const [formHasAttachedBath, setFormHasAttachedBath] = useState(true);
  const [formHasAC, setFormHasAC] = useState(true);
  const [formHasPool, setFormHasPool] = useState(false);
  const [formPetFriendly, setFormPetFriendly] = useState(false);
  const [formLockCode, setFormLockCode] = useState("");
  const [formImage, setFormImage] = useState("");

  // Operational KPI Calculations
  const kpis = useMemo(() => {
    const total = units.length;
    const clean = units.filter((u) => u.status === "clean").length;
    const occupied = units.filter((u) => u.status === "occupied").length;
    const dirty = units.filter((u) => u.status === "dirty").length;
    const inspected = units.filter((u) => u.status === "inspected").length;
    const outOfService = units.filter((u) => u.status === "out_of_service").length;
    const totalSleepCapacity = units.reduce((acc, u) => acc + u.adults_capacity + u.children_capacity, 0);
    const totalTents = units.filter((u) => u.category === "tent" || u.category === "glamping_dome").length;
    const perUnitTents = units.filter(
      (u) => (u.category === "tent" || u.category === "glamping_dome") && u.pricing_model === "per_unit"
    ).length;
    const singleTents = units.filter(
      (u) => (u.category === "tent" || u.category === "glamping_dome") && u.pricing_model === "single_tent"
    ).length;

    return {
      total,
      clean,
      occupied,
      dirty,
      inspected,
      outOfService,
      readyToSell: clean + inspected,
      totalSleepCapacity,
      totalTents,
      perUnitTents,
      singleTents,
    };
  }, [units]);

  // Filtered Units List
  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      if (selectedProperty !== "ALL" && u.property_name !== selectedProperty) return false;
      if (selectedCategory !== "ALL") {
        if (selectedCategory === "ALL_TENTS") {
          if (u.category !== "tent" && u.category !== "glamping_dome") return false;
        } else if (u.category !== selectedCategory) {
          return false;
        }
      }
      if (filterPricingModel !== "all" && u.pricing_model && u.pricing_model !== filterPricingModel) return false;
      if (filterStatus !== "all" && u.status !== filterStatus) return false;
      if (filterPetFriendly && !u.pet_friendly) return false;
      if (filterAC && !u.has_ac) return false;
      if (filterPool && !u.has_private_pool) return false;

      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchNumber = u.unit_number.toLowerCase().includes(q);
        const matchName = u.name.toLowerCase().includes(q);
        const matchZone = u.zone_or_floor.toLowerCase().includes(q);
        const matchGuest = u.current_guest?.name.toLowerCase().includes(q) || false;
        if (!matchNumber && !matchName && !matchZone && !matchGuest) return false;
      }

      return true;
    });
  }, [units, selectedProperty, selectedCategory, filterStatus, filterPricingModel, filterPetFriendly, filterAC, filterPool, searchQuery]);

  // Grouped by Property and Zone
  const groupedByPropertyAndZone = useMemo(() => {
    const map = new Map<string, Map<string, RichUnit[]>>();

    filteredUnits.forEach((u) => {
      if (!map.has(u.property_name)) {
        map.set(u.property_name, new Map());
      }
      const zoneMap = map.get(u.property_name)!;
      if (!zoneMap.has(u.zone_or_floor)) {
        zoneMap.set(u.zone_or_floor, []);
      }
      zoneMap.get(u.zone_or_floor)!.push(u);
    });

    return map;
  }, [filteredUnits]);

  const toggleStatus = (id: string, newStatus: UnitOperationalStatus) => {
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          return {
            ...u,
            status: newStatus,
            last_cleaned_at: newStatus === "clean" ? "Just Now" : u.last_cleaned_at,
            last_inspected_by: newStatus === "inspected" ? "Supervisor On Duty" : u.last_inspected_by,
          };
        }
        return u;
      })
    );
    if (selectedUnitForDossier && selectedUnitForDossier.id === id) {
      setSelectedUnitForDossier((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleOpenAddModal = () => {
    setFormUnitNumber(`Unit-${units.length + 101}`);
    setFormName("Deluxe Lakeview Cottage");
    setFormPropertyName("Palm Oasis Luxury Resort");
    setFormCategory("cottage");
    setFormZone("Waterfront Garden");
    setFormRate(9500);
    setFormWeekendRate(11000);
    setFormAdults(2);
    setFormChildren(1);
    setFormHasAttachedBath(true);
    setFormHasAC(true);
    setFormHasPool(false);
    setFormPetFriendly(true);
    setFormLockCode("1024#");
    setFormImage("https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&auto=format&fit=crop&q=80");
    setIsAddUnitModalOpen(true);
  };

  const handleOpenEditModal = (u: RichUnit) => {
    setEditingUnit(u);
    setFormUnitNumber(u.unit_number);
    setFormName(u.name);
    setFormPropertyName(u.property_name);
    setFormCategory(u.category);
    setFormZone(u.zone_or_floor);
    setFormRate(u.rate_per_night);
    setFormWeekendRate(u.weekend_rate);
    setFormAdults(u.adults_capacity);
    setFormChildren(u.children_capacity);
    setFormHasAttachedBath(u.has_attached_bath);
    setFormHasAC(u.has_ac);
    setFormHasPool(u.has_private_pool);
    setFormPetFriendly(u.pet_friendly);
    setFormLockCode(u.door_lock_code || "");
    setFormImage(u.image_url);
  };

  const handleSaveUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUnitNumber.trim() || !formName.trim()) return;

    if (editingUnit) {
      setUnits((prev) =>
        prev.map((u) =>
          u.id === editingUnit.id
            ? {
                ...u,
                unit_number: formUnitNumber,
                name: formName,
                property_name: formPropertyName,
                category: formCategory,
                zone_or_floor: formZone,
                rate_per_night: Number(formRate),
                weekend_rate: Number(formWeekendRate),
                adults_capacity: Number(formAdults),
                children_capacity: Number(formChildren),
                has_attached_bath: formHasAttachedBath,
                has_ac: formHasAC,
                has_private_pool: formHasPool,
                pet_friendly: formPetFriendly,
                door_lock_code: formLockCode,
                image_url: formImage || u.image_url,
              }
            : u
        )
      );
      setEditingUnit(null);
    } else {
      const created: RichUnit = {
        id: `u-${Date.now()}`,
        unit_number: formUnitNumber,
        name: formName,
        property_id: formPropertyName.includes("Palm") ? "prop-3" : formPropertyName.includes("Wildwoods") ? "prop-2" : "prop-1",
        property_name: formPropertyName,
        category: formCategory,
        category_label: formCategory.replace("_", " ").toUpperCase(),
        zone_or_floor: formZone || "Main Floor",
        status: "clean",
        rate_per_night: Number(formRate),
        weekend_rate: Number(formWeekendRate),
        adults_capacity: Number(formAdults),
        children_capacity: Number(formChildren),
        bedding: { kingBeds: 1, queenBeds: 0, singleBeds: 0, bunkBeds: 0, extraRollawayAllowed: true },
        has_attached_bath: formHasAttachedBath,
        has_ac: formHasAC,
        has_private_pool: formHasPool,
        pet_friendly: formPetFriendly,
        door_lock_code: formLockCode || "1234#",
        assigned_cleaner: "Housekeeping Pool",
        last_cleaned_at: "Just Initialized",
        last_inspected_by: "Supervisor On Duty",
        image_url: formImage || "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80",
        owner_name: propertyOwnerCatalog[formPropertyName]?.owner || "Estate Owner",
        owner_phone: propertyOwnerCatalog[formPropertyName]?.phone || "+91 98480 00000",
        pricing_model: "per_unit",
      };
      setUnits((prev) => [created, ...prev]);
      setIsAddUnitModalOpen(false);
    }
  };

  const handleOpenAddTentModal = (defaultProperty?: string) => {
    const targetProp = defaultProperty || (selectedProperty !== "ALL" ? selectedProperty : "Wildwoods Glamping & Campsite");
    const ownerMeta = propertyOwnerCatalog[targetProp] || propertyOwnerCatalog["Wildwoods Glamping & Campsite"];
    setTentFormPropertyName(targetProp);
    setTentFormPropertyId(ownerMeta.id);
    setTentFormOwnerName(ownerMeta.owner);
    setTentFormOwnerPhone(ownerMeta.phone);

    const tentCount = units.filter((u) => u.category === "tent" || u.category === "glamping_dome").length + 1;
    const pad = tentCount < 10 ? `0${tentCount}` : `${tentCount}`;
    if (targetProp.includes("Wildwoods")) {
      setTentFormUnitNumber(`T-${pad}`);
      setTentFormName(`Geodesic Glamping Dome ${pad}`);
      setTentFormCategory("glamping_dome");
      setTentFormPricingModel("per_unit");
      setTentFormRate(5500);
      setTentFormWeekendRate(6500);
      setTentFormPerPersonRate(1200);
      setTentFormZone("Zone A: Lakeside Deck");
      setTentFormWashroom("attached_private");
      setTentFormGround("wooden_deck");
      setTentFormLockCode(`Lockbox #${pad} (Code: 77${pad})`);
    } else {
      setTentFormUnitNumber(`BELL-${pad}`);
      setTentFormName(`Orchard Glamping Bell Tent ${pad}`);
      setTentFormCategory("glamping_dome");
      setTentFormPricingModel("per_unit");
      setTentFormRate(4500);
      setTentFormWeekendRate(5500);
      setTentFormPerPersonRate(1000);
      setTentFormZone("Mango Orchard Lawn");
      setTentFormWashroom("attached_private");
      setTentFormGround("grass_pitch");
      setTentFormLockCode(`Lockbox #${pad} (Code: 55${pad})`);
    }
    setIsAddTentModalOpen(true);
  };

  const handleSaveTent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tentFormUnitNumber.trim() || !tentFormName.trim()) return;

    const ownerMeta = propertyOwnerCatalog[tentFormPropertyName] || propertyOwnerCatalog["Wildwoods Glamping & Campsite"];

    const created: RichUnit = {
      id: `u-tent-${Date.now()}`,
      unit_number: tentFormUnitNumber,
      name: tentFormName,
      property_id: ownerMeta.id,
      property_name: tentFormPropertyName,
      category: tentFormCategory,
      category_label:
        tentFormCategory === "glamping_dome"
          ? "Geodesic Glamping Dome"
          : tentFormCategory === "tent" && tentFormPricingModel === "single_tent"
          ? "Single Tent / BYOT Pitch"
          : "Swiss Canvas Tent",
      zone_or_floor: tentFormZone || "Camping Ground",
      status: "clean",
      rate_per_night: tentFormPricingModel === "per_unit" ? Number(tentFormRate) : Number(tentFormPerPersonRate),
      weekend_rate:
        tentFormPricingModel === "per_unit" ? Number(tentFormWeekendRate) : Math.round(Number(tentFormPerPersonRate) * 1.25),
      adults_capacity: Number(tentFormAdults),
      children_capacity: Number(tentFormChildren),
      bedding: { kingBeds: 1, queenBeds: 0, singleBeds: 1, bunkBeds: 0, extraRollawayAllowed: true },
      has_attached_bath: tentFormWashroom === "attached_private",
      has_ac: tentFormHasAC,
      has_private_pool: false,
      pet_friendly: tentFormPetFriendly,
      door_lock_code: tentFormLockCode || "Tent Lock #01",
      assigned_cleaner: "Campsite Ground Team",
      last_cleaned_at: "Just Pitch Inspected",
      last_inspected_by: "Supervisor Vikram",
      image_url:
        tentFormCategory === "glamping_dome"
          ? "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=600&auto=format&fit=crop&q=80",
      owner_name: ownerMeta.owner,
      owner_phone: ownerMeta.phone,
      pricing_model: tentFormPricingModel,
      per_person_rate: tentFormPricingModel === "single_tent" ? Number(tentFormPerPersonRate) : undefined,
      tent_type: tentFormCategory as any,
      washroom_type: tentFormWashroom,
      ground_type: tentFormGround,
    };

    setUnits((prev) => [created, ...prev]);
    setTentActionToast(
      `Successfully added ${tentFormName} (${tentFormUnitNumber}) to ${tentFormPropertyName} (Owner: ${ownerMeta.owner}) charged ${
        tentFormPricingModel === "per_unit"
          ? `Per Unit Flat (₹${Number(tentFormRate).toLocaleString()}/nt)`
          : `Single Tent (₹${Number(tentFormPerPersonRate).toLocaleString()}/head)`
      }!`
    );
    setTimeout(() => setTentActionToast(null), 6000);
    setIsAddTentModalOpen(false);
  };

  const handleExportUnitsCSV = () => {
    const headers = [
      "Unit #",
      "Unit Name",
      "Property",
      "Category",
      "Zone / Floor",
      "Status",
      "Rate (INR)",
      "Weekend Rate (INR)",
      "Adults",
      "Children",
      "AC",
      "Pool",
      "Pets",
      "Lock Code",
      "Assigned Cleaner",
      "In-House Guest",
    ];

    const rows = units.map((u) => [
      `"${u.unit_number}"`,
      `"${u.name}"`,
      `"${u.property_name}"`,
      u.category,
      `"${u.zone_or_floor}"`,
      u.status,
      u.rate_per_night,
      u.weekend_rate,
      u.adults_capacity,
      u.children_capacity,
      u.has_ac ? "Yes" : "No",
      u.has_private_pool ? "Yes" : "No",
      u.pet_friendly ? "Yes" : "No",
      `"${u.door_lock_code || "-"}"`,
      `"${u.assigned_cleaner || "-"}"`,
      u.current_guest ? `"${u.current_guest.name} (${u.current_guest.phone})"` : "Vacant",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rentcot_Units_Accommodations_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: UnitOperationalStatus) => {
    switch (status) {
      case "clean":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
            <Sparkles className="h-2.5 w-2.5 text-emerald-600" /> Vacant Ready
          </span>
        );
      case "occupied":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rentcot-blue/15 text-rentcot-blue border border-rentcot-blue/25">
            <User className="h-2.5 w-2.5" /> Occupied
          </span>
        );
      case "dirty":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25">
            <Clock className="h-2.5 w-2.5 text-amber-600" /> In Turnover
          </span>
        );
      case "inspected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/25">
            <ShieldCheck className="h-2.5 w-2.5 text-teal-600" /> Inspected
          </span>
        );
      case "out_of_service":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/25">
            <Wrench className="h-2.5 w-2.5 text-rose-600" /> Out of Service
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground border border-border">
            Vacant
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-rentcot-blue text-white flex items-center justify-center shadow-xs">
              <BedDouble className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                  Units & Accommodations
                </h1>
                <Badge variant="outline" className="text-[11px] font-bold border-rentcot-blue/40 text-rentcot-blue bg-rentcot-blue/5">
                  Physical Key Inventory
                </Badge>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5 font-medium">
                Physical rooms, luxury glamping domes, swiss tents, cottages, and villas across all properties.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportUnitsCSV}
            className="text-xs h-9 gap-1.5 border-border hover:bg-muted font-semibold"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Units CSV</span>
          </Button>

          <Button
            onClick={() => handleOpenAddTentModal()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-1.5 h-9 shadow-xs"
          >
            <Tent className="h-4 w-4" />
            <span>+ Add Tent to Owner Property</span>
          </Button>

          <Button
            onClick={handleOpenAddModal}
            className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white text-xs font-bold gap-1.5 h-9 shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Physical Unit / Key</span>
          </Button>
        </div>
      </div>

      {/* Action Toast Feedback */}
      {tentActionToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 flex items-center justify-between text-xs font-medium animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{tentActionToast}</span>
          </div>
          <button
            onClick={() => setTentActionToast(null)}
            className="text-emerald-700 hover:text-emerald-950 dark:hover:text-white text-xs font-bold p-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Operational KPI Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <Card className="border border-border/80 bg-card shadow-2xs hover:shadow-xs transition-all rounded-2xl">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Total Operational Keys</span>
              <div className="h-7 w-7 rounded-lg bg-rentcot-blue/10 text-rentcot-blue flex items-center justify-center">
                <BedDouble className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-foreground">
              {kpis.total}
            </div>
            <div className="text-[11px] text-muted-foreground font-medium">
              Active physical units
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card shadow-2xs hover:shadow-xs transition-all rounded-2xl">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Ready to Sell</span>
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600">
              {kpis.readyToSell}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold">
              {kpis.clean} Clean + {kpis.inspected} Inspected
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card shadow-2xs hover:shadow-xs transition-all rounded-2xl">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Occupied</span>
              <div className="h-7 w-7 rounded-lg bg-rentcot-blue/10 text-rentcot-blue flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-foreground">
              {kpis.occupied}
            </div>
            <div className="text-[11px] text-rentcot-blue font-semibold">
              In-house guest stays
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card shadow-2xs hover:shadow-xs transition-all rounded-2xl">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Turnover Queue</span>
              <div className="h-7 w-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-amber-600">
              {kpis.dirty}
            </div>
            <div className="text-[11px] text-muted-foreground font-medium">
              Awaiting housekeeping
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card shadow-2xs hover:shadow-xs transition-all rounded-2xl">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Out of Service</span>
              <div className="h-7 w-7 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <Wrench className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-rose-600">
              {kpis.outOfService}
            </div>
            <div className="text-[11px] text-muted-foreground font-medium">
              Under maintenance
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card shadow-2xs hover:shadow-xs transition-all rounded-2xl">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Sleep Capacity</span>
              <div className="h-7 w-7 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-foreground">
              {kpis.totalSleepCapacity}
            </div>
            <div className="text-[11px] text-muted-foreground font-medium">
              Total bed capacity (Pax)
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <div className="space-y-3 bg-muted/40 p-4 rounded-2xl border border-border">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Property Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {[
              { id: "ALL", label: "All Estates", owner: null, count: units.length },
              { id: "Wildwoods Glamping & Campsite", label: "Wildwoods Campsite", owner: "Rajesh Sharma", count: units.filter((u) => u.property_name.includes("Wildwoods")).length },
              { id: "Green Valley Farmhouse & Retreat", label: "Green Valley", owner: "Dr. K. V. Rao", count: units.filter((u) => u.property_name.includes("Green")).length },
              { id: "Palm Oasis Luxury Resort", label: "Palm Oasis", owner: "Sunita Devi", count: units.filter((u) => u.property_name.includes("Palm")).length },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProperty(p.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedProperty === p.id
                    ? "bg-rentcot-blue text-white shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span>{p.label}</span>
                {p.owner && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${selectedProperty === p.id ? "bg-white/20 text-white" : "bg-muted/80 text-muted-foreground"}`}>
                    {p.owner}
                  </span>
                )}
                <span className={`text-[10px] px-1.5 rounded-full font-mono ${selectedProperty === p.id ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                  {p.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search, Status Dropdown, View Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Find room #, floor, guest..."
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
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-8 text-xs px-2.5 rounded-xl border border-border bg-background text-foreground font-medium"
            >
              <option value="all">All Statuses ({units.length})</option>
              <option value="clean">Vacant Ready ({kpis.clean})</option>
              <option value="occupied">Occupied ({kpis.occupied})</option>
              <option value="dirty">In Turnover ({kpis.dirty})</option>
              <option value="inspected">Inspected ({kpis.inspected})</option>
              <option value="out_of_service">Out of Service ({kpis.outOfService})</option>
            </select>

            {/* View Mode Toggle */}
            <div className="inline-flex p-0.5 rounded-xl bg-muted border border-border text-xs">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-background text-foreground shadow-2xs font-bold" : "text-muted-foreground"
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("grouped")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "grouped" ? "bg-background text-foreground shadow-2xs font-bold" : "text-muted-foreground"
                }`}
                title="Zone / Floor Grouped View"
              >
                <FolderTree className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "table" ? "bg-background text-foreground shadow-2xs font-bold" : "text-muted-foreground"
                }`}
                title="Housekeeping Table Ledger View"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sub-Filters: Categories & Fast Feature Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground font-medium">Category:</span>
            {[
              { id: "ALL", label: "All" },
              { id: "ALL_TENTS", label: "⛺ All Tents & Pitches" },
              { id: "glamping_dome", label: "Glamping Domes" },
              { id: "tent", label: "Swiss / Safari Tents" },
              { id: "cottage", label: "Cottages" },
              { id: "villa", label: "Villas" },
              { id: "suite", label: "Suites" },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-2.5 py-0.5 rounded-lg text-xs transition-colors ${
                  selectedCategory === c.id
                    ? "bg-foreground text-background font-bold shadow-2xs"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground">
              <input
                type="checkbox"
                checked={filterAC}
                onChange={(e) => setFilterAC(e.target.checked)}
                className="rounded text-rentcot-blue"
              />
              <span>Air Conditioned</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground">
              <input
                type="checkbox"
                checked={filterPool}
                onChange={(e) => setFilterPool(e.target.checked)}
                className="rounded text-rentcot-blue"
              />
              <span>Private Pool</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground">
              <input
                type="checkbox"
                checked={filterPetFriendly}
                onChange={(e) => setFilterPetFriendly(e.target.checked)}
                className="rounded text-rentcot-blue"
              />
              <span>Pet Friendly</span>
            </label>
          </div>
        </div>

        {/* Dual Pricing Model Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
              <IndianRupee className="h-3 w-3 text-rentcot-blue" />
              <span>Pricing Model:</span>
            </span>
            {[
              { id: "all", label: "All Pricing Models", count: units.length },
              { id: "per_unit", label: "🏷️ Per Unit Flat Rate", count: units.filter((u) => u.pricing_model === "per_unit").length },
              { id: "single_tent", label: "👤 Single Tent / Per Head", count: units.filter((u) => u.pricing_model === "single_tent").length },
            ].map((pm) => (
              <button
                key={pm.id}
                onClick={() => setFilterPricingModel(pm.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
                  filterPricingModel === pm.id
                    ? "bg-rentcot-blue text-white shadow-2xs font-bold"
                    : "bg-background border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <span>{pm.label}</span>
                <span className={`text-[10px] px-1 rounded-full font-mono ${filterPricingModel === pm.id ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                  {pm.count}
                </span>
              </button>
            ))}
          </div>

          <div className="text-[11px] text-muted-foreground font-medium hidden sm:block">
            Outdoor Inventory: <strong className="text-foreground">{kpis.totalTents} Tents</strong> ({kpis.perUnitTents} Unit Flat, {kpis.singleTents} Single Tent Slots)
          </div>
        </div>
      </div>

      {/* VIEW 1: VISUAL GRID VIEW */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUnits.map((u) => (
            <Card
              key={u.id}
              className="rounded-2xl border border-border/80 hover:border-border transition-all bg-card overflow-hidden shadow-2xs hover:shadow-xs flex flex-col justify-between group"
            >
              <div>
                {/* Unit Photo Thumbnail & Badges */}
                <div className="relative h-36 w-full overflow-hidden bg-muted">
                  <img
                    src={u.image_url}
                    alt={u.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />

                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs border border-white/20">
                      {u.category_label}
                    </span>
                    {u.pricing_model === "per_unit" && (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-purple-600/90 text-white backdrop-blur-xs shadow-xs">
                        🏷️ Per Unit Flat
                      </span>
                    )}
                    {u.pricing_model === "single_tent" && (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-600/90 text-white backdrop-blur-xs shadow-xs">
                        👤 Single Tent (₹{u.per_person_rate || u.rate_per_night}/head)
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    {getStatusBadge(u.status)}
                  </div>

                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-end justify-between">
                    <div>
                      <span className="font-mono text-base font-black text-white drop-shadow-xs">
                        {u.unit_number}
                      </span>
                      <span className="text-[11px] text-white/80 block line-clamp-1">
                        {u.name}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-white block">
                        ₹{(u.pricing_model === "single_tent" && u.per_person_rate ? u.per_person_rate : u.rate_per_night).toLocaleString()}
                      </span>
                      <span className="text-[9px] text-white/70">
                        {u.pricing_model === "single_tent" ? "/ camper / nt" : "/ unit / nt"}
                      </span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-3.5 space-y-2.5">
                  {/* Property & Owner */}
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-rentcot-blue truncate">
                        {u.property_name}
                      </span>
                      {u.owner_name && (
                        <span className="text-[10px] text-muted-foreground font-medium shrink-0 flex items-center gap-0.5 ml-1">
                          <User className="h-2.5 w-2.5 text-muted-foreground" />
                          <span className="truncate max-w-[90px]">{u.owner_name}</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground block truncate">
                      📍 {u.zone_or_floor}
                    </span>
                  </div>

                  {/* Bedding & Capacity */}
                  <div className="grid grid-cols-2 gap-1.5 text-xs bg-muted/40 p-2 rounded-xl border border-border/60">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Max Capacity</span>
                      <span className="font-semibold text-foreground">{u.adults_capacity}A, {u.children_capacity}C</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">
                        {u.pricing_model === "single_tent" ? "Pitch Type" : "Bedding"}
                      </span>
                      <span className="font-semibold text-foreground text-[11px] truncate block">
                        {u.pricing_model === "single_tent"
                          ? (u.tent_type === "byot_pitch" ? "BYOT Pitch" : "Camper Tent")
                          : (u.bedding.kingBeds > 0 ? `${u.bedding.kingBeds} King` : "") +
                            (u.bedding.queenBeds > 0 ? `${u.bedding.queenBeds} Queen` : "") +
                            (u.bedding.singleBeds > 0 ? ` + ${u.bedding.singleBeds} Single` : "") || "Double Bed"}
                      </span>
                    </div>
                  </div>

                  {/* Active In-House Guest or Housekeeping Tag */}
                  {u.current_guest ? (
                    <div className="p-2 rounded-lg bg-blue-50/40 dark:bg-blue-950/20 border border-rentcot-blue/20 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground truncate">👤 {u.current_guest.name}</span>
                        <span className="text-[10px] font-mono text-rentcot-blue font-semibold">{u.current_guest.source}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        Out: {u.current_guest.checkOut}
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-muted-foreground flex items-center justify-between px-1">
                      <span>🧹 {u.assigned_cleaner || "Housekeeping"}</span>
                      <span>{u.last_cleaned_at}</span>
                    </div>
                  )}

                  {/* Quick Features Chips */}
                  <div className="flex flex-wrap items-center gap-1 text-[10px] text-muted-foreground">
                    {u.pricing_model === "single_tent" && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-medium">
                        BYOT/Camper
                      </span>
                    )}
                    {u.pricing_model === "per_unit" && (
                      <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 font-medium">
                        Unit Flat
                      </span>
                    )}
                    {u.has_ac && <span className="px-1.5 py-0.5 rounded bg-muted border border-border">AC</span>}
                    {u.has_private_pool && <span className="px-1.5 py-0.5 rounded bg-muted border border-border">Pool</span>}
                    {u.pet_friendly && <span className="px-1.5 py-0.5 rounded bg-muted border border-border">Pets</span>}
                    {u.door_lock_code && (
                      <span className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono">
                        🔑 {u.door_lock_code}
                      </span>
                    )}
                  </div>
                </CardContent>
              </div>

              {/* Action Buttons & Fast Status Advancement */}
              <div className="p-3 bg-muted/20 border-t border-border/70 flex items-center justify-between gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedUnitForDossier(u)}
                  className="text-xs h-7 px-2 font-semibold"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  <span>Inspect</span>
                </Button>

                {/* Fast Housekeeping Progression Toggles */}
                <div className="flex items-center gap-1">
                  {u.status === "dirty" && (
                    <Button
                      size="sm"
                      onClick={() => toggleStatus(u.id, "clean")}
                      className="text-[10px] h-7 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    >
                      Cleaned
                    </Button>
                  )}
                  {u.status === "clean" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleStatus(u.id, "inspected")}
                      className="text-[10px] h-7 px-2 text-teal-700 dark:text-teal-300 border-teal-300 font-bold hover:bg-teal-50"
                    >
                      Inspect
                    </Button>
                  )}
                  {u.status !== "dirty" && u.status !== "occupied" && (
                    <button
                      onClick={() => toggleStatus(u.id, "dirty")}
                      className="text-[10px] text-muted-foreground hover:text-foreground px-1.5 py-1 rounded border border-border"
                      title="Mark for turnover cleaning"
                    >
                      Turnover
                    </button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleOpenEditModal(u)}
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* VIEW 2: ZONE & FLOOR GROUPED VIEW */}
      {viewMode === "grouped" && (
        <div className="space-y-6">
          {Array.from(groupedByPropertyAndZone.entries()).map(([propertyName, zones]) => (
            <Card key={propertyName} className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
              <CardHeader className="p-4 sm:p-5 pb-3 bg-muted/20 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-rentcot-blue" />
                    <div>
                      <CardTitle className="text-base font-bold text-foreground">{propertyName}</CardTitle>
                      {propertyOwnerCatalog[propertyName] && (
                        <p className="text-xs text-muted-foreground font-medium">
                          Owner: {propertyOwnerCatalog[propertyName].owner} • {propertyOwnerCatalog[propertyName].phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono">
                    {Array.from(zones.values()).reduce((acc, list) => acc + list.length, 0)} Units
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 space-y-6">
                {Array.from(zones.entries()).map(([zoneName, zoneUnits]) => (
                  <div key={zoneName} className="space-y-3">
                    <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                        <FolderTree className="h-3.5 w-3.5 text-rentcot-blue" />
                        <span>{zoneName}</span>
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {zoneUnits.filter((u) => u.status === "clean" || u.status === "inspected").length} of {zoneUnits.length} Ready
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {zoneUnits.map((u) => (
                        <div
                          key={u.id}
                          onClick={() => setSelectedUnitForDossier(u)}
                          className="p-3 rounded-xl border border-border/80 bg-background hover:border-rentcot-blue/50 hover:shadow-xs cursor-pointer transition-all space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="font-mono font-bold text-sm text-foreground">{u.unit_number}</span>
                              {u.pricing_model && (
                                <span className={`ml-1.5 text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                  u.pricing_model === "single_tent"
                                    ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                                    : "bg-purple-500/10 text-purple-700 dark:text-purple-300"
                                }`}>
                                  {u.pricing_model === "single_tent" ? "Single Tent" : "Per Unit"}
                                </span>
                              )}
                            </div>
                            {getStatusBadge(u.status)}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">{u.name}</div>
                          <div className="flex items-center justify-between pt-1 border-t border-border/60 text-xs">
                            <span className="font-mono font-bold text-foreground">
                              ₹{(u.pricing_model === "single_tent" && u.per_person_rate ? u.per_person_rate : u.rate_per_night).toLocaleString()}
                              <span className="text-[9px] text-muted-foreground font-normal">
                                {u.pricing_model === "single_tent" ? "/camper" : "/nt"}
                              </span>
                            </span>
                            <span className="text-[11px] text-muted-foreground">{u.adults_capacity}A / {u.children_capacity}C</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* VIEW 3: HOUSEKEEPING TABLE LEDGER VIEW */}
      {viewMode === "table" && (
        <div className="overflow-x-auto border rounded-2xl bg-card shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/70 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
              <tr>
                <th className="p-3.5">Unit # & Name</th>
                <th className="p-3.5">Property & Owner</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Pricing Model</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Rate / Billing</th>
                <th className="p-3.5">Assigned Cleaner</th>
                <th className="p-3.5">Last Cleaned</th>
                <th className="p-3.5">In-House Guest</th>
                <th className="p-3.5">Lock Code</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUnits.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3.5">
                    <div className="font-mono font-bold text-foreground text-sm">{u.unit_number}</div>
                    <div className="text-[11px] text-muted-foreground truncate max-w-[150px]">{u.name}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-foreground">{u.property_name}</div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <span>📍 {u.zone_or_floor}</span>
                      {u.owner_name && <span className="font-medium text-foreground/80">• 👤 {u.owner_name}</span>}
                    </div>
                  </td>
                  <td className="p-3.5 font-medium capitalize">{u.category.replace("_", " ")}</td>
                  <td className="p-3.5">
                    {u.pricing_model === "per_unit" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/25">
                        🏷️ Per Unit Flat
                      </span>
                    ) : u.pricing_model === "single_tent" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/25">
                        👤 Single Tent
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-[10px]">Standard</span>
                    )}
                  </td>
                  <td className="p-3.5">{getStatusBadge(u.status)}</td>
                  <td className="p-3.5 font-mono font-bold">
                    ₹{(u.pricing_model === "single_tent" && u.per_person_rate ? u.per_person_rate : u.rate_per_night).toLocaleString()}
                    <span className="text-[10px] text-muted-foreground font-normal block">
                      {u.pricing_model === "single_tent" ? "per camper / nt" : "per unit / nt"}
                    </span>
                  </td>
                  <td className="p-3.5 text-foreground font-medium">{u.assigned_cleaner || "Unassigned"}</td>
                  <td className="p-3.5 text-muted-foreground">{u.last_cleaned_at}</td>
                  <td className="p-3.5">
                    {u.current_guest ? (
                      <div>
                        <span className="font-bold text-foreground block">👤 {u.current_guest.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{u.current_guest.phone}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">—</span>
                    )}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-muted-foreground">{u.door_lock_code || "—"}</td>
                  <td className="p-3.5 text-right space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedUnitForDossier(u)}
                      className="text-[11px] h-7 px-2 font-semibold"
                    >
                      Dossier
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenEditModal(u)}
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

      {filteredUnits.length === 0 && (
        <div className="p-12 text-center border rounded-2xl bg-card">
          <BedDouble className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
          <h3 className="font-bold text-base text-foreground">No units match criteria</h3>
          <p className="text-xs text-muted-foreground mt-1">Try resetting the property or category filter.</p>
        </div>
      )}

      {/* UNIT 360° INSPECTION DOSSIER SLIDE-OVER DRAWER */}
      {selectedUnitForDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-foreground/30 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg h-full bg-card border-l border-border p-6 shadow-2xl flex flex-col justify-between overflow-y-auto space-y-5">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-black text-foreground">
                      {selectedUnitForDossier.unit_number}
                    </span>
                    {getStatusBadge(selectedUnitForDossier.status)}
                  </div>
                  <h3 className="font-bold text-sm text-foreground mt-0.5">{selectedUnitForDossier.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedUnitForDossier.property_name} • {selectedUnitForDossier.zone_or_floor}</p>
                </div>
                <button
                  onClick={() => setSelectedUnitForDossier(null)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Photo Banner */}
              <div className="relative h-44 w-full rounded-xl overflow-hidden border border-border">
                <img
                  src={selectedUnitForDossier.image_url}
                  alt={selectedUnitForDossier.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end bg-black/60 backdrop-blur-xs p-2 rounded-lg text-white text-xs">
                  <div>
                    <span className="text-[10px] text-white/70 block uppercase">Standard Rate</span>
                    <strong className="font-mono text-sm">₹{selectedUnitForDossier.rate_per_night.toLocaleString()}</strong> / night
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-white/70 block uppercase">Weekend Rate</span>
                    <strong className="font-mono text-sm">₹{selectedUnitForDossier.weekend_rate.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              {/* Door Lock & Security PIN */}
              <div className="p-3 rounded-xl border border-border bg-muted/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-rentcot-blue" />
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Keylock / Access PIN:</span>
                    <span className="font-mono font-bold text-sm text-foreground">
                      {selectedUnitForDossier.door_lock_code || "Physical Brass Key"}
                    </span>
                  </div>
                </div>
                {selectedUnitForDossier.door_lock_code && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedUnitForDossier.door_lock_code || "");
                      setCopiedLockCode(true);
                      setTimeout(() => setCopiedLockCode(false), 2000);
                    }}
                    className="text-xs h-8"
                  >
                    {copiedLockCode ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                    <span>{copiedLockCode ? "Copied" : "Copy"}</span>
                  </Button>
                )}
              </div>

              {/* Estate Owner & Commercial Billing Profile */}
              <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-rentcot-blue" />
                    <span>Estate Owner & Commercial Model</span>
                  </span>
                  {selectedUnitForDossier.pricing_model === "per_unit" ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/25">
                      🏷️ Per Unit Flat Rate
                    </span>
                  ) : selectedUnitForDossier.pricing_model === "single_tent" ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/25">
                      👤 Single Tent / Per Head
                    </span>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>
                    <span className="text-[10px] block text-muted-foreground">Property Owner</span>
                    <strong className="text-foreground text-xs">{selectedUnitForDossier.owner_name || "Estate Partner"}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] block text-muted-foreground">Owner Direct Phone</span>
                    <strong className="text-foreground text-xs font-mono">{selectedUnitForDossier.owner_phone || "On File"}</strong>
                  </div>
                </div>

                {/* Tent Specific Attributes */}
                {(selectedUnitForDossier.pricing_model || selectedUnitForDossier.category === "tent" || selectedUnitForDossier.category === "glamping_dome") && (
                  <div className="pt-2 border-t border-border/60 grid grid-cols-3 gap-1.5 text-[11px]">
                    <div className="p-1.5 rounded-lg bg-background border border-border/70">
                      <span className="text-[9px] text-muted-foreground block uppercase">Ground Type</span>
                      <strong className="text-foreground capitalize text-[10px]">
                        {selectedUnitForDossier.ground_type ? selectedUnitForDossier.ground_type.replace("_", " ") : "Ground Pitch"}
                      </strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-background border border-border/70">
                      <span className="text-[9px] text-muted-foreground block uppercase">Washroom</span>
                      <strong className="text-foreground capitalize text-[10px]">
                        {selectedUnitForDossier.washroom_type === "attached_private" ? "Attached Bath" : "Shared Camp Bath"}
                      </strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-background border border-border/70">
                      <span className="text-[9px] text-muted-foreground block uppercase">Billing Base</span>
                      <strong className="text-foreground capitalize text-[10px]">
                        {selectedUnitForDossier.pricing_model === "single_tent" ? "Per Camper" : "Entire Tent"}
                      </strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Bedding Specs & Amenities */}
              <div className="p-4 rounded-xl border border-border bg-card space-y-2.5 text-xs">
                <span className="font-bold text-foreground">Bedding & Max Occupancy</span>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>
                    <span>Adults: <strong className="text-foreground">{selectedUnitForDossier.adults_capacity}</strong></span>
                  </div>
                  <div>
                    <span>Children: <strong className="text-foreground">{selectedUnitForDossier.children_capacity}</strong></span>
                  </div>
                  <div>
                    <span>King Beds: <strong className="text-foreground">{selectedUnitForDossier.bedding.kingBeds}</strong></span>
                  </div>
                  <div>
                    <span>Queen Beds: <strong className="text-foreground">{selectedUnitForDossier.bedding.queenBeds}</strong></span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/60">
                  {selectedUnitForDossier.has_ac && <span className="px-2 py-0.5 rounded bg-muted font-medium">Air Conditioned</span>}
                  {selectedUnitForDossier.has_attached_bath && <span className="px-2 py-0.5 rounded bg-muted font-medium">Attached Washroom</span>}
                  {selectedUnitForDossier.has_private_pool && <span className="px-2 py-0.5 rounded bg-muted font-medium">Private Plunge Pool</span>}
                  {selectedUnitForDossier.pet_friendly && <span className="px-2 py-0.5 rounded bg-muted font-medium">Pet Friendly</span>}
                </div>
              </div>

              {/* Active Guest Folio (If Occupied) */}
              {selectedUnitForDossier.current_guest ? (
                <div className="p-4 rounded-xl border border-rentcot-blue/30 bg-blue-50/20 dark:bg-blue-950/20 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                    <span className="font-bold text-rentcot-blue uppercase tracking-wider text-[11px]">Active In-House Guest</span>
                    <span className="font-mono font-bold text-muted-foreground">{selectedUnitForDossier.current_guest.bookingId}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <strong className="text-foreground">{selectedUnitForDossier.current_guest.name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-mono font-bold text-foreground">{selectedUnitForDossier.current_guest.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{selectedUnitForDossier.current_guest.checkIn} → {selectedUnitForDossier.current_guest.checkOut}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Channel:</span>
                      <span className="capitalize font-bold text-foreground">{selectedUnitForDossier.current_guest.source}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-border/60">
                      <span className="text-muted-foreground">Folio Total:</span>
                      <strong className="font-mono text-emerald-600">₹{selectedUnitForDossier.current_guest.paidAmount.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              ) : (
                /* Housekeeping Audit Details */
                <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1.5 text-xs">
                  <span className="font-bold text-foreground">Housekeeping & Inspection Log</span>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Assigned Attendant:</span>
                    <strong className="text-foreground">{selectedUnitForDossier.assigned_cleaner || "General Pool"}</strong>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Last Cleaned:</span>
                    <span className="text-foreground">{selectedUnitForDossier.last_cleaned_at}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Inspection Sign-Off:</span>
                    <span className="text-foreground">{selectedUnitForDossier.last_inspected_by || "Pending"}</span>
                  </div>
                </div>
              )}

              {/* Maintenance Notes */}
              {selectedUnitForDossier.maintenance_notes && (
                <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-50/30 dark:bg-rose-950/20 text-xs text-rose-900 dark:text-rose-200">
                  <span className="font-bold block mb-0.5">Maintenance Ticket:</span>
                  <p>{selectedUnitForDossier.maintenance_notes}</p>
                </div>
              )}

              {/* Status Advancement Quick Buttons */}
              <div className="space-y-1.5 pt-2 border-t border-border">
                <span className="text-xs font-bold text-foreground">Advance Operational Status:</span>
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  <Button
                    size="sm"
                    variant={selectedUnitForDossier.status === "clean" ? "default" : "outline"}
                    onClick={() => toggleStatus(selectedUnitForDossier.id, "clean")}
                    className="text-[11px] h-8"
                  >
                    Clean
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedUnitForDossier.status === "inspected" ? "default" : "outline"}
                    onClick={() => toggleStatus(selectedUnitForDossier.id, "inspected")}
                    className="text-[11px] h-8"
                  >
                    Inspect
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedUnitForDossier.status === "dirty" ? "default" : "outline"}
                    onClick={() => toggleStatus(selectedUnitForDossier.id, "dirty")}
                    className="text-[11px] h-8"
                  >
                    Turnover
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedUnitForDossier.status === "out_of_service" ? "destructive" : "outline"}
                    onClick={() => toggleStatus(selectedUnitForDossier.id, "out_of_service")}
                    className="text-[11px] h-8"
                  >
                    OOS
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedUnitForDossier(null)}
                className="text-xs h-9"
              >
                Close Drawer
              </Button>
              <Button
                onClick={() => {
                  const targetUnit = selectedUnitForDossier;
                  setSelectedUnitForDossier(null);
                  handleOpenEditModal(targetUnit);
                }}
                className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white text-xs font-bold h-9 flex-1"
              >
                Edit Unit Specifications
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT UNIT MODAL */}
      {(isAddUnitModalOpen || editingUnit) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-rentcot-blue/10 flex items-center justify-center text-rentcot-blue">
                  {editingUnit ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {editingUnit ? `Edit Unit: ${editingUnit.unit_number}` : "Add Physical Accommodation / Unit"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Configure room specs, capacity, lock code, and nightly rates
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAddUnitModalOpen(false);
                  setEditingUnit(null);
                }}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUnit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Belonging Property</label>
                <select
                  value={formPropertyName}
                  onChange={(e) => setFormPropertyName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-medium"
                >
                  <option value="Palm Oasis Luxury Resort">Palm Oasis Luxury Resort (Gandipet)</option>
                  <option value="Green Valley Farmhouse & Retreat">Green Valley Farmhouse & Retreat (Shamirpet)</option>
                  <option value="Wildwoods Glamping & Campsite">Wildwoods Glamping & Campsite (Ananthagiri Hills)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Unit / Key Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Suite 204 or Tent A-12"
                    value={formUnitNumber}
                    onChange={(e) => setFormUnitNumber(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Accommodation Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs capitalize"
                  >
                    <option value="suite">Executive Suite</option>
                    <option value="cottage">Cottage / Chalet</option>
                    <option value="villa">Luxury Villa</option>
                    <option value="glamping_dome">Geodesic Glamping Dome</option>
                    <option value="tent">Swiss Canvas Tent</option>
                    <option value="room">Standard Room</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Unit Commercial Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Lakefront Presidential Pool Villa"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Floor / Section / Zone</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., East Wing 2nd Floor"
                    value={formZone}
                    onChange={(e) => setFormZone(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Door Lock Code / PIN</label>
                  <input
                    type="text"
                    placeholder="e.g., 2045# or Lockbox #04"
                    value={formLockCode}
                    onChange={(e) => setFormLockCode(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Standard Rate (₹ / Night)</label>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    value={formRate}
                    onChange={(e) => setFormRate(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Weekend Rate (₹ / Night)</label>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    value={formWeekendRate}
                    onChange={(e) => setFormWeekendRate(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Adults Capacity</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formAdults}
                    onChange={(e) => setFormAdults(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-border bg-background text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Children Capacity</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formChildren}
                    onChange={(e) => setFormChildren(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-border bg-background text-xs"
                  />
                </div>
              </div>

              {/* Amenity Toggles */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formHasAttachedBath}
                    onChange={(e) => setFormHasAttachedBath(e.target.checked)}
                    className="rounded text-rentcot-blue"
                  />
                  <span>Attached Private Bath</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formHasAC}
                    onChange={(e) => setFormHasAC(e.target.checked)}
                    className="rounded text-rentcot-blue"
                  />
                  <span>Air Conditioned</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formHasPool}
                    onChange={(e) => setFormHasPool(e.target.checked)}
                    className="rounded text-rentcot-blue"
                  />
                  <span>Private Plunge Pool</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formPetFriendly}
                    onChange={(e) => setFormPetFriendly(e.target.checked)}
                    className="rounded text-rentcot-blue"
                  />
                  <span>Pet Friendly</span>
                </label>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddUnitModalOpen(false);
                    setEditingUnit(null);
                  }}
                  className="text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white text-xs font-bold h-9"
                >
                  {editingUnit ? "Save Changes" : "Create & Launch Key"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD TENT TO OWNER PROPERTY MODAL */}
      {isAddTentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <Tent className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Add Tent to Owner Property
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Configure outdoor tent unit or single pitch with owner payout & pricing model
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddTentModalOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTent} className="space-y-4 text-xs">
              {/* Property & Owner Selection */}
              <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-2">
                <label className="font-bold text-foreground flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-rentcot-blue" />
                  <span>Target Estate & Owner</span>
                </label>
                <select
                  value={tentFormPropertyName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTentFormPropertyName(val);
                    const meta = propertyOwnerCatalog[val];
                    if (meta) {
                      setTentFormPropertyId(meta.id);
                      setTentFormOwnerName(meta.owner);
                      setTentFormOwnerPhone(meta.phone);
                      if (val.includes("Wildwoods")) {
                        setTentFormZone("Zone A: Lakeside Deck");
                      } else if (val.includes("Green Valley")) {
                        setTentFormZone("Mango Orchard Lawn");
                      } else {
                        setTentFormZone("Lawn Glamping Zone");
                      }
                    }
                  }}
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-medium"
                >
                  <option value="Wildwoods Glamping & Campsite">Wildwoods Glamping & Campsite • Owner: Rajesh Sharma</option>
                  <option value="Green Valley Farmhouse & Retreat">Green Valley Farmhouse & Retreat • Owner: Dr. K. V. Rao</option>
                  <option value="Palm Oasis Luxury Resort">Palm Oasis Luxury Resort • Owner: Sunita Devi</option>
                </select>

                <div className="flex items-center justify-between text-[11px] pt-1 text-muted-foreground px-1">
                  <span>Owner Contact: <strong className="text-foreground">{tentFormOwnerName} ({tentFormOwnerPhone})</strong></span>
                  <span className="text-rentcot-blue font-semibold">
                    {propertyOwnerCatalog[tentFormPropertyName]?.payout || "80/20 split"}
                  </span>
                </div>
              </div>

              {/* DUAL PRICING MODEL SELECTOR */}
              <div className="space-y-2">
                <label className="font-bold text-foreground block">
                  Outdoor Charging / Pricing Engine Model <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setTentFormPricingModel("per_unit")}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      tentFormPricingModel === "per_unit"
                        ? "border-purple-500 bg-purple-50/20 dark:bg-purple-950/20 ring-1 ring-purple-500 shadow-2xs"
                        : "border-border bg-card hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                        <Tent className="h-4 w-4 text-purple-600" />
                        <span>Charge Per Unit Flat</span>
                      </span>
                      <input
                        type="radio"
                        name="pricing_model"
                        checked={tentFormPricingModel === "per_unit"}
                        onChange={() => setTentFormPricingModel("per_unit")}
                        className="text-purple-600"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Fixed nightly rate for the entire physical tent (glamping dome, swiss cottage tent) regardless of 1 to max occupants.
                    </p>
                  </div>

                  <div
                    onClick={() => setTentFormPricingModel("single_tent")}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      tentFormPricingModel === "single_tent"
                        ? "border-amber-500 bg-amber-50/20 dark:bg-amber-950/20 ring-1 ring-amber-500 shadow-2xs"
                        : "border-border bg-card hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-amber-600" />
                        <span>Charge Single Tent / Per Head</span>
                      </span>
                      <input
                        type="radio"
                        name="pricing_model"
                        checked={tentFormPricingModel === "single_tent"}
                        onChange={() => setTentFormPricingModel("single_tent")}
                        className="text-amber-600"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Charged per individual camper or single tent pitch slot per night (ideal for BYOT lawns, backpackers & group treks).
                    </p>
                  </div>
                </div>
              </div>

              {/* Tent Key / Number & Name */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Tent / Slot Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., T-05 or BYOT-02"
                    value={tentFormUnitNumber}
                    onChange={(e) => setTentFormUnitNumber(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Tent Category</label>
                  <select
                    value={tentFormCategory}
                    onChange={(e) => setTentFormCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs"
                  >
                    <option value="glamping_dome">Geodesic Glamping Dome (Luxury)</option>
                    <option value="tent">Swiss Canvas Glamping Tent</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Tent Commercial Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Lakeside Geodesic Dome 05 or Hillview BYOT Pitch"
                  value={tentFormName}
                  onChange={(e) => setTentFormName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-xs"
                />
              </div>

              {/* Ground & Washroom Specifications */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Ground Pitch Construction</label>
                  <select
                    value={tentFormGround}
                    onChange={(e) => setTentFormGround(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs"
                  >
                    <option value="wooden_deck">Raised Teakwood Deck</option>
                    <option value="grass_pitch">Natural Grass Lawn Pitch</option>
                    <option value="stone_plinth">Elevated Stone Plinth</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Washroom Setup</label>
                  <select
                    value={tentFormWashroom}
                    onChange={(e) => setTentFormWashroom(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs"
                  >
                    <option value="attached_private">Attached Private Bathroom</option>
                    <option value="shared_bathhouse">Shared Campsite Bathhouse</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Rates based on Pricing Model */}
              {tentFormPricingModel === "per_unit" ? (
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-purple-50/20 dark:bg-purple-950/10 border border-purple-200 dark:border-purple-900">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Weekday Flat Rate (₹ / night)</label>
                    <input
                      type="number"
                      min="500"
                      step="100"
                      value={tentFormRate}
                      onChange={(e) => setTentFormRate(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-border bg-background text-xs font-mono font-bold"
                    />
                    <span className="text-[10px] text-muted-foreground">Covers up to max capacity</span>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Weekend Flat Rate (₹ / night)</label>
                    <input
                      type="number"
                      min="500"
                      step="100"
                      value={tentFormWeekendRate}
                      onChange={(e) => setTentFormWeekendRate(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-border bg-background text-xs font-mono font-bold"
                    />
                    <span className="text-[10px] text-muted-foreground">Fri - Sun peak pricing</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-amber-50/20 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-900">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Single Tent / Head (₹ / camper)</label>
                    <input
                      type="number"
                      min="300"
                      step="50"
                      value={tentFormPerPersonRate}
                      onChange={(e) => setTentFormPerPersonRate(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-border bg-background text-xs font-mono font-bold text-amber-700 dark:text-amber-300"
                    />
                    <span className="text-[10px] text-muted-foreground">Multiplied by total campers</span>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Calculated Pitch Base (₹ / nt)</label>
                    <div className="p-2 rounded-lg border border-border bg-background text-xs font-mono font-bold text-foreground">
                      ₹{(tentFormPerPersonRate * tentFormAdults).toLocaleString()} (for {tentFormAdults} adults)
                    </div>
                    <span className="text-[10px] text-muted-foreground">At full adult capacity</span>
                  </div>
                </div>
              )}

              {/* Capacity and Zone */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Adults Capacity</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={tentFormAdults}
                    onChange={(e) => setTentFormAdults(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-border bg-background text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Children Capacity</label>
                  <input
                    type="number"
                    min="0"
                    max="6"
                    value={tentFormChildren}
                    onChange={(e) => setTentFormChildren(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-border bg-background text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Zone / Floor / Lawn</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Zone A: Lakeside"
                    value={tentFormZone}
                    onChange={(e) => setTentFormZone(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-background text-xs"
                  />
                </div>
              </div>

              {/* Lock Code & Amenities */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Lock / Zipper Code / Peg ID</label>
                  <input
                    type="text"
                    placeholder="e.g., Lockbox #05 (Code: 1944)"
                    value={tentFormLockCode}
                    onChange={(e) => setTentFormLockCode(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-background text-xs font-mono"
                  />
                </div>

                <div className="flex flex-col justify-center space-y-1.5 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tentFormHasAC}
                      onChange={(e) => setTentFormHasAC(e.target.checked)}
                      className="rounded text-rentcot-blue"
                    />
                    <span>Air Conditioned / Climate Fan</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tentFormPetFriendly}
                      onChange={(e) => setTentFormPetFriendly(e.target.checked)}
                      className="rounded text-rentcot-blue"
                    />
                    <span>Camp Pets Allowed</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddTentModalOpen(false)}
                  className="text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-9 gap-1.5"
                >
                  <Tent className="h-4 w-4" />
                  <span>Add Tent to Owner Property</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type RichReservation,
  type BookingInventoryCategory,
  type BookingChannel,
  type MealPlanType,
} from "@/modules/bookings/types";
import {
  CalendarDays,
  Search,
  Filter,
  UserCheck,
  UserX,
  CreditCard,
  Phone,
  MessageCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  Dog,
  Clock,
  Sparkles,
  ExternalLink,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Tent,
  PartyPopper,
  Utensils,
  IndianRupee,
  Eye,
  Key,
  X,
  Check,
  MapPin,
  Copy,
  Printer,
  FileText,
  User,
  Mail,
  Tag,
  Flame,
  LayoutGrid,
  List,
  BarChart3,
  Calendar,
  Lock,
} from "lucide-react";

// Initial Multi-Channel Booking Registry across Rooms, Tents, and Event Venues
const initialReservations: RichReservation[] = [
  // 🏨 ROOMS & VILLAS
  {
    id: "RES-9081",
    bookingReference: "RC-GV-101",
    guestName: "Aditya Verma",
    phone: "+91 98480 12345",
    email: "aditya.verma@example.com",
    city: "Hyderabad, Telangana",
    propertyId: "prop-1",
    propertyName: "Green Valley Farmhouse & Retreat",
    inventoryCategory: "room",
    unitId: "u-101",
    unitName: "Heritage Pool Villa 1",
    unitNumber: "V-01",
    doorLockCode: "1024#",
    checkIn: "2026-09-12",
    checkOut: "2026-09-15",
    nights: 3,
    adults: 4,
    children: 1,
    pets: 1,
    source: "direct_walkin",
    status: "checked_in",
    paymentStatus: "paid",
    baseRate: 7500,
    addonsTotal: 2000,
    taxAmount: 2940,
    securityDeposit: 5000,
    totalAmount: 27440,
    paidAmount: 27440,
    balanceDue: 0,
    mealPlan: "map",
    mealPlanLabel: "MAP (Breakfast + Dinner BBQ)",
    specialRequests: "Arrived with Golden Retriever, private lawn campfire setup enabled",
    addons: [
      { name: "Private Campfire Pit", price: 1200 },
      { name: "Pet Sanitization Kit", price: 800 },
    ],
    paymentTransactions: [
      { id: "TXN-8801", amount: 27440, method: "upi", timestamp: "12 Sep 2026, 02:15 PM", notes: "GPay QR at Reception" },
    ],
    createdAt: "2026-09-10T14:30:00Z",
    otaSyncLocked: true,
    ownerName: "Dr. K. V. Rao",
    ownerPayout: 23324,
  },
  {
    id: "RES-9082",
    bookingReference: "HM-ABNB-9988",
    guestName: "Sarah Jenkins",
    phone: "+1 415 555 2671",
    email: "sarah.j@travelworld.org",
    city: "San Francisco, USA",
    propertyId: "prop-3",
    propertyName: "Palm Oasis Luxury Resort",
    inventoryCategory: "room",
    unitId: "u-103",
    unitName: "Executive Lakeview Villa 102",
    unitNumber: "LV-102",
    doorLockCode: "8821#",
    checkIn: "2026-09-13",
    checkOut: "2026-09-17",
    nights: 4,
    adults: 2,
    children: 0,
    pets: 0,
    source: "airbnb",
    status: "confirmed",
    paymentStatus: "paid",
    baseRate: 9500,
    addonsTotal: 0,
    taxAmount: 6840,
    securityDeposit: 10000,
    totalAmount: 44840,
    paidAmount: 44840,
    balanceDue: 0,
    mealPlan: "cp",
    mealPlanLabel: "CP (Complimentary Breakfast)",
    specialRequests: "Late check-in approx 08:30 PM. Needs airport pickup coordination.",
    paymentTransactions: [
      { id: "TXN-8802", amount: 44840, method: "ota_virtual_card", timestamp: "11 Sep 2026, 11:00 AM", notes: "Airbnb Payout Dispatched" },
    ],
    createdAt: "2026-09-08T09:12:00Z",
    otaSyncLocked: true,
    ownerName: "Sunita Devi",
    ownerPayout: 36768,
  },
  {
    id: "RES-9083",
    bookingReference: "BK-BCOM-4412",
    guestName: "Mohammed Al-Nuaimi",
    phone: "+971 50 123 4567",
    email: "m.alnuaimi@dubaiholdings.ae",
    city: "Dubai, UAE",
    propertyId: "prop-3",
    propertyName: "Palm Oasis Luxury Resort",
    inventoryCategory: "room",
    unitId: "u-104",
    unitName: "Presidential Royal Cottage 01",
    unitNumber: "PR-01",
    doorLockCode: "9912#",
    checkIn: "2026-09-14",
    checkOut: "2026-09-18",
    nights: 4,
    adults: 3,
    children: 2,
    pets: 0,
    source: "booking",
    status: "confirmed",
    paymentStatus: "partially_paid",
    baseRate: 14000,
    addonsTotal: 6000,
    taxAmount: 11160,
    securityDeposit: 15000,
    totalAmount: 73160,
    paidAmount: 35000,
    balanceDue: 38160,
    mealPlan: "ap",
    mealPlanLabel: "AP (Full Board Halal Gourmet)",
    specialRequests: "Strict Halal catering, baby crib requested in master suite",
    addons: [
      { name: "Private Airport Chauffeur", price: 3500 },
      { name: "Extra Rollaway Bed", price: 2500 },
    ],
    paymentTransactions: [
      { id: "TXN-8803", amount: 35000, method: "card", timestamp: "09 Sep 2026, 04:30 PM", notes: "Visa International Advance" },
    ],
    createdAt: "2026-09-09T16:20:00Z",
    otaSyncLocked: true,
    ownerName: "Sunita Devi",
    ownerPayout: 59991,
  },

  // ⛺ TENTS & GLAMPING
  {
    id: "RES-9084",
    bookingReference: "MMT-CAMP-7781",
    guestName: "Rohan & Priyam Mehra",
    phone: "+91 98200 99881",
    email: "rohan.mehra@mumbaiadvisors.in",
    city: "Mumbai, Maharashtra",
    propertyId: "prop-2",
    propertyName: "Wildwoods Glamping & Campsite",
    inventoryCategory: "tent",
    unitId: "u-106",
    unitName: "Geodesic Glamping Dome 01",
    unitNumber: "T-01",
    doorLockCode: "Lockbox #01 (Code: 7721)",
    checkIn: "2026-09-11",
    checkOut: "2026-09-13",
    nights: 2,
    adults: 2,
    children: 0,
    pets: 0,
    source: "makemytrip",
    status: "checked_in",
    paymentStatus: "paid",
    baseRate: 5500,
    addonsTotal: 1800,
    taxAmount: 1536,
    securityDeposit: 2000,
    totalAmount: 14336,
    paidAmount: 14336,
    balanceDue: 0,
    mealPlan: "cp",
    mealPlanLabel: "CP (Organic Camp Breakfast)",
    specialRequests: "Requested lakefront sunset deck allocation & telescope viewing",
    addons: [
      { name: "Stargazing Telescope Session", price: 800 },
      { name: "Campfire Barbecue Skewers", price: 1000 },
    ],
    paymentTransactions: [
      { id: "TXN-8804", amount: 14336, method: "ota_virtual_card", timestamp: "10 Sep 2026, 12:45 PM", notes: "MMT Net Settled" },
    ],
    createdAt: "2026-09-05T18:10:00Z",
    otaSyncLocked: true,
    ownerName: "Rajesh Sharma",
    ownerPayout: 11468,
  },
  {
    id: "RES-9087",
    bookingReference: "HM-ABNB-6612",
    guestName: "Ananya Sengupta",
    phone: "+91 97112 33445",
    email: "ananya.sengupta@delhipress.in",
    city: "New Delhi",
    propertyId: "prop-2",
    propertyName: "Wildwoods Glamping & Campsite",
    inventoryCategory: "tent",
    unitId: "u-107",
    unitName: "Swiss Canvas Glamping Tent 03",
    unitNumber: "T-03",
    doorLockCode: "Lockbox #03 (Code: 7723)",
    checkIn: "2026-09-13",
    checkOut: "2026-09-15",
    nights: 2,
    adults: 3,
    children: 1,
    pets: 1,
    source: "airbnb",
    status: "confirmed",
    paymentStatus: "paid",
    baseRate: 4800,
    addonsTotal: 1500,
    taxAmount: 1332,
    securityDeposit: 2000,
    totalAmount: 12432,
    paidAmount: 12432,
    balanceDue: 0,
    mealPlan: "ep",
    mealPlanLabel: "EP (Room Only)",
    specialRequests: "Traveling with Indie dog, please provide extra pet blanket & water bowl",
    addons: [
      { name: "Pet Stay Pack", price: 500 },
      { name: "Pine Wood Bonfire Kit", price: 1000 },
    ],
    paymentTransactions: [
      { id: "TXN-8805", amount: 12432, method: "ota_virtual_card", timestamp: "11 Sep 2026, 03:00 PM", notes: "Airbnb Confirmed" },
    ],
    createdAt: "2026-09-11T11:00:00Z",
    otaSyncLocked: true,
    ownerName: "Rajesh Sharma",
    ownerPayout: 9945,
  },
  {
    id: "RES-9088",
    bookingReference: "RC-WALK-5521",
    guestName: "Wilderness Trekker Club (Vikas Rao)",
    phone: "+91 99480 77112",
    email: "vikas.rao@trekhyderabad.org",
    city: "Secunderabad, Telangana",
    propertyId: "prop-2",
    propertyName: "Wildwoods Glamping & Campsite",
    inventoryCategory: "tent",
    unitId: "u-110",
    unitName: "Alpine 2-Man Trekker Tents (Slot 01-03)",
    unitNumber: "ALP-01",
    doorLockCode: "Zipper Lock #05",
    checkIn: "2026-09-12",
    checkOut: "2026-09-13",
    nights: 1,
    adults: 6,
    children: 0,
    pets: 0,
    source: "direct_walkin",
    status: "checked_in",
    paymentStatus: "paid",
    baseRate: 1200, // per person rate
    addonsTotal: 900,
    taxAmount: 972,
    securityDeposit: 1500,
    totalAmount: 9072, // 6 pax * 1200 + addons + tax
    paidAmount: 9072,
    balanceDue: 0,
    mealPlan: "map",
    mealPlanLabel: "MAP (Camp Dinner + Trek Breakfast)",
    specialRequests: "Single Tent / Head Billing Model (₹1,200/camper). Early morning forest trek departure at 06:00 AM.",
    addons: [
      { name: "Trek Guide Assistance", price: 900 },
    ],
    paymentTransactions: [
      { id: "TXN-8806", amount: 9072, method: "cash", timestamp: "12 Sep 2026, 05:30 PM", notes: "Cash at Camp Reception Desk" },
    ],
    createdAt: "2026-09-12T17:15:00Z",
    otaSyncLocked: true,
    ownerName: "Rajesh Sharma",
    ownerPayout: 7257,
  },
  {
    id: "RES-9089",
    bookingReference: "AG-BYOT-3321",
    guestName: "Deepak & Shilpa Nair",
    phone: "+91 96190 44556",
    email: "deepak.nair@techblr.com",
    city: "Bengaluru, Karnataka",
    propertyId: "prop-2",
    propertyName: "Wildwoods Glamping & Campsite",
    inventoryCategory: "tent",
    unitId: "u-111",
    unitName: "BYOT Lawn Pitch Slot 01",
    unitNumber: "BYOT-01",
    doorLockCode: "Ground Peg Slot #01",
    checkIn: "2026-09-13",
    checkOut: "2026-09-15",
    nights: 2,
    adults: 4,
    children: 1,
    pets: 1,
    source: "agoda",
    status: "confirmed",
    paymentStatus: "paid",
    baseRate: 800, // per camper rate
    addonsTotal: 1200,
    taxAmount: 912,
    securityDeposit: 1000,
    totalAmount: 8512,
    paidAmount: 8512,
    balanceDue: 0,
    mealPlan: "ep",
    mealPlanLabel: "EP (Self-Cook Lawn Pitch)",
    specialRequests: "Bringing personal Coleman 4-man dome tent. Requires electricity extension board to pitch slot.",
    addons: [
      { name: "Power Hookup Extension Cable", price: 400 },
      { name: "Shared Bathhouse Hygiene Pass", price: 800 },
    ],
    paymentTransactions: [
      { id: "TXN-8807", amount: 8512, method: "ota_virtual_card", timestamp: "11 Sep 2026, 01:20 PM", notes: "Agoda Net Paid" },
    ],
    createdAt: "2026-09-11T10:45:00Z",
    otaSyncLocked: true,
    ownerName: "Rajesh Sharma",
    ownerPayout: 6809,
  },

  // 🎪 EVENT VENUES & LAWNS
  {
    id: "RES-9085",
    bookingReference: "CORP-DIR-8819",
    guestName: "TechCorp Global (Karan Mathur)",
    phone: "+91 99001 44321",
    email: "events@techcorpglobal.com",
    city: "Bengaluru, Karnataka",
    propertyId: "prop-1",
    propertyName: "Green Valley Farmhouse & Retreat",
    inventoryCategory: "venue",
    unitId: "v-201",
    unitName: "Grand Royal Lawn & Banquet Hall",
    unitNumber: "EV-LAWN",
    doorLockCode: "Security Gate Code: 1100",
    checkIn: "2026-09-15",
    checkOut: "2026-09-16",
    nights: 1,
    adults: 45,
    children: 0,
    pets: 0,
    source: "corporate",
    status: "confirmed",
    paymentStatus: "partially_paid",
    baseRate: 95000,
    addonsTotal: 25000,
    taxAmount: 21600,
    securityDeposit: 25000,
    totalAmount: 141600,
    paidAmount: 70000,
    balanceDue: 71600,
    mealPlan: "buffet",
    mealPlanLabel: "Executive Buffet + High Tea",
    specialRequests: "Annual strategy retreat. Stage backdrop, projector 4K, 4 collar mics, and generator standby requested.",
    addons: [
      { name: "AV Sound & 4K Projector Setup", price: 15000 },
      { name: "Diesel Generator Standby (8 hrs)", price: 10000 },
    ],
    paymentTransactions: [
      { id: "TXN-8808", amount: 70000, method: "netbanking", timestamp: "08 Sep 2026, 03:00 PM", notes: "HDFC NEFT Advance Reference #881923" },
    ],
    createdAt: "2026-09-04T12:00:00Z",
    otaSyncLocked: true,
    ownerName: "Dr. K. V. Rao",
    ownerPayout: 120360,
  },
  {
    id: "RES-9090",
    bookingReference: "RC-DIR-9941",
    guestName: "Reddy Sangeet & Reception (Dr. Suresh Reddy)",
    phone: "+91 98490 66778",
    email: "suresh.reddy@kims.org",
    city: "Hyderabad, Telangana",
    propertyId: "prop-1",
    propertyName: "Green Valley Farmhouse & Retreat",
    inventoryCategory: "venue",
    unitId: "v-202",
    unitName: "Mango Orchard Wedding Lawn",
    unitNumber: "EV-ORCHARD",
    doorLockCode: "Main Gate Lead: Suresh Manager",
    checkIn: "2026-09-18",
    checkOut: "2026-09-19",
    nights: 1,
    adults: 120,
    children: 25,
    pets: 0,
    source: "direct_web",
    status: "confirmed",
    paymentStatus: "partially_paid",
    baseRate: 150000,
    addonsTotal: 35000,
    taxAmount: 33300,
    securityDeposit: 30000,
    totalAmount: 218300,
    paidAmount: 100000,
    balanceDue: 118300,
    mealPlan: "buffet",
    mealPlanLabel: "Traditional Andhra Wedding Feast",
    specialRequests: "Pre-wedding Sangeet with fairy light lawn canopy, valet parking for 60 vehicles, and acoustic sound check permit.",
    addons: [
      { name: "Fairy Lights & Canopy Tree Illumination", price: 20000 },
      { name: "Valet Staff & Traffic Marshals", price: 15000 },
    ],
    paymentTransactions: [
      { id: "TXN-8809", amount: 100000, method: "netbanking", timestamp: "05 Sep 2026, 11:30 AM", notes: "ICICI RTGS Token #994101" },
    ],
    createdAt: "2026-09-02T15:00:00Z",
    otaSyncLocked: true,
    ownerName: "Dr. K. V. Rao",
    ownerPayout: 185555,
  },
  {
    id: "RES-9091",
    bookingReference: "RC-LIVE-4401",
    guestName: "Sunset Acoustic Music Night (Hyderabad Jam Club)",
    phone: "+91 97000 88991",
    email: "jamclub.hyd@livemusic.in",
    city: "Secunderabad, Telangana",
    propertyId: "prop-2",
    propertyName: "Wildwoods Glamping & Campsite",
    inventoryCategory: "venue",
    unitId: "v-203",
    unitName: "Sunset Deck Amphitheatre & Lawn",
    unitNumber: "EV-AMPHI",
    doorLockCode: "Deck Ramp #01",
    checkIn: "2026-09-12",
    checkOut: "2026-09-13",
    nights: 1,
    adults: 60,
    children: 0,
    pets: 2,
    source: "direct_walkin",
    status: "checked_in",
    paymentStatus: "paid",
    baseRate: 45000,
    addonsTotal: 12000,
    taxAmount: 10260,
    securityDeposit: 10000,
    totalAmount: 67260,
    paidAmount: 67260,
    balanceDue: 0,
    mealPlan: "buffet",
    mealPlanLabel: "Live Grill & Beverage Bar",
    specialRequests: "Live unplugged acoustic performance until 10:00 PM quiet hours curfew. Campfire circle activated.",
    addons: [
      { name: "Large Fire Pit & BBQ Station", price: 8000 },
      { name: "Camp Acoustic Sound Marshals", price: 4000 },
    ],
    paymentTransactions: [
      { id: "TXN-8810", amount: 67260, method: "upi", timestamp: "12 Sep 2026, 04:00 PM", notes: "UPI merchant scan confirmed" },
    ],
    createdAt: "2026-09-07T14:15:00Z",
    otaSyncLocked: true,
    ownerName: "Rajesh Sharma",
    ownerPayout: 53808,
  },
  {
    id: "RES-9079",
    bookingReference: "AG-CAMP-1192",
    guestName: "Vikram Kulkarni",
    phone: "+91 94401 77654",
    email: "vikram.kulkarni@gmail.com",
    city: "Hyderabad, Telangana",
    propertyId: "prop-2",
    propertyName: "Wildwoods Glamping & Campsite",
    inventoryCategory: "tent",
    unitId: "u-108",
    unitName: "Safari Dome Tent 02",
    unitNumber: "T-02",
    doorLockCode: "Lockbox #02 (Code: 7722)",
    checkIn: "2026-09-10",
    checkOut: "2026-09-12",
    nights: 2,
    adults: 2,
    children: 1,
    pets: 1,
    source: "agoda",
    status: "checked_out",
    paymentStatus: "paid",
    baseRate: 4800,
    addonsTotal: 0,
    taxAmount: 1152,
    securityDeposit: 1500,
    totalAmount: 10752,
    paidAmount: 10752,
    balanceDue: 0,
    mealPlan: "cp",
    mealPlanLabel: "CP (Camp Breakfast)",
    specialRequests: "Stay completed smoothly. Feedback rating 5/5 stars.",
    paymentTransactions: [
      { id: "TXN-8811", amount: 10752, method: "ota_virtual_card", timestamp: "09 Sep 2026, 02:00 PM", notes: "Agoda Net Payout" },
    ],
    createdAt: "2026-09-03T11:20:00Z",
    otaSyncLocked: true,
    ownerName: "Rajesh Sharma",
    ownerPayout: 8601,
  },
];

export default function BookingsPage() {
  const { t } = useTranslation();

  const [reservations, setReservations] = useState<RichReservation[]>(initialReservations);

  // Filters & Controls
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | BookingInventoryCategory>("all");
  const [propertyFilter, setPropertyFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "cards" | "financial">("table");

  // Multi-Channel Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("Just now");
  const [actionToast, setActionToast] = useState<string | null>(null);

  // Inspection Drawer & Action Modals
  const [selectedReservation, setSelectedReservation] = useState<RichReservation | null>(null);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [paymentModalReservation, setPaymentModalReservation] = useState<RichReservation | null>(null);
  const [paymentAmountInput, setPaymentAmountInput] = useState<number>(0);
  const [paymentMethodInput, setPaymentMethodInput] = useState<"cash" | "upi" | "card" | "netbanking">("upi");
  const [copiedPIN, setCopiedPIN] = useState(false);

  // New Booking Form State
  const [newPropId, setNewPropId] = useState("prop-1");
  const [newPropName, setNewPropName] = useState("Green Valley Farmhouse & Retreat");
  const [newCategory, setNewCategory] = useState<BookingInventoryCategory>("room");
  const [newUnitName, setNewUnitName] = useState("Heritage Pool Villa 2");
  const [newUnitNumber, setNewUnitNumber] = useState("V-02");
  const [newGuestName, setNewGuestName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newCity, setNewCity] = useState("Hyderabad");
  const [newCheckIn, setNewCheckIn] = useState("2026-09-14");
  const [newCheckOut, setNewCheckOut] = useState("2026-09-16");
  const [newAdults, setNewAdults] = useState(2);
  const [newChildren, setNewChildren] = useState(0);
  const [newPets, setNewPets] = useState(0);
  const [newChannel, setNewChannel] = useState<BookingChannel>("direct_walkin");
  const [newMealPlan, setNewMealPlan] = useState<MealPlanType>("cp");
  const [newBaseRate, setNewBaseRate] = useState(7500);
  const [newPaidUpfront, setNewPaidUpfront] = useState(5000);
  const [newPaymentMethod, setNewPaymentMethod] = useState<"cash" | "upi" | "card">("upi");
  const [newSpecialRequests, setNewSpecialRequests] = useState("");

  const showToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 5500);
  };

  // KPI Calculations
  const kpis = useMemo(() => {
    const total = reservations.length;
    const grossFolio = reservations.reduce((acc, r) => acc + r.totalAmount, 0);
    const collectedRevenue = reservations.reduce((acc, r) => acc + r.paidAmount, 0);
    const pendingBalance = reservations.reduce((acc, r) => acc + r.balanceDue, 0);

    const checkedInCount = reservations.filter((r) => r.status === "checked_in").length;
    const confirmedCount = reservations.filter((r) => r.status === "confirmed").length;
    const checkedOutCount = reservations.filter((r) => r.status === "checked_out").length;

    const totalRooms = reservations.filter((r) => r.inventoryCategory === "room").length;
    const totalTents = reservations.filter((r) => r.inventoryCategory === "tent").length;
    const totalVenues = reservations.filter((r) => r.inventoryCategory === "venue").length;

    const totalInHouseGuests = reservations
      .filter((r) => r.status === "checked_in")
      .reduce((acc, r) => acc + r.adults + r.children, 0);

    const totalPetsOnPremise = reservations
      .filter((r) => r.status === "checked_in")
      .reduce((acc, r) => acc + r.pets, 0);

    return {
      total,
      grossFolio,
      collectedRevenue,
      pendingBalance,
      checkedInCount,
      confirmedCount,
      checkedOutCount,
      totalRooms,
      totalTents,
      totalVenues,
      totalInHouseGuests,
      totalPetsOnPremise,
    };
  }, [reservations]);

  // Filtered Reservations List
  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      if (categoryFilter !== "all" && r.inventoryCategory !== categoryFilter) return false;
      if (propertyFilter !== "all" && r.propertyId !== propertyFilter) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (paymentFilter !== "all") {
        if (paymentFilter === "paid" && r.balanceDue > 0) return false;
        if (paymentFilter === "partial" && (r.paidAmount === 0 || r.balanceDue === 0)) return false;
        if (paymentFilter === "pending" && r.paidAmount > 0) return false;
      }
      if (channelFilter !== "all" && r.source !== channelFilter) return false;

      if (searchTerm.trim() !== "") {
        const q = searchTerm.toLowerCase().trim();
        const mGuest = r.guestName.toLowerCase().includes(q);
        const mId = r.id.toLowerCase().includes(q) || r.bookingReference.toLowerCase().includes(q);
        const mPhone = r.phone.includes(q);
        const mUnit = r.unitName.toLowerCase().includes(q) || r.unitNumber.toLowerCase().includes(q);
        const mProp = r.propertyName.toLowerCase().includes(q);
        if (!mGuest && !mId && !mPhone && !mUnit && !mProp) return false;
      }

      return true;
    });
  }, [reservations, categoryFilter, propertyFilter, statusFilter, paymentFilter, channelFilter, searchTerm]);

  // Real-Time Multi-Channel Sync Trigger
  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setLastSyncTime(timeStr);
      showToast("⚡ Multi-channel sync completed: All OTA rates, stop-sells, and collision locks verified active!");
    }, 1200);
  };

  // Status Handlers
  const handleStatusChange = (id: string, newStatus: RichReservation["status"]) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    if (selectedReservation && selectedReservation.id === id) {
      setSelectedReservation((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    const label = newStatus === "checked_in" ? "Checked In" : newStatus === "checked_out" ? "Checked Out" : newStatus;
    showToast(`Reservation ${id} updated to ${label}!`);
  };

  // Collect Payment Modal Triggers
  const handleOpenPaymentModal = (res: RichReservation) => {
    setPaymentModalReservation(res);
    setPaymentAmountInput(res.balanceDue);
    setPaymentMethodInput("upi");
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalReservation || paymentAmountInput <= 0) return;

    const amount = Number(paymentAmountInput);
    const targetId = paymentModalReservation.id;

    setReservations((prev) =>
      prev.map((r) => {
        if (r.id === targetId) {
          const newPaid = r.paidAmount + amount;
          const newBal = Math.max(0, r.totalAmount - newPaid);
          const newTxn = {
            id: `TXN-${Date.now().toString().slice(-4)}`,
            amount,
            method: paymentMethodInput,
            timestamp: "Just Now",
            notes: `Front Desk Payment Collection (${paymentMethodInput.toUpperCase()})`,
          };
          return {
            ...r,
            paidAmount: newPaid,
            balanceDue: newBal,
            paymentStatus: newBal === 0 ? "paid" : "partially_paid",
            paymentTransactions: [...(r.paymentTransactions || []), newTxn],
          };
        }
        return r;
      })
    );

    if (selectedReservation && selectedReservation.id === targetId) {
      setSelectedReservation((prev) => {
        if (!prev) return null;
        const newPaid = prev.paidAmount + amount;
        const newBal = Math.max(0, prev.totalAmount - newPaid);
        return {
          ...prev,
          paidAmount: newPaid,
          balanceDue: newBal,
          paymentStatus: newBal === 0 ? "paid" : "partially_paid",
        };
      });
    }

    setPaymentModalReservation(null);
    showToast(`Payment of ₹${amount.toLocaleString()} successfully recorded for ${targetId}!`);
  };

  // Create Walk-in / Reservation
  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim() || !newPhone.trim()) return;

    const d1 = new Date(newCheckIn);
    const d2 = new Date(newCheckOut);
    const diffDays = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));

    const baseCost = Number(newBaseRate) * diffDays;
    const tax = Math.round(baseCost * 0.12);
    const total = baseCost + tax;
    const paid = Math.min(total, Number(newPaidUpfront));
    const bal = Math.max(0, total - paid);

    const newId = `RES-${Date.now().toString().slice(-4)}`;
    const created: RichReservation = {
      id: newId,
      bookingReference: `RC-WALK-${Date.now().toString().slice(-4)}`,
      guestName: newGuestName,
      phone: newPhone,
      email: newEmail || `${newGuestName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      city: newCity,
      propertyId: newPropId,
      propertyName: newPropName,
      inventoryCategory: newCategory,
      unitId: `u-${Date.now()}`,
      unitName: newUnitName,
      unitNumber: newUnitNumber,
      doorLockCode: newCategory === "tent" ? "Lockbox #06 (Code: 7726)" : "2244#",
      checkIn: newCheckIn,
      checkOut: newCheckOut,
      nights: diffDays,
      adults: Number(newAdults),
      children: Number(newChildren),
      pets: Number(newPets),
      source: newChannel,
      status: "confirmed",
      paymentStatus: bal === 0 ? "paid" : paid > 0 ? "partially_paid" : "pending",
      baseRate: Number(newBaseRate),
      addonsTotal: 0,
      taxAmount: tax,
      securityDeposit: newCategory === "venue" ? 25000 : 2000,
      totalAmount: total,
      paidAmount: paid,
      balanceDue: bal,
      mealPlan: newMealPlan,
      mealPlanLabel:
        newMealPlan === "cp"
          ? "CP (Breakfast)"
          : newMealPlan === "map"
          ? "MAP (Breakfast + Dinner)"
          : newMealPlan === "ap"
          ? "AP (Full Board)"
          : newMealPlan === "buffet"
          ? "Grand Lawn Buffet"
          : "EP (Room Only)",
      specialRequests: newSpecialRequests,
      paymentTransactions:
        paid > 0
          ? [
              {
                id: `TXN-${Date.now().toString().slice(-4)}`,
                amount: paid,
                method: newPaymentMethod,
                timestamp: "Just Now",
                notes: "Advance Paid on Reservation Entry",
              },
            ]
          : [],
      createdAt: new Date().toISOString(),
      otaSyncLocked: true,
      ownerName: newPropName.includes("Wildwoods") ? "Rajesh Sharma" : newPropName.includes("Green") ? "Dr. K. V. Rao" : "Sunita Devi",
      ownerPayout: Math.round(total * 0.8),
    };

    setReservations((prev) => [created, ...prev]);
    setIsNewBookingModalOpen(false);
    showToast(`🔒 Reservation ${newId} confirmed & locked for ${newGuestName} on ${newUnitName}!`);

    // Reset Form
    setNewGuestName("");
    setNewPhone("");
    setNewEmail("");
    setNewSpecialRequests("");
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      "Reservation ID",
      "Reference",
      "Guest Name",
      "Phone",
      "Email",
      "Property",
      "Category",
      "Unit / Venue",
      "Check In",
      "Check Out",
      "Nights",
      "Adults",
      "Kids",
      "Pets",
      "Channel",
      "Status",
      "Payment Status",
      "Total Folio (INR)",
      "Paid Amount (INR)",
      "Balance Due (INR)",
      "Meal Plan",
      "Special Requests",
    ];

    const rows = filteredReservations.map((r) => [
      `"${r.id}"`,
      `"${r.bookingReference}"`,
      `"${r.guestName}"`,
      `"${r.phone}"`,
      `"${r.email}"`,
      `"${r.propertyName}"`,
      `"${r.inventoryCategory}"`,
      `"${r.unitName} (${r.unitNumber})"`,
      r.checkIn,
      r.checkOut,
      r.nights,
      r.adults,
      r.children,
      r.pets,
      r.source,
      r.status,
      r.paymentStatus,
      r.totalAmount,
      r.paidAmount,
      r.balanceDue,
      `"${r.mealPlanLabel}"`,
      `"${r.specialRequests || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rentcot_Reservations_Register_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // UI Badges
  const getSourceBadge = (source: BookingChannel) => {
    switch (source) {
      case "airbnb":
        return <Badge variant="secondary" className="bg-[#FF5A5F]/15 text-[#FF5A5F] border-[#FF5A5F]/30 font-semibold text-[11px]">Airbnb</Badge>;
      case "booking":
        return <Badge variant="secondary" className="bg-[#003580]/15 text-[#003580] border-[#003580]/30 font-semibold text-[11px]">Booking.com</Badge>;
      case "makemytrip":
        return <Badge variant="secondary" className="bg-[#EB2226]/15 text-[#EB2226] border-[#EB2226]/30 font-semibold text-[11px]">MakeMyTrip</Badge>;
      case "agoda":
        return <Badge variant="secondary" className="bg-[#2B86E8]/15 text-[#2B86E8] border-[#2B86E8]/30 font-semibold text-[11px]">Agoda</Badge>;
      case "corporate":
        return <Badge variant="secondary" className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30 font-semibold text-[11px]">Corporate MICE</Badge>;
      case "direct_web":
        return <Badge variant="secondary" className="bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30 font-semibold text-[11px]">Direct Web</Badge>;
      case "direct_walkin":
      default:
        return <Badge variant="secondary" className="bg-rentcot-blue/15 text-rentcot-blue border-rentcot-blue/30 font-semibold text-[11px]">Direct Walk-In</Badge>;
    }
  };

  const getCategoryBadge = (category: BookingInventoryCategory) => {
    switch (category) {
      case "room":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
            <Building2 className="h-3 w-3" /> Room / Villa
          </span>
        );
      case "tent":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            <Tent className="h-3 w-3" /> Tent / Glamping
          </span>
        );
      case "venue":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
            <PartyPopper className="h-3 w-3" /> Event Lawn
          </span>
        );
    }
  };

  const getStatusBadge = (status: RichReservation["status"]) => {
    switch (status) {
      case "checked_in":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            <UserCheck className="h-3 w-3 text-emerald-600" /> In-House
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rentcot-blue/15 text-rentcot-blue border border-rentcot-blue/30">
            <CheckCircle2 className="h-3 w-3" /> Confirmed
          </span>
        );
      case "checked_out":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground border border-border">
            <UserX className="h-3 w-3" /> Checked Out
          </span>
        );
      case "canceled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
            Cancelled
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
              <CalendarDays className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                  Reservations & Master Register
                </h1>
                <Badge variant="outline" className="text-[11px] font-bold border-emerald-500/40 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10">
                  Real-Time Multi-Channel Active
                </Badge>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5 font-medium">
                Unified live booking register across physical rooms, glamping tents, and outdoor event venues.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="text-xs h-9 gap-1.5 border-border hover:bg-muted font-semibold"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Register CSV</span>
          </Button>

          <Button
            onClick={() => setIsNewBookingModalOpen(true)}
            className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white text-xs font-bold gap-1.5 h-9 shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>+ New Walk-in / Reservation</span>
          </Button>
        </div>
      </div>

      {/* Action Toast Feedback */}
      {actionToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 flex items-center justify-between text-xs font-medium animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{actionToast}</span>
          </div>
          <button
            onClick={() => setActionToast(null)}
            className="text-emerald-700 hover:text-emerald-950 dark:hover:text-white text-xs font-bold p-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Real-Time Multi-Channel Sync Health Ribbon */}
      <Card className="rounded-2xl border border-border/90 bg-muted/30 shadow-2xs overflow-hidden">
        <CardContent className="p-3.5 sm:p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-rentcot-blue" />
                <span>Multi-Channel Status:</span>
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Direct Webhook (Live)
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Airbnb 2-Way API
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Booking.com Direct XML
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> MMT Switch Connected
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end lg:self-center">
              <span className="text-[11px] text-muted-foreground font-mono">
                Last verified: {lastSyncTime}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleTriggerSync}
                disabled={isSyncing}
                className="h-7 text-xs px-2.5 font-semibold gap-1"
              >
                <RefreshCw className={`h-3 w-3 ${isSyncing ? "animate-spin text-rentcot-blue" : ""}`} />
                <span>{isSyncing ? "Auditing OTAs..." : "Sync All Channels"}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operational KPI Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <Card className="border border-border/80 bg-card shadow-2xs hover:shadow-xs transition-all rounded-2xl">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Total Bookings</span>
              <div className="h-7 w-7 rounded-lg bg-rentcot-blue/10 text-rentcot-blue flex items-center justify-center">
                <CalendarDays className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-foreground">
              {kpis.total}
            </div>
            <div className="text-[11px] text-muted-foreground font-medium truncate">
              Gross ₹{kpis.grossFolio.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card shadow-2xs hover:shadow-xs transition-all rounded-2xl">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Active In-House</span>
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <UserCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600">
              {kpis.checkedInCount}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold">
              {kpis.totalInHouseGuests} Guests • {kpis.totalPetsOnPremise} Pets
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card shadow-2xs hover:shadow-xs transition-all rounded-2xl">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Confirmed Ahead</span>
              <div className="h-7 w-7 rounded-lg bg-rentcot-blue/10 text-rentcot-blue flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-foreground">
              {kpis.confirmedCount}
            </div>
            <div className="text-[11px] text-rentcot-blue font-semibold">
              Double-booking locked
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card shadow-2xs hover:shadow-xs transition-all rounded-2xl">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Rooms & Villas</span>
              <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-foreground">
              {kpis.totalRooms}
            </div>
            <div className="text-[11px] text-muted-foreground font-medium">
              Physical keys booked
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card shadow-2xs hover:shadow-xs transition-all rounded-2xl">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Tents & Glamping</span>
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Tent className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600">
              {kpis.totalTents}
            </div>
            <div className="text-[11px] text-muted-foreground font-medium">
              Outdoor domes & pitches
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card shadow-2xs hover:shadow-xs transition-all rounded-2xl">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Uncollected Folio</span>
              <div className="h-7 w-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <IndianRupee className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-amber-600">
              ₹{kpis.pendingBalance.toLocaleString()}
            </div>
            <div className="text-[11px] text-amber-600 font-semibold">
              Pending front-desk collection
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <div className="space-y-3 bg-muted/40 p-4 rounded-2xl border border-border">
        {/* Row 1: Inventory Category Tabs & View Mode */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {[
              { id: "all", label: "All Accommodations & Venues", count: reservations.length },
              { id: "room", label: "🏨 Rooms & Villas", count: kpis.totalRooms },
              { id: "tent", label: "⛺ Glamping & Tents", count: kpis.totalTents },
              { id: "venue", label: "🎪 Event Venues & Lawns", count: kpis.totalVenues },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id as any)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  categoryFilter === cat.id
                    ? "bg-rentcot-blue text-white shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 rounded-full font-mono ${categoryFilter === cat.id ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Find guest, phone, unit, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 text-xs pl-8 pr-3 bg-background border-border rounded-xl"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="inline-flex p-0.5 rounded-xl bg-muted border border-border text-xs">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "table" ? "bg-background text-foreground shadow-2xs font-bold" : "text-muted-foreground"
                }`}
                title="Table Register Ledger"
              >
                <List className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("cards")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "cards" ? "bg-background text-foreground shadow-2xs font-bold" : "text-muted-foreground"
                }`}
                title="Folio Cards View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("financial")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "financial" ? "bg-background text-foreground shadow-2xs font-bold" : "text-muted-foreground"
                }`}
                title="Cashier Financial Split"
              >
                <BarChart3 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Property Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/60 text-xs">
          <span className="text-[11px] text-muted-foreground font-medium">Estate Property:</span>
          {[
            { id: "all", label: "All Properties", owner: null },
            { id: "prop-1", label: "Green Valley Farmhouse", owner: "Dr. K.V. Rao" },
            { id: "prop-2", label: "Wildwoods Glamping", owner: "Rajesh Sharma" },
            { id: "prop-3", label: "Palm Oasis Luxury Resort", owner: "Sunita Devi" },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPropertyFilter(p.id)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors inline-flex items-center gap-1.5 ${
                propertyFilter === p.id
                  ? "bg-foreground text-background font-bold shadow-2xs"
                  : "bg-background border border-border/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{p.label}</span>
              {p.owner && (
                <span className={`text-[10px] px-1 py-0.2 rounded font-normal ${propertyFilter === p.id ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"}`}>
                  {p.owner}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Row 3: Status & Payment Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground font-medium">Status:</span>
            {[
              { id: "all", label: "All" },
              { id: "confirmed", label: "Confirmed" },
              { id: "checked_in", label: "In-House" },
              { id: "checked_out", label: "Checked Out" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-2 py-0.5 rounded text-xs transition-colors ${
                  statusFilter === st.id
                    ? "bg-rentcot-blue text-white font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground font-medium">Payment:</span>
            {[
              { id: "all", label: "All Payments" },
              { id: "paid", label: "Fully Paid" },
              { id: "partial", label: "Partial Due" },
            ].map((pm) => (
              <button
                key={pm.id}
                onClick={() => setPaymentFilter(pm.id)}
                className={`px-2 py-0.5 rounded text-xs transition-colors ${
                  paymentFilter === pm.id
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {pm.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground font-medium">Channel:</span>
            {[
              { id: "all", label: "All" },
              { id: "direct_walkin", label: "Walk-In" },
              { id: "airbnb", label: "Airbnb" },
              { id: "booking", label: "Booking" },
              { id: "makemytrip", label: "MMT" },
              { id: "corporate", label: "MICE" },
            ].map((ch) => (
              <button
                key={ch.id}
                onClick={() => setChannelFilter(ch.id)}
                className={`px-2 py-0.5 rounded text-xs transition-colors ${
                  channelFilter === ch.id
                    ? "bg-foreground text-background font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* VIEW 1: TABLE REGISTER LEDGER VIEW */}
      {viewMode === "table" && (
        <div className="overflow-x-auto border rounded-2xl bg-card shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/70 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
              <tr>
                <th className="p-3.5">ID & Channel</th>
                <th className="p-3.5">Guest & Contact</th>
                <th className="p-3.5">Inventory Key / Venue</th>
                <th className="p-3.5">Stay / Event Window</th>
                <th className="p-3.5">Pax</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Folio Total</th>
                <th className="p-3.5">Paid & Due</th>
                <th className="p-3.5">Lock PIN</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredReservations.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3.5">
                    <div className="font-mono font-bold text-foreground text-sm flex items-center gap-1.5">
                      <span>{r.id}</span>
                      {r.otaSyncLocked && (
                        <span title="Collision Lock Active">
                          <Lock className="h-3 w-3 text-rentcot-blue" />
                        </span>
                      )}
                    </div>
                    <div className="mt-1">{getSourceBadge(r.source)}</div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-bold text-foreground text-sm">{r.guestName}</div>
                    <div className="text-[11px] text-muted-foreground font-mono flex items-center gap-1.5 mt-0.5">
                      <a href={`tel:${r.phone}`} className="hover:text-rentcot-blue flex items-center gap-0.5">
                        <Phone className="h-3 w-3" />
                        <span>{r.phone}</span>
                      </a>
                    </div>
                    {r.city && <div className="text-[10px] text-muted-foreground">{r.city}</div>}
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      {getCategoryBadge(r.inventoryCategory)}
                    </div>
                    <div className="font-semibold text-foreground">{r.unitName}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {r.propertyName} • <span className="font-mono font-bold">{r.unitNumber}</span>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-mono font-semibold text-foreground">
                      {r.checkIn} → {r.checkOut}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {r.nights} {r.nights === 1 ? "Night / Slot" : "Nights"} • {r.mealPlan.toUpperCase()}
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-semibold text-foreground">
                      {r.adults}A {r.children > 0 ? `, ${r.children}C` : ""}
                    </div>
                    {r.pets > 0 && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-purple-600 dark:text-purple-400 font-bold mt-0.5">
                        <Dog className="h-3 w-3" /> {r.pets} Pet
                      </span>
                    )}
                  </td>

                  <td className="p-3.5">{getStatusBadge(r.status)}</td>

                  <td className="p-3.5 font-mono font-bold text-sm">
                    ₹{r.totalAmount.toLocaleString()}
                  </td>

                  <td className="p-3.5">
                    <div className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      ₹{r.paidAmount.toLocaleString()}
                    </div>
                    {r.balanceDue > 0 ? (
                      <div className="font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                        Due: ₹{r.balanceDue.toLocaleString()}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600">
                        <ShieldCheck className="h-3 w-3" /> Fully Paid
                      </span>
                    )}
                  </td>

                  <td className="p-3.5 font-mono text-muted-foreground font-bold">
                    {r.doorLockCode || "Physical Key"}
                  </td>

                  <td className="p-3.5 text-right space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedReservation(r)}
                      className="text-[11px] h-7 px-2 font-semibold"
                    >
                      Dossier
                    </Button>

                    {r.balanceDue > 0 && (
                      <Button
                        size="sm"
                        onClick={() => handleOpenPaymentModal(r)}
                        className="text-[11px] h-7 px-2 bg-amber-600 hover:bg-amber-700 text-white font-bold"
                      >
                        Collect
                      </Button>
                    )}

                    {r.status === "confirmed" && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(r.id, "checked_in")}
                        className="text-[11px] h-7 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                      >
                        Check-In
                      </Button>
                    )}

                    {r.status === "checked_in" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(r.id, "checked_out")}
                        className="text-[11px] h-7 px-2 border-border text-foreground hover:bg-muted font-semibold"
                      >
                        Check-Out
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 2: FOLIO CARDS VIEW */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReservations.map((r) => (
            <Card
              key={r.id}
              className="rounded-2xl border border-border/80 hover:border-border transition-all bg-card overflow-hidden shadow-2xs hover:shadow-xs flex flex-col justify-between"
            >
              <CardContent className="p-4 sm:p-5 space-y-3">
                {/* Header & Badges */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-sm font-black text-foreground">{r.id}</span>
                      {getSourceBadge(r.source)}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      {getCategoryBadge(r.inventoryCategory)}
                      {getStatusBadge(r.status)}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-bold font-mono text-foreground block">
                      ₹{r.totalAmount.toLocaleString()}
                    </span>
                    {r.balanceDue > 0 ? (
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 font-mono">
                        Due ₹{r.balanceDue.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-600 font-mono">
                        Paid Full
                      </span>
                    )}
                  </div>
                </div>

                {/* Guest Identity */}
                <div className="pt-2 border-t border-border/60">
                  <h3 className="font-bold text-base text-foreground flex items-center justify-between">
                    <span>{r.guestName}</span>
                    <span className="text-xs text-muted-foreground font-normal">{r.adults}A {r.children > 0 ? `, ${r.children}C` : ""}</span>
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <a href={`tel:${r.phone}`} className="hover:text-rentcot-blue flex items-center gap-1 font-mono">
                      <Phone className="h-3 w-3" />
                      <span>{r.phone}</span>
                    </a>
                    {r.pets > 0 && (
                      <span className="text-purple-600 font-bold flex items-center gap-0.5">
                        <Dog className="h-3 w-3" /> {r.pets} Pet
                      </span>
                    )}
                  </div>
                </div>

                {/* Property & Accommodation */}
                <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-1">
                  <div className="font-semibold text-rentcot-blue truncate">{r.propertyName}</div>
                  <div className="text-foreground font-medium flex items-center justify-between">
                    <span>{r.unitName}</span>
                    <span className="font-mono font-bold text-[11px] text-muted-foreground">{r.unitNumber}</span>
                  </div>
                  <div className="text-muted-foreground text-[11px] flex items-center justify-between pt-1 border-t border-border/40">
                    <span>📅 {r.checkIn} → {r.checkOut}</span>
                    <span>{r.nights} nights</span>
                  </div>
                </div>

                {/* Special Requests or Meal Plan */}
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="truncate max-w-[200px]">🍽️ {r.mealPlanLabel}</span>
                  {r.doorLockCode && (
                    <span className="font-mono font-bold text-foreground">🔑 {r.doorLockCode}</span>
                  )}
                </div>
              </CardContent>

              {/* Action Buttons */}
              <div className="p-3 bg-muted/20 border-t border-border/70 flex items-center justify-between gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedReservation(r)}
                  className="text-xs h-7 px-2 font-semibold"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  <span>Inspect</span>
                </Button>

                <div className="flex items-center gap-1">
                  <a
                    href={`https://wa.me/${r.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(r.guestName)},%20this%20is%20Rentcot%20concierge%20confirming%20your%20reservation%20${r.id}%20for%20${r.unitName}!`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center h-7 px-2 rounded-lg border border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-xs font-semibold"
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    <span>WhatsApp</span>
                  </a>

                  {r.balanceDue > 0 && (
                    <Button
                      size="sm"
                      onClick={() => handleOpenPaymentModal(r)}
                      className="text-[11px] h-7 px-2 bg-amber-600 hover:bg-amber-700 text-white font-bold"
                    >
                      Pay
                    </Button>
                  )}

                  {r.status === "confirmed" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(r.id, "checked_in")}
                      className="text-[11px] h-7 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    >
                      Check-In
                    </Button>
                  )}

                  {r.status === "checked_in" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(r.id, "checked_out")}
                      className="text-[11px] h-7 px-2 border-border text-foreground hover:bg-muted font-semibold"
                    >
                      Check-Out
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* VIEW 3: CASHIER FINANCIAL SPLIT VIEW */}
      {viewMode === "financial" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="rounded-2xl border border-border bg-card p-5 space-y-2">
              <span className="text-xs font-bold text-muted-foreground uppercase">Gross Booked Portfolio</span>
              <div className="text-3xl font-black font-mono text-foreground">
                ₹{kpis.grossFolio.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Cumulative contract value across active reservations.</p>
            </Card>

            <Card className="rounded-2xl border border-border bg-card p-5 space-y-2">
              <span className="text-xs font-bold text-muted-foreground uppercase">Collected in Hand</span>
              <div className="text-3xl font-black font-mono text-emerald-600">
                ₹{kpis.collectedRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Settled via UPI, Bank RTGS, and OTA Virtual Cards.</p>
            </Card>

            <Card className="rounded-2xl border border-border bg-card p-5 space-y-2">
              <span className="text-xs font-bold text-muted-foreground uppercase">Pending Front-Desk Folio</span>
              <div className="text-3xl font-black font-mono text-amber-600">
                ₹{kpis.pendingBalance.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Outstanding balance due upon guest arrival / check-out.</p>
            </Card>
          </div>

          <Card className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
            <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border bg-muted/20">
              <CardTitle className="text-base font-bold text-foreground">Channel Revenue Breakdown & Settlements</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Audit of all multi-channel inflows across Airbnb, Booking.com, MakeMyTrip, and Direct Desk
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-5">
              <div className="divide-y divide-border text-xs">
                {[
                  { channel: "Direct Walk-In & Website", count: reservations.filter((r) => r.source.includes("direct")).length, rev: reservations.filter((r) => r.source.includes("direct")).reduce((acc, r) => acc + r.totalAmount, 0), fee: "0% OTA Fee" },
                  { channel: "Airbnb 2-Way API", count: reservations.filter((r) => r.source === "airbnb").length, rev: reservations.filter((r) => r.source === "airbnb").reduce((acc, r) => acc + r.totalAmount, 0), fee: "3% Host Commission" },
                  { channel: "Booking.com Direct XML", count: reservations.filter((r) => r.source === "booking").length, rev: reservations.filter((r) => r.source === "booking").reduce((acc, r) => acc + r.totalAmount, 0), fee: "15% Commission" },
                  { channel: "MakeMyTrip India Switch", count: reservations.filter((r) => r.source === "makemytrip").length, rev: reservations.filter((r) => r.source === "makemytrip").reduce((acc, r) => acc + r.totalAmount, 0), fee: "18% Net Settled" },
                  { channel: "Corporate & MICE Contracts", count: reservations.filter((r) => r.source === "corporate").length, rev: reservations.filter((r) => r.source === "corporate").reduce((acc, r) => acc + r.totalAmount, 0), fee: "Direct Corporate Wire" },
                ].map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-foreground text-sm block">{item.channel}</span>
                      <span className="text-[11px] text-muted-foreground">{item.count} Active Reservations • {item.fee}</span>
                    </div>
                    <div className="text-right font-mono font-bold text-sm text-foreground">
                      ₹{item.rev.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {filteredReservations.length === 0 && (
        <div className="p-12 text-center border rounded-2xl bg-card">
          <CalendarDays className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
          <h3 className="font-bold text-base text-foreground">No reservations match criteria</h3>
          <p className="text-xs text-muted-foreground mt-1">Try resetting the search query or category filters.</p>
        </div>
      )}

      {/* RESERVATION 360° INSPECTION DOSSIER SLIDE-OVER DRAWER */}
      {selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-foreground/30 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg h-full bg-card border-l border-border p-6 shadow-2xl flex flex-col justify-between overflow-y-auto space-y-5">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-black text-foreground">
                      {selectedReservation.id}
                    </span>
                    {getStatusBadge(selectedReservation.status)}
                    {getSourceBadge(selectedReservation.source)}
                  </div>
                  <h3 className="font-bold text-sm text-foreground mt-0.5">{selectedReservation.guestName}</h3>
                  <p className="text-xs text-muted-foreground">Ref: {selectedReservation.bookingReference}</p>
                </div>
                <button
                  onClick={() => setSelectedReservation(null)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Guest Identity & Direct Contact */}
              <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-rentcot-blue" />
                    <span>Guest Profile & Verification</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    ID Verified (Govt Aadhaar/Passport)
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>
                    <span className="text-[10px] block">Primary Contact:</span>
                    <strong className="text-foreground font-mono">{selectedReservation.phone}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] block">Email Address:</span>
                    <span className="text-foreground truncate block">{selectedReservation.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] block">Origin City:</span>
                    <span className="text-foreground">{selectedReservation.city || "India"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] block">Total Occupancy:</span>
                    <strong className="text-foreground">
                      {selectedReservation.adults} Adults, {selectedReservation.children} Kids {selectedReservation.pets > 0 ? `, ${selectedReservation.pets} Pets` : ""}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                  <a
                    href={`https://wa.me/${selectedReservation.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(selectedReservation.guestName)},%20concierge%20from%20Rentcot!`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 rounded-lg border border-emerald-500/40 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-xs font-semibold text-center flex items-center justify-center gap-1"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>WhatsApp Guest</span>
                  </a>
                  <a
                    href={`tel:${selectedReservation.phone}`}
                    className="py-1.5 px-3 rounded-lg border border-border text-foreground hover:bg-muted text-xs font-semibold flex items-center gap-1"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              </div>

              {/* Physical Accommodation / Key Allocated */}
              <div className="p-3.5 rounded-xl border border-border bg-card space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                  <span className="font-bold text-foreground">Allocated Physical Key / Venue</span>
                  {getCategoryBadge(selectedReservation.inventoryCategory)}
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-sm text-foreground">{selectedReservation.unitName}</div>
                  <div className="text-muted-foreground">
                    {selectedReservation.propertyName} • Key #{selectedReservation.unitNumber}
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center justify-between pt-1">
                    <span>Stay Duration: <strong>{selectedReservation.nights} Nights</strong></span>
                    <span>{selectedReservation.checkIn} → {selectedReservation.checkOut}</span>
                  </div>
                </div>

                {/* Key PIN / Door Access */}
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-rentcot-blue" />
                    <div>
                      <span className="text-[9px] text-muted-foreground uppercase block">Door Lock / Keybox PIN</span>
                      <strong className="font-mono text-xs text-foreground">
                        {selectedReservation.doorLockCode || "Physical Key Handover"}
                      </strong>
                    </div>
                  </div>
                  {selectedReservation.doorLockCode && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedReservation.doorLockCode || "");
                        setCopiedPIN(true);
                        setTimeout(() => setCopiedPIN(false), 2000);
                      }}
                      className="h-7 text-xs px-2"
                    >
                      {copiedPIN ? <Check className="h-3 w-3 mr-1 text-emerald-600" /> : <Copy className="h-3 w-3 mr-1" />}
                      <span>{copiedPIN ? "Copied" : "Copy"}</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Financial Folio & Ledger Breakdown */}
              <div className="p-3.5 rounded-xl border border-border bg-card space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                  <span className="font-bold text-foreground">Folio Ledger & Billing</span>
                  <span className="text-muted-foreground font-mono">
                    {selectedReservation.paymentStatus.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1.5 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Base Accommodation ({selectedReservation.nights} nights @ ₹{selectedReservation.baseRate.toLocaleString()}):</span>
                    <strong className="text-foreground font-mono">
                      ₹{(selectedReservation.baseRate * selectedReservation.nights).toLocaleString()}
                    </strong>
                  </div>

                  {selectedReservation.addons && selectedReservation.addons.map((add, idx) => (
                    <div key={idx} className="flex justify-between text-[11px]">
                      <span>+ {add.name}:</span>
                      <span className="font-mono text-foreground">₹{add.price.toLocaleString()}</span>
                    </div>
                  ))}

                  <div className="flex justify-between">
                    <span>Taxes (GST 12% / 18%):</span>
                    <span className="font-mono text-foreground">₹{selectedReservation.taxAmount.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between pt-1.5 border-t border-border/60 font-bold text-foreground text-sm">
                    <span>Total Folio Value:</span>
                    <span className="font-mono">₹{selectedReservation.totalAmount.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Paid / Settled:</span>
                    <span className="font-mono">-₹{selectedReservation.paidAmount.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between pt-1 border-t border-border/60 text-sm font-black">
                    <span className="text-amber-600 dark:text-amber-400">Balance Due:</span>
                    <span className="font-mono text-amber-600 dark:text-amber-400">
                      ₹{selectedReservation.balanceDue.toLocaleString()}
                    </span>
                  </div>
                </div>

                {selectedReservation.balanceDue > 0 && (
                  <Button
                    onClick={() => handleOpenPaymentModal(selectedReservation)}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold h-8 gap-1 mt-1"
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    <span>Collect Outstanding ₹{selectedReservation.balanceDue.toLocaleString()}</span>
                  </Button>
                )}
              </div>

              {/* Special Requests */}
              {selectedReservation.specialRequests && (
                <div className="p-3 rounded-xl bg-blue-50/30 dark:bg-blue-950/20 border border-rentcot-blue/20 text-xs">
                  <span className="font-bold text-foreground block mb-0.5">Special Requests & Notes:</span>
                  <p className="text-muted-foreground">{selectedReservation.specialRequests}</p>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedReservation(null)}
                className="text-xs h-9"
              >
                Close Drawer
              </Button>

              <div className="flex items-center gap-2">
                {selectedReservation.status === "confirmed" && (
                  <Button
                    onClick={() => handleStatusChange(selectedReservation.id, "checked_in")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-9"
                  >
                    Complete Check-In
                  </Button>
                )}
                {selectedReservation.status === "checked_in" && (
                  <Button
                    onClick={() => handleStatusChange(selectedReservation.id, "checked_out")}
                    className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white text-xs font-bold h-9"
                  >
                    Check-Out & Free Key
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COLLECT PAYMENT MODAL */}
      {paymentModalReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Collect Folio Payment</h3>
                  <p className="text-xs text-muted-foreground">Reservation {paymentModalReservation.id} • {paymentModalReservation.guestName}</p>
                </div>
              </div>
              <button
                onClick={() => setPaymentModalReservation(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase">Total Balance Due</span>
                  <strong className="font-mono text-base text-amber-600">
                    ₹{paymentModalReservation.balanceDue.toLocaleString()}
                  </strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground block uppercase">Total Folio</span>
                  <span className="font-mono font-semibold text-foreground">
                    ₹{paymentModalReservation.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Payment Amount to Collect (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={paymentModalReservation.balanceDue}
                  value={paymentAmountInput}
                  onChange={(e) => setPaymentAmountInput(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-sm font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Payment Instrument / Gateway</label>
                <select
                  value={paymentMethodInput}
                  onChange={(e) => setPaymentMethodInput(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-medium"
                >
                  <option value="upi">UPI (GPay / PhonePe / QR Scan)</option>
                  <option value="cash">Cash at Front-Desk Reception</option>
                  <option value="card">Credit / Debit Card POS Swipe</option>
                  <option value="netbanking">Direct Bank NEFT / RTGS Wire</option>
                </select>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPaymentModalReservation(null)}
                  className="text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-9"
                >
                  Record ₹{Number(paymentAmountInput).toLocaleString()} Payment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW WALK-IN / RESERVATION MODAL */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-rentcot-blue/10 flex items-center justify-center text-rentcot-blue">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">New Reservation / Walk-In</h3>
                  <p className="text-xs text-muted-foreground">Direct front-desk entry with multi-channel collision guard</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewBookingModalOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReservation} className="space-y-4 text-xs">
              {/* Category Selector */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">Inventory Accommodation Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "room", label: "🏨 Room / Villa" },
                    { id: "tent", label: "⛺ Glamping Tent" },
                    { id: "venue", label: "🎪 Event Lawn" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setNewCategory(c.id as any);
                        if (c.id === "tent") {
                          setNewPropId("prop-2");
                          setNewPropName("Wildwoods Glamping & Campsite");
                          setNewUnitName("Lakeside Glamping Dome 04");
                          setNewUnitNumber("T-04");
                          setNewBaseRate(5500);
                        } else if (c.id === "venue") {
                          setNewPropId("prop-1");
                          setNewPropName("Green Valley Farmhouse & Retreat");
                          setNewUnitName("Mango Orchard Event Lawn");
                          setNewUnitNumber("EV-ORCHARD");
                          setNewBaseRate(75000);
                        } else {
                          setNewPropId("prop-1");
                          setNewPropName("Green Valley Farmhouse & Retreat");
                          setNewUnitName("Heritage Pool Villa 2");
                          setNewUnitNumber("V-02");
                          setNewBaseRate(7500);
                        }
                      }}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                        newCategory === c.id
                          ? "bg-rentcot-blue text-white border-rentcot-blue shadow-2xs"
                          : "border-border bg-background hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Property */}
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Target Estate Property</label>
                <select
                  value={newPropId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setNewPropId(id);
                    if (id === "prop-1") setNewPropName("Green Valley Farmhouse & Retreat");
                    else if (id === "prop-2") setNewPropName("Wildwoods Glamping & Campsite");
                    else setNewPropName("Palm Oasis Luxury Resort");
                  }}
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-medium"
                >
                  <option value="prop-1">Green Valley Farmhouse & Retreat • Owner: Dr. K. V. Rao</option>
                  <option value="prop-2">Wildwoods Glamping & Campsite • Owner: Rajesh Sharma</option>
                  <option value="prop-3">Palm Oasis Luxury Resort • Owner: Sunita Devi</option>
                </select>
              </div>

              {/* Unit / Venue & Base Rate */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Physical Key / Unit Name</label>
                  <input
                    type="text"
                    required
                    value={newUnitName}
                    onChange={(e) => setNewUnitName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Nightly / Slot Base Rate (₹)</label>
                  <input
                    type="number"
                    required
                    min="500"
                    step="100"
                    value={newBaseRate}
                    onChange={(e) => setNewBaseRate(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {/* Guest Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Guest Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Rajesh Kumar"
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Mobile Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98480 00000"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-mono"
                  />
                </div>
              </div>

              {/* Dates & Pax */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Check-In Date</label>
                  <input
                    type="date"
                    required
                    value={newCheckIn}
                    onChange={(e) => setNewCheckIn(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Check-Out Date</label>
                  <input
                    type="date"
                    required
                    value={newCheckOut}
                    onChange={(e) => setNewCheckOut(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Adults</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newAdults}
                    onChange={(e) => setNewAdults(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-border bg-background text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Kids</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={newChildren}
                    onChange={(e) => setNewChildren(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-border bg-background text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Pets</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={newPets}
                    onChange={(e) => setNewPets(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-border bg-background text-xs font-mono"
                  />
                </div>
              </div>

              {/* Channel & Meal Plan */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Channel Source</label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs"
                  >
                    <option value="direct_walkin">Direct Walk-In Front Desk</option>
                    <option value="direct_web">Direct Website Engine</option>
                    <option value="airbnb">Airbnb 2-Way Sync</option>
                    <option value="booking">Booking.com</option>
                    <option value="makemytrip">MakeMyTrip</option>
                    <option value="corporate">Corporate / MICE Contract</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Meal Plan</label>
                  <select
                    value={newMealPlan}
                    onChange={(e) => setNewMealPlan(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs"
                  >
                    <option value="ep">EP (Room Only)</option>
                    <option value="cp">CP (Breakfast Included)</option>
                    <option value="map">MAP (Breakfast + Dinner)</option>
                    <option value="ap">AP (Full Board 3-Meals)</option>
                    <option value="buffet">Grand Event Buffet</option>
                  </select>
                </div>
              </div>

              {/* Payment Advance */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/40 border border-border">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Advance Paid Upfront (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={newPaidUpfront}
                    onChange={(e) => setNewPaidUpfront(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-border bg-background text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Payment Method</label>
                  <select
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-border bg-background text-xs"
                  >
                    <option value="upi">UPI (GPay / PhonePe / QR)</option>
                    <option value="cash">Cash at Reception Desk</option>
                    <option value="card">Credit / Debit Card</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Special Requests / Notes</label>
                <input
                  type="text"
                  placeholder="e.g., Campfire setup, late arrival, extra towels"
                  value={newSpecialRequests}
                  onChange={(e) => setNewSpecialRequests(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-xs"
                />
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsNewBookingModalOpen(false)}
                  className="text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white text-xs font-bold h-9 gap-1.5"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Confirm & Lock Reservation</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

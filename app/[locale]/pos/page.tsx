"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Receipt,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  QrCode,
  Banknote,
  BedDouble,
  CheckCircle2,
  Utensils,
  Coffee,
  Flame,
  Bike,
  Sparkles,
  ShoppingBag,
  Printer,
  Share2,
  Percent,
  X,
  History,
  Download,
  Phone,
  Split,
  Building,
  Edit3,
  ShieldCheck,
  MapPin,
  Mail,
  Search,
  FileSpreadsheet,
  AlertCircle,
  Clock,
  UserCheck,
  Check,
  DollarSign,
  Briefcase,
  Store,
  Users,
  Baby,
  UserPlus,
  IndianRupee,
  Dog,
  DoorOpen,
  Eye,
  Calendar,
  Tent,
  Home,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  POSItem,
  POSCategory,
  POSGuestProfile,
  POSRoomUnit,
  POSUnitStatus,
  SplitTenderDetails,
  B2BBillingDetails,
  ResortBranding,
  TaxBreakdownRow,
  CompletedInvoice,
  CashierShift,
} from "@/modules/pos";

// Indian Currency to Words converter
function numberToIndianWords(amount: number): string {
  const rounded = Math.round(amount);
  if (rounded === 0) return "Rupees Zero Only";

  const single = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convertTwoDigits(n: number): string {
    if (n === 0) return "";
    if (n < 10) return single[n];
    if (n < 20) return teens[n - 10];
    const unit = n % 10;
    const ten = Math.floor(n / 10);
    return `${tens[ten]}${unit ? " " + single[unit] : ""}`;
  }

  function convertThreeDigits(n: number): string {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    let res = "";
    if (hundred > 0) res += `${single[hundred]} Hundred`;
    if (hundred > 0 && rest > 0) res += " and ";
    if (rest > 0) res += convertTwoDigits(rest);
    return res;
  }

  const crore = Math.floor(rounded / 10000000);
  const rem = rounded % 10000000;
  const lakh = Math.floor(rem / 100000);
  const rem2 = rem % 100000;
  const thousand = Math.floor(rem2 / 1000);
  const remainder = rem2 % 1000;

  const parts: string[] = [];
  if (crore > 0) parts.push(`${convertTwoDigits(crore)} Crore`);
  if (lakh > 0) parts.push(`${convertTwoDigits(lakh)} Lakh`);
  if (thousand > 0) parts.push(`${convertTwoDigits(thousand)} Thousand`);
  if (remainder > 0) parts.push(convertThreeDigits(remainder));

  return `Rupees ${parts.join(" ")} Only`;
}

// Default Resort Branding Presets with Green Valley Farmhouse as primary context
const defaultBrandingPresets: Record<string, ResortBranding> = {
  farmhouse: {
    name: "Green Valley Farmhouse & Eco Retreat",
    tradeName: "Green Valley Agro-Hospitality LLP",
    tagline: "Private Farmhouse Stays, Organic Dining & Celebrations",
    addressLine: "Survey No. 44/A, Shamirpet Lake Valley Road",
    cityStatePin: "Medchal-Malkajgiri District, Hyderabad, Telangana - 500078",
    stateCode: "36 (Telangana)",
    phone: "+91 98480 12345",
    email: "billing@greenvalleyretreat.com",
    gstin: "36AAACR8821K1Z2",
    fssai: "13622011000452",
    logoType: "treepine",
    bankName: "HDFC Bank, Shamirpet Branch",
    bankAccountNo: "50200088912345",
    bankIfsc: "HDFC0001429",
    upiVpa: "greenvalleyfarm@hdfcbank",
  },
  campsite: {
    name: "Wildwoods Glamping & Campsite",
    tradeName: "Wildwoods Outdoor Adventures Pvt Ltd",
    tagline: "Eco Glamping Domes, Campfires & Forest Trails",
    addressLine: "Ananthagiri Hills Forest Road, Near Kotpally Reservoir",
    cityStatePin: "Vikarabad, Telangana - 501101",
    stateCode: "36 (Telangana)",
    phone: "+91 94401 77654",
    email: "camp@wildwoodsretreat.in",
    gstin: "36AABBW9912L1Z9",
    fssai: "13623014000881",
    logoType: "tent",
    bankName: "State Bank of India, Vikarabad",
    bankAccountNo: "38920194412",
    bankIfsc: "SBIN0020194",
    upiVpa: "wildwoodscamp@sbi",
  },
  resort: {
    name: "Palm Oasis Luxury Resort",
    tradeName: "Palm Oasis Hospitality & Spas Ltd",
    tagline: "Waterfront Pool Villas, Spa & Destination Dining",
    addressLine: "Lake Front Promenade, Gandipet Main Road",
    cityStatePin: "Hyderabad, Telangana - 500075",
    stateCode: "36 (Telangana)",
    phone: "+91 40 6822 9000",
    email: "frontdesk@palmoasisresorts.com",
    gstin: "36AABCP4411M1Z3",
    fssai: "13621008000129",
    logoType: "compass",
    bankName: "ICICI Bank, Gandipet Branch",
    bankAccountNo: "004505019821",
    bankIfsc: "ICIC0000045",
    upiVpa: "palmoasis@icici",
  },
};

// Curated 28 real-world catalog items specifically for Green Valley Farmhouse & Eco Retreat
const initialCatalog: POSItem[] = [
  // 1. F&B Dining (SAC 996331, 5% GST)
  {
    id: "pos-1",
    name: "Farmhouse Telangana Non-Veg Thali",
    category: "food",
    price: 450,
    kidPrice: 225,
    isPerPerson: true,
    taxRate: 0.05,
    sacCode: "996331",
    available: true,
    description: "Natu kodi pulusu, mutton sukka, ragi mudde, steamed rice, rasam, curd & sweet",
    unit: "thali",
  },
  {
    id: "pos-2",
    name: "Royal South Indian Veg Thali",
    category: "food",
    price: 350,
    kidPrice: 175,
    isPerPerson: true,
    taxRate: 0.05,
    sacCode: "996331",
    available: true,
    description: "Pappu, sambar, 3 farm-fresh curries, poori, rice, curd, papad & payasam",
    unit: "thali",
  },
  {
    id: "pos-3",
    name: "Clay Oven Paneer Tikka Platter",
    category: "food",
    price: 320,
    taxRate: 0.05,
    sacCode: "996331",
    available: true,
    description: "Charred cottage cheese & broccoli with mint chutney (8 pcs)",
    unit: "platter",
  },
  {
    id: "pos-4",
    name: "Country Chicken (Natu Kodi) Pulao",
    category: "food",
    price: 420,
    kidPrice: 210,
    isPerPerson: true,
    taxRate: 0.05,
    sacCode: "996331",
    available: true,
    description: "Free-range country chicken slow cooked with spices, served with raita & salan",
    unit: "portion",
  },
  {
    id: "pos-5",
    name: "Telangana Mutton Sukka Fry + Parottas",
    category: "food",
    price: 480,
    taxRate: 0.05,
    sacCode: "996331",
    available: true,
    description: "Tender local goat meat pan-roasted in black pepper & curry leaves (2 Malabar parottas)",
    unit: "combo",
  },
  {
    id: "pos-6",
    name: "Farm-Fresh Kadai Paneer + Butter Naan Basket",
    category: "food",
    price: 340,
    taxRate: 0.05,
    sacCode: "996331",
    available: true,
    description: "Rich tomato-onion gravy with organic bell peppers and 3 butter tandoori naans",
    unit: "basket",
  },
  {
    id: "pos-7",
    name: "Dal Tadka & Steamed Jeera Basmati Rice",
    category: "food",
    price: 220,
    taxRate: 0.05,
    sacCode: "996331",
    available: true,
    description: "Yellow lentils tempered with ghee, cumin & roasted garlic with aromatic rice",
    unit: "bowl",
  },
  {
    id: "pos-8",
    name: "Crispy Farm Sweet Corn & Pepper Toss",
    category: "food",
    price: 190,
    taxRate: 0.05,
    sacCode: "996331",
    available: true,
    description: "Freshly harvested organic sweet corn wok-tossed with green chili and cilantro",
    unit: "portion",
  },
  {
    id: "pos-9",
    name: "Hot Gulab Jamun with Artisanal Rabdi",
    category: "food",
    price: 150,
    taxRate: 0.05,
    sacCode: "996331",
    available: true,
    description: "2 warm milk solid dumplings simmered in cardamom syrup over reduced saffron rabdi",
    unit: "plate",
  },

  // 2. Beverages & Cafe (SAC 996331, 5% GST)
  {
    id: "pos-10",
    name: "Fresh Tender Coconut Water",
    category: "beverage",
    price: 90,
    taxRate: 0.05,
    sacCode: "996331",
    available: true,
    description: "Freshly plucked from Green Valley estate coconut groves",
    unit: "pc",
  },
  {
    id: "pos-11",
    name: "Artisanal Filter Coffee (Brass Pot)",
    category: "beverage",
    price: 120,
    taxRate: 0.05,
    sacCode: "996331",
    available: true,
    description: "Traditional chicory blend slow dripped with farm milk (serves 2-3)",
    unit: "pot",
  },
  {
    id: "pos-12",
    name: "Shamirpet Special Masala Chai Flask",
    category: "beverage",
    price: 180,
    taxRate: 0.05,
    sacCode: "996331",
    available: true,
    description: "Brewed with fresh ginger, cardamom & lemongrass (serves 4 cups)",
    unit: "flask",
  },
  {
    id: "pos-13",
    name: "Farm Mint & Ginger Lemonade Pitcher",
    category: "beverage",
    price: 200,
    taxRate: 0.05,
    sacCode: "996331",
    available: true,
    description: "Chilled iced lemonade with crushed organic garden mint and black salt (serves 3)",
    unit: "pitcher",
  },
  {
    id: "pos-14",
    name: "Cold-Pressed Sugarcane Juice with Ginger",
    category: "beverage",
    price: 110,
    taxRate: 0.05,
    sacCode: "996331",
    available: true,
    description: "Hygienically crushed farm cane with lime, ginger and mint",
    unit: "glass",
  },
  {
    id: "pos-15",
    name: "Farm-Churned Spiced Buttermilk (Majiga)",
    category: "beverage",
    price: 140,
    taxRate: 0.05,
    sacCode: "996331",
    available: true,
    description: "Probiotic tempered chaas with mustard seeds, asafoetida and cilantro (1L jug)",
    unit: "jug",
  },
  {
    id: "pos-16",
    name: "Alphonso Mango & Yogurt Thickshake",
    category: "beverage",
    price: 160,
    taxRate: 0.05,
    sacCode: "996331",
    available: true,
    description: "Blended with pure fruit pulp from our Shamirpet orchard",
    unit: "glass",
  },

  // 3. BBQ & Campfire Kits (SAC 999699, 18% GST / SAC 4401 5% GST)
  {
    id: "pos-17",
    name: "Private Evening Bonfire Setup (15kg Neem Hardwood)",
    category: "bbq_campfire",
    price: 1200,
    taxRate: 0.18,
    sacCode: "999699",
    available: true,
    description: "Dedicated pit setup, fire safety ring, ignition kit and 2 hours of firewood",
    unit: "session",
  },
  {
    id: "pos-18",
    name: "Marinated BBQ Veg Grill Basket (Serves 4)",
    category: "bbq_campfire",
    price: 1400,
    taxRate: 0.18,
    sacCode: "999699",
    available: true,
    description: "Paneer, marinated mushrooms, sweet corn cobs, peppers, butter basting & skewers",
    unit: "kit",
  },
  {
    id: "pos-19",
    name: "Marinated BBQ Non-Veg Meat Basket (Serves 4)",
    category: "bbq_campfire",
    price: 1800,
    taxRate: 0.18,
    sacCode: "999699",
    available: true,
    description: "Tandoori chicken tikka, spiced chicken wings, fish fillets, basting butter & dips",
    unit: "kit",
  },
  {
    id: "pos-20",
    name: "Extra Seasoned Hardwood Firewood Bundle (15kg)",
    category: "bbq_campfire",
    price: 400,
    taxRate: 0.05,
    sacCode: "4401",
    available: true,
    description: "Dry cured subabul & neem wood logs for extended campfire warmth",
    unit: "bundle",
  },
  {
    id: "pos-21",
    name: "Marshmallow Roasting Skewer Kit",
    category: "bbq_campfire",
    price: 250,
    taxRate: 0.18,
    sacCode: "999699",
    available: true,
    description: "Pack of 12 giant vanilla marshmallows + 4 reusable stainless steel skewers",
    unit: "pack",
  },
  {
    id: "pos-22",
    name: "Chef-Assisted Live Villa Grill Master (2 Hours)",
    category: "bbq_campfire",
    price: 1500,
    taxRate: 0.18,
    sacCode: "999699",
    available: true,
    description: "Personal chef assigned to manage coal fire, grilling and hot lawn table service",
    unit: "service",
  },

  // 4. Adventure Activities & Rides (SAC 999699, 18% GST / SAC 9983, 18% GST)
  {
    id: "pos-23",
    name: "ATV Quad Bike Trail Ride (30 mins)",
    category: "activities",
    price: 800,
    taxRate: 0.18,
    sacCode: "999699",
    available: true,
    isPerPerson: true,
    description: "200cc all-terrain quad ride through mud track and wooded trail with instructor",
    unit: "rider",
  },
  {
    id: "pos-24",
    name: "Shamirpet Lake Kayaking Session (1 Hour)",
    category: "activities",
    price: 500,
    taxRate: 0.18,
    sacCode: "999699",
    available: true,
    isPerPerson: true,
    description: "Tandem or solo sit-on-top kayak with life vests and safety supervisor",
    unit: "session",
  },
  {
    id: "pos-25",
    name: "Guided Organic Farm Walk & Harvest Tour",
    category: "activities",
    price: 300,
    kidPrice: 150,
    taxRate: 0.05,
    sacCode: "9983",
    available: true,
    isPerPerson: true,
    description: "Agronomist-led tour of drip irrigation, hydroponics and pluck-your-own veggies",
    unit: "guest",
  },
  {
    id: "pos-26",
    name: "Traditional Bullock Cart Village Safari (45 mins)",
    category: "activities",
    price: 400,
    taxRate: 0.18,
    sacCode: "999699",
    available: true,
    description: "Decorated ox cart ride through scenic paddy fields & rustic village hamlets (up to 6 pax)",
    unit: "ride",
  },
  {
    id: "pos-27",
    name: "Target Archery & Air Rifle Range (30 shots)",
    category: "activities",
    price: 350,
    taxRate: 0.18,
    sacCode: "999699",
    available: true,
    isPerPerson: true,
    description: "Recurve bows & .177 air rifles with bullseye target boards and safety gear",
    unit: "session",
  },

  // 5. Farm-to-Table Fresh Produce & Merchandise
  {
    id: "pos-28",
    name: "Farm-Fresh Organic Vegetable Hamper (5kg)",
    category: "farm_produce",
    price: 450,
    taxRate: 0.0,
    sacCode: "0709",
    available: true,
    description: "Harvested today: spinach, bottle gourd, tomatoes, ridge gourd, green chilies",
    unit: "hamper",
  },
  // 6. Curated Per-Person Resort & Campsite Headcount Packages (All in INR ₹)
  {
    id: "pos-29",
    name: "Farmhouse Breakfast & Hi-Tea Buffet",
    category: "food",
    price: 250,
    kidPrice: 125,
    isPerPerson: true,
    taxRate: 0.05,
    sacCode: "996331",
    available: true,
    description: "Unlimited hot idli, vada, dosa, upma, poori, seasonal fruits, fresh juice & filter coffee",
    unit: "per person",
  },
  {
    id: "pos-30",
    name: "Campfire & BBQ Dinner Feast Pass",
    category: "bbq_campfire",
    price: 800,
    kidPrice: 400,
    isPerPerson: true,
    taxRate: 0.18,
    sacCode: "999699",
    available: true,
    description: "Evening private bonfire pit, marinated grill skewers, dinner buffet & acoustic campfire music",
    unit: "per person",
  },
  {
    id: "pos-31",
    name: "Day-Picnic & Swimming Pool Day Pass",
    category: "activities",
    price: 600,
    kidPrice: 300,
    isPerPerson: true,
    taxRate: 0.18,
    sacCode: "999699",
    available: true,
    description: "10 AM - 6 PM full retreat access, swimming pool, rain dance, lunch thali & hi-tea snacks",
    unit: "per person",
  },
];

// Active guest profiles for Green Valley Farmhouse with verified adult, kid & pet headcounts
const initialGuestProfiles: POSGuestProfile[] = [
  {
    id: "gst-1",
    roomOrPitch: "Heritage Pool Villa 1",
    guestName: "Aditya Verma",
    guestPhone: "+91 98480 12345",
    folio: "FOL-901",
    checkInDate: "11 Sep 2026",
    adultsCount: 2,
    kidsCount: 1,
    petsCount: 1,
    petType: "Golden Retriever",
    isCorporate: false,
    type: "in_house",
  },
  {
    id: "gst-2",
    roomOrPitch: "Heritage Villa 2",
    guestName: "Sneha Reddy",
    guestPhone: "+91 98765 43210",
    folio: "FOL-902",
    checkInDate: "12 Sep 2026",
    adultsCount: 4,
    kidsCount: 2,
    petsCount: 0,
    isCorporate: false,
    type: "in_house",
  },
  {
    id: "gst-3",
    roomOrPitch: "Grand Royal Lawn & Pavilion",
    guestName: "Vikram Malhotra (TechCorp)",
    guestPhone: "+91 98200 99881",
    folio: "FOL-903",
    checkInDate: "12 Sep 2026",
    adultsCount: 25,
    kidsCount: 0,
    petsCount: 0,
    isCorporate: true,
    companyName: "TechCorp Solutions India Pvt Ltd",
    companyGstin: "36AAACT9482P1Z6",
    type: "in_house",
  },
  {
    id: "gst-4",
    roomOrPitch: "Luxury Glamping Dome 01",
    guestName: "Rohan Mehra",
    guestPhone: "+91 94401 77654",
    folio: "FOL-904",
    checkInDate: "12 Sep 2026",
    adultsCount: 2,
    kidsCount: 0,
    petsCount: 0,
    isCorporate: false,
    type: "in_house",
  },
  {
    id: "gst-5",
    roomOrPitch: "Family Farm Cottage B",
    guestName: "Rajesh Kumar",
    guestPhone: "+91 97000 44551",
    folio: "FOL-905",
    checkInDate: "13 Sep 2026",
    adultsCount: 3,
    kidsCount: 2,
    petsCount: 1,
    petType: "Beagle",
    isCorporate: false,
    type: "in_house",
  },
  {
    id: "gst-6",
    roomOrPitch: "Eco Campsite Pitch C4",
    guestName: "Vikram Kulkarni",
    guestPhone: "+91 91234 56780",
    folio: "FOL-906",
    checkInDate: "13 Sep 2026",
    adultsCount: 2,
    kidsCount: 1,
    petsCount: 0,
    isCorporate: false,
    type: "in_house",
  },
  {
    id: "gst-7",
    roomOrPitch: "Dining Table 04 (Lawn Gazebo)",
    guestName: "Pooja Hegde & Family",
    guestPhone: "+91 98850 77123",
    folio: "WALK-401",
    checkInDate: "13 Sep 2026",
    adultsCount: 4,
    kidsCount: 2,
    petsCount: 0,
    isCorporate: false,
    type: "walk_in_dining",
  },
  {
    id: "gst-8",
    roomOrPitch: "Poolside Cabana 2",
    guestName: "Anand Sundaram (Day Picnic)",
    guestPhone: "+91 97011 22334",
    folio: "DP-802",
    checkInDate: "13 Sep 2026",
    adultsCount: 6,
    kidsCount: 3,
    petsCount: 0,
    isCorporate: false,
    type: "day_picnic",
  },
];

// Real-time physical units & outdoor camps for Green Valley Farmhouse & Eco Retreat
const initialPOSRoomUnits: POSRoomUnit[] = [
  {
    id: "unit-1",
    unitNumber: "Tent T-01",
    name: "Swiss Luxury Canvas Tent",
    category: "tent",
    status: "vacant",
    ratePerDay: 2800,
    ratePerHour: 350,
    minHours: 3,
    adultsCapacity: 3,
    kidsCapacity: 2,
    petFriendly: true,
    petFee: 500,
    amenities: ["Attached Bath", "Private Porch", "Electric Fan", "Campfire Pit Access"],
    standardCheckInTime: "02:00 PM",
    standardCheckOutTime: "11:00 AM",
    keyDoorCode: "🔑 T-101",
    imageUrl: "https://images.unsplash.com/photo-1506535772317-9fca70e930c6?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "unit-2",
    unitNumber: "Tent T-04",
    name: "Meadow Bell Tent Deluxe",
    category: "tent",
    status: "occupied",
    ratePerDay: 2400,
    ratePerHour: 300,
    minHours: 3,
    adultsCapacity: 2,
    kidsCapacity: 1,
    petFriendly: false,
    petFee: 0,
    amenities: ["Shared Bathhouse", "Queen Bed", "Solar Lanterns"],
    currentGuestName: "Rahul Sharma",
    currentGuestPhone: "+91 98111 22334",
    currentGuestFolio: "FOL-840",
    expectedCheckoutTime: "11:00 AM Today",
    standardCheckInTime: "02:00 PM",
    standardCheckOutTime: "11:00 AM",
    keyDoorCode: "🔑 T-104",
    imageUrl: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "unit-3",
    unitNumber: "Cottage C-02",
    name: "Orchard Family Mango Cottage",
    category: "cottage",
    status: "ready_to_vacant",
    ratePerDay: 4500,
    ratePerHour: 550,
    minHours: 3,
    adultsCapacity: 4,
    kidsCapacity: 2,
    petFriendly: true,
    petFee: 500,
    amenities: ["Air Conditioned", "Private Garden Patio", "Kitchenette", "Hot Geyser"],
    currentGuestName: "Rajesh Kumar & Family",
    currentGuestPhone: "+91 97000 44551",
    currentGuestFolio: "FOL-905",
    expectedCheckoutTime: "11:30 AM Today (Departing)",
    standardCheckInTime: "02:00 PM",
    standardCheckOutTime: "11:00 AM",
    keyDoorCode: "🔑 4281#",
    imageUrl: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "unit-4",
    unitNumber: "Villa V-01",
    name: "Heritage Teak Private Pool Villa",
    category: "villa",
    status: "vacant",
    ratePerDay: 7500,
    ratePerHour: 950,
    minHours: 4,
    adultsCapacity: 6,
    kidsCapacity: 4,
    petFriendly: true,
    petFee: 750,
    amenities: ["Private Plunge Pool", "2 King Suites", "Lawn Gazebo", "Butler Call Bell"],
    standardCheckInTime: "02:00 PM",
    standardCheckOutTime: "11:00 AM",
    keyDoorCode: "🔑 8820#",
    imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "unit-5",
    unitNumber: "Dome D-03",
    name: "Lakeside Geodesic Glamping Dome",
    category: "glamping_dome",
    status: "vacant",
    ratePerDay: 3800,
    ratePerHour: 480,
    minHours: 3,
    adultsCapacity: 2,
    kidsCapacity: 1,
    petFriendly: false,
    petFee: 0,
    amenities: ["Stargazing Skylight", "AC Climate Control", "Attached Luxury Bath", "Deck Sunbed"],
    standardCheckInTime: "02:00 PM",
    standardCheckOutTime: "11:00 AM",
    keyDoorCode: "🔑 D-303",
    imageUrl: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "unit-6",
    unitNumber: "Pitch P-05",
    name: "Alpine Pine-Woods Pitch (BYOT)",
    category: "pitch",
    status: "vacant",
    ratePerDay: 1200,
    ratePerHour: 180,
    minHours: 3,
    adultsCapacity: 4,
    kidsCapacity: 2,
    petFriendly: true,
    petFee: 300,
    amenities: ["Level Grass Ground", "Campfire Pit", "Power Socket", "Water Point"],
    standardCheckInTime: "01:00 PM",
    standardCheckOutTime: "11:00 AM",
    keyDoorCode: "P-05 Ground",
    imageUrl: "https://images.unsplash.com/photo-1496545672447-f699b503d270?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "unit-7",
    unitNumber: "Cottage C-01",
    name: "Lakeview Teak Cottage",
    category: "cottage",
    status: "dirty",
    ratePerDay: 4200,
    ratePerHour: 500,
    minHours: 3,
    adultsCapacity: 3,
    kidsCapacity: 2,
    petFriendly: false,
    petFee: 0,
    amenities: ["Lakeside Balcony", "Air Conditioned", "Attached Bath"],
    expectedCheckoutTime: "Departed (Housekeeping In-Progress)",
    standardCheckInTime: "02:00 PM",
    standardCheckOutTime: "11:00 AM",
    keyDoorCode: "🔑 1109#",
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "unit-8",
    unitNumber: "Suite S-01",
    name: "Executive Farmhouse Jacuzzi Suite",
    category: "suite",
    status: "vacant",
    ratePerDay: 6200,
    ratePerHour: 750,
    minHours: 3,
    adultsCapacity: 2,
    kidsCapacity: 2,
    petFriendly: false,
    petFee: 0,
    amenities: ["Private Jacuzzi", "King Bed", "Coffee Machine", "Veranda View"],
    standardCheckInTime: "02:00 PM",
    standardCheckOutTime: "11:00 AM",
    keyDoorCode: "🔑 9090#",
    imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
  },
];

// Curated Per-Head Packages for Quick Billing in Indian Rupees (INR ₹)
const headcountPackages = [
  {
    id: "pkg-1",
    name: "Royal South Indian Veg Thali",
    category: "food" as POSCategory,
    adultRate: 350,
    kidRate: 175,
    sacCode: "996331",
    taxRate: 0.05,
    description: "Unlimited Pappu, sambar, 3 farm curries, poori, rice, curd, papad & payasam",
    badge: "Bestseller Lunch",
  },
  {
    id: "pkg-2",
    name: "Farmhouse Telangana Non-Veg Thali",
    category: "food" as POSCategory,
    adultRate: 450,
    kidRate: 225,
    sacCode: "996331",
    taxRate: 0.05,
    description: "Natu kodi pulusu, mutton sukka, ragi mudde, steamed rice & payasam",
    badge: "Chef Special",
  },
  {
    id: "pkg-3",
    name: "Farmhouse Breakfast & Hi-Tea Buffet",
    category: "food" as POSCategory,
    adultRate: 250,
    kidRate: 125,
    sacCode: "996331",
    taxRate: 0.05,
    description: "Unlimited idli, vada, dosa, upma, poori, seasonal fruits, fresh juice & filter coffee",
    badge: "Buffet Spread",
  },
  {
    id: "pkg-4",
    name: "Campfire & BBQ Dinner Feast Pass",
    category: "bbq_campfire" as POSCategory,
    adultRate: 800,
    kidRate: 400,
    sacCode: "999699",
    taxRate: 0.18,
    description: "Evening bonfire pit, marinated skewers grill, dinner buffet & acoustic campfire music",
    badge: "Night Experience",
  },
  {
    id: "pkg-5",
    name: "Day-Picnic & Swimming Pool Day Pass",
    category: "activities" as POSCategory,
    adultRate: 600,
    kidRate: 300,
    sacCode: "999699",
    taxRate: 0.18,
    description: "10 AM - 6 PM access, swimming pool, rain dance, lunch thali & hi-tea snacks",
    badge: "Full Day Pass",
  },
  {
    id: "pkg-6",
    name: "Guided Farm Walk & Harvest Tour",
    category: "activities" as POSCategory,
    adultRate: 300,
    kidRate: 150,
    sacCode: "9983",
    taxRate: 0.05,
    description: "Agronomist-led tour of drip irrigation, hydroponics, tractor ride & harvest basket",
    badge: "Eco Tour",
  },
];

export default function POSPage() {
  const { t } = useTranslation();

  // Catalog and search state
  const [catalogItems, setCatalogItems] = useState<POSItem[]>(initialCatalog);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Cart state
  const [cart, setCart] = useState<{ item: POSItem; quantity: number }[]>([]);

  // Registered Guest Profiles with Headcount Tracking (Adults & Kids)
  const [registeredGuests, setRegisteredGuests] = useState<POSGuestProfile[]>(initialGuestProfiles);
  const [selectedGuestId, setSelectedGuestId] = useState<string>("walk_in");

  // Invoicing target: Charge to in-house room folio vs direct counter settlement
  const [chargeTarget, setChargeTarget] = useState<"room" | "direct">("direct");
  const [selectedRoom, setSelectedRoom] = useState<string>(initialGuestProfiles[0].roomOrPitch);
  const [guestName, setGuestName] = useState<string>("Walk-In Guest");
  const [guestPhone, setGuestPhone] = useState<string>("");

  // Main POS View: "catalog" (F&B Dining & Activities) vs "rooms" (Real-Time Room & Camp Availability)
  const [posMainTab, setPosMainTab] = useState<"catalog" | "rooms">("catalog");

  // Room & Camp Inventory & Availability State
  const [roomUnits, setRoomUnits] = useState<POSRoomUnit[]>(initialPOSRoomUnits);
  const [roomCategoryFilter, setRoomCategoryFilter] = useState<string>("all");
  const [roomStatusFilter, setRoomStatusFilter] = useState<string>("all");
  const [roomSearchQuery, setRoomSearchQuery] = useState<string>("");

  // Guest Headcount (Number of Guests / Adults, Kids, and Pets) - default 1 Adult, 0 Kids, 0 Pets for clean start
  const [adultsCount, setAdultsCount] = useState<number>(1);
  const [kidsCount, setKidsCount] = useState<number>(0);
  const [petsCount, setPetsCount] = useState<number>(0);

  // Handler to update adult count and auto-sync per-person/activity cart items
  const handleUpdateAdults = (newAdults: number) => {
    if (newAdults < 1) return;
    const prevAdults = adultsCount;
    setAdultsCount(newAdults);

    // Auto-sync items in cart that are per-person (e.g. ATV ride, kayaking, thali, pass)
    setCart((prev) =>
      prev.map((c) => {
        if (c.item.isPerPerson && (c.quantity === prevAdults || c.quantity === 1)) {
          return { ...c, quantity: newAdults };
        }
        return c;
      })
    );
  };

  // Handler to update kid count and auto-sync kid pass items in cart
  const handleUpdateKids = (newKids: number) => {
    if (newKids < 0) return;
    const prevKids = kidsCount;
    setKidsCount(newKids);

    setCart((prev) =>
      prev.map((c) => {
        if (c.item.id.endsWith("-kid") && (c.quantity === prevKids || c.quantity === 1)) {
          return { ...c, quantity: Math.max(1, newKids) };
        }
        return c;
      })
    );
  };

  // Group Headcount Feasts & Passes Collapsible Banner
  const [showHeadcountPackages, setShowHeadcountPackages] = useState<boolean>(false);

  // Add / Register Guest Modal State
  const [isAddGuestModalOpen, setIsAddGuestModalOpen] = useState<boolean>(false);
  const [newGuestName, setNewGuestName] = useState<string>("");
  const [newGuestPhone, setNewGuestPhone] = useState<string>("");
  const [newGuestEmail, setNewGuestEmail] = useState<string>("");
  const [newGuestType, setNewGuestType] = useState<"in_house" | "walk_in_dining" | "day_picnic">("in_house");
  const [newGuestRoomOrTable, setNewGuestRoomOrTable] = useState<string>("");
  const [newGuestAdults, setNewGuestAdults] = useState<number>(2);
  const [newGuestKids, setNewGuestKids] = useState<number>(0);
  const [newGuestPets, setNewGuestPets] = useState<number>(0);
  const [newGuestIsCorporate, setNewGuestIsCorporate] = useState<boolean>(false);
  const [newGuestCompany, setNewGuestCompany] = useState<string>("");
  const [newGuestGstin, setNewGuestGstin] = useState<string>("");

  // Walk-in Stay Reservation Modal State
  const [isRoomBookingModalOpen, setIsRoomBookingModalOpen] = useState<boolean>(false);
  const [bookingUnit, setBookingUnit] = useState<POSRoomUnit | null>(null);
  const [stayDurationType, setStayDurationType] = useState<"per_day" | "per_hour">("per_day");
  const [stayNights, setStayNights] = useState<number>(1);
  const [stayHours, setStayHours] = useState<number>(4);
  const [bookingGuestName, setBookingGuestName] = useState<string>("");
  const [bookingGuestPhone, setBookingGuestPhone] = useState<string>("");
  const [bookingAdults, setBookingAdults] = useState<number>(2);
  const [bookingKids, setBookingKids] = useState<number>(0);
  const [bookingPets, setBookingPets] = useState<number>(0);
  const [includePetFee, setIncludePetFee] = useState<boolean>(true);
  const [bookingCheckInTime, setBookingCheckInTime] = useState<string>("Today, 02:00 PM");
  const [bookingCheckOutTime, setBookingCheckOutTime] = useState<string>("Tomorrow, 11:00 AM");
  const [activeStayDetails, setActiveStayDetails] = useState<{
    unitName: string;
    duration: string;
    checkIn: string;
    checkOut: string;
    type: "per_day" | "per_hour";
  } | null>(null);

  // Corporate B2B details
  const [isB2B, setIsB2B] = useState<boolean>(false);
  const [b2bCompanyName, setB2bCompanyName] = useState<string>("");
  const [b2bCompanyGstin, setB2bCompanyGstin] = useState<string>("");
  const [b2bAddress, setB2bAddress] = useState<string>("HITEC City, Hyderabad, Telangana - 500081");

  // Payment Settlement states
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cash" | "split">("upi");

  // Split Tender State: Multi-instrument tracking
  const [splitCash, setSplitCash] = useState<number>(0);
  const [splitUpi, setSplitUpi] = useState<number>(0);
  const [splitCard, setSplitCard] = useState<number>(0);
  const [splitUpiRef, setSplitUpiRef] = useState<string>("");
  const [splitCardLast4, setSplitCardLast4] = useState<string>("");

  // Discounts & custom charge
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Custom Item Modal
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [customItemName, setCustomItemName] = useState<string>("");
  const [customItemCategory, setCustomItemCategory] = useState<POSCategory>("food");
  const [customPricingMode, setCustomPricingMode] = useState<"flat" | "per_person">("flat");
  const [customItemPrice, setCustomItemPrice] = useState<number>(200); // Adult price in INR
  const [customItemKidPrice, setCustomItemKidPrice] = useState<number>(100); // Kid price in INR
  const [customItemTaxRate, setCustomItemTaxRate] = useState<number>(0.05);
  const [customItemSac, setCustomItemSac] = useState<string>("996331");
  const [customItemUnit, setCustomItemUnit] = useState<string>("service");

  // Resort Branding State (Defaults to Green Valley Farmhouse in INR)
  const [branding, setBranding] = useState<ResortBranding>(defaultBrandingPresets.farmhouse);
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState<boolean>(false);

  // Invoice display format in modal: standard A4 vs 80mm thermal slip
  const [invoiceViewFormat, setInvoiceViewFormat] = useState<"standard" | "thermal">("standard");

  // Active generated invoice for modal
  const [activeInvoice, setActiveInvoice] = useState<CompletedInvoice | null>(null);

  // Invoice History
  const [invoiceHistory, setInvoiceHistory] = useState<CompletedInvoice[]>([
    {
      invoiceNumber: "GVF/2026-27/0819",
      date: "12 Sep 2026, 08:30 PM",
      guestName: "Aditya Verma",
      guestPhone: "+91 98480 12345",
      adultsCount: 2,
      kidsCount: 1,
      roomOrPitch: "Heritage Pool Villa 1",
      items: [
        { name: "Private Evening Bonfire Setup", quantity: 1, price: 1200, sacCode: "999699", taxRate: 0.18, unit: "session" },
        { name: "Marinated BBQ Non-Veg Meat Basket", quantity: 1, price: 1800, sacCode: "999699", taxRate: 0.18, unit: "kit" },
        { name: "Farm Mint & Ginger Lemonade Pitcher", quantity: 1, price: 200, sacCode: "996331", taxRate: 0.05, unit: "pitcher" },
      ],
      subtotal: 3200,
      discount: 0,
      tax: 550,
      grandTotal: 3750,
      currency: "INR (₹)",
      paymentMethod: "Charge to Folio (FOL-901)",
      chargeTarget: "room",
      brandingSnapshot: defaultBrandingPresets.farmhouse,
      taxSummary: [
        { sacCode: "996331", taxableValue: 200, cgstRate: 0.025, cgstAmount: 5, sgstRate: 0.025, sgstAmount: 5, totalTax: 10 },
        { sacCode: "999699", taxableValue: 3000, cgstRate: 0.09, cgstAmount: 270, sgstRate: 0.09, sgstAmount: 270, totalTax: 540 },
      ],
      amountInWords: "Rupees Three Thousand Seven Hundred Fifty Only",
      cashierName: "Ravi Kumar (Front-Desk Lead)",
    },
  ]);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  // Cashier Shift & Drawer Register State
  const [cashierShift, setCashierShift] = useState<CashierShift>({
    shiftId: "SH-GVF-041",
    cashierName: "Ravi Kumar (Front-Desk Lead)",
    openedAt: "13 Sep 2026, 07:00 AM",
    initialFloat: 2000,
    invoicesCount: 1,
    totalGross: 3750,
    cashCollected: 0,
    upiCollected: 0,
    cardCollected: 0,
    folioCharged: 3750,
    totalGst: 550,
  });
  const [isShiftModalOpen, setIsShiftModalOpen] = useState<boolean>(false);

  // Helper when switching guest selection
  const handleSelectGuest = (guestId: string) => {
    setSelectedGuestId(guestId);
    const found = registeredGuests.find((g) => g.id === guestId);
    if (found) {
      setSelectedRoom(found.roomOrPitch);
      setGuestName(found.guestName);
      setGuestPhone(found.guestPhone);
      handleUpdateAdults(found.adultsCount);
      handleUpdateKids(found.kidsCount);
      setPetsCount(found.petsCount || 0);
      setChargeTarget(found.type === "in_house" ? "room" : "direct");
      if (found.isCorporate) {
        setIsB2B(true);
        setB2bCompanyName(found.companyName || "");
        setB2bCompanyGstin(found.companyGstin || "");
      } else {
        setIsB2B(false);
      }
    }
  };

  // Helper when room selection changes
  const handleRoomChange = (roomName: string) => {
    setSelectedRoom(roomName);
    const found = registeredGuests.find((r) => r.roomOrPitch === roomName);
    if (found) {
      setSelectedGuestId(found.id);
      setGuestName(found.guestName);
      setGuestPhone(found.guestPhone);
      handleUpdateAdults(found.adultsCount);
      handleUpdateKids(found.kidsCount);
      setPetsCount(found.petsCount || 0);
      if (found.isCorporate) {
        setIsB2B(true);
        setB2bCompanyName(found.companyName || "");
        setB2bCompanyGstin(found.companyGstin || "");
      } else {
        setIsB2B(false);
      }
    }
  };

  // Helper when switching between Direct Walk-In and In-House Room
  const handleSwitchChargeTarget = (target: "room" | "direct") => {
    setChargeTarget(target);
    if (target === "room") {
      const activeRoom = registeredGuests.find((g) => g.type === "in_house") || registeredGuests[0];
      if (activeRoom) {
        setSelectedRoom(activeRoom.roomOrPitch);
        setSelectedGuestId(activeRoom.id);
        setGuestName(activeRoom.guestName);
        setGuestPhone(activeRoom.guestPhone);
        handleUpdateAdults(activeRoom.adultsCount || 2);
        handleUpdateKids(activeRoom.kidsCount || 0);
        setPetsCount(activeRoom.petsCount || 0);
        if (activeRoom.isCorporate) {
          setIsB2B(true);
          setB2bCompanyName(activeRoom.companyName || "");
          setB2bCompanyGstin(activeRoom.companyGstin || "");
        } else {
          setIsB2B(false);
        }
      }
    } else {
      setSelectedGuestId("walk_in");
      setGuestName("Walk-In Guest");
      setGuestPhone("");
      setSelectedRoom("");
      setIsB2B(false);
    }
  };

  // Handler to register & save a new guest in POS
  const handleSaveNewGuest = () => {
    if (!newGuestName.trim()) {
      alert("Please enter guest name.");
      return;
    }
    const prefix = newGuestType === "in_house" ? "FOL" : newGuestType === "day_picnic" ? "DP" : "WALK";
    const newId = `gst-${Date.now()}`;
    const newFolio = `${prefix}-${Math.floor(100 + Math.random() * 900)}`;

    const created: POSGuestProfile = {
      id: newId,
      guestName: newGuestName.trim(),
      guestPhone: newGuestPhone.trim() || "+91 98480 00000",
      email: newGuestEmail.trim() || undefined,
      roomOrPitch: newGuestRoomOrTable.trim() || (newGuestType === "in_house" ? "Executive Cottage" : "Dining Table 1"),
      folio: newFolio,
      adultsCount: Math.max(1, newGuestAdults),
      kidsCount: Math.max(0, newGuestKids),
      petsCount: Math.max(0, newGuestPets),
      isCorporate: newGuestIsCorporate,
      companyName: newGuestCompany.trim() || undefined,
      companyGstin: newGuestGstin.trim() || undefined,
      checkInDate: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      type: newGuestType,
    };

    setRegisteredGuests((prev) => [created, ...prev]);
    setSelectedGuestId(newId);
    setSelectedRoom(created.roomOrPitch);
    setGuestName(created.guestName);
    setGuestPhone(created.guestPhone);
    setAdultsCount(created.adultsCount);
    setKidsCount(created.kidsCount);
    setPetsCount(created.petsCount);
    setChargeTarget(created.type === "in_house" ? "room" : "direct");

    if (created.isCorporate && created.companyName) {
      setIsB2B(true);
      setB2bCompanyName(created.companyName);
      setB2bCompanyGstin(created.companyGstin || "");
    } else {
      setIsB2B(false);
    }

    setIsAddGuestModalOpen(false);
    // Reset form
    setNewGuestName("");
    setNewGuestPhone("");
    setNewGuestEmail("");
    setNewGuestRoomOrTable("");
    setNewGuestAdults(2);
    setNewGuestKids(0);
    setNewGuestPets(0);
    setNewGuestIsCorporate(false);
    setNewGuestCompany("");
    setNewGuestGstin("");
  };

  // Open walk-in room booking modal for any room/camp
  const handleOpenRoomBooking = (unit: POSRoomUnit) => {
    setBookingUnit(unit);
    setStayDurationType("per_day");
    setStayNights(1);
    setStayHours(unit.minHours || 3);
    setBookingGuestName(guestName === "Aditya Verma" ? "" : guestName);
    setBookingGuestPhone(guestPhone === "+91 98480 12345" ? "" : guestPhone);
    setBookingAdults(adultsCount > 0 ? adultsCount : 2);
    setBookingKids(kidsCount);
    setBookingPets(petsCount);
    setIncludePetFee(unit.petFriendly && petsCount > 0);
    setBookingCheckInTime("Today, 02:00 PM");
    setBookingCheckOutTime("Tomorrow, 11:00 AM");
    setIsRoomBookingModalOpen(true);
  };

  // Update check-in and departure calculation when stay duration type or hours change
  const handleDurationTypeChange = (type: "per_day" | "per_hour", nightsVal?: number, hoursVal?: number) => {
    setStayDurationType(type);
    const nights = nightsVal !== undefined ? nightsVal : stayNights;
    const hours = hoursVal !== undefined ? hoursVal : stayHours;

    if (type === "per_day") {
      setBookingCheckInTime("Today, 02:00 PM");
      setBookingCheckOutTime(`${nights === 1 ? "Tomorrow" : `In ${nights} Days`}, 11:00 AM`);
    } else {
      const now = new Date();
      const checkInStr = `Today, ${now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
      const departure = new Date(now.getTime() + hours * 60 * 60 * 1000);
      const checkOutStr = `Today, ${departure.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
      setBookingCheckInTime(checkInStr);
      setBookingCheckOutTime(checkOutStr);
    }
  };

  // Confirm Walk-in Room Booking and Add to Cart & Folio
  const handleConfirmRoomBooking = () => {
    if (!bookingUnit) return;
    const finalGuestName = bookingGuestName.trim() || "Walk-In Stay Guest";
    const finalGuestPhone = bookingGuestPhone.trim() || "+91 98480 00000";

    const basePrice = stayDurationType === "per_day"
      ? bookingUnit.ratePerDay * stayNights
      : bookingUnit.ratePerHour * stayHours;

    const durationLabel = stayDurationType === "per_day"
      ? `${stayNights} Night(s) Stay`
      : `${stayHours} Hours Flex Stay`;

    const stayItem: POSItem = {
      id: `stay-${bookingUnit.id}-${Date.now()}`,
      name: `${bookingUnit.name} (${bookingUnit.unitNumber}) - ${durationLabel}`,
      category: "accommodation",
      price: basePrice,
      taxRate: 0.12, // 12% GST on room accommodation
      sacCode: "996311",
      available: true,
      unit: stayDurationType === "per_day" ? `${stayNights} nt` : `${stayHours} hrs`,
      description: `Check-in: ${bookingCheckInTime} | Check-out: ${bookingCheckOutTime}`,
    };

    const newCartItems = [...cart, { item: stayItem, quantity: 1 }];

    // If pets are included and unit is pet friendly
    if (includePetFee && bookingPets > 0 && bookingUnit.petFriendly && bookingUnit.petFee > 0) {
      const petItem: POSItem = {
        id: `pet-fee-${Date.now()}`,
        name: `Pet Stay & Sanitation Fee (${bookingPets} Pet${bookingPets > 1 ? "s" : ""})`,
        category: "other",
        price: bookingUnit.petFee * bookingPets,
        taxRate: 0.18,
        sacCode: "9997",
        available: true,
        unit: `${bookingPets} pet`,
        description: `Deep-clean sanitization fee for ${bookingUnit.unitNumber}`,
      };
      newCartItems.push({ item: petItem, quantity: 1 });
    }

    setCart(newCartItems);

    // Register / update guest profile
    const newFolio = `FOL-${Math.floor(100 + Math.random() * 900)}`;
    const newProfile: POSGuestProfile = {
      id: `gst-${Date.now()}`,
      guestName: finalGuestName,
      guestPhone: finalGuestPhone,
      roomOrPitch: `${bookingUnit.name} (${bookingUnit.unitNumber})`,
      folio: newFolio,
      adultsCount: bookingAdults,
      kidsCount: bookingKids,
      petsCount: bookingPets,
      isCorporate: false,
      type: "in_house",
      stayType: stayDurationType,
      stayDuration: stayDurationType === "per_day" ? stayNights : stayHours,
      checkInTime: bookingCheckInTime,
      checkOutTime: bookingCheckOutTime,
      unitId: bookingUnit.id,
      checkInDate: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    };

    setRegisteredGuests((prev) => [newProfile, ...prev]);
    setSelectedGuestId(newProfile.id);
    setSelectedRoom(newProfile.roomOrPitch);
    setGuestName(newProfile.guestName);
    setGuestPhone(newProfile.guestPhone);
    setAdultsCount(bookingAdults);
    setKidsCount(bookingKids);
    setPetsCount(bookingPets);
    setChargeTarget("room");

    setActiveStayDetails({
      unitName: `${bookingUnit.name} (${bookingUnit.unitNumber})`,
      duration: durationLabel,
      checkIn: bookingCheckInTime,
      checkOut: bookingCheckOutTime,
      type: stayDurationType,
    });

    // Mark unit as occupied in roomUnits
    setRoomUnits((prev) =>
      prev.map((u) =>
        u.id === bookingUnit.id
          ? {
              ...u,
              status: "occupied" as POSUnitStatus,
              currentGuestName: finalGuestName,
              currentGuestPhone: finalGuestPhone,
              currentGuestFolio: newFolio,
              expectedCheckoutTime: bookingCheckOutTime,
            }
          : u
      )
    );

    setIsRoomBookingModalOpen(false);
  };

  // Mark room clean & vacant
  const handleMarkUnitClean = (unitId: string) => {
    setRoomUnits((prev) =>
      prev.map((u) =>
        u.id === unitId
          ? {
              ...u,
              status: "vacant" as POSUnitStatus,
              currentGuestName: undefined,
              currentGuestPhone: undefined,
              currentGuestFolio: undefined,
              expectedCheckoutTime: undefined,
            }
          : u
      )
    );
  };

  // Handler to charge a per-head package (Adults & Kids breakdown in INR ₹)
  const handleChargeHeadcountPackage = (pkg: (typeof headcountPackages)[0]) => {
    if (adultsCount <= 0 && kidsCount <= 0) {
      alert("Please specify at least 1 adult or kid guest.");
      return;
    }

    const itemsToAdd: { item: POSItem; quantity: number }[] = [];

    if (adultsCount > 0) {
      itemsToAdd.push({
        item: {
          id: `headcount-adult-${pkg.id}-${Date.now()}`,
          name: `${pkg.name} (Adult Package)`,
          category: pkg.category,
          price: pkg.adultRate,
          taxRate: pkg.taxRate,
          sacCode: pkg.sacCode,
          available: true,
          unit: `${adultsCount} Adult${adultsCount > 1 ? "s" : ""}`,
          isPerPerson: true,
        },
        quantity: adultsCount,
      });
    }

    if (kidsCount > 0) {
      itemsToAdd.push({
        item: {
          id: `headcount-kid-${pkg.id}-${Date.now()}`,
          name: `${pkg.name} (Kids Package)`,
          category: pkg.category,
          price: pkg.kidRate,
          taxRate: pkg.taxRate,
          sacCode: pkg.sacCode,
          available: true,
          unit: `${kidsCount} Kid${kidsCount > 1 ? "s" : ""}`,
          isPerPerson: true,
        },
        quantity: kidsCount,
      });
    }

    setCart((prev) => [...prev, ...itemsToAdd]);
  };

  // Handler to charge catalog item on a per-head (Adults & Kids) basis
  const handleChargeItemForGuests = (item: POSItem) => {
    if (adultsCount <= 0 && kidsCount <= 0) {
      alert("Please specify at least 1 adult or kid guest.");
      return;
    }

    setCart((prev) => {
      let updated = [...prev];

      // Add or update adult portion using the real item.id so card counters sync
      if (adultsCount > 0) {
        const adultItemIndex = updated.findIndex((c) => c.item.id === item.id);
        if (adultItemIndex >= 0) {
          updated[adultItemIndex] = {
            ...updated[adultItemIndex],
            quantity: adultsCount,
          };
        } else {
          updated.push({
            item,
            quantity: adultsCount,
          });
        }
      }

      // If kids are present and item has a kid price or is per-person, add or update kid line
      if (kidsCount > 0 && (item.kidPrice !== undefined || item.isPerPerson)) {
        const kidPrice = item.kidPrice !== undefined ? item.kidPrice : Math.round(item.price * 0.5);
        const kidItemId = `${item.id}-kid`;
        const kidItemIndex = updated.findIndex((c) => c.item.id === kidItemId);

        const kidItem: POSItem = {
          ...item,
          id: kidItemId,
          name: `${item.name} (${kidsCount} Kids)`,
          price: kidPrice,
          unit: `${kidsCount} Kid${kidsCount > 1 ? "s" : ""}`,
          isPerPerson: true,
        };

        if (kidItemIndex >= 0) {
          updated[kidItemIndex] = {
            ...updated[kidItemIndex],
            quantity: kidsCount,
          };
        } else {
          updated.push({
            item: kidItem,
            quantity: kidsCount,
          });
        }
      }

      return updated;
    });
  };

  // Cart operations
  const addToCart = (item: POSItem, customQty?: number) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        const increment = customQty !== undefined ? customQty : 1;
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + increment } : c
        );
      }
      // If item is per-person (e.g. ATV ride, kayaking, thali, pass) and adultsCount > 1, default initial quantity to adultsCount
      const initialQty =
        customQty !== undefined
          ? customQty
          : item.isPerPerson && adultsCount > 1
          ? adultsCount
          : 1;

      return [...prev, { item, quantity: initialQty }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) =>
      prev
        .map((c) => (c.item.id === itemId ? { ...c, quantity: c.quantity - 1 } : c))
        .filter((c) => c.quantity > 0)
    );
  };

  const clearCartItem = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.item.id !== itemId));
  };

  // Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  }, [cart]);

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const discountedSubtotal = subtotal - discountAmount;

  // Build itemized SAC tax breakdown
  const { totalTax, taxSummaryRows } = useMemo(() => {
    if (cart.length === 0) return { totalTax: 0, taxSummaryRows: [] as TaxBreakdownRow[] };

    const sacMap = new Map<
      string,
      { taxableValue: number; taxRate: number; totalTax: number }
    >();

    cart.forEach((c) => {
      const itemRatio = (c.item.price * c.quantity) / (subtotal || 1);
      const taxableVal = discountedSubtotal * itemRatio;
      const taxAmt = taxableVal * c.item.taxRate;

      const existing = sacMap.get(c.item.sacCode) || {
        taxableValue: 0,
        taxRate: c.item.taxRate,
        totalTax: 0,
      };

      sacMap.set(c.item.sacCode, {
        taxableValue: existing.taxableValue + taxableVal,
        taxRate: c.item.taxRate,
        totalTax: existing.totalTax + taxAmt,
      });
    });

    const rows: TaxBreakdownRow[] = [];
    let cumulativeTax = 0;

    sacMap.forEach((val, sac) => {
      const cgstR = val.taxRate / 2;
      const sgstR = val.taxRate / 2;
      const cgstA = Math.round((val.taxableValue * cgstR) * 100) / 100;
      const sgstA = Math.round((val.taxableValue * sgstR) * 100) / 100;
      const rowTax = Math.round((cgstA + sgstA) * 100) / 100;

      cumulativeTax += rowTax;
      rows.push({
        sacCode: sac,
        taxableValue: Math.round(val.taxableValue),
        cgstRate: cgstR,
        cgstAmount: cgstA,
        sgstRate: sgstR,
        sgstAmount: sgstA,
        totalTax: rowTax,
      });
    });

    return { totalTax: Math.round(cumulativeTax), taxSummaryRows: rows };
  }, [cart, subtotal, discountedSubtotal]);

  const grandTotal = Math.round(discountedSubtotal + totalTax);

  // Split Tender Live Reconciliation
  const totalSplitTendered = splitCash + splitUpi + splitCard;
  const splitShortfall = grandTotal - totalSplitTendered;
  const splitChangeToReturn = splitShortfall < 0 && splitCash >= Math.abs(splitShortfall) ? Math.abs(splitShortfall) : 0;
  const isSplitBalanced = paymentMethod === "split" ? (splitShortfall === 0 || (splitShortfall < 0 && splitCash > 0)) : true;

  // Filter Catalog
  const filteredItems = useMemo(() => {
    return catalogItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" ? true : item.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sacCode.includes(searchQuery) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [catalogItems, selectedCategory, searchQuery]);

  // Room Availability Statistics & Filtering
  const vacantRoomsCount = useMemo(() => roomUnits.filter((r) => r.status === "vacant").length, [roomUnits]);
  const readyToVacantCount = useMemo(() => roomUnits.filter((r) => r.status === "ready_to_vacant").length, [roomUnits]);
  const occupiedRoomsCount = useMemo(() => roomUnits.filter((r) => r.status === "occupied").length, [roomUnits]);
  const dirtyRoomsCount = useMemo(() => roomUnits.filter((r) => r.status === "dirty").length, [roomUnits]);

  const filteredRoomUnits = useMemo(() => {
    return roomUnits.filter((u) => {
      const matchCat = roomCategoryFilter === "all" || u.category === roomCategoryFilter;
      const matchStatus = roomStatusFilter === "all" || u.status === roomStatusFilter;
      const matchSearch =
        !roomSearchQuery ||
        u.name.toLowerCase().includes(roomSearchQuery.toLowerCase()) ||
        u.unitNumber.toLowerCase().includes(roomSearchQuery.toLowerCase()) ||
        (u.currentGuestName && u.currentGuestName.toLowerCase().includes(roomSearchQuery.toLowerCase())) ||
        u.amenities.some((a) => a.toLowerCase().includes(roomSearchQuery.toLowerCase()));
      return matchCat && matchStatus && matchSearch;
    });
  }, [roomUnits, roomCategoryFilter, roomStatusFilter, roomSearchQuery]);

  // Handle Add Custom Item (Flat vs Per Person in INR ₹)
  const handleAddCustomItem = () => {
    if (!customItemName.trim()) return;

    if (customPricingMode === "per_person") {
      const itemsToAdd: { item: POSItem; quantity: number }[] = [];
      if (adultsCount > 0) {
        itemsToAdd.push({
          item: {
            id: `custom-adult-${Date.now()}`,
            name: `${customItemName.trim()} (${adultsCount} Adults @ ₹${customItemPrice.toLocaleString()})`,
            category: customItemCategory,
            price: customItemPrice,
            taxRate: customItemTaxRate,
            sacCode: customItemSac.trim() || "996331",
            available: true,
            unit: `${adultsCount} Adult${adultsCount > 1 ? "s" : ""}`,
            isPerPerson: true,
          },
          quantity: adultsCount,
        });
      }
      if (kidsCount > 0) {
        itemsToAdd.push({
          item: {
            id: `custom-kid-${Date.now()}`,
            name: `${customItemName.trim()} (${kidsCount} Kids @ ₹${customItemKidPrice.toLocaleString()})`,
            category: customItemCategory,
            price: customItemKidPrice,
            taxRate: customItemTaxRate,
            sacCode: customItemSac.trim() || "996331",
            available: true,
            unit: `${kidsCount} Kid${kidsCount > 1 ? "s" : ""}`,
            isPerPerson: true,
          },
          quantity: kidsCount,
        });
      }
      setCart((prev) => [...prev, ...itemsToAdd]);
    } else {
      const newItem: POSItem = {
        id: `custom-${Date.now()}`,
        name: customItemName.trim(),
        category: customItemCategory,
        price: customItemPrice,
        taxRate: customItemTaxRate,
        sacCode: customItemSac.trim() || "996331",
        available: true,
        unit: customItemUnit,
      };

      setCatalogItems((prev) => [newItem, ...prev]);
      addToCart(newItem);
    }

    setIsCustomModalOpen(false);
    setCustomItemName("");
    setCustomItemPrice(200);
    setCustomItemKidPrice(100);
  };

  // Quick Split Preset helpers
  const handleEqualSplit = (type: "cash_upi" | "upi_card" | "all_cash" | "all_upi" | "all_card") => {
    if (type === "cash_upi") {
      const half = Math.round(grandTotal / 2);
      setSplitCash(half);
      setSplitUpi(grandTotal - half);
      setSplitCard(0);
    } else if (type === "upi_card") {
      const half = Math.round(grandTotal / 2);
      setSplitUpi(half);
      setSplitCard(grandTotal - half);
      setSplitCash(0);
    } else if (type === "all_cash") {
      setSplitCash(grandTotal);
      setSplitUpi(0);
      setSplitCard(0);
    } else if (type === "all_upi") {
      setSplitUpi(grandTotal);
      setSplitCash(0);
      setSplitCard(0);
    } else if (type === "all_card") {
      setSplitCard(grandTotal);
      setSplitCash(0);
      setSplitUpi(0);
    }
  };

  // Handle Checkout & Invoice Generation
  const handleCheckoutAndGenerateInvoice = () => {
    if (cart.length === 0) return;
    if (paymentMethod === "split" && !isSplitBalanced) {
      alert(`Split payment unbalanced. Remaining shortfall: ₹${splitShortfall}`);
      return;
    }

    const currentFolio = registeredGuests.find((r) => r.roomOrPitch === selectedRoom)?.folio || "FOL-000";
    const invoicePrefix = branding.name.includes("Wildwoods") ? "WWC" : branding.name.includes("Palm") ? "POR" : "GVF";
    const newInvNumber = `${invoicePrefix}/2026-27/0${Math.floor(100 + Math.random() * 900)}`;

    let formattedPaymentMethod = "";
    if (chargeTarget === "room") {
      formattedPaymentMethod = `Room Folio Transfer (${currentFolio})`;
    } else if (paymentMethod === "split") {
      const parts: string[] = [];
      if (splitUpi > 0) parts.push(`UPI: ₹${splitUpi.toLocaleString()}${splitUpiRef ? ` (Ref: ${splitUpiRef})` : ""}`);
      if (splitCash > 0) parts.push(`Cash: ₹${(splitCash - splitChangeToReturn).toLocaleString()}`);
      if (splitCard > 0) parts.push(`Card: ₹${splitCard.toLocaleString()}${splitCardLast4 ? ` (Card *${splitCardLast4})` : ""}`);
      formattedPaymentMethod = `Split Settlement [${parts.join(" + ")}]`;
    } else {
      formattedPaymentMethod = paymentMethod.toUpperCase();
    }

    const splitDetails: SplitTenderDetails | undefined =
      paymentMethod === "split"
        ? {
            cash: splitCash,
            upi: splitUpi,
            card: splitCard,
            upiRef: splitUpiRef,
            cardLast4: splitCardLast4,
            changeReturned: splitChangeToReturn,
          }
        : undefined;

    const b2bDetails: B2BBillingDetails | undefined =
      isB2B && b2bCompanyName
        ? {
            isB2B: true,
            companyName: b2bCompanyName,
            companyGstin: b2bCompanyGstin,
            companyAddress: b2bAddress,
            placeOfSupply: branding.stateCode,
          }
        : undefined;

    const newInvoice: CompletedInvoice = {
      invoiceNumber: newInvNumber,
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      guestName: chargeTarget === "room" ? guestName : (guestName.trim() || "Walk-In Guest"),
      guestPhone: guestPhone.trim() || undefined,
      adultsCount,
      kidsCount,
      petsCount: petsCount || 0,
      stayDetails: activeStayDetails || undefined,
      roomOrPitch: chargeTarget === "room" ? selectedRoom : "Direct POS Counter",
      items: cart.map((c) => ({
        name: c.item.name,
        quantity: c.quantity,
        price: c.item.price,
        sacCode: c.item.sacCode,
        taxRate: c.item.taxRate,
        unit: c.item.unit,
      })),
      subtotal,
      discount: discountAmount,
      tax: totalTax,
      grandTotal,
      currency: "INR (₹)",
      paymentMethod: formattedPaymentMethod,
      chargeTarget,
      splitDetails,
      b2bDetails,
      brandingSnapshot: { ...branding, currency: "INR (₹)" },
      taxSummary: taxSummaryRows,
      amountInWords: numberToIndianWords(grandTotal),
      cashierName: cashierShift.cashierName,
    };

    // Update shift drawer register
    setCashierShift((prev) => {
      const addCash = paymentMethod === "cash" ? grandTotal : paymentMethod === "split" ? (splitCash - splitChangeToReturn) : 0;
      const addUpi = paymentMethod === "upi" ? grandTotal : paymentMethod === "split" ? splitUpi : 0;
      const addCard = paymentMethod === "card" ? grandTotal : paymentMethod === "split" ? splitCard : 0;
      const addFolio = chargeTarget === "room" ? grandTotal : 0;

      return {
        ...prev,
        invoicesCount: prev.invoicesCount + 1,
        totalGross: prev.totalGross + grandTotal,
        cashCollected: prev.cashCollected + addCash,
        upiCollected: prev.upiCollected + addUpi,
        cardCollected: prev.cardCollected + addCard,
        folioCharged: prev.folioCharged + addFolio,
        totalGst: prev.totalGst + totalTax,
      };
    });

    setInvoiceHistory((prev) => [newInvoice, ...prev]);
    setActiveInvoice(newInvoice);
    setCart([]);
    setDiscountPercent(0);
    setSplitCash(0);
    setSplitUpi(0);
    setSplitCard(0);
    setSplitUpiRef("");
    setSplitCardLast4("");
  };

  const handlePrint = () => {
    window.print();
  };

  const generateInvoiceWhatsAppText = (inv: CompletedInvoice) => {
    const itemsList = inv.items
      .map(
        (it) =>
          `• ${it.quantity}x ${it.name} (${it.sacCode ? `SAC ${it.sacCode}` : ""}) - ₹${(
            it.quantity * it.price
          ).toLocaleString()}`
      )
      .join("\n");

    const taxLines = inv.taxSummary
      .map((tx) => `  SAC ${tx.sacCode}: CGST ₹${tx.cgstAmount} + SGST ₹${tx.sgstAmount}`)
      .join("\n");

    return `🧾 *TAX INVOICE - ${inv.brandingSnapshot.name.toUpperCase()}*
*Invoice No:* ${inv.invoiceNumber}
*Date:* ${inv.date}
*Guest:* ${inv.guestName} (${inv.roomOrPitch})
*Pax / Headcount:* ${inv.adultsCount || 1} Adults${inv.kidsCount ? `, ${inv.kidsCount} Kids` : ""} (Total: ${(inv.adultsCount || 1) + (inv.kidsCount || 0)} Guests)
*Currency:* Indian Rupee (INR — ₹)
${inv.b2bDetails ? `*Company:* ${inv.b2bDetails.companyName}\n*GSTIN:* ${inv.b2bDetails.companyGstin}\n` : ""}
*Items Ordered:*
${itemsList}

*Subtotal:* ₹${inv.subtotal.toLocaleString()}
${inv.discount > 0 ? `*Discount (${discountPercent}%):* -₹${inv.discount.toLocaleString()}\n` : ""}*Taxes (CGST + SGST):* ₹${inv.tax.toLocaleString()}
${taxLines ? `\n*Tax Breakdown:*\n${taxLines}\n` : ""}
*Grand Total Paid:* ₹${inv.grandTotal.toLocaleString()}
*Amount in Words:* ${inv.amountInWords}
*Settlement Mode:* ${inv.paymentMethod}
*Cashier:* ${inv.cashierName}

*Property Address:*
${inv.brandingSnapshot.name}
${inv.brandingSnapshot.addressLine}, ${inv.brandingSnapshot.cityStatePin}
GSTIN: ${inv.brandingSnapshot.gstin} | FSSAI: ${inv.brandingSnapshot.fssai} | Ph: ${inv.brandingSnapshot.phone}

_Powered by Rentcot Property OS_`;
  };

  const generateInvoiceMailto = (inv: CompletedInvoice) => {
    const subject = `Tax Invoice ${inv.invoiceNumber} - ${inv.brandingSnapshot.name}`;
    const body = `Dear ${inv.guestName},

Thank you for visiting ${inv.brandingSnapshot.name}!

Here is your itemized GST Tax Invoice:
Invoice Number: ${inv.invoiceNumber}
Date: ${inv.date}
Folio / Location: ${inv.roomOrPitch}
Headcount: ${inv.adultsCount || 1} Adults${inv.kidsCount ? `, ${inv.kidsCount} Kids` : ""} (Total: ${(inv.adultsCount || 1) + (inv.kidsCount || 0)} Guests)
Currency: Indian Rupees (INR — ₹)
Settlement Mode: ${inv.paymentMethod}
Cashier: ${inv.cashierName}
${inv.b2bDetails ? `Company: ${inv.b2bDetails.companyName}\nGSTIN: ${inv.b2bDetails.companyGstin}\n` : ""}
Itemized Charges:
${inv.items
  .map(
    (i) =>
      `• ${i.quantity}x ${i.name} [SAC ${i.sacCode}]: ₹${(i.quantity * i.price).toLocaleString()}`
  )
  .join("\n")}

Subtotal: ₹${inv.subtotal.toLocaleString()}
${inv.discount > 0 ? `Discount Applied: -₹${inv.discount.toLocaleString()}\n` : ""}Central GST (CGST): ₹${(inv.tax / 2).toFixed(2)}
State GST (SGST): ₹${(inv.tax / 2).toFixed(2)}
Total Amount: ₹${inv.grandTotal.toLocaleString()} (${inv.amountInWords})

Issuer Details:
${inv.brandingSnapshot.name} (${inv.brandingSnapshot.tradeName})
${inv.brandingSnapshot.addressLine}, ${inv.brandingSnapshot.cityStatePin}
GSTIN: ${inv.brandingSnapshot.gstin} | State Code: ${inv.brandingSnapshot.stateCode}
FSSAI License: ${inv.brandingSnapshot.fssai}
Phone: ${inv.brandingSnapshot.phone} | Email: ${inv.brandingSnapshot.email}

---------------------------------------------------------
Powered by Rentcot Property OS
Modern Multi-Tenant Hospitality OS for Resorts, Farmhouses & Camping Retreats
`;
    return `mailto:${encodeURIComponent(
      inv.brandingSnapshot.email
    )}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleDownloadInvoice = (inv: CompletedInvoice) => {
    const logoHtml = inv.brandingSnapshot.customLogoUrl
      ? `<img src="${inv.brandingSnapshot.customLogoUrl}" style="max-height: 48px; max-width: 160px; object-fit: contain; margin-bottom: 8px;" />`
      : `<div style="font-size: 26px; margin-bottom: 4px;">${
          inv.brandingSnapshot.logoType === "tent"
            ? "⛺"
            : inv.brandingSnapshot.logoType === "treepine"
            ? "🌲"
            : "🏛️"
        }</div>`;

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Tax Invoice ${inv.invoiceNumber} - ${inv.brandingSnapshot.name}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 36px; color: #0f172a; font-size: 13px; line-height: 1.5; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 20px; }
    .title { font-size: 20px; font-weight: 800; color: #0f172a; }
    .muted { color: #64748b; font-size: 11px; margin-top: 2px; }
    .tag { display: inline-block; padding: 4px 10px; border: 1px solid #0f172a; background: #f8fafc; border-radius: 4px; font-weight: bold; font-size: 11px; letter-spacing: 0.5px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
    th { background: #f1f5f9; font-size: 11px; text-transform: uppercase; font-weight: 700; color: #334155; }
    .tax-table { margin-top: 10px; font-size: 11px; }
    .tax-table th { background: #e2e8f0; }
    .totals { margin-left: auto; width: 340px; margin-top: 14px; }
    .totals div { display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; }
    .totals .grand { font-size: 15px; font-weight: 800; border-top: 2px solid #0f172a; padding-top: 6px; color: #1e40af; }
    .footer { margin-top: 36px; padding-top: 14px; border-top: 1px dashed #94a3b8; display: flex; justify-content: space-between; font-size: 10px; color: #64748b; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      ${logoHtml}
      <div class="title">${inv.brandingSnapshot.name}</div>
      <div class="muted">${inv.brandingSnapshot.tradeName}</div>
      <div class="muted">${inv.brandingSnapshot.addressLine}, ${inv.brandingSnapshot.cityStatePin}</div>
      <div class="muted">GSTIN: <strong>${inv.brandingSnapshot.gstin}</strong> | FSSAI: ${inv.brandingSnapshot.fssai}</div>
      <div class="muted">State: ${inv.brandingSnapshot.stateCode} | Phone: ${inv.brandingSnapshot.phone} | Email: ${inv.brandingSnapshot.email}</div>
    </div>
    <div style="text-align: right;">
      <div class="tag">GST TAX INVOICE</div>
      <div style="font-family: monospace; font-size: 15px; font-weight: bold; margin-top: 6px;">${inv.invoiceNumber}</div>
      <div class="muted">Date & Time: ${inv.date}</div>
      <div class="muted">Place of Supply: ${inv.brandingSnapshot.stateCode}</div>
      <div class="muted">Reverse Charge: No</div>
    </div>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; background: #f8fafc; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 20px;">
    <div>
      <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">Billed To Guest:</span>
      <div style="font-weight: 700; font-size: 13px;">${inv.guestName}</div>
      <div style="font-size: 11px; color: #64748b;">${inv.roomOrPitch} ${inv.guestPhone ? `• ${inv.guestPhone}` : ""}</div>
      ${inv.b2bDetails ? `
        <div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed #cbd5e1;">
          <div style="font-weight: 700; color: #1e3a8a;">B2B Entity: ${inv.b2bDetails.companyName}</div>
          <div style="font-size: 11px; font-family: monospace;">GSTIN: ${inv.b2bDetails.companyGstin}</div>
        </div>
      ` : ""}
    </div>
    <div style="text-align: right;">
      <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">Settlement Status:</span>
      <div style="font-weight: 700; font-size: 13px; color: #047857;">Cleared & Settled</div>
      <div style="font-size: 11px; color: #64748b;">Mode: ${inv.paymentMethod}</div>
      <div style="font-size: 11px; color: #64748b;">Cashier: ${inv.cashierName}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 40px; text-align: center;">#</th>
        <th>Item Description</th>
        <th style="width: 90px; text-align: center;">SAC / HSN</th>
        <th style="width: 50px; text-align: center;">Qty</th>
        <th style="width: 80px; text-align: right;">Rate</th>
        <th style="width: 60px; text-align: right;">GST</th>
        <th style="width: 90px; text-align: right;">Amount (₹)</th>
      </tr>
    </thead>
    <tbody>
      ${inv.items
        .map(
          (it, idx) => `
        <tr>
          <td style="text-align: center;">${idx + 1}</td>
          <td><strong>${it.name}</strong> ${it.unit ? `<span style="font-size: 10px; color: #64748b;">(${it.unit})</span>` : ""}</td>
          <td style="text-align: center; font-family: monospace;">${it.sacCode}</td>
          <td style="text-align: center;">${it.quantity}</td>
          <td style="text-align: right;">₹${it.price.toLocaleString()}</td>
          <td style="text-align: right;">${(it.taxRate * 100).toFixed(0)}%</td>
          <td style="text-align: right;"><strong>₹${(it.quantity * it.price).toLocaleString()}</strong></td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>

  <!-- Statutory GST Summary Table -->
  <div style="font-weight: 700; font-size: 11px; text-transform: uppercase; color: #475569; margin-top: 16px;">Tax Summary (CGST & SGST Split)</div>
  <table class="tax-table">
    <thead>
      <tr>
        <th>SAC Code</th>
        <th style="text-align: right;">Taxable Amount</th>
        <th style="text-align: right;">CGST Rate</th>
        <th style="text-align: right;">CGST Amount</th>
        <th style="text-align: right;">SGST Rate</th>
        <th style="text-align: right;">SGST Amount</th>
        <th style="text-align: right;">Total Tax</th>
      </tr>
    </thead>
    <tbody>
      ${inv.taxSummary
        .map(
          (tx) => `
        <tr>
          <td style="font-family: monospace;">${tx.sacCode}</td>
          <td style="text-align: right;">₹${tx.taxableValue.toLocaleString()}</td>
          <td style="text-align: right;">${(tx.cgstRate * 100).toFixed(1)}%</td>
          <td style="text-align: right;">₹${tx.cgstAmount.toFixed(2)}</td>
          <td style="text-align: right;">${(tx.sgstRate * 100).toFixed(1)}%</td>
          <td style="text-align: right;">₹${tx.sgstAmount.toFixed(2)}</td>
          <td style="text-align: right; font-weight: bold;">₹${tx.totalTax.toFixed(2)}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>

  <div class="totals">
    <div><span>Subtotal:</span><span>₹${inv.subtotal.toLocaleString()}</span></div>
    ${inv.discount > 0 ? `<div><span>Discount (${discountPercent}%):</span><span>-₹${inv.discount.toLocaleString()}</span></div>` : ""}
    <div><span>CGST Total:</span><span>₹${(inv.tax / 2).toFixed(2)}</span></div>
    <div><span>SGST Total:</span><span>₹${(inv.tax / 2).toFixed(2)}</span></div>
    <div class="grand"><span>Grand Total:</span><span>₹${inv.grandTotal.toLocaleString()}</span></div>
  </div>

  <div style="margin-top: 14px; padding: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 11px;">
    <strong>Amount in Words:</strong> ${inv.amountInWords}<br>
    ${inv.brandingSnapshot.bankName ? `<strong>Bank Settlement:</strong> ${inv.brandingSnapshot.bankName} | A/c: ${inv.brandingSnapshot.bankAccountNo} | IFSC: ${inv.brandingSnapshot.bankIfsc} | UPI: ${inv.brandingSnapshot.upiVpa}` : ""}
  </div>

  <div class="footer">
    <div>
      <strong>Powered by Rentcot Property OS</strong><br>
      Modern Multi-Tenant Hospitality & Campsite Operations
    </div>
    <div style="text-align: right;">
      Verified Tax Invoice &bull; State Code: ${inv.brandingSnapshot.stateCode} &bull; Digitally Recorded
    </div>
  </div>
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Tax-Invoice-${inv.invoiceNumber.replace(/\//g, "-")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const applyPreset = (presetKey: "farmhouse" | "campsite" | "resort") => {
    setBranding(defaultBrandingPresets[presetKey]);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {t("nav.pos", "Front-Desk POS & GST Invoicing Terminal")}
            </h1>
            <Badge
              variant="outline"
              className="text-xs font-semibold text-rentcot-blue border-rentcot-blue/30 bg-rentcot-blue/5 px-2.5 py-1"
            >
              <Store className="h-3.5 w-3.5 mr-1" />
              {branding.name}
            </Badge>
            <Badge
              variant="outline"
              className="text-xs font-semibold text-emerald-700 border-emerald-500/30 bg-emerald-500/5 px-2.5 py-1 flex items-center gap-1"
            >
              <IndianRupee className="h-3.5 w-3.5 text-emerald-600" />
              <span>Deals in INR (₹)</span>
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Commercial front-desk billing: Per-guest/per-kid dining packages, campfire kits, adventure activities, multi-tender splits, and resort-branded GST tax invoices.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Register New Guest Button */}
          <Button
            onClick={() => setIsAddGuestModalOpen(true)}
            className="text-xs font-bold h-9 gap-1.5 bg-rentcot-blue hover:bg-rentcot-blue/90 text-white shadow-xs"
          >
            <UserPlus className="h-4 w-4" />
            <span>+ Register Guest</span>
          </Button>

          {/* Shift Drawer Summary Button */}
          <Button
            variant="outline"
            onClick={() => setIsShiftModalOpen(true)}
            className="text-xs font-semibold h-9 gap-1.5 border-emerald-500/30 bg-emerald-500/5 text-emerald-700 hover:bg-emerald-500/10"
          >
            <Banknote className="h-4 w-4 text-emerald-600" />
            <span>Cashier Register (Shift #41)</span>
          </Button>

          {/* Edit Invoice Branding Button */}
          <Button
            variant="outline"
            onClick={() => setIsBrandingModalOpen(true)}
            className="text-xs font-semibold h-9 gap-1.5 border-amber-500/30 bg-amber-500/5 text-amber-800 hover:bg-amber-500/10"
          >
            <Edit3 className="h-4 w-4 text-amber-600" />
            <span>Resort GST Branding</span>
          </Button>

          {/* Invoice History */}
          <Button
            variant="outline"
            onClick={() => setShowHistoryModal(true)}
            className="text-xs font-semibold h-9 gap-1.5 border-border"
          >
            <History className="h-4 w-4 text-rentcot-blue" />
            <span>Past Invoices ({invoiceHistory.length})</span>
          </Button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Catalog Filter & Items Grid or Rooms Availability Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main POS Operations Tab Switcher: F&B Dining & Activities Catalog vs Rooms & Camps Availability */}
          <div className="flex items-center justify-between p-1 rounded-xl bg-muted/60 border border-border shadow-2xs">
            <button
              type="button"
              onClick={() => setPosMainTab("catalog")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                posMainTab === "catalog"
                  ? "bg-background text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Utensils className="h-4 w-4 text-primary" />
              <span>Dining &amp; Activities Catalog</span>
              <Badge variant="clean" className="text-[10px] py-0 px-1.5 ml-1">
                {catalogItems.length}
              </Badge>
            </button>

            <button
              type="button"
              onClick={() => setPosMainTab("rooms")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                posMainTab === "rooms"
                  ? "bg-background text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BedDouble className="h-4 w-4 text-emerald-600" />
              <span>Rooms &amp; Camps Availability</span>
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 ml-1 bg-emerald-500/10 text-emerald-700 border-emerald-500/30 font-bold">
                {vacantRoomsCount} Vacant
              </Badge>
            </button>
          </div>

          {posMainTab === "catalog" ? (
            <div className="space-y-4 animate-in fade-in">
              {/* Search bar + Custom Item Quick Add */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search catalog by dish, package, ride, or SAC code in INR (₹)..."
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCustomModalOpen(true)}
                  className="text-xs h-9 gap-1.5 font-semibold shrink-0 border-dashed border-primary/40 text-primary hover:bg-primary/5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>+ Custom Charge</span>
                </Button>
              </div>

              {/* Group Feasts & Buffet Passes (Collapsible / Sleek) */}
              <div className="rounded-xl border border-primary/20 bg-card overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setShowHeadcountPackages(!showHeadcountPackages)}
                  className="w-full p-2.5 px-3 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent flex items-center justify-between hover:bg-primary/15 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
                      <Users className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground flex items-center gap-2">
                        <span>🍱 Group Feasts &amp; Buffet Passes (Per Head)</span>
                        <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
                          6 Available
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Buffet meals, BBQ dinners &amp; passes auto-calculated for {adultsCount} Adult{adultsCount !== 1 ? "s" : ""}{kidsCount > 0 ? `, ${kidsCount} Kid${kidsCount !== 1 ? "s" : ""}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-primary font-semibold">
                    <span>{showHeadcountPackages ? "Hide Packages" : "View Packages"}</span>
                    {showHeadcountPackages ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </div>
                </button>

                {showHeadcountPackages && (
                  <div className="p-3 pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 border-t border-border/60 bg-muted/20 animate-in fade-in">
                    {headcountPackages.map((pkg) => {
                      const calculatedTotal = (pkg.adultRate * adultsCount) + (pkg.kidRate * kidsCount);
                      return (
                        <div
                          key={pkg.id}
                          className="p-2.5 rounded-lg border border-border/70 bg-card hover:border-primary/50 transition-all space-y-1.5 flex flex-col justify-between shadow-2xs"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-xs text-foreground truncate" title={pkg.name}>
                                {pkg.name}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground shrink-0 font-medium">
                                {pkg.badge}
                              </span>
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">
                              Adult: <strong className="text-foreground">₹{pkg.adultRate}</strong> • Kid: <strong className="text-foreground">₹{pkg.kidRate}</strong>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            onClick={() => handleChargeHeadcountPackage(pkg)}
                            className="w-full text-[11px] h-7 font-bold bg-primary hover:bg-primary/90 text-primary-foreground gap-1 justify-between shadow-2xs"
                          >
                            <span>+ {adultsCount}A {kidsCount > 0 ? `+ ${kidsCount}K` : ""}</span>
                            <span className="font-mono">₹{calculatedTotal.toLocaleString()}</span>
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: "all", label: "All Items", icon: ShoppingBag },
                  { id: "food", label: "F&B Dining", icon: Utensils },
                  { id: "beverage", label: "Beverages & Cafe", icon: Coffee },
                  { id: "bbq_campfire", label: "BBQ & Campfire", icon: Flame },
                  { id: "activities", label: "Activities & Rides", icon: Bike },
                  { id: "accommodation", label: "Stay Packages", icon: BedDouble },
                  { id: "farm_produce", label: "Farm Fresh", icon: Sparkles },
                ].map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.id;
                  const count =
                    cat.id === "all"
                      ? catalogItems.length
                      : catalogItems.filter((i) => i.category === cat.id).length;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-xs font-bold"
                          : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] rounded-full px-1.5 py-0.2 ${
                          isActive
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-background/80 text-muted-foreground"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[580px] overflow-y-auto pr-1">
                {filteredItems.length === 0 ? (
                  <div className="col-span-2 py-12 text-center text-muted-foreground space-y-2">
                    <Store className="h-8 w-8 mx-auto opacity-30" />
                    <div className="text-sm font-semibold">No catalog items found</div>
                    <div className="text-xs">Try clearing the search query or switching categories.</div>
                  </div>
                ) : (
                  filteredItems.map((item) => {
                    const inCart = cart.find((c) => c.item.id === item.id);
                    const kidPrice = item.kidPrice !== undefined ? item.kidPrice : Math.round(item.price * 0.5);
                    const headcountTotal = (item.price * adultsCount) + (kidPrice * kidsCount);
                    const isVeg = item.name.toLowerCase().includes("veg") && !item.name.toLowerCase().includes("non-veg");

                    return (
                      <Card
                        key={item.id}
                        className={`hover:border-primary/50 transition-all cursor-pointer select-none bg-card ${
                          inCart ? "border-primary/40 bg-primary/5" : "border-border"
                        }`}
                        onClick={() => addToCart(item)}
                      >
                        <CardContent className="p-3.5 flex flex-col justify-between h-full gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
                                {item.category === "food" && (
                                  <span
                                    className={`inline-flex items-center justify-center h-3.5 w-3.5 rounded-xs border shrink-0 ${
                                      isVeg ? "border-emerald-600" : "border-red-600"
                                    }`}
                                    title={isVeg ? "Pure Vegetarian" : "Non-Vegetarian"}
                                  >
                                    <span className={`h-1.5 w-1.5 rounded-full ${isVeg ? "bg-emerald-600" : "bg-red-600"}`} />
                                  </span>
                                )}
                                <span className="font-bold text-xs sm:text-sm text-foreground leading-tight truncate">
                                  {item.name}
                                </span>
                                {item.unit && (
                                  <span className="text-[10px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded shrink-0">
                                    {item.unit}
                                  </span>
                                )}
                              </div>

                              <div className="shrink-0">
                                {inCart ? (
                                  <div
                                    className="flex items-center gap-1 bg-background rounded-lg p-0.5 border border-primary/30 shadow-2xs"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      onClick={() => removeFromCart(item.id)}
                                      className="h-6 w-6 rounded bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 text-xs font-bold transition-colors"
                                    >
                                      <Minus className="h-3 w-3" />
                                    </button>
                                    <span className="font-extrabold text-xs px-1 text-foreground min-w-[14px] text-center">
                                      {inCart.quantity}
                                    </span>
                                    <button
                                      onClick={() => addToCart(item)}
                                      className="h-6 w-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold hover:bg-primary/90 transition-colors"
                                    >
                                      <Plus className="h-3 w-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 px-2 text-xs rounded-lg border-border hover:border-primary hover:bg-primary hover:text-white transition-colors gap-1 font-semibold"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addToCart(item);
                                    }}
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                    <span>
                                      {item.isPerPerson && adultsCount > 1 ? `Add (${adultsCount})` : "Add"}
                                    </span>
                                  </Button>
                                )}
                              </div>
                            </div>

                            {item.description && (
                              <p className="text-[11px] text-muted-foreground line-clamp-1 leading-relaxed">
                                {item.description}
                              </p>
                            )}

                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-base font-extrabold text-rentcot-blue font-mono">
                                ₹{item.price.toLocaleString()}
                              </span>
                              {item.kidPrice && (
                                <span className="text-[11px] text-muted-foreground font-medium">
                                  (Kid: ₹{item.kidPrice})
                                </span>
                              )}
                              <Badge
                                variant="outline"
                                className="text-[10px] font-mono border-border text-muted-foreground ml-auto"
                              >
                                SAC {item.sacCode} • {(item.taxRate * 100).toFixed(0)}% GST
                              </Badge>
                            </div>
                          </div>

                          {/* Only show per-head group addition if item is explicitly perPerson or has kid price with multiple pax */}
                          {(item.isPerPerson || (item.kidPrice && (adultsCount + kidsCount > 1))) && (
                            <div className="pt-1.5 border-t border-border/50 flex items-center justify-between gap-1 text-[10px]">
                              <span className="text-muted-foreground">Group billing:</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleChargeItemForGuests(item);
                                }}
                                className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-colors"
                              >
                                <Users className="h-3 w-3" />
                                <span>Add for {adultsCount}A{kidsCount > 0 ? `+${kidsCount}K` : ""} (₹{headcountTotal.toLocaleString()})</span>
                              </button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            /* Real-Time Rooms & Camps Availability View */
            <div className="space-y-4 animate-in fade-in">
              {/* Operational KPI Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center gap-2.5 shadow-2xs">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-700 font-bold shrink-0">
                    <DoorOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-800 uppercase font-bold block">Vacant &amp; Ready</span>
                    <div className="text-base font-black text-emerald-700">{vacantRoomsCount} Units</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center gap-2.5 shadow-2xs">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-700 font-bold shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-800 uppercase font-bold block">Checkout Today</span>
                    <div className="text-base font-black text-amber-700">{readyToVacantCount} Units</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 flex items-center gap-2.5 shadow-2xs">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-700 font-bold shrink-0">
                    <BedDouble className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-800 uppercase font-bold block">In-House Occupied</span>
                    <div className="text-base font-black text-blue-700">{occupiedRoomsCount} Units</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 flex items-center gap-2.5 shadow-2xs">
                  <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-700 font-bold shrink-0">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-800 uppercase font-bold block">Housekeeping / Dirty</span>
                    <div className="text-base font-black text-purple-700">{dirtyRoomsCount} Units</div>
                  </div>
                </div>
              </div>

              {/* Filters & Search Row */}
              <div className="p-3 rounded-xl border border-border bg-card space-y-2.5 shadow-2xs">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                  <div className="relative flex-1">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={roomSearchQuery}
                      onChange={(e) => setRoomSearchQuery(e.target.value)}
                      placeholder="Search room number, tent, villa, guest, or amenity in INR (₹)..."
                      className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                    />
                    {roomSearchQuery && (
                      <button
                        onClick={() => setRoomSearchQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Status Filter */}
                    <select
                      value={roomStatusFilter}
                      onChange={(e) => setRoomStatusFilter(e.target.value)}
                      className="p-2 text-xs rounded-lg border border-border bg-background text-foreground font-semibold"
                    >
                      <option value="all">All Statuses ({roomUnits.length})</option>
                      <option value="vacant">🟢 Vacant Only ({vacantRoomsCount})</option>
                      <option value="ready_to_vacant">🟡 Departing Today ({readyToVacantCount})</option>
                      <option value="occupied">🔴 Occupied ({occupiedRoomsCount})</option>
                      <option value="dirty">🧹 Housekeeping ({dirtyRoomsCount})</option>
                    </select>

                    {/* Category Filter */}
                    <select
                      value={roomCategoryFilter}
                      onChange={(e) => setRoomCategoryFilter(e.target.value)}
                      className="p-2 text-xs rounded-lg border border-border bg-background text-foreground font-semibold"
                    >
                      <option value="all">All Types</option>
                      <option value="tent">🎪 Tents &amp; Camps</option>
                      <option value="cottage">🏡 Cottages</option>
                      <option value="villa">🏰 Villas</option>
                      <option value="glamping_dome">🔮 Glamping Domes</option>
                      <option value="suite">🛋️ Suites</option>
                      <option value="pitch">🏕️ Pitches</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/60">
                  <span>
                    Showing <strong>{filteredRoomUnits.length}</strong> physical accommodation keys at <strong>Green Valley Farmhouse</strong>
                  </span>
                  <span className="text-emerald-700 font-semibold font-mono">
                    Check-in: 02:00 PM • Checkout: 11:00 AM • Hourly Flex Available
                  </span>
                </div>
              </div>

              {/* Room & Camp Availability Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[580px] overflow-y-auto pr-1">
                {filteredRoomUnits.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-muted-foreground space-y-2 border border-dashed border-border rounded-xl bg-muted/10">
                    <BedDouble className="h-8 w-8 mx-auto opacity-30" />
                    <div className="text-sm font-semibold text-foreground">No rooms or camps match your filter</div>
                    <div className="text-xs">Adjust your status, category, or search filters above.</div>
                  </div>
                ) : (
                  filteredRoomUnits.map((unit) => {
                    const isVacant = unit.status === "vacant";
                    const isReady = unit.status === "ready_to_vacant";
                    const isOccupied = unit.status === "occupied";
                    const isDirty = unit.status === "dirty";

                    return (
                      <Card
                        key={unit.id}
                        className={`overflow-hidden border transition-all flex flex-col justify-between shadow-2xs ${
                          isVacant
                            ? "border-emerald-500/40 bg-card hover:border-emerald-500"
                            : isReady
                            ? "border-amber-500/40 bg-card hover:border-amber-500"
                            : isOccupied
                            ? "border-border/80 bg-muted/10"
                            : "border-border/60 bg-muted/20"
                        }`}
                      >
                        {/* Cover Image & Header Badges */}
                        <div className="relative h-32 w-full bg-muted overflow-hidden">
                          {unit.imageUrl ? (
                            <Image
                              src={unit.imageUrl}
                              alt={unit.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-tr from-muted to-muted/40 flex items-center justify-center">
                              <BedDouble className="h-8 w-8 text-muted-foreground/40" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                          {/* Top Badges */}
                          <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap">
                            <Badge className="bg-background/90 text-foreground font-extrabold text-[10px] backdrop-blur-xs border border-border shadow-xs">
                              {unit.unitNumber}
                            </Badge>
                            <Badge variant="outline" className="bg-background/80 text-foreground text-[9px] backdrop-blur-xs capitalize border-border font-medium">
                              {unit.category.replace("_", " ")}
                            </Badge>
                          </div>

                          <div className="absolute top-2 right-2">
                            {isVacant && (
                              <Badge className="bg-emerald-600 text-white font-bold text-[10px] shadow-sm">
                                🟢 Vacant &amp; Ready
                              </Badge>
                            )}
                            {isReady && (
                              <Badge className="bg-amber-600 text-white font-bold text-[10px] shadow-sm">
                                🟡 Checkout Today
                              </Badge>
                            )}
                            {isOccupied && (
                              <Badge className="bg-red-600 text-white font-bold text-[10px] shadow-sm">
                                🔴 Occupied
                              </Badge>
                            )}
                            {isDirty && (
                              <Badge className="bg-purple-700 text-white font-bold text-[10px] shadow-sm">
                                🧹 Housekeeping
                              </Badge>
                            )}
                          </div>

                          {/* Bottom Title on Image */}
                          <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                            <h4 className="font-bold text-xs sm:text-sm drop-shadow-md truncate">
                              {unit.name}
                            </h4>
                            <div className="flex items-center gap-2 text-[10px] text-white/90 font-mono">
                              <span>Per Day: ₹{unit.ratePerDay.toLocaleString("en-IN")}</span>
                              <span>•</span>
                              <span>Per Hr: ₹{unit.ratePerHour.toLocaleString("en-IN")}</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Body Details */}
                        <div className="p-3 space-y-2.5 flex-1 flex flex-col justify-between text-xs">
                          <div className="space-y-1.5">
                            {/* Rates and Timings Strip */}
                            <div className="grid grid-cols-2 gap-1.5 p-2 rounded-lg bg-muted/40 border border-border/70 text-[11px]">
                              <div>
                                <span className="text-[9px] text-muted-foreground uppercase font-bold block">
                                  Standard Timings
                                </span>
                                <div className="font-semibold text-foreground">
                                  In: {unit.standardCheckInTime} • Out: {unit.standardCheckOutTime}
                                </div>
                              </div>
                              <div>
                                <span className="text-[9px] text-muted-foreground uppercase font-bold block">
                                  Flexible Hourly Rate
                                </span>
                                <div className="font-semibold text-rentcot-blue font-mono">
                                  ₹{unit.ratePerHour}/hr (min {unit.minHours || 3}h)
                                </div>
                              </div>
                            </div>

                            {/* Occupancy or Expected Checkout notice */}
                            {(isReady || isOccupied) && (
                              <div className={`p-2 rounded-lg text-[10px] border ${
                                isReady
                                  ? "bg-amber-500/10 border-amber-500/30 text-amber-900"
                                  : "bg-blue-500/10 border-blue-500/30 text-blue-900"
                              }`}>
                                <div className="font-bold flex items-center justify-between">
                                  <span>Guest: {unit.currentGuestName || "In-House Guest"}</span>
                                  {unit.currentGuestFolio && <span className="font-mono">{unit.currentGuestFolio}</span>}
                                </div>
                                <div className="text-[10px] mt-0.5 opacity-90">
                                  {isReady ? `Expected Checkout: ${unit.expectedCheckoutTime}` : `Checkout: ${unit.standardCheckOutTime}`}
                                </div>
                              </div>
                            )}

                            {/* Capacity and Pet policy */}
                            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5 text-foreground" />
                                <span>Up to {unit.adultsCapacity} Adults, {unit.kidsCapacity} Kids</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Dog className={`h-3.5 w-3.5 ${unit.petFriendly ? "text-orange-600" : "text-muted-foreground/50"}`} />
                                <span className={unit.petFriendly ? "text-orange-700 font-semibold" : ""}>
                                  {unit.petFriendly ? `Pet Friendly (₹{unit.petFee})` : "No Pets"}
                                </span>
                              </div>
                            </div>

                            {/* Amenities Chips */}
                            <div className="flex items-center gap-1 flex-wrap pt-0.5">
                              {unit.amenities.map((amenity, idx) => (
                                <span
                                  key={idx}
                                  className="text-[9px] bg-muted/60 text-muted-foreground px-1.5 py-0.5 rounded border border-border/50"
                                >
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="pt-2 border-t border-border/60">
                            {isVacant ? (
                              <Button
                                size="sm"
                                onClick={() => handleOpenRoomBooking(unit)}
                                className="w-full h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-xs"
                              >
                                <DoorOpen className="h-3.5 w-3.5" />
                                <span>Book Walk-in Stay (Day / Hour)</span>
                              </Button>
                            ) : isReady ? (
                              <div className="space-y-1">
                                <Button
                                  size="sm"
                                  onClick={() => handleOpenRoomBooking(unit)}
                                  className="w-full h-8 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white gap-1.5 shadow-xs"
                                >
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>Pre-Book Next Walk-in (After 12 PM)</span>
                                </Button>
                              </div>
                            ) : isOccupied ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const guest = registeredGuests.find((g) => g.roomOrPitch.includes(unit.unitNumber));
                                  if (guest) {
                                    handleSelectGuest(guest.id);
                                    setPosMainTab("catalog");
                                  } else {
                                    alert(`In-house guest details: ${unit.currentGuestName} (${unit.currentGuestPhone || "No phone"})`);
                                  }
                                }}
                                className="w-full h-8 text-xs font-semibold border-border gap-1.5 hover:bg-muted"
                              >
                                <Eye className="h-3.5 w-3.5 text-primary" />
                                <span>View Active Guest Folio</span>
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarkUnitClean(unit.id)}
                                className="w-full h-8 text-xs font-semibold text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10 gap-1.5"
                              >
                                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                                <span>Mark Clean &amp; Vacant</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Active Cart, Split Tenders & Invoicing Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="sticky top-20 border-primary/20 shadow-md">
            <CardHeader className="pb-3 border-b border-border bg-card">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-rentcot-blue" />
                  <span>Front-Desk Billing Folio</span>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-500/30 bg-emerald-500/10 font-bold">
                    INR (₹)
                  </Badge>
                  {cart.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs bg-rentcot-blue/10 text-rentcot-blue font-semibold px-2 py-0.5 rounded-full">
                        {cart.reduce((sum, c) => sum + c.quantity, 0)} items
                      </span>
                      <button
                        onClick={() => setCart([])}
                        className="text-[11px] text-muted-foreground hover:text-destructive p-1"
                        title="Clear Cart"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Step 1: Customer & Destination Switcher (Direct Walk-In vs In-House Room) */}
              <div className="p-3 rounded-xl border border-border bg-muted/30 space-y-3">
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-background rounded-lg border border-border">
                  <button
                    type="button"
                    onClick={() => handleSwitchChargeTarget("direct")}
                    className={`py-1.5 px-2 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      chargeTarget === "direct"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Banknote className="h-3.5 w-3.5" />
                    <span>Direct Walk-In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSwitchChargeTarget("room")}
                    className={`py-1.5 px-2 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      chargeTarget === "room"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <BedDouble className="h-3.5 w-3.5" />
                    <span>In-House Room</span>
                  </button>
                </div>

                {chargeTarget === "direct" ? (
                  /* Direct Walk-In Guest Details & Compact 1-Row Pax Steppers */
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-muted-foreground font-semibold block mb-0.5">
                          Guest Name
                        </label>
                        <input
                          type="text"
                          placeholder="Walk-In Guest"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          className="w-full p-2 text-xs rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground font-semibold block mb-0.5">
                          Phone (WhatsApp bill)
                        </label>
                        <input
                          type="tel"
                          placeholder="+91 98480..."
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          className="w-full p-2 text-xs rounded-lg border border-border bg-background text-foreground font-mono focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>

                    {/* Compact 1-Row Pax Stepper */}
                    <div className="p-2 rounded-lg bg-background border border-border/80 flex items-center justify-between gap-1 text-xs">
                      {/* Adults */}
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-muted-foreground font-medium">Adults:</span>
                        <div className="flex items-center gap-0.5 bg-muted rounded p-0.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateAdults(Math.max(1, adultsCount - 1))}
                            className="h-5 w-5 rounded bg-background flex items-center justify-center font-bold text-xs hover:bg-card"
                          >
                            -
                          </button>
                          <span className="w-5 text-center font-bold text-xs">{adultsCount}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateAdults(adultsCount + 1)}
                            className="h-5 w-5 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Kids */}
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-muted-foreground font-medium">Kids:</span>
                        <div className="flex items-center gap-0.5 bg-muted rounded p-0.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateKids(Math.max(0, kidsCount - 1))}
                            className="h-5 w-5 rounded bg-background flex items-center justify-center font-bold text-xs hover:bg-card"
                          >
                            -
                          </button>
                          <span className="w-5 text-center font-bold text-xs">{kidsCount}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateKids(kidsCount + 1)}
                            className="h-5 w-5 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Pets */}
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-muted-foreground font-medium">Pets:</span>
                        <div className="flex items-center gap-0.5 bg-muted rounded p-0.5">
                          <button
                            type="button"
                            onClick={() => setPetsCount((p) => Math.max(0, p - 1))}
                            className="h-5 w-5 rounded bg-background flex items-center justify-center font-bold text-xs hover:bg-card"
                          >
                            -
                          </button>
                          <span className="w-5 text-center font-bold text-xs">{petsCount}</span>
                          <button
                            type="button"
                            onClick={() => setPetsCount((p) => p + 1)}
                            className="h-5 w-5 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Inline Pet Fee Quick Add Button */}
                    {petsCount > 0 && (
                      <div className="p-1.5 px-2.5 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-between text-xs animate-in fade-in">
                        <span className="text-orange-900 text-[11px] flex items-center gap-1">
                          <Dog className="h-3.5 w-3.5 text-orange-600 shrink-0" />
                          <span>{petsCount} Pet{petsCount > 1 ? "s" : ""} registered</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const feeItem: POSItem = {
                              id: `pet-fee-${Date.now()}`,
                              name: `Pet Stay & Sanitation Fee (${petsCount} Pet${petsCount > 1 ? "s" : ""})`,
                              category: "other",
                              price: 500 * petsCount,
                              taxRate: 0.18,
                              sacCode: "9997",
                              available: true,
                              unit: `${petsCount} pet`,
                              description: "Deep-clean sanitization fee for pet-friendly stay",
                            };
                            addToCart(feeItem);
                          }}
                          className="text-[10px] px-2 py-0.5 rounded bg-orange-600 hover:bg-orange-700 text-white font-bold transition-colors shadow-2xs"
                        >
                          + Add ₹{(petsCount * 500).toLocaleString("en-IN")} Fee
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* In-House Room Selection */
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-semibold text-muted-foreground block">
                        Select In-House Villa, Cottage or Tent:
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsAddGuestModalOpen(true)}
                        className="text-[10px] text-primary hover:underline font-semibold"
                      >
                        + New In-House Guest
                      </button>
                    </div>

                    <select
                      value={selectedRoom}
                      onChange={(e) => handleRoomChange(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-border bg-background text-foreground font-medium focus:ring-1 focus:ring-primary"
                    >
                      {registeredGuests.map((r) => (
                        <option key={r.id} value={r.roomOrPitch}>
                          {r.roomOrPitch} — {r.guestName} ({r.folio})
                        </option>
                      ))}
                    </select>

                    <div className="p-2.5 rounded-lg bg-background border border-border/80 text-xs flex items-center justify-between">
                      <div>
                        <div className="font-bold text-foreground flex items-center gap-1.5">
                          <span>{guestName}</span>
                          <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary py-0">
                            {registeredGuests.find((r) => r.roomOrPitch === selectedRoom)?.folio || "FOL-000"}
                          </Badge>
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                          {guestPhone || "No phone on file"}
                        </div>
                      </div>

                      <Badge variant="secondary" className="text-[10px] font-medium">
                        {adultsCount} Adults{kidsCount > 0 ? `, ${kidsCount} Kids` : ""}{petsCount > 0 ? `, ${petsCount} Pets` : ""}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Cart Items List */}
              {cart.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground space-y-2 border border-dashed border-border rounded-xl">
                  <ShoppingBag className="h-8 w-8 mx-auto opacity-30 text-muted-foreground" />
                  <div className="text-xs font-semibold text-foreground">Folio is currently empty</div>
                  <div className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                    Click any food item, buffet package, campfire kit, or room on the left to add to bill.
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1 border-t border-b border-border py-2">
                    {cart.map(({ item, quantity }) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg bg-muted/20 border border-border/50"
                      >
                        <div className="flex-1 pr-2 min-w-0">
                          <div className="font-semibold text-foreground truncate flex items-center gap-1">
                            <span>{item.name}</span>
                            {item.isPerPerson && (
                              <span className="text-[9px] bg-emerald-500/10 text-emerald-700 px-1 py-0.2 rounded font-mono">
                                per head
                              </span>
                            )}
                          </div>
                          <div className="text-muted-foreground font-mono text-[10px] flex items-center gap-1">
                            <span>{quantity} × ₹{item.price.toLocaleString()}</span>
                            <span>•</span>
                            <span>SAC {item.sacCode} ({(item.taxRate * 100).toFixed(0)}% GST)</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* In-folio quantity stepper */}
                          <div className="flex items-center gap-0.5 bg-background rounded-md border border-border p-0.5 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="h-5 w-5 rounded bg-muted/60 flex items-center justify-center font-bold text-xs hover:bg-muted text-foreground transition-colors"
                              title="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="w-5 text-center font-bold font-mono text-xs text-foreground">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => addToCart(item, 1)}
                              className="h-5 w-5 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shadow-2xs hover:bg-primary/90 transition-colors"
                              title="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <span className="font-extrabold text-foreground font-mono min-w-[56px] text-right">
                            ₹{(quantity * item.price).toLocaleString()}
                          </span>
                          <button
                            onClick={() => clearCartItem(item.id)}
                            className="text-muted-foreground hover:text-destructive p-1 transition-colors ml-0.5"
                            title="Remove item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Step 3: Payment & Settlement */}
                  <div className="space-y-3 pt-1">
                    {/* If Direct Walk-in: Settlement Method Selector */}
                    {chargeTarget === "direct" ? (
                      <div className="space-y-2">
                        <label className="text-[10px] text-muted-foreground font-semibold block">
                          Payment Method
                        </label>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[
                            { id: "upi", label: "UPI QR", icon: QrCode },
                            { id: "card", label: "Card POS", icon: CreditCard },
                            { id: "cash", label: "Cash", icon: Banknote },
                            { id: "split", label: "Split", icon: Split },
                          ].map((m) => {
                            const Icon = m.icon;
                            const isSel = paymentMethod === m.id;
                            return (
                              <button
                                key={m.id}
                                onClick={() => {
                                  setPaymentMethod(m.id as any);
                                  if (m.id === "split" && splitCash === 0 && splitUpi === 0 && splitCard === 0) {
                                    handleEqualSplit("cash_upi");
                                  }
                                }}
                                className={`flex flex-col items-center justify-center p-2 rounded-lg border text-[10px] font-semibold transition-colors ${
                                  isSel
                                    ? "border-primary bg-primary/10 text-primary font-bold shadow-2xs"
                                    : "border-border text-muted-foreground hover:bg-muted"
                                }`}
                              >
                                <Icon className="h-4 w-4 mb-1" />
                                <span>{m.label}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Split Tender Engine UI if split is selected */}
                        {paymentMethod === "split" && (
                          <div className="p-3 bg-muted/40 rounded-xl border border-primary/20 space-y-2.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-foreground text-[11px] flex items-center gap-1">
                                <Split className="h-3.5 w-3.5 text-rentcot-blue" />
                                <span>Multi-Tender Breakdown</span>
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleEqualSplit("cash_upi")}
                                  className="text-[10px] bg-background border px-1.5 py-0.5 rounded hover:bg-muted text-muted-foreground"
                                >
                                  50% Cash / 50% UPI
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEqualSplit("upi_card")}
                                  className="text-[10px] bg-background border px-1.5 py-0.5 rounded hover:bg-muted text-muted-foreground"
                                >
                                  50% UPI / 50% Card
                                </button>
                              </div>
                            </div>

                            {/* Tender 1: Cash */}
                            <div className="grid grid-cols-12 gap-2 items-center">
                              <span className="col-span-3 text-[11px] font-medium flex items-center gap-1">
                                <Banknote className="h-3 w-3 text-emerald-600" /> Cash
                              </span>
                              <div className="col-span-6">
                                <input
                                  type="number"
                                  min={0}
                                  value={splitCash || ""}
                                  onChange={(e) => setSplitCash(Number(e.target.value))}
                                  placeholder="0"
                                  className="w-full p-1.5 text-xs rounded border border-border bg-background"
                                />
                              </div>
                              <div className="col-span-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const rem = Math.max(0, grandTotal - splitUpi - splitCard);
                                    setSplitCash(rem);
                                  }}
                                  className="text-[10px] w-full py-1 text-center bg-background border rounded hover:bg-muted font-medium"
                                >
                                  Fill Rem
                                </button>
                              </div>
                            </div>

                            {/* Tender 2: UPI */}
                            <div className="grid grid-cols-12 gap-2 items-center">
                              <span className="col-span-3 text-[11px] font-medium flex items-center gap-1">
                                <QrCode className="h-3 w-3 text-blue-600" /> UPI
                              </span>
                              <div className="col-span-6">
                                <input
                                  type="number"
                                  min={0}
                                  value={splitUpi || ""}
                                  onChange={(e) => setSplitUpi(Number(e.target.value))}
                                  placeholder="0"
                                  className="w-full p-1.5 text-xs rounded border border-border bg-background"
                                />
                              </div>
                              <div className="col-span-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const rem = Math.max(0, grandTotal - splitCash - splitCard);
                                    setSplitUpi(rem);
                                  }}
                                  className="text-[10px] w-full py-1 text-center bg-background border rounded hover:bg-muted font-medium"
                                >
                                  Fill Rem
                                </button>
                              </div>
                            </div>

                            {/* Tender 3: Card */}
                            <div className="grid grid-cols-12 gap-2 items-center">
                              <span className="col-span-3 text-[11px] font-medium flex items-center gap-1">
                                <CreditCard className="h-3 w-3 text-purple-600" /> Card
                              </span>
                              <div className="col-span-6">
                                <input
                                  type="number"
                                  min={0}
                                  value={splitCard || ""}
                                  onChange={(e) => setSplitCard(Number(e.target.value))}
                                  placeholder="0"
                                  className="w-full p-1.5 text-xs rounded border border-border bg-background"
                                />
                              </div>
                              <div className="col-span-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const rem = Math.max(0, grandTotal - splitCash - splitUpi);
                                    setSplitCard(rem);
                                  }}
                                  className="text-[10px] w-full py-1 text-center bg-background border rounded hover:bg-muted font-medium"
                                >
                                  Fill Rem
                                </button>
                              </div>
                            </div>

                            {/* Optional Reference Numbers for Audit */}
                            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/60">
                              <input
                                type="text"
                                placeholder="UPI Ref / UTR No."
                                value={splitUpiRef}
                                onChange={(e) => setSplitUpiRef(e.target.value)}
                                className="p-1.5 text-[10px] rounded border border-border bg-background"
                              />
                              <input
                                type="text"
                                placeholder="Card Last 4 Digits"
                                maxLength={4}
                                value={splitCardLast4}
                                onChange={(e) => setSplitCardLast4(e.target.value)}
                                className="p-1.5 text-[10px] rounded border border-border bg-background font-mono"
                              />
                            </div>

                            {/* Reconciliation Status Banner */}
                            <div className="pt-1">
                              {splitShortfall > 0 ? (
                                <div className="flex items-center justify-between p-2 rounded bg-destructive/10 text-destructive text-[11px] font-medium">
                                  <span>Short by: ₹{splitShortfall.toLocaleString()}</span>
                                  <span className="text-[10px]">Tendered: ₹{totalSplitTendered.toLocaleString()}</span>
                                </div>
                              ) : splitShortfall < 0 ? (
                                <div className="flex items-center justify-between p-2 rounded bg-amber-500/10 text-amber-700 text-[11px] font-medium">
                                  <span>Cash Change to Guest: ₹{splitChangeToReturn.toLocaleString()}</span>
                                  <span className="text-[10px]">Overpaid</span>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between p-2 rounded bg-emerald-500/10 text-emerald-700 text-[11px] font-medium">
                                  <span className="flex items-center gap-1">
                                    <CheckCircle2 className="h-3.5 w-3.5" /> Balanced: ₹{grandTotal.toLocaleString()}
                                  </span>
                                  <span className="text-[10px] font-bold">Ready to Settle</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Corporate B2B GST Invoicing Toggle */}
                        <div className="p-2 rounded-lg border border-border bg-muted/20 space-y-1.5">
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-foreground">
                            <input
                              type="checkbox"
                              checked={isB2B}
                              onChange={(e) => setIsB2B(e.target.checked)}
                              className="rounded border-border text-primary focus:ring-primary"
                            />
                            <Briefcase className="h-3.5 w-3.5 text-primary" />
                            <span>Corporate / B2B GST Invoice (ITC Claim)</span>
                          </label>

                          {isB2B && (
                            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/60">
                              <input
                                type="text"
                                placeholder="Company Name"
                                value={b2bCompanyName}
                                onChange={(e) => setB2bCompanyName(e.target.value)}
                                className="p-1.5 text-xs rounded border border-border bg-background"
                              />
                              <input
                                type="text"
                                placeholder="Company GSTIN"
                                value={b2bCompanyGstin}
                                onChange={(e) => setB2bCompanyGstin(e.target.value)}
                                className="p-1.5 text-xs rounded border border-border bg-background font-mono"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* In-House Room Notice */
                      <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-900 text-xs flex items-center gap-2">
                        <BedDouble className="h-4 w-4 text-blue-700 shrink-0" />
                        <div>
                          <div className="font-bold">Posting to Room Folio</div>
                          <div className="text-[10px] text-blue-800">
                            Charges will be transferred to {guestName}'s room bill ({selectedRoom}) for checkout settlement.
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Promotional Discount */}
                    <div className="flex items-center justify-between pt-1 border-t border-border text-xs">
                      <span className="text-muted-foreground flex items-center gap-1 font-medium">
                        <Percent className="h-3.5 w-3.5 text-primary" />
                        <span>Discount:</span>
                      </span>
                      <div className="flex items-center gap-1">
                        {[0, 5, 10, 15, 20].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => setDiscountPercent(pct)}
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors ${
                              discountPercent === pct
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border text-muted-foreground hover:bg-muted"
                            }`}
                          >
                            {pct === 0 ? "None" : `${pct}%`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Summary Totals */}
                    <div className="space-y-1 pt-1 border-t border-border text-xs">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>

                      {discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-semibold">
                          <span>Discount ({discountPercent}%)</span>
                          <span>-₹{discountAmount.toLocaleString()}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-muted-foreground">
                        <span>GST (CGST + SGST)</span>
                        <span className="font-mono">₹{totalTax.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between text-sm sm:text-base font-extrabold text-foreground pt-1 border-t border-border">
                        <span>Grand Total</span>
                        <span className="text-primary font-mono">₹{grandTotal.toLocaleString()}</span>
                      </div>

                      <div className="text-[10px] text-muted-foreground italic truncate">
                        {numberToIndianWords(grandTotal)}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={handleCheckoutAndGenerateInvoice}
                      disabled={chargeTarget === "direct" && paymentMethod === "split" && !isSplitBalanced}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground min-h-[44px] text-xs sm:text-sm font-bold gap-2 shadow-md"
                    >
                      <Receipt className="h-4 w-4" />
                      <span>
                        {chargeTarget === "room"
                          ? `Post ₹${grandTotal.toLocaleString()} to Room Folio (${selectedRoom})`
                          : `Settle ₹${grandTotal.toLocaleString()} & Generate GST Invoice`}
                      </span>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Printable GST Tax Invoice Modal (Dual View: Standard A4 vs 80mm Thermal Slip) */}
      {activeInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-foreground/40 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Modal Actions Bar (Hidden on print) */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 print:hidden">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <div>
                  <span className="font-bold text-foreground text-sm">GST Tax Invoice Ready</span>
                  <div className="text-[11px] text-muted-foreground font-mono">{activeInvoice.invoiceNumber}</div>
                </div>
              </div>

              {/* View Toggle + Action Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                {/* Format Toggle */}
                <div className="flex items-center border border-border rounded-lg p-0.5 bg-muted/40 mr-1">
                  <button
                    onClick={() => setInvoiceViewFormat("standard")}
                    className={`px-2 py-1 text-[11px] font-semibold rounded ${
                      invoiceViewFormat === "standard"
                        ? "bg-background text-foreground shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Standard A4
                  </button>
                  <button
                    onClick={() => setInvoiceViewFormat("thermal")}
                    className={`px-2 py-1 text-[11px] font-semibold rounded ${
                      invoiceViewFormat === "thermal"
                        ? "bg-background text-foreground shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    80mm Thermal
                  </button>
                </div>

                <Button
                  size="sm"
                  onClick={handlePrint}
                  className="bg-primary text-primary-foreground text-xs h-8 gap-1 font-semibold"
                  title="Print or Save as PDF"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print</span>
                </Button>

                <a
                  href={`https://wa.me/${(activeInvoice.guestPhone || "").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    generateInvoiceWhatsAppText(activeInvoice)
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs h-8 px-2.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 font-semibold"
                  title="Share invoice on WhatsApp"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={generateInvoiceMailto(activeInvoice)}
                  className="inline-flex items-center gap-1 text-xs h-8 px-2.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                  title="Send invoice via Email"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Email</span>
                </a>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownloadInvoice(activeInvoice)}
                  className="text-xs h-8 gap-1 font-medium"
                  title="Download HTML file"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </Button>

                <button
                  onClick={() => setActiveInvoice(null)}
                  className="p-1.5 rounded-md text-muted-foreground hover:bg-muted ml-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Standard A4 View vs 80mm Thermal Slip View */}
            {invoiceViewFormat === "standard" ? (
              <div
                id="printable-invoice"
                className="p-6 border border-border rounded-xl bg-background space-y-5 text-xs font-sans shadow-xs"
              >
                {/* Top Header: Resort Branding */}
                <div className="flex justify-between items-start border-b border-border pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      {activeInvoice.brandingSnapshot.customLogoUrl ? (
                        <img
                          src={activeInvoice.brandingSnapshot.customLogoUrl}
                          alt={activeInvoice.brandingSnapshot.name}
                          className="h-12 w-auto max-w-[150px] object-contain rounded-md border border-border/50 p-1 bg-white"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600/10 text-amber-600 font-black text-lg border border-amber-600/20">
                          {activeInvoice.brandingSnapshot.logoType === "tent"
                            ? "⛺"
                            : activeInvoice.brandingSnapshot.logoType === "treepine"
                            ? "🌲"
                            : "🏛️"}
                        </div>
                      )}
                      <div>
                        <div className="font-black text-lg text-foreground tracking-tight leading-tight">
                          {activeInvoice.brandingSnapshot.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-medium">
                          {activeInvoice.brandingSnapshot.tradeName}
                        </div>
                        {activeInvoice.brandingSnapshot.tagline && (
                          <div className="text-[9px] text-muted-foreground/80 italic">
                            {activeInvoice.brandingSnapshot.tagline}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-muted-foreground text-[11px] pt-1">
                      <div>{activeInvoice.brandingSnapshot.addressLine}</div>
                      <div>{activeInvoice.brandingSnapshot.cityStatePin}</div>
                      <div className="flex items-center gap-3 pt-0.5 font-mono text-[10px]">
                        <span>Ph: {activeInvoice.brandingSnapshot.phone}</span>
                        <span>Email: {activeInvoice.brandingSnapshot.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1 text-[11px] font-mono">
                      <span className="font-bold text-foreground">
                        GSTIN: {activeInvoice.brandingSnapshot.gstin}
                      </span>
                      {activeInvoice.brandingSnapshot.fssai && (
                        <span className="text-muted-foreground">
                          FSSAI: {activeInvoice.brandingSnapshot.fssai}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <Badge
                      variant="outline"
                      className="font-mono text-xs font-bold border-foreground/30 bg-muted/30"
                    >
                      GST TAX INVOICE
                    </Badge>
                    <div className="font-mono font-extrabold text-foreground mt-1 text-sm">
                      {activeInvoice.invoiceNumber}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{activeInvoice.date}</div>
                    <div className="text-[10px] text-muted-foreground">Place of Supply: {activeInvoice.brandingSnapshot.stateCode}</div>
                    <div className="text-[10px] text-muted-foreground">Reverse Charge: No</div>
                  </div>
                </div>

                {/* Guest & Billing Details */}
                <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-muted/30 border border-border/50 text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                      Billed To Guest:
                    </span>
                    <div className="font-bold text-foreground">{activeInvoice.guestName}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {activeInvoice.roomOrPitch} {activeInvoice.guestPhone ? `• ${activeInvoice.guestPhone}` : ""}
                    </div>
                    {/* Guest Headcount & Currency Badges */}
                    <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                      <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30 font-semibold px-1.5 py-0">
                        👥 Pax: {activeInvoice.adultsCount || 1} Adult{(activeInvoice.adultsCount || 1) > 1 ? "s" : ""}{activeInvoice.kidsCount ? `, ${activeInvoice.kidsCount} Kid${activeInvoice.kidsCount > 1 ? "s" : ""}` : ""}{activeInvoice.petsCount ? `, ${activeInvoice.petsCount} Pet${activeInvoice.petsCount > 1 ? "s" : ""}` : ""}
                      </Badge>
                      <Badge variant="clean" className="text-[10px] font-mono text-emerald-700 bg-emerald-500/10 border-emerald-500/30 px-1.5 py-0">
                        Currency: {activeInvoice.currency || "INR (₹)"}
                      </Badge>
                    </div>

                    {activeInvoice.stayDetails && (
                      <div className="mt-1.5 p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px]">
                        <span className="font-bold text-emerald-800">🛏️ Stay Accommodation: </span>
                        <span className="text-foreground font-semibold">{activeInvoice.stayDetails.unitName} ({activeInvoice.stayDetails.duration})</span>
                        <div className="text-muted-foreground mt-0.5">In: {activeInvoice.stayDetails.checkIn} • Out: {activeInvoice.stayDetails.checkOut}</div>
                      </div>
                    )}

                    {activeInvoice.b2bDetails && (
                      <div className="mt-1.5 pt-1.5 border-t border-border/60">
                        <div className="font-bold text-rentcot-blue text-[11px]">
                          {activeInvoice.b2bDetails.companyName}
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground">
                          GSTIN: {activeInvoice.b2bDetails.companyGstin}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                      Settlement Details:
                    </span>
                    <div className="font-bold text-foreground">{activeInvoice.paymentMethod}</div>
                    <div className="text-[11px] text-emerald-600 font-medium">Status: Settled &amp; Cleared</div>
                    <div className="text-[10px] text-muted-foreground">Cashier: {activeInvoice.cashierName}</div>
                  </div>
                </div>

                {/* Itemized Table */}
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground font-semibold text-[11px]">
                      <th className="py-2">Item Description</th>
                      <th className="py-2 font-mono">SAC/HSN</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right">Rate</th>
                      <th className="py-2 text-right">GST</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {activeInvoice.items.map((it, idx) => (
                      <tr key={idx} className="text-foreground">
                        <td className="py-2 font-medium">
                          {it.name} {it.unit && <span className="text-[10px] text-muted-foreground">({it.unit})</span>}
                        </td>
                        <td className="py-2 font-mono text-[11px] text-muted-foreground">{it.sacCode}</td>
                        <td className="py-2 text-center">{it.quantity}</td>
                        <td className="py-2 text-right">₹{it.price.toLocaleString()}</td>
                        <td className="py-2 text-right text-muted-foreground">{(it.taxRate * 100).toFixed(0)}%</td>
                        <td className="py-2 text-right font-semibold">₹{(it.price * it.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Statutory SAC Tax Summary Breakdown */}
                <div className="pt-2">
                  <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider mb-1">
                    Statutory Tax Breakdown (CGST &amp; SGST Split)
                  </div>
                  <table className="w-full text-[10px] border-collapse bg-muted/20 rounded border border-border">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="p-1.5 text-left font-mono">SAC Code</th>
                        <th className="p-1.5 text-right">Taxable Value</th>
                        <th className="p-1.5 text-right">CGST Rate</th>
                        <th className="p-1.5 text-right">CGST Amt</th>
                        <th className="p-1.5 text-right">SGST Rate</th>
                        <th className="p-1.5 text-right">SGST Amt</th>
                        <th className="p-1.5 text-right font-bold">Total Tax</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {activeInvoice.taxSummary.map((tx) => (
                        <tr key={tx.sacCode} className="text-foreground">
                          <td className="p-1.5 font-mono">{tx.sacCode}</td>
                          <td className="p-1.5 text-right">₹{tx.taxableValue.toLocaleString()}</td>
                          <td className="p-1.5 text-right">{(tx.cgstRate * 100).toFixed(1)}%</td>
                          <td className="p-1.5 text-right">₹{tx.cgstAmount.toFixed(2)}</td>
                          <td className="p-1.5 text-right">{(tx.sgstRate * 100).toFixed(1)}%</td>
                          <td className="p-1.5 text-right">₹{tx.sgstAmount.toFixed(2)}</td>
                          <td className="p-1.5 text-right font-bold">₹{tx.totalTax.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals Section */}
                <div className="pt-2 border-t border-border space-y-1 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{activeInvoice.subtotal.toLocaleString()}</span>
                  </div>
                  {activeInvoice.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Promotional Discount</span>
                      <span>-₹{activeInvoice.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>Central GST (CGST)</span>
                    <span>₹{(activeInvoice.tax / 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>State GST (SGST)</span>
                    <span>₹{(activeInvoice.tax / 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-foreground pt-2 border-t border-border">
                    <span>Grand Total Paid</span>
                    <span className="text-rentcot-blue text-lg font-black">
                      ₹{activeInvoice.grandTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground italic pt-0.5">
                    {activeInvoice.amountInWords}
                  </div>
                </div>

                {/* Bank / QR Settlement details */}
                <div className="p-2.5 rounded-lg border border-border bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px]">
                  <div>
                    <strong>Bank Account Details:</strong> {activeInvoice.brandingSnapshot.bankName} | A/c: {activeInvoice.brandingSnapshot.bankAccountNo} | IFSC: {activeInvoice.brandingSnapshot.bankIfsc}
                    <div className="text-muted-foreground">UPI ID: {activeInvoice.brandingSnapshot.upiVpa}</div>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 font-mono text-[9px] text-muted-foreground">
                    <QrCode className="h-4 w-4 text-rentcot-blue" />
                    <span>UPI QR Verified</span>
                  </div>
                </div>

                {/* Non-removable Rentcot OS Verification Footer */}
                <div className="pt-3 border-t-2 border-dashed border-border flex flex-col sm:flex-row items-center justify-between gap-3 bg-muted/10 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="relative h-6 w-24">
                      <Image
                        src="/brand/rentcot-logo.png"
                        alt="Rentcot Property OS"
                        fill
                        className="object-contain object-left"
                      />
                    </div>
                    <div className="text-[10px] text-muted-foreground leading-tight">
                      <div>Powered by Rentcot Property OS</div>
                      <div className="text-[9px] text-muted-foreground/80">
                        Multi-Tenant Hospitality Engine for Resorts, Farmhouses &amp; Camping Retreats
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-mono">
                    <ShieldCheck className="h-3.5 w-3.5 text-rentcot-blue" />
                    <span>Verified GST Invoice • Audit Ledger Safe</span>
                  </div>
                </div>
              </div>
            ) : (
              /* 80mm Thermal Receipt View */
              <div
                id="printable-thermal-invoice"
                className="max-w-[340px] mx-auto p-4 border border-dashed border-border rounded-lg bg-background text-[11px] font-mono space-y-3 shadow-inner"
              >
                <div className="text-center space-y-1">
                  <div className="font-extrabold text-sm uppercase">
                    {activeInvoice.brandingSnapshot.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {activeInvoice.brandingSnapshot.addressLine}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    GSTIN: {activeInvoice.brandingSnapshot.gstin}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Ph: {activeInvoice.brandingSnapshot.phone}
                  </div>
                  <div className="border-b border-dashed border-border my-2" />
                  <div className="font-bold">*** CASH / POS RECEIPT ***</div>
                  <div>Inv: {activeInvoice.invoiceNumber}</div>
                  <div>Date: {activeInvoice.date}</div>
                  <div>Guest: {activeInvoice.guestName}</div>
                  <div>Ref: {activeInvoice.roomOrPitch}</div>
                  <div className="text-primary font-semibold">
                    Pax: {activeInvoice.adultsCount || 1} Adults, {activeInvoice.kidsCount || 0} Kids{activeInvoice.petsCount ? `, ${activeInvoice.petsCount} Pets` : ""}
                  </div>
                  {activeInvoice.stayDetails && (
                    <div className="text-[10px] text-emerald-700 font-semibold border-y border-dashed border-border py-1 my-1 text-left">
                      Stay: {activeInvoice.stayDetails.unitName}
                      <br />
                      Dur: {activeInvoice.stayDetails.duration}
                      <br />
                      In: {activeInvoice.stayDetails.checkIn}
                      <br />
                      Out: {activeInvoice.stayDetails.checkOut}
                    </div>
                  )}
                  <div className="text-[10px] text-muted-foreground">
                    Currency: {activeInvoice.currency || "INR (₹)"}
                  </div>
                  {activeInvoice.b2bDetails && (
                    <div className="text-[9px] text-left pt-1">
                      Co: {activeInvoice.b2bDetails.companyName}
                      <br />
                      GST: {activeInvoice.b2bDetails.companyGstin}
                    </div>
                  )}
                </div>

                <div className="border-b border-dashed border-border" />

                <div className="space-y-1.5">
                  {activeInvoice.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between">
                      <div className="truncate pr-1">
                        {it.quantity}x {it.name}
                      </div>
                      <div className="shrink-0">₹{(it.quantity * it.price).toLocaleString()}</div>
                    </div>
                  ))}
                </div>

                <div className="border-b border-dashed border-border" />

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{activeInvoice.subtotal.toLocaleString()}</span>
                  </div>
                  {activeInvoice.discount > 0 && (
                    <div className="flex justify-between">
                      <span>Discount:</span>
                      <span>-₹{activeInvoice.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>CGST:</span>
                    <span>₹{(activeInvoice.tax / 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SGST:</span>
                    <span>₹{(activeInvoice.tax / 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-xs pt-1 border-t border-border">
                    <span>TOTAL:</span>
                    <span>₹{activeInvoice.grandTotal.toLocaleString()}</span>
                  </div>
                  <div className="text-[9px] pt-1">
                    Mode: {activeInvoice.paymentMethod}
                  </div>
                  <div className="text-[9px]">
                    Cashier: {activeInvoice.cashierName}
                  </div>
                </div>

                <div className="border-b border-dashed border-border my-2" />

                <div className="text-center text-[9px] text-muted-foreground space-y-0.5">
                  <div>Thank You For Visiting!</div>
                  <div>*** Powered by Rentcot Property OS ***</div>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end print:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveInvoice(null)}
                className="text-xs h-9"
              >
                Close & Ready for Next Order
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cashier Shift Register & Drawer Summary Modal */}
      {isShiftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <Banknote className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Cashier Register & Drawer Summary</h3>
                  <p className="text-xs text-muted-foreground">{cashierShift.shiftId} • {cashierShift.cashierName}</p>
                </div>
              </div>
              <button
                onClick={() => setIsShiftModalOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/30 border border-border/60">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Shift Started</span>
                  <div className="font-semibold text-foreground">{cashierShift.openedAt}</div>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Starting Cash Float</span>
                  <div className="font-semibold text-foreground">₹{cashierShift.initialFloat.toLocaleString()}</div>
                </div>
              </div>

              {/* Breakdown Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                  <span className="text-[10px] text-emerald-700 font-bold block">Cash in Register Drawer</span>
                  <div className="text-lg font-black text-emerald-700">
                    ₹{(cashierShift.initialFloat + cashierShift.cashCollected).toLocaleString()}
                  </div>
                  <span className="text-[9px] text-muted-foreground">
                    Float ₹{cashierShift.initialFloat} + Collected ₹{cashierShift.cashCollected}
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-blue-500/20 bg-blue-500/5">
                  <span className="text-[10px] text-blue-700 font-bold block">UPI Direct Collected</span>
                  <div className="text-lg font-black text-blue-700">
                    ₹{cashierShift.upiCollected.toLocaleString()}
                  </div>
                  <span className="text-[9px] text-muted-foreground">Direct to {branding.upiVpa}</span>
                </div>

                <div className="p-3 rounded-xl border border-purple-500/20 bg-purple-500/5">
                  <span className="text-[10px] text-purple-700 font-bold block">Card POS Swiped</span>
                  <div className="text-lg font-black text-purple-700">
                    ₹{cashierShift.cardCollected.toLocaleString()}
                  </div>
                  <span className="text-[9px] text-muted-foreground">EDC Terminal settled</span>
                </div>

                <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5">
                  <span className="text-[10px] text-amber-700 font-bold block">Transferred to Room Folios</span>
                  <div className="text-lg font-black text-amber-700">
                    ₹{cashierShift.folioCharged.toLocaleString()}
                  </div>
                  <span className="text-[9px] text-muted-foreground">To be settled at checkout</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-border bg-card space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Invoices Billed:</span>
                  <span className="font-bold text-foreground">{cashierShift.invoicesCount} invoices</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total GST Collected:</span>
                  <span className="font-bold text-foreground">₹{cashierShift.totalGst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-extrabold text-sm pt-1 border-t border-border">
                  <span>Gross Shift Turnover:</span>
                  <span className="text-rentcot-blue">₹{cashierShift.totalGross.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground font-mono">
                Audit Status: Balanced &amp; Verifiable
              </span>
              <Button
                size="sm"
                onClick={() => {
                  alert("Shift Handover Report printed to thermal receipt.");
                  setIsShiftModalOpen(false);
                }}
                className="text-xs h-8 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Print Shift Handover
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Custom Item Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-foreground text-sm sm:text-base">Add Custom Item / Charge</h3>
              </div>
              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-foreground block mb-1">
                  Item Description / Service Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Broken Wine Glass Replacement / Late Checkout Fee"
                  value={customItemName}
                  onChange={(e) => setCustomItemName(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-border bg-background"
                />
              </div>

              {/* Pricing Mode Toggle */}
              <div>
                <label className="text-[11px] font-semibold text-foreground block mb-1">
                  Pricing Mode & Headcount Handling (INR ₹)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomPricingMode("flat")}
                    className={`p-2 rounded-lg border text-left flex flex-col gap-0.5 transition-all ${
                      customPricingMode === "flat"
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                        : "border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <span className="text-xs">Flat Single Charge</span>
                    <span className="text-[10px] opacity-80 font-normal">Fixed amount (e.g. damages, transport)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomPricingMode("per_person")}
                    className={`p-2 rounded-lg border text-left flex flex-col gap-0.5 transition-all ${
                      customPricingMode === "per_person"
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                        : "border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <span className="text-xs flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> Per Head (Adults & Kids)
                    </span>
                    <span className="text-[10px] opacity-80 font-normal">Multiplies by active guest headcount</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-foreground block mb-1">
                    Category
                  </label>
                  <select
                    value={customItemCategory}
                    onChange={(e) => {
                      const cat = e.target.value as POSCategory;
                      setCustomItemCategory(cat);
                      if (cat === "food" || cat === "beverage") {
                        setCustomItemTaxRate(0.05);
                        setCustomItemSac("996331");
                      } else if (cat === "bbq_campfire") {
                        setCustomItemTaxRate(0.18);
                        setCustomItemSac("999699");
                      } else if (cat === "activities") {
                        setCustomItemTaxRate(0.18);
                        setCustomItemSac("999699");
                      } else {
                        setCustomItemTaxRate(0.18);
                        setCustomItemSac("9997");
                      }
                    }}
                    className="w-full p-2 text-xs rounded-lg border border-border bg-background"
                  >
                    <option value="food">F&B Dining (5% GST)</option>
                    <option value="beverage">Beverage (5% GST)</option>
                    <option value="bbq_campfire">BBQ & Campfire (18% GST)</option>
                    <option value="activities">Adventure Activity (18% GST)</option>
                    <option value="farm_produce">Farm Fresh (0% GST)</option>
                    <option value="other">Other Service / Damage (18% GST)</option>
                  </select>
                </div>

                {customPricingMode === "flat" ? (
                  <div>
                    <label className="text-[11px] font-semibold text-foreground block mb-1">
                      Flat Amount (₹ INR)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={customItemPrice}
                      onChange={(e) => setCustomItemPrice(Number(e.target.value))}
                      className="w-full p-2 text-xs rounded-lg border border-border bg-background font-bold"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-[11px] font-semibold text-foreground block mb-1">
                      Adult Rate (₹ INR / adult)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={customItemPrice}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCustomItemPrice(val);
                        // Suggest 50% for kids
                        if (customItemKidPrice === Math.round(customItemPrice * 0.5)) {
                          setCustomItemKidPrice(Math.round(val * 0.5));
                        }
                      }}
                      className="w-full p-2 text-xs rounded-lg border border-border bg-background font-bold"
                    />
                  </div>
                )}
              </div>

              {customPricingMode === "per_person" && (
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/80 space-y-2">
                  <div className="grid grid-cols-2 gap-3 items-center">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-semibold text-foreground">
                          Kid Rate (₹ INR / kid)
                        </label>
                        <button
                          type="button"
                          onClick={() => setCustomItemKidPrice(Math.round(customItemPrice * 0.5))}
                          className="text-[9px] text-primary hover:underline font-medium"
                        >
                          50% of adult
                        </button>
                      </div>
                      <input
                        type="number"
                        min={0}
                        value={customItemKidPrice}
                        onChange={(e) => setCustomItemKidPrice(Number(e.target.value))}
                        className="w-full p-2 text-xs rounded-lg border border-border bg-background font-bold"
                      />
                    </div>

                    <div className="text-[11px] space-y-1">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                        Headcount Calculation
                      </span>
                      <div className="font-semibold text-foreground">
                        {adultsCount} Adults × ₹{customItemPrice} = ₹{(adultsCount * customItemPrice).toLocaleString("en-IN")}
                      </div>
                      {kidsCount > 0 && (
                        <div className="text-muted-foreground">
                          {kidsCount} Kids × ₹{customItemKidPrice} = ₹{(kidsCount * customItemKidPrice).toLocaleString("en-IN")}
                        </div>
                      )}
                      <div className="text-xs font-black text-rentcot-blue pt-0.5 border-t border-border">
                        Total: ₹{(adultsCount * customItemPrice + kidsCount * customItemKidPrice).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-foreground block mb-1">
                    SAC / HSN Code
                  </label>
                  <input
                    type="text"
                    value={customItemSac}
                    onChange={(e) => setCustomItemSac(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-border bg-background font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-foreground block mb-1">
                    GST Rate
                  </label>
                  <select
                    value={customItemTaxRate}
                    onChange={(e) => setCustomItemTaxRate(Number(e.target.value))}
                    className="w-full p-2 text-xs rounded-lg border border-border bg-background"
                  >
                    <option value={0.0}>0% GST (Exempt)</option>
                    <option value={0.05}>5% GST (2.5% CGST + 2.5% SGST)</option>
                    <option value={0.12}>12% GST (6% CGST + 6% SGST)</option>
                    <option value={0.18}>18% GST (9% CGST + 9% SGST)</option>
                    <option value={0.28}>28% GST (14% CGST + 14% SGST)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCustomModalOpen(false)}
                className="text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAddCustomItem}
                disabled={!customItemName.trim()}
                className="bg-primary text-primary-foreground text-xs h-9 font-semibold"
              >
                Add to Cart & Folio
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Branding Customizer Modal */}
      {isBrandingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-amber-600/10 flex items-center justify-center text-amber-600">
                  <Building className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Invoice Branding & Resort Address</h3>
                  <p className="text-xs text-muted-foreground">Configure your property name, trade entity, address, and GSTIN for bills</p>
                </div>
              </div>
              <button
                onClick={() => setIsBrandingModalOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Preset Buttons */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground block">Quick Property Presets:</label>
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => applyPreset("farmhouse")}
                  className={`text-xs h-8 ${branding.name === defaultBrandingPresets.farmhouse.name ? "border-primary bg-primary/10 text-primary font-bold" : ""}`}
                >
                  🌲 Green Valley Farmhouse
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => applyPreset("campsite")}
                  className={`text-xs h-8 ${branding.name === defaultBrandingPresets.campsite.name ? "border-primary bg-primary/10 text-primary font-bold" : ""}`}
                >
                  ⛺ Wildwoods Campsite
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => applyPreset("resort")}
                  className={`text-xs h-8 ${branding.name === defaultBrandingPresets.resort.name ? "border-primary bg-primary/10 text-primary font-bold" : ""}`}
                >
                  🏛️ Palm Oasis Luxury Resort
                </Button>
              </div>
            </div>

            {/* Logo Configuration */}
            <div className="p-3 rounded-xl border border-border bg-muted/30 space-y-2.5">
              <label className="text-xs font-bold text-foreground block">
                Resort / Property Logo for Invoice Header
              </label>

              <div className="flex items-center gap-4">
                {branding.customLogoUrl ? (
                  <div className="relative h-12 w-28 rounded-lg border border-border bg-background p-1 flex items-center justify-center overflow-hidden">
                    <img
                      src={branding.customLogoUrl}
                      alt="Logo Preview"
                      className="h-full w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setBranding({ ...branding, customLogoUrl: undefined })}
                      className="absolute top-0 right-0 h-4 w-4 bg-destructive text-white rounded-bl flex items-center justify-center text-[10px]"
                      title="Remove Logo"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="h-12 w-28 rounded-lg border border-dashed border-border bg-background/50 flex flex-col items-center justify-center text-[10px] text-muted-foreground">
                    <span>No Custom Logo</span>
                    <span className="text-[9px] opacity-70">Using Icon Preset</span>
                  </div>
                )}

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-colors shadow-2xs">
                      <span>Upload Image (PNG/JPG)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              setBranding({ ...branding, customLogoUrl: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {branding.customLogoUrl && (
                      <span className="text-[11px] text-emerald-600 font-medium">✓ Custom Logo Active</span>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Or paste Logo Image URL (https://...)"
                    value={branding.customLogoUrl || ""}
                    onChange={(e) => setBranding({ ...branding, customLogoUrl: e.target.value })}
                    className="w-full p-2 text-xs rounded-lg border border-border bg-background text-[11px]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs pt-2">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Resort / Property Display Name</label>
                <input
                  type="text"
                  value={branding.name}
                  onChange={(e) => setBranding({ ...branding, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-border bg-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Legal Trade / Entity Name</label>
                  <input
                    type="text"
                    value={branding.tradeName}
                    onChange={(e) => setBranding({ ...branding, tradeName: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-border bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Property Tagline</label>
                  <input
                    type="text"
                    value={branding.tagline}
                    onChange={(e) => setBranding({ ...branding, tagline: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-border bg-background"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Physical Address (Plot / Road)</label>
                <input
                  type="text"
                  value={branding.addressLine}
                  onChange={(e) => setBranding({ ...branding, addressLine: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-border bg-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">City, District & PIN Code</label>
                  <input
                    type="text"
                    value={branding.cityStatePin}
                    onChange={(e) => setBranding({ ...branding, cityStatePin: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-border bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">State & State Code</label>
                  <input
                    type="text"
                    value={branding.stateCode}
                    onChange={(e) => setBranding({ ...branding, stateCode: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-border bg-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">GSTIN Number</label>
                  <input
                    type="text"
                    value={branding.gstin}
                    onChange={(e) => setBranding({ ...branding, gstin: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-border bg-background font-mono uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">FSSAI License No.</label>
                  <input
                    type="text"
                    value={branding.fssai}
                    onChange={(e) => setBranding({ ...branding, fssai: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-border bg-background font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Official Phone</label>
                  <input
                    type="text"
                    value={branding.phone}
                    onChange={(e) => setBranding({ ...branding, phone: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-border bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Billing Email</label>
                  <input
                    type="text"
                    value={branding.email}
                    onChange={(e) => setBranding({ ...branding, email: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-border bg-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Bank & Account No.</label>
                  <input
                    type="text"
                    value={branding.bankName || ""}
                    onChange={(e) => setBranding({ ...branding, bankName: e.target.value })}
                    placeholder="HDFC Bank Shamirpet"
                    className="w-full p-2 text-xs rounded-lg border border-border bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">UPI VPA Handle</label>
                  <input
                    type="text"
                    value={branding.upiVpa || ""}
                    onChange={(e) => setBranding({ ...branding, upiVpa: e.target.value })}
                    placeholder="greenvalley@hdfcbank"
                    className="w-full p-2 text-xs rounded-lg border border-border bg-background font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                Invoices will be branded with your details + Powered by Rentcot footer
              </span>
              <Button
                onClick={() => setIsBrandingModalOpen(false)}
                className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white text-xs h-9 font-semibold"
              >
                Save & Apply to Invoices
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-rentcot-blue" />
                <h3 className="font-bold text-foreground text-base">Past Invoices & Receipts</h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded-md text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="divide-y divide-border">
              {invoiceHistory.map((inv) => (
                <div key={inv.invoiceNumber} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-mono font-bold text-foreground">{inv.invoiceNumber}</div>
                    <div className="text-muted-foreground">
                      {inv.date} • {inv.guestName} ({inv.roomOrPitch})
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {inv.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-bold text-foreground">₹{inv.grandTotal.toLocaleString()}</div>
                      <Badge variant="clean" className="text-[10px]">
                        {inv.paymentMethod}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setActiveInvoice(inv);
                        setShowHistoryModal(false);
                      }}
                      className="text-xs h-8"
                    >
                      View / Print
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add / Register Guest in POS Modal */}
      {isAddGuestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Register Guest / Visitor in POS</h3>
                  <p className="text-xs text-muted-foreground">
                    Set up guest name, mobile number, stay/dining area, and headcount in INR (₹)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddGuestModalOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Guest Profile Type */}
              <div>
                <label className="text-[11px] font-semibold text-foreground block mb-1.5">
                  Guest Visit Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewGuestType("in_house");
                      if (!newGuestRoomOrTable) setNewGuestRoomOrTable("Tent T-04 (Meadow)");
                    }}
                    className={`p-2.5 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                      newGuestType === "in_house"
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                        : "border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <span className="text-xs">🏡 In-House Stay</span>
                    <span className="text-[9px] opacity-80 font-normal">Villa, Cottage, or Tent</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewGuestType("walk_in_dining");
                      if (!newGuestRoomOrTable) setNewGuestRoomOrTable("Table 07 (Lawn)");
                    }}
                    className={`p-2.5 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                      newGuestType === "walk_in_dining"
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                        : "border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <span className="text-xs">🍽️ Walk-in Dining</span>
                    <span className="text-[9px] opacity-80 font-normal">Restaurant / Lawn Table</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewGuestType("day_picnic");
                      if (!newGuestRoomOrTable) setNewGuestRoomOrTable("Pool Cabana #02");
                    }}
                    className={`p-2.5 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                      newGuestType === "day_picnic"
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                        : "border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <span className="text-xs">🏊 Day Picnic / Event</span>
                    <span className="text-[9px] opacity-80 font-normal">Passes, BBQ, Pool Cabana</span>
                  </button>
                </div>
              </div>

              {/* Guest Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-foreground block mb-1">
                    Guest Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra"
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-border bg-background font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-foreground block mb-1">
                    Mobile Phone (For WhatsApp Invoice) *
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={newGuestPhone}
                    onChange={(e) => setNewGuestPhone(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-border bg-background font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-foreground block mb-1">
                    {newGuestType === "in_house"
                      ? "Room / Tent / Pitch Identifier *"
                      : newGuestType === "walk_in_dining"
                      ? "Table / Dining Area *"
                      : "Cabana / Activity Venue *"}
                  </label>
                  <input
                    type="text"
                    placeholder={
                      newGuestType === "in_house"
                        ? "e.g. Tent T-04 (Meadow)"
                        : newGuestType === "walk_in_dining"
                        ? "e.g. Table 05 (Garden View)"
                        : "e.g. Pool Cabana #02"
                    }
                    value={newGuestRoomOrTable}
                    onChange={(e) => setNewGuestRoomOrTable(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-border bg-background"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-foreground block mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="guest@example.com"
                    value={newGuestEmail}
                    onChange={(e) => setNewGuestEmail(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-border bg-background"
                  />
                </div>
              </div>

              {/* Headcount Steppers: Number of Guests (Adults), Kids & Pets */}
              <div className="p-3.5 rounded-xl bg-muted/30 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-bold text-foreground text-xs">Guest Headcount (Pax &amp; Pets)</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono border-primary/40 text-primary">
                    Total: {newGuestAdults + newGuestKids} Pax {newGuestPets > 0 && `• ${newGuestPets} Pet${newGuestPets > 1 ? "s" : ""}`}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Adults */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border">
                    <div>
                      <div className="font-semibold text-xs text-foreground">Adults</div>
                      <div className="text-[10px] text-muted-foreground">Age 12+ years</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setNewGuestAdults((p) => Math.max(1, p - 1))}
                        className="h-7 w-7 rounded-md border border-border bg-card flex items-center justify-center text-sm font-bold hover:bg-muted"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-sm text-foreground">
                        {newGuestAdults}
                      </span>
                      <button
                        type="button"
                        onClick={() => setNewGuestAdults((p) => p + 1)}
                        className="h-7 w-7 rounded-md border border-border bg-card flex items-center justify-center text-sm font-bold hover:bg-muted"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Kids */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border">
                    <div>
                      <div className="font-semibold text-xs text-foreground flex items-center gap-1">
                        <Baby className="h-3.5 w-3.5 text-amber-500" />
                        Kids
                      </div>
                      <div className="text-[10px] text-muted-foreground">Age 5-11 yrs</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setNewGuestKids((p) => Math.max(0, p - 1))}
                        className="h-7 w-7 rounded-md border border-border bg-card flex items-center justify-center text-sm font-bold hover:bg-muted"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-sm text-foreground">
                        {newGuestKids}
                      </span>
                      <button
                        type="button"
                        onClick={() => setNewGuestKids((p) => p + 1)}
                        className="h-7 w-7 rounded-md border border-border bg-card flex items-center justify-center text-sm font-bold hover:bg-muted"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Pets */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border">
                    <div>
                      <div className="font-semibold text-xs text-foreground flex items-center gap-1">
                        <Dog className="h-3.5 w-3.5 text-purple-600" />
                        Pets
                      </div>
                      <div className="text-[10px] text-muted-foreground">Dogs/Cats/Pets</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setNewGuestPets((p) => Math.max(0, p - 1))}
                        className="h-7 w-7 rounded-md border border-border bg-card flex items-center justify-center text-sm font-bold hover:bg-muted"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-sm text-foreground">
                        {newGuestPets}
                      </span>
                      <button
                        type="button"
                        onClick={() => setNewGuestPets((p) => p + 1)}
                        className="h-7 w-7 rounded-md border border-border bg-card flex items-center justify-center text-sm font-bold hover:bg-muted"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                  <IndianRupee className="h-3 w-3 text-emerald-600" />
                  <span>Buffets, BBQ dinners, stays, and pet fees will automatically calculate in INR (₹) based on this headcount.</span>
                </div>
              </div>

              {/* Corporate GST Toggle */}
              <div className="p-3 rounded-xl border border-border/80 bg-background space-y-2.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newGuestIsCorporate}
                    onChange={(e) => setNewGuestIsCorporate(e.target.checked)}
                    className="rounded border-border"
                  />
                  <span className="font-bold text-foreground text-xs">
                    Corporate / B2B GST Invoice Required
                  </span>
                </label>

                {newGuestIsCorporate && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-border/60">
                    <div>
                      <label className="text-[10px] font-semibold text-foreground block mb-1">
                        Company / Entity Name
                      </label>
                      <input
                        type="text"
                        placeholder="Infosys BPM Ltd"
                        value={newGuestCompany}
                        onChange={(e) => setNewGuestCompany(e.target.value)}
                        className="w-full p-2 text-xs rounded-lg border border-border bg-card"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-foreground block mb-1">
                        15-digit GSTIN
                      </label>
                      <input
                        type="text"
                        placeholder="36AAACI1234F1Z1"
                        maxLength={15}
                        value={newGuestGstin}
                        onChange={(e) => setNewGuestGstin(e.target.value.toUpperCase())}
                        className="w-full p-2 text-xs rounded-lg border border-border bg-card font-mono uppercase"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground">
                Currency: INR (₹) • Deals Exclusively in INR
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddGuestModalOpen(false)}
                  className="text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveNewGuest}
                  disabled={!newGuestName.trim()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-9 font-semibold gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Save &amp; Set Active in POS
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WALK-IN ROOM / CAMP STAY BOOKING MODAL */}
      {isRoomBookingModalOpen && bookingUnit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-4 bg-muted/40 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  {bookingUnit.category === "tent" || bookingUnit.category === "glamping_dome" ? (
                    <Tent className="h-5 w-5" />
                  ) : (
                    <Home className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground text-base">
                      Book Walk-in Stay: {bookingUnit.name}
                    </h3>
                    <Badge variant="outline" className="font-mono text-xs border-primary/40 text-primary">
                      {bookingUnit.unitNumber}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Instantly assign room/camp, register pax &amp; pets, and bill directly in POS folio
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsRoomBookingModalOpen(false)}
                className="rounded-full h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                ✕
              </Button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Unit Highlights Banner */}
              <div className="p-3 rounded-xl bg-muted/30 border border-border flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-[10px] capitalize">
                    {bookingUnit.category.replace("_", " ")}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">
                    Max: {bookingUnit.adultsCapacity} Adults, {bookingUnit.kidsCapacity} Kids
                  </Badge>
                  {bookingUnit.petFriendly ? (
                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 text-[10px] flex items-center gap-1">
                      <Dog className="h-3 w-3" /> Pet Friendly (₹{bookingUnit.petFee.toLocaleString("en-IN")}/pet fee)
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] text-muted-foreground">
                      🚫 No Pets
                    </Badge>
                  )}
                  {bookingUnit.keyDoorCode && (
                    <Badge variant="outline" className="text-[10px] font-mono border-amber-300 text-amber-700 dark:text-amber-300">
                      Key Code: {bookingUnit.keyDoorCode}
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-foreground">
                    ₹{stayDurationType === "per_day" ? bookingUnit.ratePerDay.toLocaleString("en-IN") : bookingUnit.ratePerHour.toLocaleString("en-IN")}
                    <span className="text-[10px] font-normal text-muted-foreground">
                      {stayDurationType === "per_day" ? "/night" : "/hr"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stay Type Tabs: Per Day / Night vs Per Hour */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground block">
                  Select Stay Duration Type
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-muted/50 rounded-xl border border-border">
                  <button
                    type="button"
                    onClick={() => handleDurationTypeChange("per_day")}
                    className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      stayDurationType === "per_day"
                        ? "bg-card text-foreground shadow-sm border border-border"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Calendar className="h-4 w-4 text-emerald-600" />
                    <span>Per Day / Overnight (₹{bookingUnit.ratePerDay.toLocaleString("en-IN")}/nt)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDurationTypeChange("per_hour")}
                    className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      stayDurationType === "per_hour"
                        ? "bg-card text-foreground shadow-sm border border-border"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Clock className="h-4 w-4 text-primary" />
                    <span>Per Hour / Flex Stay (₹{bookingUnit.ratePerHour.toLocaleString("en-IN")}/hr)</span>
                  </button>
                </div>
              </div>

              {/* Duration Count: Nights or Hours */}
              {stayDurationType === "per_day" ? (
                <div className="p-3.5 rounded-xl border border-border bg-background space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-foreground">Number of Nights</div>
                      <div className="text-[10px] text-muted-foreground">
                        Standard Check-in: 02:00 PM • Check-out: 11:00 AM
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const val = Math.max(1, stayNights - 1);
                          setStayNights(val);
                          handleDurationTypeChange("per_day", val);
                        }}
                        className="h-8 w-8 rounded-lg border border-border bg-card flex items-center justify-center text-sm font-bold hover:bg-muted"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-sm text-foreground">
                        {stayNights}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const val = stayNights + 1;
                          setStayNights(val);
                          handleDurationTypeChange("per_day", val);
                        }}
                        className="h-8 w-8 rounded-lg border border-border bg-card flex items-center justify-center text-sm font-bold hover:bg-muted"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60 text-[11px]">
                    <div className="p-2 rounded-lg bg-muted/40">
                      <span className="text-muted-foreground block text-[10px]">Check-in</span>
                      <span className="font-semibold text-foreground">{bookingCheckInTime}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/40">
                      <span className="text-muted-foreground block text-[10px]">Departure / Check-out</span>
                      <span className="font-semibold text-foreground">{bookingCheckOutTime}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl border border-border bg-background space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-foreground">Flex Stay Hours (Min: {bookingUnit.minHours}h)</div>
                      <div className="text-[10px] text-muted-foreground">
                        Micro-stay for day resting, pool access, or transit guests
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {[3, 4, 6, 8, 12].map((hrs) => (
                        <Button
                          key={hrs}
                          variant={stayHours === hrs ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setStayHours(hrs);
                            handleDurationTypeChange("per_hour", undefined, hrs);
                          }}
                          className={`h-7 px-2.5 text-xs font-semibold ${stayHours === hrs ? "bg-primary text-primary-foreground" : ""}`}
                        >
                          {hrs}h
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60 text-[11px]">
                    <div className="p-2 rounded-lg bg-muted/40">
                      <span className="text-muted-foreground block text-[10px]">Check-in (Immediate)</span>
                      <span className="font-semibold text-foreground">{bookingCheckInTime}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/40">
                      <span className="text-muted-foreground block text-[10px]">Departure (After {stayHours}h)</span>
                      <span className="font-semibold text-foreground">{bookingCheckOutTime}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Guest Details Input */}
              <div className="p-3.5 rounded-xl border border-border bg-background space-y-3">
                <div className="font-bold text-foreground text-xs flex items-center gap-1.5">
                  <UserCheck className="h-4 w-4 text-primary" />
                  <span>Guest Registration Details</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-foreground block mb-1">
                      Guest Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Vikramaditya Rathore"
                      value={bookingGuestName}
                      onChange={(e) => setBookingGuestName(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-border bg-card"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-foreground block mb-1">
                      Mobile Number (+91)
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98480 99999"
                      value={bookingGuestPhone}
                      onChange={(e) => setBookingGuestPhone(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-border bg-card font-mono"
                    />
                  </div>
                </div>

                {/* Headcount Steppers: Adults, Kids, Pets */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border/60">
                  {/* Adults */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border">
                    <div>
                      <div className="font-semibold text-xs text-foreground">Adults</div>
                      <div className="text-[10px] text-muted-foreground">Max {bookingUnit.adultsCapacity}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setBookingAdults((p) => Math.max(1, p - 1))}
                        className="h-6 w-6 rounded border border-border bg-card flex items-center justify-center text-xs font-bold hover:bg-muted"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-bold text-xs">{bookingAdults}</span>
                      <button
                        type="button"
                        onClick={() => setBookingAdults((p) => Math.min(bookingUnit.adultsCapacity + 2, p + 1))}
                        className="h-6 w-6 rounded border border-border bg-card flex items-center justify-center text-xs font-bold hover:bg-muted"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Kids */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border">
                    <div>
                      <div className="font-semibold text-xs text-foreground flex items-center gap-1">
                        <Baby className="h-3 w-3 text-amber-500" />
                        Kids
                      </div>
                      <div className="text-[10px] text-muted-foreground">Max {bookingUnit.kidsCapacity}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setBookingKids((p) => Math.max(0, p - 1))}
                        className="h-6 w-6 rounded border border-border bg-card flex items-center justify-center text-xs font-bold hover:bg-muted"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-bold text-xs">{bookingKids}</span>
                      <button
                        type="button"
                        onClick={() => setBookingKids((p) => p + 1)}
                        className="h-6 w-6 rounded border border-border bg-card flex items-center justify-center text-xs font-bold hover:bg-muted"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Pets */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border">
                    <div>
                      <div className="font-semibold text-xs text-foreground flex items-center gap-1">
                        <Dog className="h-3 w-3 text-purple-600" />
                        Pets
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {bookingUnit.petFriendly ? "Allowed" : "Not allowed"}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={!bookingUnit.petFriendly}
                        onClick={() => setBookingPets((p) => Math.max(0, p - 1))}
                        className="h-6 w-6 rounded border border-border bg-card flex items-center justify-center text-xs font-bold hover:bg-muted disabled:opacity-40"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-bold text-xs">{bookingPets}</span>
                      <button
                        type="button"
                        disabled={!bookingUnit.petFriendly}
                        onClick={() => setBookingPets((p) => p + 1)}
                        className="h-6 w-6 rounded border border-border bg-card flex items-center justify-center text-xs font-bold hover:bg-muted disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pet Fee Sanitation Checkbox if pets > 0 */}
                {bookingUnit.petFriendly && bookingPets > 0 && (
                  <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includePetFee}
                        onChange={(e) => setIncludePetFee(e.target.checked)}
                        className="rounded border-purple-400 text-purple-600"
                      />
                      <div>
                        <span className="font-bold text-purple-900 dark:text-purple-200 text-xs">
                          Add Pet Sanitization &amp; Deep Clean Fee
                        </span>
                        <p className="text-[10px] text-purple-700 dark:text-purple-300">
                          ₹{bookingUnit.petFee.toLocaleString("en-IN")} × {bookingPets} Pet{bookingPets > 1 ? "s" : ""} (SAC 9997 • 18% GST)
                        </p>
                      </div>
                    </label>
                    <span className="font-bold font-mono text-purple-900 dark:text-purple-200 text-xs">
                      +₹{(bookingUnit.petFee * bookingPets).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
              </div>

              {/* Price Calculation Summary */}
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-900 dark:text-emerald-300 font-medium">
                    {stayDurationType === "per_day" ? `Room Tariff (${stayNights} Night)` : `Hourly Tariff (${stayHours} Hours)`}
                  </span>
                  <span className="font-bold font-mono text-emerald-950 dark:text-emerald-200">
                    ₹{(stayDurationType === "per_day" ? bookingUnit.ratePerDay * stayNights : bookingUnit.ratePerHour * stayHours).toLocaleString("en-IN")}
                  </span>
                </div>

                {includePetFee && bookingPets > 0 && bookingUnit.petFriendly && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-800 dark:text-purple-300 font-medium">
                      Pet Fee ({bookingPets} Pet{bookingPets > 1 ? "s" : ""})
                    </span>
                    <span className="font-bold font-mono text-purple-950 dark:text-purple-200">
                      +₹{(bookingUnit.petFee * bookingPets).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-emerald-200/80 dark:border-emerald-800/40 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-emerald-950 dark:text-emerald-100 text-sm">
                      Total Accommodation Bill
                    </span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block">
                      SAC 996311 (12% GST) included • Exclusively in INR (₹)
                    </span>
                  </div>
                  <span className="font-extrabold font-mono text-base text-emerald-700 dark:text-emerald-300">
                    ₹{(
                      (stayDurationType === "per_day" ? bookingUnit.ratePerDay * stayNights : bookingUnit.ratePerHour * stayHours) +
                      (includePetFee && bookingPets > 0 && bookingUnit.petFriendly ? bookingUnit.petFee * bookingPets : 0)
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-muted/30 border-t border-border flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRoomBookingModalOpen(false)}
                className="text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmRoomBooking}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-9 font-semibold gap-1.5 shadow-md"
              >
                <CheckCircle2 className="h-4 w-4" />
                Confirm Stay &amp; Add to POS Cart
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


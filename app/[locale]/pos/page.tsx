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
} from "lucide-react";
import {
  POSItem,
  POSCategory,
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
    description: "Tandem or solo sit-on-top kayak with life vests and safety supervisor",
    unit: "session",
  },
  {
    id: "pos-25",
    name: "Guided Organic Farm Walk & Harvest Tour",
    category: "activities",
    price: 300,
    taxRate: 0.05,
    sacCode: "9983",
    available: true,
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
];

// Active in-house reservations for Green Valley Farmhouse
const inHouseReservations = [
  {
    room: "Heritage Pool Villa 1",
    guest: "Aditya Verma",
    phone: "+91 98480 12345",
    folio: "FOL-901",
    checkIn: "11 Sep 2026",
    isCorporate: false,
    company: "",
    gstin: "",
  },
  {
    room: "Heritage Villa 2",
    guest: "Sneha Reddy",
    phone: "+91 98765 43210",
    folio: "FOL-902",
    checkIn: "12 Sep 2026",
    isCorporate: false,
    company: "",
    gstin: "",
  },
  {
    room: "Grand Royal Lawn & Pavilion",
    guest: "Vikram Malhotra (TechCorp)",
    phone: "+91 98200 99881",
    folio: "FOL-903",
    checkIn: "12 Sep 2026",
    isCorporate: true,
    company: "TechCorp Solutions India Pvt Ltd",
    gstin: "36AAACT9482P1Z6",
  },
  {
    room: "Luxury Glamping Dome 01",
    guest: "Rohan Mehra",
    phone: "+91 94401 77654",
    folio: "FOL-904",
    checkIn: "12 Sep 2026",
    isCorporate: false,
    company: "",
    gstin: "",
  },
  {
    room: "Family Farm Cottage B",
    guest: "Rajesh Kumar",
    phone: "+91 97000 44551",
    folio: "FOL-905",
    checkIn: "13 Sep 2026",
    isCorporate: false,
    company: "",
    gstin: "",
  },
  {
    room: "Eco Campsite Pitch C4",
    guest: "Vikram Kulkarni",
    phone: "+91 91234 56780",
    folio: "FOL-906",
    checkIn: "13 Sep 2026",
    isCorporate: false,
    company: "",
    gstin: "",
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

  // Invoicing target: Charge to in-house room folio vs direct counter settlement
  const [chargeTarget, setChargeTarget] = useState<"room" | "direct">("room");
  const [selectedRoom, setSelectedRoom] = useState<string>(inHouseReservations[0].room);
  const [guestName, setGuestName] = useState<string>(inHouseReservations[0].guest);
  const [guestPhone, setGuestPhone] = useState<string>(inHouseReservations[0].phone);

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
  const [customItemPrice, setCustomItemPrice] = useState<number>(200);
  const [customItemTaxRate, setCustomItemTaxRate] = useState<number>(0.05);
  const [customItemSac, setCustomItemSac] = useState<string>("996331");
  const [customItemUnit, setCustomItemUnit] = useState<string>("service");

  // Resort Branding State (Defaults to Green Valley Farmhouse)
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

  // Helper when room selection changes
  const handleRoomChange = (roomName: string) => {
    setSelectedRoom(roomName);
    const found = inHouseReservations.find((r) => r.room === roomName);
    if (found) {
      setGuestName(found.guest);
      setGuestPhone(found.phone);
      if (found.isCorporate) {
        setIsB2B(true);
        setB2bCompanyName(found.company);
        setB2bCompanyGstin(found.gstin);
      } else {
        setIsB2B(false);
      }
    }
  };

  // Cart operations
  const addToCart = (item: POSItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { item, quantity: 1 }];
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

  // Handle Add Custom Item
  const handleAddCustomItem = () => {
    if (!customItemName.trim()) return;

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
    setIsCustomModalOpen(false);
    setCustomItemName("");
    setCustomItemPrice(200);
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

    const currentFolio = inHouseReservations.find((r) => r.room === selectedRoom)?.folio || "FOL-000";
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
      paymentMethod: formattedPaymentMethod,
      chargeTarget,
      splitDetails,
      b2bDetails,
      brandingSnapshot: { ...branding },
      taxSummary: taxSummaryRows,
      amountInWords: numberToIndianWords(grandTotal),
      cashierName: cashierShift.cashierName,
    };

    // Update shift drawer register
    setCashierShift((prev) => {
      let addCash = 0;
      let addUpi = 0;
      let addCard = 0;
      let addFolio = 0;

      if (chargeTarget === "room") {
        addFolio = grandTotal;
      } else if (paymentMethod === "split") {
        addCash = splitCash - splitChangeToReturn;
        addUpi = splitUpi;
        addCard = splitCard;
      } else if (paymentMethod === "cash") {
        addCash = grandTotal;
      } else if (paymentMethod === "upi") {
        addUpi = grandTotal;
      } else if (paymentMethod === "card") {
        addCard = grandTotal;
      }

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
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Commercial front-desk billing: F&B dining, campfire kits, adventure activities, multi-tender splits, and custom resort-branded GST tax invoices.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
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
        {/* Left Column: Catalog Filter & Items Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search bar + Custom Item Quick Add */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog by dish, kit, ride, or SAC code..."
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

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
            {[
              { id: "all", label: "All Items", icon: ShoppingBag, count: catalogItems.length },
              { id: "food", label: "F&B Dining", icon: Utensils, count: catalogItems.filter((i) => i.category === "food").length },
              { id: "beverage", label: "Beverages & Cafe", icon: Coffee, count: catalogItems.filter((i) => i.category === "beverage").length },
              { id: "bbq_campfire", label: "BBQ & Campfire", icon: Flame, count: catalogItems.filter((i) => i.category === "bbq_campfire").length },
              { id: "activities", label: "Activities & Rides", icon: Bike, count: catalogItems.filter((i) => i.category === "activities").length },
              { id: "farm_produce", label: "Farm Fresh", icon: Sparkles, count: catalogItems.filter((i) => i.category === "farm_produce").length },
            ].map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors min-h-[38px] ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-card border border-border text-muted-foreground hover:bg-muted/60"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? "bg-primary-foreground/20 text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[720px] overflow-y-auto pr-1">
            {filteredItems.length === 0 ? (
              <div className="col-span-full py-16 text-center text-muted-foreground bg-muted/20 border border-dashed rounded-xl">
                <ShoppingBag className="h-8 w-8 mx-auto opacity-30 mb-2" />
                <p className="text-sm font-semibold">No items match your filter</p>
                <p className="text-xs text-muted-foreground mt-1">Try another search or click "+ Custom Charge" to add on-the-fly.</p>
              </div>
            ) : (
              filteredItems.map((item) => {
                const inCart = cart.find((c) => c.item.id === item.id);
                return (
                  <Card
                    key={item.id}
                    className={`hover:border-primary/50 transition-all cursor-pointer select-none bg-card ${
                      inCart ? "border-primary/40 bg-primary/5" : "border-border"
                    }`}
                    onClick={() => addToCart(item)}
                  >
                    <CardContent className="p-3.5 flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs sm:text-sm text-foreground leading-tight">
                            {item.name}
                          </span>
                          {item.unit && (
                            <span className="text-[10px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                              {item.unit}
                            </span>
                          )}
                        </div>

                        {item.description && (
                          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-base font-extrabold text-rentcot-blue">
                            ₹{item.price.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                            SAC {item.sacCode} • +{(item.taxRate * 100).toFixed(0)}% GST
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {inCart ? (
                          <div
                            className="flex items-center gap-1.5 bg-background rounded-lg p-1 border border-primary/30 shadow-2xs"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="h-7 w-7 rounded bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 text-xs font-bold transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-extrabold text-xs px-1 text-foreground min-w-[16px] text-center">
                              {inCart.quantity}
                            </span>
                            <button
                              onClick={() => addToCart(item)}
                              className="h-7 w-7 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold hover:bg-primary/90 transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 rounded-lg border-border hover:border-primary hover:bg-primary hover:text-white transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(item);
                            }}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
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
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground space-y-2">
                  <ShoppingBag className="h-10 w-10 mx-auto opacity-30 text-muted-foreground" />
                  <div className="text-sm font-semibold text-foreground">Folio is currently empty</div>
                  <div className="text-xs text-muted-foreground max-w-xs mx-auto">
                    Click any food item, campfire setup, or adventure ride on the left to add charges to the bill.
                  </div>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {cart.map(({ item, quantity }) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-xs py-2 border-b border-border/60"
                      >
                        <div className="flex-1 pr-2 min-w-0">
                          <div className="font-semibold text-foreground truncate">{item.name}</div>
                          <div className="text-muted-foreground font-mono text-[11px] flex items-center gap-1">
                            <span>{quantity} × ₹{item.price.toLocaleString()}</span>
                            <span>•</span>
                            <span>SAC {item.sacCode} ({(item.taxRate * 100).toFixed(0)}% GST)</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-extrabold text-foreground">
                            ₹{(quantity * item.price).toLocaleString()}
                          </span>
                          <button
                            onClick={() => clearCartItem(item.id)}
                            className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Destination: In-House Room Folio vs Direct Settlement */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">Settlement Target:</span>
                      <span className="text-[11px] text-muted-foreground">
                        {chargeTarget === "room" ? "Add to Guest Tab" : "Counter Settle"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setChargeTarget("room")}
                        className={`flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-semibold border transition-colors ${
                          chargeTarget === "room"
                            ? "border-primary bg-primary/10 text-primary shadow-2xs"
                            : "border-border text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <BedDouble className="h-3.5 w-3.5" />
                        <span>Room Folio Charge</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setChargeTarget("direct")}
                        className={`flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-semibold border transition-colors ${
                          chargeTarget === "direct"
                            ? "border-primary bg-primary/10 text-primary shadow-2xs"
                            : "border-border text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <Banknote className="h-3.5 w-3.5" />
                        <span>Direct Settle (GST)</span>
                      </button>
                    </div>

                    {chargeTarget === "room" ? (
                      <div className="space-y-1.5 pt-1">
                        <label className="text-[11px] font-semibold text-muted-foreground block">
                          Select In-House Villa / Cottage / Tent:
                        </label>
                        <select
                          value={selectedRoom}
                          onChange={(e) => handleRoomChange(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-primary"
                        >
                          {inHouseReservations.map((r) => (
                            <option key={r.room} value={r.room}>
                              {r.room} — {r.guest} ({r.folio})
                            </option>
                          ))}
                        </select>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                          <span>Guest: <strong className="text-foreground">{guestName}</strong></span>
                          <span>Ph: {guestPhone}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 pt-1">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-muted-foreground font-semibold block mb-0.5">
                              Guest Name
                            </label>
                            <input
                              type="text"
                              placeholder="Walk-in Guest"
                              value={guestName}
                              onChange={(e) => setGuestName(e.target.value)}
                              className="w-full p-2 text-xs rounded-lg border border-border bg-background text-foreground"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-muted-foreground font-semibold block mb-0.5">
                              Phone (WhatsApp bill)
                            </label>
                            <input
                              type="text"
                              placeholder="+91 98480..."
                              value={guestPhone}
                              onChange={(e) => setGuestPhone(e.target.value)}
                              className="w-full p-2 text-xs rounded-lg border border-border bg-background text-foreground"
                            />
                          </div>
                        </div>

                        {/* Payment Mode Selector */}
                        <div className="space-y-1 pt-1">
                          <label className="text-[10px] text-muted-foreground font-semibold block">
                            Direct Settlement Method
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
                        </div>

                        {/* Split Tender Engine UI */}
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
                      </div>
                    )}
                  </div>

                  {/* Corporate B2B GST Invoicing Toggle */}
                  <div className="p-2.5 rounded-lg border border-border bg-muted/20 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-foreground">
                      <input
                        type="checkbox"
                        checked={isB2B}
                        onChange={(e) => setIsB2B(e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <Briefcase className="h-3.5 w-3.5 text-rentcot-blue" />
                      <span>Corporate / B2B GST Invoice (ITC Claim)</span>
                    </label>

                    {isB2B && (
                      <div className="space-y-2 pt-1 border-t border-border/60">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-muted-foreground block">Company Legal Name</label>
                            <input
                              type="text"
                              placeholder="e.g. TechCorp India Pvt Ltd"
                              value={b2bCompanyName}
                              onChange={(e) => setB2bCompanyName(e.target.value)}
                              className="w-full p-1.5 text-xs rounded border border-border bg-background"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-muted-foreground block">Company GSTIN</label>
                            <input
                              type="text"
                              placeholder="36AAACT9482P1Z6"
                              value={b2bCompanyGstin}
                              onChange={(e) => setB2bCompanyGstin(e.target.value)}
                              className="w-full p-1.5 text-xs rounded border border-border bg-background font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Promotional Discount */}
                  <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                    <span className="text-muted-foreground flex items-center gap-1 font-medium">
                      <Percent className="h-3.5 w-3.5 text-rentcot-blue" />
                      <span>Discount:</span>
                    </span>
                    <div className="flex items-center gap-1">
                      {[0, 5, 10, 15, 20].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setDiscountPercent(pct)}
                          className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors ${
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
                  <div className="space-y-1.5 pt-2 border-t border-border text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Promotional Discount ({discountPercent}%)</span>
                        <span>-₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-muted-foreground">
                      <span>Applicable GST (CGST + SGST)</span>
                      <span className="font-mono">₹{totalTax.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-sm sm:text-base font-extrabold text-foreground pt-1.5 border-t border-border">
                      <span>Grand Total</span>
                      <span className="text-rentcot-blue">₹{grandTotal.toLocaleString()}</span>
                    </div>

                    <div className="text-[10px] text-muted-foreground italic truncate">
                      {numberToIndianWords(grandTotal)}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={handleCheckoutAndGenerateInvoice}
                    disabled={paymentMethod === "split" && !isSplitBalanced}
                    className="w-full bg-rentcot-blue hover:bg-rentcot-blue/90 text-white min-h-[44px] text-xs sm:text-sm font-bold gap-2 shadow-sm"
                  >
                    <Receipt className="h-4 w-4" />
                    <span>
                      {chargeTarget === "room"
                        ? `Post ₹${grandTotal.toLocaleString()} to Folio & Print Bill`
                        : `Settle ₹${grandTotal.toLocaleString()} & Generate GST Invoice`}
                    </span>
                  </Button>
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
                    <div className="text-[11px] text-emerald-600 font-medium">Status: Settled & Cleared</div>
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
                    Statutory Tax Breakdown (CGST & SGST Split)
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
                        Multi-Tenant Hospitality Engine for Resorts, Farmhouses & Camping Retreats
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

                <div>
                  <label className="text-[11px] font-semibold text-foreground block mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={customItemPrice}
                    onChange={(e) => setCustomItemPrice(Number(e.target.value))}
                    className="w-full p-2 text-xs rounded-lg border border-border bg-background font-bold"
                  />
                </div>
              </div>

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
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
} from "lucide-react";

interface POSItem {
  id: string;
  name: string;
  category: "food" | "beverage" | "activities" | "bbq_campfire";
  price: number;
  taxRate: number;
  sacCode: string;
  available: boolean;
}

interface CompletedInvoice {
  invoiceNumber: string;
  date: string;
  guestName: string;
  roomOrPitch: string;
  items: { name: string; quantity: number; price: number; sacCode: string; taxRate: number }[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  paymentMethod: string;
  chargeTarget: "room" | "direct";
  brandingSnapshot: ResortBranding;
}

interface ResortBranding {
  name: string;
  tradeName: string;
  tagline: string;
  addressLine: string;
  cityStatePin: string;
  phone: string;
  email: string;
  gstin: string;
  fssai: string;
  logoType: "treepine" | "tent" | "compass";
  customLogoUrl?: string;
}

const defaultBrandingPresets: Record<string, ResortBranding> = {
  farmhouse: {
    name: "Green Valley Farmhouse & Eco Retreat",
    tradeName: "Green Valley Agro-Hospitality LLP",
    tagline: "Private Farmhouse Stays, Organic Dining & Celebrations",
    addressLine: "Survey No. 44/A, Shamirpet Lake Valley Road",
    cityStatePin: "Medchal-Malkajgiri District, Hyderabad, Telangana - 500078",
    phone: "+91 98480 12345",
    email: "billing@greenvalleyretreat.com",
    gstin: "36AAACR8821K1Z2",
    fssai: "13622011000452",
    logoType: "treepine",
  },
  campsite: {
    name: "Wildwoods Glamping & Campsite",
    tradeName: "Wildwoods Outdoor Adventures Pvt Ltd",
    tagline: "Eco Glamping Domes, Campfires & Forest Trails",
    addressLine: "Ananthagiri Hills Forest Road, Near Kotpally Reservoir",
    cityStatePin: "Vikarabad, Telangana - 501101",
    phone: "+91 94401 77654",
    email: "camp@wildwoodsretreat.in",
    gstin: "36AABBW9912L1Z9",
    fssai: "13623014000881",
    logoType: "tent",
  },
  resort: {
    name: "Palm Oasis Luxury Resort",
    tradeName: "Palm Oasis Hospitality & Spas Ltd",
    tagline: "Waterfront Pool Villas, Spa & Destination Dining",
    addressLine: "Lake Front Promenade, Gandipet Main Road",
    cityStatePin: "Hyderabad, Telangana - 500075",
    phone: "+91 40 6822 9000",
    email: "frontdesk@palmoasisresorts.com",
    gstin: "36AABCP4411M1Z3",
    fssai: "13621008000129",
    logoType: "compass",
  },
};

const catalog: POSItem[] = [
  // Food & Dining (SAC 996331, 5% GST)
  { id: "pos-1", name: "Farmhouse Telangana Thali (Non-Veg)", category: "food", price: 450, taxRate: 0.05, sacCode: "996331", available: true },
  { id: "pos-2", name: "Royal South Indian Veg Thali", category: "food", price: 350, taxRate: 0.05, sacCode: "996331", available: true },
  { id: "pos-3", name: "Clay Oven Paneer Tikka Platter", category: "food", price: 320, taxRate: 0.05, sacCode: "996331", available: true },
  { id: "pos-4", name: "Country Chicken Curry + 4 Rotis", category: "food", price: 420, taxRate: 0.05, sacCode: "996331", available: true },
  // Beverage (SAC 996331, 5% GST)
  { id: "pos-5", name: "Fresh Tender Coconut Water", category: "beverage", price: 90, taxRate: 0.05, sacCode: "996331", available: true },
  { id: "pos-6", name: "Artisanal Filter Coffee (Pot)", category: "beverage", price: 120, taxRate: 0.05, sacCode: "996331", available: true },
  { id: "pos-7", name: "Masala Chai Flask (Serves 4)", category: "beverage", price: 180, taxRate: 0.05, sacCode: "996331", available: true },
  { id: "pos-8", name: "Fresh Mint Lemonade Pitcher", category: "beverage", price: 200, taxRate: 0.05, sacCode: "996331", available: true },
  // BBQ & Campfire (SAC 999699, 18% GST)
  { id: "pos-9", name: "Private Bonfire Setup (15kg Hardwood)", category: "bbq_campfire", price: 1200, taxRate: 0.18, sacCode: "999699", available: true },
  { id: "pos-10", name: "Marinated BBQ Grill Basket (Serves 4)", category: "bbq_campfire", price: 1800, taxRate: 0.18, sacCode: "999699", available: true },
  { id: "pos-11", name: "Extra Firewood Bundle (15kg)", category: "bbq_campfire", price: 400, taxRate: 0.05, sacCode: "999699", available: true },
  // Activities & Adventures (SAC 999699, 18% GST)
  { id: "pos-12", name: "ATV Quad Bike Trail Ride (30 mins)", category: "activities", price: 800, taxRate: 0.18, sacCode: "999699", available: true },
  { id: "pos-13", name: "Lake Kayaking Session (1 Hour)", category: "activities", price: 500, taxRate: 0.18, sacCode: "999699", available: true },
  { id: "pos-14", name: "Guided Organic Farm Tour & Harvest", category: "activities", price: 300, taxRate: 0.05, sacCode: "999699", available: true },
];

export default function POSPage() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cart, setCart] = useState<{ item: POSItem; quantity: number }[]>([]);
  const [chargeTarget, setChargeTarget] = useState<"room" | "direct">("room");
  const [selectedRoom, setSelectedRoom] = useState<string>("Heritage Villa 1 (Aditya Verma)");
  const [guestName, setGuestName] = useState<string>("Aditya Verma");
  const [guestPhone, setGuestPhone] = useState<string>("+91 98480 12345");

  // Resort Branding State for Invoices
  const [branding, setBranding] = useState<ResortBranding>(defaultBrandingPresets.farmhouse);
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState<boolean>(false);

  // Payment settlement states
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cash" | "split">("upi");
  const [splitUpiAmount, setSplitUpiAmount] = useState<number>(0);
  const [splitCashAmount, setSplitCashAmount] = useState<number>(0);

  // Discounts
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Active generated invoice for modal
  const [activeInvoice, setActiveInvoice] = useState<CompletedInvoice | null>(null);
  const [invoiceHistory, setInvoiceHistory] = useState<CompletedInvoice[]>([
    {
      invoiceNumber: "INV-POS-2026-0819",
      date: "12 Sep 2026, 12:45 PM",
      guestName: "Sarah Jenkins",
      roomOrPitch: "Pool Villa 102",
      items: [
        { name: "Fresh Tender Coconut Water", quantity: 2, price: 90, sacCode: "996331", taxRate: 0.05 },
        { name: "Farmhouse Telangana Thali", quantity: 2, price: 450, sacCode: "996331", taxRate: 0.05 },
      ],
      subtotal: 1080,
      discount: 0,
      tax: 54,
      grandTotal: 1134,
      paymentMethod: "Charge to Folio",
      chargeTarget: "room",
      brandingSnapshot: defaultBrandingPresets.farmhouse,
    },
  ]);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  const activeRooms = [
    { room: "Heritage Villa 1", guest: "Aditya Verma", phone: "+91 98480 12345" },
    { room: "Pool Villa 102", guest: "Sarah Jenkins", phone: "+1 415 555 2671" },
    { room: "Luxury Glamping Tent 04", guest: "Rohan Mehra", phone: "+91 98200 99881" },
    { room: "Safari Dome Tent 02", guest: "Vikram Kulkarni", phone: "+91 94401 77654" },
    { room: "BYOT Lawn Pitch G1", guest: "Hyderabad Bikers", phone: "+91 97000 44551" },
  ];

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

  const subtotal = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const discountedSubtotal = subtotal - discountAmount;
  const tax = cart.reduce((sum, c) => {
    const itemRatio = c.item.price * c.quantity / (subtotal || 1);
    const itemDiscountedBase = discountedSubtotal * itemRatio;
    return sum + itemDiscountedBase * c.item.taxRate;
  }, 0);
  const grandTotal = Math.round(discountedSubtotal + tax);

  const filteredItems = catalog.filter((item) =>
    selectedCategory === "all" ? true : item.category === selectedCategory
  );

  const handleCheckoutAndGenerateInvoice = () => {
    const newInv: CompletedInvoice = {
      invoiceNumber: `INV-POS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      guestName: chargeTarget === "room" ? guestName : (guestName || "Walk-In Guest"),
      roomOrPitch: chargeTarget === "room" ? selectedRoom : "Direct Counter",
      items: cart.map((c) => ({
        name: c.item.name,
        quantity: c.quantity,
        price: c.item.price,
        sacCode: c.item.sacCode,
        taxRate: c.item.taxRate,
      })),
      subtotal,
      discount: discountAmount,
      tax: Math.round(tax),
      grandTotal,
      paymentMethod:
        chargeTarget === "room"
          ? "Room Folio Charge"
          : paymentMethod === "split"
          ? `Split (UPI: ₹${splitUpiAmount} + Cash: ₹${splitCashAmount})`
          : paymentMethod.toUpperCase(),
      chargeTarget,
      brandingSnapshot: { ...branding },
    };

    setInvoiceHistory((prev) => [newInv, ...prev]);
    setActiveInvoice(newInv);
    setCart([]);
    setDiscountPercent(0);
  };

  const handlePrint = () => {
    window.print();
  };

  const generateInvoiceWhatsAppText = (inv: CompletedInvoice) => {
    const itemsList = inv.items
      .map((it) => `• ${it.quantity}x ${it.name} - ₹${(it.quantity * it.price).toLocaleString()}`)
      .join("\n");

    return `🧾 *TAX INVOICE - ${inv.brandingSnapshot.name.toUpperCase()}*
*Invoice No:* ${inv.invoiceNumber}
*Date:* ${inv.date}
*Guest:* ${inv.guestName} (${inv.roomOrPitch})

*Items Ordered:*
${itemsList}

*Subtotal:* ₹${inv.subtotal.toLocaleString()}
${inv.discount > 0 ? `*Discount:* -₹${inv.discount.toLocaleString()}\n` : ""}*Taxes (CGST + SGST):* ₹${inv.tax.toFixed(2)}
*Total Paid:* ₹${inv.grandTotal.toLocaleString()}
*Payment Mode:* ${inv.paymentMethod}

*Property Address:*
${inv.brandingSnapshot.name}
${inv.brandingSnapshot.addressLine}, ${inv.brandingSnapshot.cityStatePin}
GSTIN: ${inv.brandingSnapshot.gstin} | Ph: ${inv.brandingSnapshot.phone}

_Powered by Rentcot Property OS_`;
  };

  const generateInvoiceMailto = (inv: CompletedInvoice) => {
    const subject = `Tax Invoice ${inv.invoiceNumber} - ${inv.brandingSnapshot.name}`;
    const body = `Dear ${inv.guestName},

Thank you for choosing ${inv.brandingSnapshot.name}!

Here are your tax invoice details:
Invoice Number: ${inv.invoiceNumber}
Date: ${inv.date}
Room/Pitch: ${inv.roomOrPitch}
Settlement Mode: ${inv.paymentMethod}

Itemized Charges:
${inv.items.map((i) => `• ${i.quantity}x ${i.name} (SAC ${i.sacCode}): ₹${(i.quantity * i.price).toLocaleString()}`).join("\n")}

Subtotal: ₹${inv.subtotal.toLocaleString()}
${inv.discount > 0 ? `Discount Applied: -₹${inv.discount.toLocaleString()}\n` : ""}CGST (2.5% / 9%): ₹${(inv.tax / 2).toFixed(2)}
SGST (2.5% / 9%): ₹${(inv.tax / 2).toFixed(2)}
Total Amount Paid: ₹${inv.grandTotal.toLocaleString()}

Issuer Details:
${inv.brandingSnapshot.name} (${inv.brandingSnapshot.tradeName})
${inv.brandingSnapshot.addressLine}, ${inv.brandingSnapshot.cityStatePin}
GSTIN: ${inv.brandingSnapshot.gstin}
Phone: ${inv.brandingSnapshot.phone}
Email: ${inv.brandingSnapshot.email}

---------------------------------------------------------
Powered by Rentcot Property OS
Modern Multi-Tenant Hospitality OS for Resorts, Farmhouses & Camping Retreats
`;
    return `mailto:${encodeURIComponent(inv.brandingSnapshot.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleDownloadInvoice = (inv: CompletedInvoice) => {
    const logoHtml = inv.brandingSnapshot.customLogoUrl
      ? `<img src="${inv.brandingSnapshot.customLogoUrl}" style="max-height: 50px; max-width: 160px; object-fit: contain; margin-bottom: 8px;" />`
      : `<div style="font-size: 28px; margin-bottom: 4px;">${inv.brandingSnapshot.logoType === 'tent' ? '⛺' : inv.brandingSnapshot.logoType === 'treepine' ? '🌲' : '🏛️'}</div>`;

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Tax Invoice ${inv.invoiceNumber} - ${inv.brandingSnapshot.name}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 32px; color: #0f172a; font-size: 13px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 20px; }
    .title { font-size: 18px; font-weight: 800; color: #0f172a; }
    .muted { color: #64748b; font-size: 11px; margin-top: 2px; }
    .tag { display: inline-block; padding: 4px 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-weight: bold; font-size: 11px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #e2e8f0; padding: 8px 10px; text-align: left; }
    th { background: #f8fafc; font-size: 11px; text-transform: uppercase; }
    .totals { margin-left: auto; width: 300px; }
    .totals div { display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; }
    .totals .grand { font-size: 15px; font-weight: 800; border-top: 2px solid #0f172a; padding-top: 6px; color: #1e40af; }
    .footer { margin-top: 36px; padding-top: 14px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; font-size: 10px; color: #64748b; }
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
      <div class="muted">GSTIN: ${inv.brandingSnapshot.gstin} | Ph: ${inv.brandingSnapshot.phone}</div>
    </div>
    <div style="text-align: right;">
      <div class="tag">GST TAX INVOICE</div>
      <div style="font-family: monospace; font-size: 14px; font-weight: bold; margin-top: 6px;">${inv.invoiceNumber}</div>
      <div class="muted">${inv.date}</div>
    </div>
  </div>

  <div style="margin-bottom: 16px;">
    <strong>Guest:</strong> ${inv.guestName} (${inv.roomOrPitch})<br>
    <strong>Settlement Mode:</strong> ${inv.paymentMethod}
  </div>

  <table>
    <thead>
      <tr>
        <th>Item Description</th>
        <th>SAC Code</th>
        <th style="text-align: right;">Qty</th>
        <th style="text-align: right;">Rate</th>
        <th style="text-align: right;">Tax %</th>
        <th style="text-align: right;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${inv.items.map((it) => `
        <tr>
          <td>${it.name}</td>
          <td>${it.sacCode}</td>
          <td style="text-align: right;">${it.quantity}</td>
          <td style="text-align: right;">₹${it.price.toLocaleString()}</td>
          <td style="text-align: right;">${(it.taxRate * 100).toFixed(0)}%</td>
          <td style="text-align: right;">₹${(it.quantity * it.price).toLocaleString()}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  <div class="totals">
    <div><span>Subtotal:</span><span>₹${inv.subtotal.toLocaleString()}</span></div>
    ${inv.discount > 0 ? `<div><span>Discount:</span><span>-₹${inv.discount.toLocaleString()}</span></div>` : ""}
    <div><span>CGST:</span><span>₹${(inv.tax / 2).toFixed(2)}</span></div>
    <div><span>SGST:</span><span>₹${(inv.tax / 2).toFixed(2)}</span></div>
    <div class="grand"><span>Grand Total:</span><span>₹${inv.grandTotal.toLocaleString()}</span></div>
  </div>

  <div class="footer">
    <div>
      <strong>Powered by Rentcot Property OS</strong><br>
      Automated Hospitality & Campsite Operations
    </div>
    <div style="text-align: right;">
      Verified Tax Invoice &bull; Multi-Tenant Isolated
    </div>
  </div>
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice-${inv.invoiceNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const applyPreset = (presetKey: "farmhouse" | "campsite" | "resort") => {
    setBranding(defaultBrandingPresets[presetKey]);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {t("nav.pos", "Front-Desk POS & GST Invoicing Terminal")}
            </h1>
            <Badge variant="outline" className="text-xs font-semibold text-rentcot-blue border-rentcot-blue/30 bg-rentcot-blue/5">
              {branding.name}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            F&B dining, campfire kits, adventure activities, split tenders, and custom resort-branded GST tax invoices.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Edit Invoice Branding Button */}
          <Button
            variant="outline"
            onClick={() => setIsBrandingModalOpen(true)}
            className="text-xs font-semibold h-10 gap-1.5 border-border"
          >
            <Edit3 className="h-4 w-4 text-amber-600" />
            <span>Customize Invoice Branding</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowHistoryModal(true)}
            className="text-xs font-semibold h-10 gap-1.5 border-border"
          >
            <History className="h-4 w-4 text-rentcot-blue" />
            <span>Recent Invoices ({invoiceHistory.length})</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Item Catalog */}
        <div className="lg:col-span-2 space-y-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: "all", label: "All Items", icon: ShoppingBag },
              { id: "food", label: "F&B Dining", icon: Utensils },
              { id: "beverage", label: "Beverages & Cafe", icon: Coffee },
              { id: "bbq_campfire", label: "BBQ & Campfire", icon: Flame },
              { id: "activities", label: "Activities & Rides", icon: Bike },
            ].map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors min-h-[40px] ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card border border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredItems.map((item) => {
              const inCart = cart.find((c) => c.item.id === item.id);
              return (
                <Card
                  key={item.id}
                  className="hover:border-primary/50 transition-all cursor-pointer select-none"
                  onClick={() => addToCart(item)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="space-y-1 pr-2">
                      <div className="font-semibold text-sm text-foreground">{item.name}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-rentcot-blue">
                          ₹{item.price}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          SAC {item.sacCode} • +{(item.taxRate * 100).toFixed(0)}% GST
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {inCart ? (
                        <div
                          className="flex items-center gap-2 bg-primary/10 rounded-lg p-1 border border-primary/20"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="h-7 w-7 rounded bg-background flex items-center justify-center text-foreground hover:bg-muted text-xs font-bold"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="font-bold text-xs px-1 text-foreground">{inCart.quantity}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="h-7 w-7 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 w-9 p-0 rounded-lg border-border"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item);
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Active Cart & Invoicing Panel */}
        <div className="space-y-4">
          <Card className="sticky top-20 border-primary/20 shadow-md">
            <CardHeader className="pb-3 border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-rentcot-blue" />
                  <span>Current Folio Order</span>
                </CardTitle>
                {cart.length > 0 && (
                  <span className="text-xs bg-rentcot-blue/10 text-rentcot-blue font-semibold px-2 py-0.5 rounded-full">
                    {cart.reduce((sum, c) => sum + c.quantity, 0)} items
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground space-y-1">
                  <ShoppingBag className="h-8 w-8 mx-auto opacity-40 mb-2" />
                  <div className="text-sm font-medium">Cart is empty</div>
                  <div className="text-xs">Select items from the catalog to build an order.</div>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {cart.map(({ item, quantity }) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-xs py-1.5 border-b border-border/60"
                      >
                        <div className="flex-1 pr-2">
                          <div className="font-medium text-foreground">{item.name}</div>
                          <div className="text-muted-foreground font-mono text-[11px]">
                            {quantity} × ₹{item.price} • SAC {item.sacCode}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">
                            ₹{quantity * item.price}
                          </span>
                          <button
                            onClick={() => clearCartItem(item.id)}
                            className="text-muted-foreground hover:text-destructive p-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Destination: Room vs Direct Counter */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <div className="text-xs font-semibold text-foreground">Billing Destination:</div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setChargeTarget("room")}
                        className={`flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-medium border transition-colors ${
                          chargeTarget === "room"
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <BedDouble className="h-3.5 w-3.5" />
                        <span>Charge to Room Folio</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setChargeTarget("direct")}
                        className={`flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-medium border transition-colors ${
                          chargeTarget === "direct"
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <Banknote className="h-3.5 w-3.5" />
                        <span>Direct Settle (GST)</span>
                      </button>
                    </div>

                    {chargeTarget === "room" ? (
                      <div className="space-y-1 pt-1">
                        <label className="text-[11px] text-muted-foreground">Select In-House Room / Tent:</label>
                        <select
                          value={selectedRoom}
                          onChange={(e) => {
                            setSelectedRoom(e.target.value);
                            const found = activeRooms.find((r) => r.room === e.target.value);
                            if (found) {
                              setGuestName(found.guest);
                              setGuestPhone(found.phone);
                            }
                          }}
                          className="w-full text-xs p-2 rounded-lg border border-border bg-background"
                        >
                          {activeRooms.map((r) => (
                            <option key={r.room} value={r.room}>
                              {r.room} — {r.guest}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="space-y-2 pt-1">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Guest Name (Optional)"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="p-2 text-xs rounded-lg border border-border bg-background"
                          />
                          <input
                            type="text"
                            placeholder="Phone (for WhatsApp bill)"
                            value={guestPhone}
                            onChange={(e) => setGuestPhone(e.target.value)}
                            className="p-2 text-xs rounded-lg border border-border bg-background"
                          />
                        </div>

                        {/* Payment Method Selector */}
                        <div className="grid grid-cols-4 gap-1 pt-1">
                          {[
                            { id: "upi", label: "UPI", icon: QrCode },
                            { id: "card", label: "Card", icon: CreditCard },
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
                                  if (m.id === "split") {
                                    setSplitUpiAmount(Math.round(grandTotal / 2));
                                    setSplitCashAmount(grandTotal - Math.round(grandTotal / 2));
                                  }
                                }}
                                className={`flex flex-col items-center p-2 rounded-lg border text-[10px] font-medium transition-colors ${
                                  isSel ? "border-primary bg-primary/10 text-primary font-bold" : "border-border text-muted-foreground hover:bg-muted"
                                }`}
                              >
                                <Icon className="h-3.5 w-3.5 mb-1" />
                                <span>{m.label}</span>
                              </button>
                            );
                          })}
                        </div>

                        {paymentMethod === "split" && (
                          <div className="grid grid-cols-2 gap-2 p-2 bg-muted/40 rounded-lg border border-border text-xs">
                            <div>
                              <label className="text-[10px] text-muted-foreground block">UPI Amount (₹)</label>
                              <input
                                type="number"
                                value={splitUpiAmount}
                                onChange={(e) => {
                                  const v = Number(e.target.value);
                                  setSplitUpiAmount(v);
                                  setSplitCashAmount(Math.max(0, grandTotal - v));
                                }}
                                className="w-full p-1.5 rounded border border-border bg-background text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-muted-foreground block">Cash Amount (₹)</label>
                              <input
                                type="number"
                                value={splitCashAmount}
                                onChange={(e) => {
                                  const v = Number(e.target.value);
                                  setSplitCashAmount(v);
                                  setSplitUpiAmount(Math.max(0, grandTotal - v));
                                }}
                                className="w-full p-1.5 rounded border border-border bg-background text-xs"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Discounts Selector */}
                  <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Percent className="h-3.5 w-3.5 text-rentcot-blue" />
                      <span>Promotional Discount:</span>
                    </span>
                    <div className="flex items-center gap-1">
                      {[0, 5, 10, 15].map((pct) => (
                        <button
                          key={pct}
                          onClick={() => setDiscountPercent(pct)}
                          className={`px-2 py-1 rounded text-[11px] font-semibold border ${
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
                        <span>Discount ({discountPercent}%)</span>
                        <span>-₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-muted-foreground">
                      <span>Applicable GST (CGST + SGST)</span>
                      <span>₹{Math.round(tax).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-foreground pt-1 border-t border-border">
                      <span>Grand Total</span>
                      <span className="text-rentcot-blue">₹{grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={handleCheckoutAndGenerateInvoice}
                    className="w-full bg-rentcot-blue hover:bg-rentcot-blue/90 text-white min-h-[44px] text-xs sm:text-sm font-bold gap-2"
                  >
                    <Receipt className="h-4 w-4" />
                    <span>
                      {chargeTarget === "room"
                        ? `Post ₹${grandTotal} & Print GST Bill`
                        : `Settle ₹${grandTotal} & Generate Invoice`}
                    </span>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Printable GST Tax Invoice Modal */}
      {activeInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Actions Bar (Hidden on print) */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 print:hidden">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className="font-bold text-foreground text-sm">Tax Invoice Generated</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Button
                  size="sm"
                  onClick={handlePrint}
                  className="bg-primary text-primary-foreground text-xs h-8 gap-1 font-semibold"
                  title="Print or Save as PDF"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print / PDF</span>
                </Button>
                <a
                  href={`https://wa.me/${guestPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    generateInvoiceWhatsAppText(activeInvoice)
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs h-8 px-2.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 font-semibold"
                  title="Share complete invoice breakdown on WhatsApp"
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
                  title="Download offline invoice HTML/PDF file"
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

            {/* Formatted Invoice Body (Printer Ready) */}
            <div id="printable-invoice" className="p-6 border border-border rounded-xl bg-background space-y-5 text-xs font-sans shadow-xs">
              {/* Top Header: Custom Resort / Farmhouse / Campsite Branding */}
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
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-600/10 text-amber-600 font-black text-sm border border-amber-600/20">
                        {activeInvoice.brandingSnapshot.logoType === "tent" ? "⛺" : activeInvoice.brandingSnapshot.logoType === "treepine" ? "🌲" : "🏛️"}
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
                  <Badge variant="outline" className="font-mono text-xs font-bold border-foreground/30 bg-muted/30">
                    TAX INVOICE
                  </Badge>
                  <div className="font-mono font-bold text-foreground mt-1 text-sm">{activeInvoice.invoiceNumber}</div>
                  <div className="text-[11px] text-muted-foreground">{activeInvoice.date}</div>
                </div>
              </div>

              {/* Guest & Room Details */}
              <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-muted/40 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Billed To Guest:</span>
                  <div className="font-bold text-foreground">{activeInvoice.guestName}</div>
                  <div className="text-[11px] text-muted-foreground">{activeInvoice.roomOrPitch}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Settlement Method:</span>
                  <div className="font-bold text-foreground">{activeInvoice.paymentMethod}</div>
                  <div className="text-[11px] text-emerald-600 font-medium">Status: Settled & Cleared</div>
                </div>
              </div>

              {/* Itemized Table */}
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-semibold text-[11px]">
                    <th className="py-2">Item Description</th>
                    <th className="py-2">SAC/HSN</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Rate</th>
                    <th className="py-2 text-right">GST</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {activeInvoice.items.map((it, idx) => (
                    <tr key={idx} className="text-foreground">
                      <td className="py-2 font-medium">{it.name}</td>
                      <td className="py-2 font-mono text-[11px] text-muted-foreground">{it.sacCode}</td>
                      <td className="py-2 text-center">{it.quantity}</td>
                      <td className="py-2 text-right">₹{it.price}</td>
                      <td className="py-2 text-right text-muted-foreground">{(it.taxRate * 100).toFixed(0)}%</td>
                      <td className="py-2 text-right font-semibold">₹{it.price * it.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Tax & Total Calculation */}
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
                  <span>CGST (Central Tax)</span>
                  <span>₹{(activeInvoice.tax / 2).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>SGST (State Tax)</span>
                  <span>₹{(activeInvoice.tax / 2).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-foreground pt-2 border-t border-border">
                  <span>Total Amount Paid</span>
                  <span className="text-rentcot-blue text-lg">₹{activeInvoice.grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Powered by Rentcot Non-Removable Verification Footer */}
              <div className="pt-4 border-t-2 border-dashed border-border flex flex-col sm:flex-row items-center justify-between gap-3 bg-muted/20 p-3 rounded-lg">
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
                    <div className="text-[9px] text-muted-foreground/80">Operating System for Resorts, Farmhouses & Camping Zones</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-mono">
                  <ShieldCheck className="h-3 w-3 text-rentcot-blue" />
                  <span>Verified Tax Invoice • Multi-Tenant Isolated</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end print:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveInvoice(null)}
                className="text-xs h-9"
              >
                Close & Next Order
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
                  className="text-xs h-8"
                >
                  🌲 Green Valley Farmhouse
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => applyPreset("campsite")}
                  className="text-xs h-8"
                >
                  ⛺ Wildwoods Campsite
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => applyPreset("resort")}
                  className="text-xs h-8"
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

              <div className="space-y-1">
                <label className="font-semibold text-foreground">City, State & PIN Code</label>
                <input
                  type="text"
                  value={branding.cityStatePin}
                  onChange={(e) => setBranding({ ...branding, cityStatePin: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-border bg-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">GSTIN Number</label>
                  <input
                    type="text"
                    value={branding.gstin}
                    onChange={(e) => setBranding({ ...branding, gstin: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-border bg-background font-mono"
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
                    <div className="text-muted-foreground">{inv.date} • {inv.guestName} ({inv.roomOrPitch})</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{inv.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-bold text-foreground">₹{inv.grandTotal.toLocaleString()}</div>
                      <Badge variant="clean" className="text-[10px]">{inv.paymentMethod}</Badge>
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

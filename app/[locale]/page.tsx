"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  TreePine,
  Tent,
  Compass,
  CalendarCheck,
  Receipt,
  Flame,
  CreditCard,
  BarChart3,
  Users,
  Smartphone,
  Check,
  X,
  HelpCircle,
  ExternalLink,
  Lock,
  Mail,
  KeyRound,
  User,
  Phone,
  Layers,
  Zap,
  Globe,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function LandingPage() {
  const { t, locale } = useTranslation();
  const router = useRouter();

  // Auth Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");

  // Sign In Form States
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInLoading, setSignInLoading] = useState(false);

  // Sign Up Form States
  const [signUpName, setSignUpName] = useState("");
  const [signUpProperty, setSignUpProperty] = useState("");
  const [signUpCategory, setSignUpCategory] = useState("resort");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpLoading, setSignUpLoading] = useState(false);

  // Interactive Product Preview Tab
  const [activePreviewTab, setActivePreviewTab] = useState<"radar" | "ota" | "pos" | "camping">("radar");

  // Pricing Toggle (Monthly vs Annual)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  // Interactive ROI Calculator State
  const [monthlyRevenue, setMonthlyRevenue] = useState(1500000); // ₹15 Lakhs default
  const [otaPercentage, setOtaPercentage] = useState(65); // 65% OTA bookings
  const otaCommissionRate = 0.18; // 18% OTA average take rate
  const annualOtaCommissionsPaid = Math.round(monthlyRevenue * (otaPercentage / 100) * otaCommissionRate * 12);
  const estimatedRentcotDirectSavings = Math.round(annualOtaCommissionsPaid * 0.45); // 45% shift to direct bookings

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInLoading(true);
    setTimeout(() => {
      setSignInLoading(false);
      setIsAuthModalOpen(false);
      router.push(`/${locale}/dashboard`);
    }, 600);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpLoading(true);
    setTimeout(() => {
      setSignUpLoading(false);
      setIsAuthModalOpen(false);
      router.push(`/${locale}/auth/onboarding`);
    }, 800);
  };

  const handleDemoAccess = () => {
    router.push(`/${locale}/dashboard`);
  };

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Rentcot Property OS",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web, iOS, Android",
        "offers": {
          "@type": "Offer",
          "price": "14999",
          "priceCurrency": "INR",
          "priceValidUntil": "2027-12-31",
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "320",
        },
        "description": "Multi-tenant operating system for resorts, farmhouses, camping zones, and vacation stays with 2-way OTA synchronization, GST invoicing, and dynamic pricing.",
      },
      {
        "@type": "Organization",
        "name": "Rentcot Property OS",
        "url": "https://rentcot.com",
        "logo": "https://rentcot.com/brand/rentcot-logo.png",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-98480-12345",
          "contactType": "Customer Support",
          "areaServed": "IN",
          "availableLanguage": ["English", "Hindi", "Telugu", "Arabic"],
        },
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How does Rentcot Property OS prevent double-bookings across OTAs?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Rentcot connects directly via 2-way API adapters to Airbnb, Booking.com, MakeMyTrip, and Agoda. The moment a reservation arrives on any channel, that unit is locked instantly, and zero-inventory stop-sells are pushed across all other channels within milliseconds.",
            },
          },
          {
            "@type": "Question",
            "name": "Can we print GST tax invoices with our resort branding and logo?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Owners can upload their custom resort logo, customize legal trade name, address, GSTIN, and FSSAI numbers. Invoices can be printed to PDF, shared instantly on WhatsApp, or emailed with itemized SAC codes.",
            },
          },
          {
            "@type": "Question",
            "name": "What camping and glamping operational features are included?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Rentcot includes pitch ground allocation (wooden decks, grass, gravel, sand), a real-time wind and fire safety watchdog with automatic campfire bans at 28 km/h, gear rental UV sanitization tracking, and evening BBQ logistics.",
            },
          },
        ],
      },
    ],
  };

  const faqs = [
    {
      q: "How does Rentcot Property OS prevent double-bookings across OTAs?",
      a: "Rentcot connects directly via real-time 2-way API adapters to Airbnb, Booking.com, MakeMyTrip, Goibibo, and Agoda. The millisecond an inbound reservation is confirmed from any OTA or direct walk-in, the physical unit is locked, and a zero-availability stop-sell is immediately broadcast to all other connected channels.",
    },
    {
      q: "Can I customize invoices with my own resort logo, trade name, and GSTIN?",
      a: "Yes! While Rentcot includes a non-removable 'Powered by Rentcot' verification stamp at the footer, property owners have 100% control over the header branding: upload your resort logo, enter your registered legal trade name, full physical address, GSTIN, FSSAI number, and share receipts instantly via WhatsApp or Email.",
    },
    {
      q: "What makes Rentcot specialized for farmhouses and camping retreats?",
      a: "Traditional hotel software fails for outdoor hospitality. Rentcot includes specialized modules for camping pitch ground types (wooden decks, grass, sand), weather and wind watchdog with automated campfire bans (≥ 28 km/h), adventure gear rental with UV sanitization tracking, and daytime picnic venue slots (10 AM – 6 PM).",
    },
    {
      q: "How does the Dynamic Pricing & Surge Engine work?",
      a: "The pricing engine automatically adjusts nightly and hourly rates based on weekend surges, holiday calendars, live occupancy tiers (e.g., +25% rate once occupancy crosses 80%), and long-stay rules. It also features a Rate Parity Watchdog to protect your direct bookings from OTA undercutting penalties.",
    },
    {
      q: "Is Rentcot multi-tenant and secure?",
      a: "Yes. Rentcot is built with Supabase enterprise PostgreSQL featuring strict Row Level Security (RLS). All guest data, financial ledgers, and inventory are cryptographically isolated per organization. Role-based access control (RBAC) ensures front-desk staff, housekeeping, and accountants only see what they need.",
    },
    {
      q: "Can I use Rentcot on mobile devices, iPads, and tablets?",
      a: "Yes. Rentcot Property OS is 100% responsive and PWA-ready. Front-desk staff can use iPads for POS and check-in, housekeepers can inspect room statuses on smartphones, and owners have a live mobile executive dashboard.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-rentcot-blue selection:text-white">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Sticky Marketing Header / Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="relative h-8 w-32 sm:h-9 sm:w-36">
              <Image
                src="/brand/rentcot-logo.png"
                alt="Rentcot Property OS"
                fill
                className="object-contain object-left rtl:object-right"
                priority
              />
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-muted-foreground">
            <a href="#solutions" className="hover:text-foreground transition-colors">
              Solutions
            </a>
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#channel-manager" className="hover:text-foreground transition-colors">
              OTA Sync
            </a>
            <a href="#pricing" className="hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#roi" className="hover:text-foreground transition-colors">
              ROI Calculator
            </a>
            <a href="#faq" className="hover:text-foreground transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right Actions: Language Switcher, Sign In, Sign Up / Demo */}
          <div className="flex items-center gap-2.5">
            <LanguageSwitcher />

            <button
              onClick={() => {
                setAuthMode("signin");
                setIsAuthModalOpen(true);
              }}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors"
            >
              Sign In
            </button>

            <Button
              onClick={() => {
                setAuthMode("signup");
                setIsAuthModalOpen(true);
              }}
              className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white text-xs font-semibold h-9 px-4 rounded-lg shadow-sm"
            >
              Start Free Trial
            </Button>

            <button
              onClick={handleDemoAccess}
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600/20 border border-emerald-600/20 transition-colors"
              title="Launch instant live demo"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Live Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Landing Page Content */}
      <main>
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-border bg-radial from-rentcot-blue/5 via-background to-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
            {/* Top Version Announcement Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-rentcot-blue/30 bg-rentcot-blue/10 px-3.5 py-1 text-xs font-semibold text-rentcot-blue">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Version 2.4 Live • Purpose-Built for Resorts, Farmhouses & Camping</span>
            </div>

            {/* Main Headline */}
            <h1 className="mx-auto max-w-4xl text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.15]">
              The Unified Operating System for{" "}
              <span className="bg-gradient-to-r from-rentcot-blue via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Resorts, Farmhouses & Glamping
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
              Stop juggling 6 disconnected apps. Manage multi-channel OTA sync, direct reservations,
              front-desk POS billing with GST, automated surge pricing, and campsite weather safety in one high-performance platform.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Button
                size="lg"
                onClick={() => {
                  setAuthMode("signup");
                  setIsAuthModalOpen(true);
                }}
                className="w-full sm:w-auto bg-rentcot-blue hover:bg-rentcot-blue/90 text-white font-semibold text-sm h-12 px-8 rounded-xl shadow-md gap-2"
              >
                <span>Start 14-Day Free Trial</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={handleDemoAccess}
                className="w-full sm:w-auto border-border bg-card hover:bg-muted text-foreground font-semibold text-sm h-12 px-6 rounded-xl gap-2"
              >
                <Zap className="h-4 w-4 text-emerald-600" />
                <span>Explore Live Demo Portal</span>
              </Button>
            </div>

            {/* Trust Signals */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-border/60">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-black text-foreground font-mono">500+</div>
                <div className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider">Properties Live</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-black text-foreground font-mono">₹45 Cr+</div>
                <div className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider">Bookings Handled</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-black text-emerald-600 font-mono">0%</div>
                <div className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider">Double-Bookings</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-black text-rentcot-blue font-mono">99.98%</div>
                <div className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider">Uptime SLA</div>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE PRODUCT SHOWCASE SECTION */}
        <section className="py-16 md:py-24 border-b border-border bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <Badge variant="outline" className="text-xs font-semibold text-rentcot-blue border-rentcot-blue/30">
                Live Interactive Experience
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                Designed for Fast-Paced Property Operations
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
                Switch between core modules below to explore how Rentcot replaces legacy PMS systems with instant visual controls.
              </p>
            </div>

            {/* Tabs Controller */}
            <div className="flex justify-center">
              <div className="inline-flex p-1 rounded-xl bg-background border border-border shadow-xs gap-1">
                <button
                  onClick={() => setActivePreviewTab("radar")}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activePreviewTab === "radar"
                      ? "bg-rentcot-blue text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Availability Radar
                </button>
                <button
                  onClick={() => setActivePreviewTab("ota")}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activePreviewTab === "ota"
                      ? "bg-rentcot-blue text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  2-Way OTA Sync
                </button>
                <button
                  onClick={() => setActivePreviewTab("pos")}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activePreviewTab === "pos"
                      ? "bg-rentcot-blue text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  POS & GST Invoicing
                </button>
                <button
                  onClick={() => setActivePreviewTab("camping")}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activePreviewTab === "camping"
                      ? "bg-rentcot-blue text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Campsite Watchdog
                </button>
              </div>
            </div>

            {/* Tab Visual Windows */}
            <Card className="border-border shadow-xl overflow-hidden bg-card">
              {activePreviewTab === "radar" && (
                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">Live Visual Inventory & Occupancy Radar</h3>
                      <p className="text-xs text-muted-foreground">Color-coded availability across villas, suites & glamping domes</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        ● Available
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                        ● Fast Filling
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-500/10 text-red-600 border border-red-500/20">
                        ● Sold Out
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1">
                      <div className="text-[10px] font-bold text-emerald-600 uppercase">Green Valley Farmhouse</div>
                      <div className="text-base font-bold text-foreground">Main Farmhouse Villa</div>
                      <Badge variant="clean" className="text-[10px]">Ready &bull; 8 Sleeps</Badge>
                    </div>
                    <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-1">
                      <div className="text-[10px] font-bold text-amber-600 uppercase">Wildwoods Campsite</div>
                      <div className="text-base font-bold text-foreground">Glamping Dome 01</div>
                      <Badge variant="occupied" className="text-[10px]">Occupied &bull; Check-out 11 AM</Badge>
                    </div>
                    <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/5 space-y-1">
                      <div className="text-[10px] font-bold text-red-600 uppercase">Palm Oasis Resort</div>
                      <div className="text-base font-bold text-foreground">Lakeview Pool Villa</div>
                      <Badge variant="dirty" className="text-[10px]">Turnover in Progress</Badge>
                    </div>
                    <div className="p-3.5 rounded-xl border border-border bg-background space-y-1">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase">Wildwoods Campsite</div>
                      <div className="text-base font-bold text-foreground">Pitch P-04 (Grass Lawn)</div>
                      <Badge variant="clean" className="text-[10px]">Vacant Clean</Badge>
                    </div>
                  </div>
                </div>
              )}

              {activePreviewTab === "ota" && (
                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">Two-Way OTA Synchronization Engine</h3>
                      <p className="text-xs text-muted-foreground">Airbnb, Booking.com, MakeMyTrip & Agoda 1-click sync</p>
                    </div>
                    <Badge variant="clean" className="text-xs font-mono">Zero Collisions Active</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { name: "Airbnb", status: "Active Push/Pull", lastSync: "24s ago", markup: "+12% markup" },
                      { name: "Booking.com", status: "Active Push/Pull", lastSync: "45s ago", markup: "+15% markup" },
                      { name: "MakeMyTrip", status: "Active Push/Pull", lastSync: "1m ago", markup: "+15% markup" },
                      { name: "Agoda", status: "Active Push/Pull", lastSync: "1m ago", markup: "+10% markup" },
                    ].map((channel, i) => (
                      <div key={i} className="p-4 rounded-xl border border-border bg-background space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-foreground">{channel.name}</span>
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        </div>
                        <div className="text-xs text-emerald-600 font-medium">{channel.status}</div>
                        <div className="text-[11px] text-muted-foreground">Last sync: {channel.lastSync}</div>
                        <Badge variant="outline" className="text-[10px]">{channel.markup}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activePreviewTab === "pos" && (
                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">Front-Desk POS & GST Invoicing</h3>
                      <p className="text-xs text-muted-foreground">F&B dining, campfire hardwood kits, split tenders & custom branding</p>
                    </div>
                    <Badge variant="outline" className="text-xs font-semibold">WhatsApp & PDF Ready</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-border bg-background space-y-2">
                      <div className="font-bold text-xs text-muted-foreground uppercase">Resort Header Branding</div>
                      <div className="font-bold text-sm text-foreground">Upload Custom Logo & Address</div>
                      <p className="text-xs text-muted-foreground">Owner details on top, verified Powered by Rentcot footer.</p>
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-background space-y-2">
                      <div className="font-bold text-xs text-muted-foreground uppercase">GST & SAC Compliance</div>
                      <div className="font-bold text-sm text-foreground">5% & 18% Automated Split</div>
                      <p className="text-xs text-muted-foreground">Automatic CGST & SGST calculation with legal tax invoices.</p>
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-background space-y-2">
                      <div className="font-bold text-xs text-muted-foreground uppercase">Instant Multi-Channel Export</div>
                      <div className="font-bold text-sm text-foreground">1-Tap WhatsApp & Email PDF</div>
                      <p className="text-xs text-muted-foreground">Send itemized invoice links directly to the guest&apos;s phone.</p>
                    </div>
                  </div>
                </div>
              )}

              {activePreviewTab === "camping" && (
                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">Campsite & Glamping Operations Watchdog</h3>
                      <p className="text-xs text-muted-foreground">Wind monitor, automatic campfire bans, BBQ delivery & UV gear sanitization</p>
                    </div>
                    <Badge variant="outline" className="text-xs font-mono text-amber-600 border-amber-600/30 bg-amber-600/10">
                      Safety Protocol Active
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-border bg-background space-y-1.5">
                      <div className="flex items-center gap-2 text-amber-600 font-bold text-xs">
                        <Flame className="h-4 w-4" />
                        <span>Wind & Campfire Ban</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Automatically disables campfire checkout if gusts exceed 28 km/h.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-background space-y-1.5">
                      <div className="flex items-center gap-2 text-rentcot-blue font-bold text-xs">
                        <Tent className="h-4 w-4" />
                        <span>Pitch Allocation</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Separate wooden decks, grass plots, sand beds, and RV bays.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-background space-y-1.5">
                      <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                        <Sparkles className="h-4 w-4" />
                        <span>UV Sanitization Desk</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Barcode tracking for sanitized sleeping bags, lanterns & camping chairs.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </section>

        {/* SOLUTIONS BY PROPERTY TYPE */}
        <section id="solutions" className="py-16 md:py-24 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-2">
              <Badge variant="outline" className="text-xs font-semibold text-rentcot-blue border-rentcot-blue/30">
                Tailored Solutions
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                Built Specifically for Diverse Hospitality Formats
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
                Whether you manage a private agro-estate, a lakefront resort, or a forest glamping retreat.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Solution 1: Luxury Resorts & Villas */}
              <Card className="border-border hover:border-rentcot-blue/50 transition-all flex flex-col justify-between">
                <CardHeader className="space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                    <Compass className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Resorts & Boutique Villas</CardTitle>
                    <CardDescription className="text-xs mt-1">Multi-category suites, pool villas & events</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-xs text-muted-foreground">
                  <p>
                    Complete front-desk management, room folio posting from restaurant & bar, banquet lawn bookings, and identity compliance for domestic & international travelers.
                  </p>
                  <ul className="space-y-2 text-foreground font-medium">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Pool villa & suite category hierarchy</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Banquet hall & lawn day-slot reservations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Housekeeping turnover state machine</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Solution 2: Private Farmhouses & Eco Estates */}
              <Card className="border-border hover:border-rentcot-blue/50 transition-all flex flex-col justify-between">
                <CardHeader className="space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                    <TreePine className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Farmhouses & Eco Retreats</CardTitle>
                    <CardDescription className="text-xs mt-1">Estate buyouts, private pools & organic dining</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-xs text-muted-foreground">
                  <p>
                    Designed for private farm stay operators who need full-property buyout rules, 10 AM – 6 PM day-picnic packages, pet fees, and private hardwood bonfire arrangements.
                  </p>
                  <ul className="space-y-2 text-foreground font-medium">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Full estate buyout vs per-room split</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Day-use picnic slots (10 AM &bull; 6 PM)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Pet parent declaration & cleaning deposits</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Solution 3: Campsites & Glamping Zones */}
              <Card className="border-border hover:border-rentcot-blue/50 transition-all flex flex-col justify-between">
                <CardHeader className="space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                    <Tent className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Glamping & Campsites</CardTitle>
                    <CardDescription className="text-xs mt-1">Pitch allocations, weather watch & gear rentals</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-xs text-muted-foreground">
                  <p>
                    The only property platform with dedicated outdoor safety protocols: live wind/gust watchdog, automatic campfire bans, serialized sleeping bag UV sanitization, and forest quiet curfew.
                  </p>
                  <ul className="space-y-2 text-foreground font-medium">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Deck, grass, gravel & RV pitch assignment</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Automatic fire ban triggered at 28 km/h</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>UV sanitized gear checkout logs</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CORE FEATURES GRID */}
        <section id="features" className="py-16 md:py-24 border-b border-border bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-2">
              <Badge variant="outline" className="text-xs font-semibold text-rentcot-blue border-rentcot-blue/30">
                Core Capabilities
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                Everything Required to Run a High-Margin Property
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
                Engineered with enterprise multi-tenancy, real-time sync, and mobile-first hospitality workflows.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: CalendarCheck,
                  title: "Instant 2-Way OTA Sync",
                  desc: "Zero double bookings. Rates & availability push out; reservations & cancellations pull in across Airbnb, Booking.com, MMT & Agoda.",
                },
                {
                  icon: CreditCard,
                  title: "Dynamic Surge Pricing",
                  desc: "Automate rates based on weekend surges, holidays, occupancy thresholds, and minimum length-of-stay requirements.",
                },
                {
                  icon: Receipt,
                  title: "Custom Branded POS",
                  desc: "Touchscreen POS with your resort logo, GSTIN, split UPI/Cash tender, and instant WhatsApp invoice delivery.",
                },
                {
                  icon: Sparkles,
                  title: "Turnover Board & Linen",
                  desc: "6-state housekeeping board (clean, dirty, inspected, occupied) linked to linen pairs & dry store thresholds.",
                },
                {
                  icon: ShieldCheck,
                  title: "Multi-Tenant RLS Security",
                  desc: "Cryptographically isolated data stores per organization with role-based access control for front-desk, managers, and accountants.",
                },
                {
                  icon: Smartphone,
                  title: "Guest Self-Service Portal",
                  desc: "Mobile guest portal for contactless digital check-in, Aadhaar/ID photo upload, pet declarations, and folio payments.",
                },
              ].map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div key={idx} className="p-6 rounded-2xl border border-border bg-background hover:shadow-md transition-shadow space-y-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rentcot-blue/10 text-rentcot-blue">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-base text-foreground">{feat.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* OTA COMMISSION SAVINGS / ROI CALCULATOR */}
        <section id="roi" className="py-16 md:py-24 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center space-y-2">
              <Badge variant="outline" className="text-xs font-semibold text-emerald-600 border-emerald-600/30 bg-emerald-600/5">
                Financial ROI Analysis
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                Calculate Your Direct Booking Savings
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
                See how much revenue you lose to 18% OTA commissions each year compared to running Rentcot Property OS.
              </p>
            </div>

            <Card className="max-w-4xl mx-auto border-border shadow-xl bg-card">
              <CardContent className="p-6 sm:p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Controls */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Average Monthly Booking Revenue</span>
                        <span className="text-rentcot-blue font-bold font-mono">₹{(monthlyRevenue / 100000).toFixed(1)} Lakhs</span>
                      </div>
                      <input
                        type="range"
                        min={300000}
                        max={5000000}
                        step={100000}
                        value={monthlyRevenue}
                        onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                        className="w-full accent-rentcot-blue cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>₹3 Lakhs</span>
                        <span>₹25 Lakhs</span>
                        <span>₹50 Lakhs</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Current OTA Booking Share</span>
                        <span className="text-amber-600 font-bold font-mono">{otaPercentage}%</span>
                      </div>
                      <input
                        type="range"
                        min={20}
                        max={95}
                        step={5}
                        value={otaPercentage}
                        onChange={(e) => setOtaPercentage(Number(e.target.value))}
                        className="w-full accent-amber-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>20% Direct heavy</span>
                        <span>60% Balanced</span>
                        <span>95% OTA dependent</span>
                      </div>
                    </div>
                  </div>

                  {/* ROI Outcome Box */}
                  <div className="p-6 rounded-2xl bg-muted/40 border border-border space-y-4">
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Estimated Yearly OTA Commission Paid:</div>
                      <div className="text-2xl font-black text-rose-600 font-mono">
                        ₹{annualOtaCommissionsPaid.toLocaleString()} / year
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">Based on standard ~18% OTA commission cut.</div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="text-xs text-muted-foreground font-medium">Estimated Yearly Savings with Rentcot Direct:</div>
                      <div className="text-3xl font-black text-emerald-600 font-mono">
                        ₹{estimatedRentcotDirectSavings.toLocaleString()} / year
                      </div>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-1">
                        By shifting 45% of repeat guests to direct WhatsApp & web booking.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <Button
                    size="lg"
                    onClick={() => {
                      setAuthMode("signup");
                      setIsAuthModalOpen(true);
                    }}
                    className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white font-semibold text-xs h-11 px-8 rounded-xl shadow-sm"
                  >
                    Start Saving &bull; Claim Your 14-Day Free Trial
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="py-16 md:py-24 border-b border-border bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center space-y-2">
              <Badge variant="outline" className="text-xs font-semibold text-rentcot-blue border-rentcot-blue/30">
                Transparent SaaS Tiers
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                Predictable Subscription Pricing
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
                No hidden transaction cuts. Anchor against OTA commission savings and custom software maintenance.
              </p>
            </div>

            {/* Monthly / Annual Toggle */}
            <div className="flex justify-center">
              <div className="inline-flex items-center p-1 rounded-xl bg-background border border-border">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    billingCycle === "monthly"
                      ? "bg-rentcot-blue text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  onClick={() => setBillingCycle("annual")}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    billingCycle === "annual"
                      ? "bg-rentcot-blue text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>Annual Billing</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                    Save 25%
                  </span>
                </button>
              </div>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Starter */}
              <Card className="border-border hover:shadow-lg transition-shadow flex flex-col justify-between bg-card">
                <CardHeader className="space-y-2">
                  <Badge variant="outline" className="w-fit text-xs font-semibold">Starter Plan</Badge>
                  <CardTitle className="text-xl font-bold">Resorts & Boutique Stays</CardTitle>
                  <CardDescription className="text-xs">For single properties up to 10 units</CardDescription>
                  <div className="pt-4">
                    <span className="text-3xl sm:text-4xl font-black text-foreground font-mono">
                      ₹{billingCycle === "annual" ? "14,999" : "19,999"}
                    </span>
                    <span className="text-xs text-muted-foreground"> / month</span>
                    <div className="text-[11px] text-muted-foreground mt-1">One-time setup: ₹19,999</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-4 border-t border-border">
                  <ul className="space-y-2.5 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2 text-foreground">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>Up to 10 units / rooms / tents</span>
                    </li>
                    <li className="flex items-center gap-2 text-foreground">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>Front-Desk POS & GST Invoicing</span>
                    </li>
                    <li className="flex items-center gap-2 text-foreground">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>Dynamic Surge Pricing Engine</span>
                    </li>
                    <li className="flex items-center gap-2 text-foreground">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>WhatsApp Invoices & Guest CRM</span>
                    </li>
                  </ul>
                  <Button
                    onClick={() => {
                      setAuthMode("signup");
                      setIsAuthModalOpen(true);
                    }}
                    variant="outline"
                    className="w-full text-xs font-semibold h-10 border-border"
                  >
                    Start 14-Day Trial
                  </Button>
                </CardContent>
              </Card>

              {/* Growth Pro (Featured) */}
              <Card className="border-rentcot-blue shadow-xl relative flex flex-col justify-between bg-card">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rentcot-blue text-white px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs">
                  Most Popular for Resorts & Campsites
                </div>
                <CardHeader className="space-y-2">
                  <Badge className="w-fit text-xs font-semibold bg-rentcot-blue text-white">Growth Pro</Badge>
                  <CardTitle className="text-xl font-bold">Multi-Property Groups</CardTitle>
                  <CardDescription className="text-xs">Up to 5 properties + Full OTA Sync + Campsite Ops</CardDescription>
                  <div className="pt-4">
                    <span className="text-3xl sm:text-4xl font-black text-foreground font-mono">
                      ₹{billingCycle === "annual" ? "34,999" : "39,999"}
                    </span>
                    <span className="text-xs text-muted-foreground"> / month</span>
                    <div className="text-[11px] text-muted-foreground mt-1">One-time setup: ₹39,999</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-4 border-t border-border">
                  <ul className="space-y-2.5 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2 text-foreground font-semibold">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>Up to 5 properties & 50 units</span>
                    </li>
                    <li className="flex items-center gap-2 text-foreground font-semibold">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>2-Way OTA Channel Manager (Airbnb, MMT, Booking)</span>
                    </li>
                    <li className="flex items-center gap-2 text-foreground font-semibold">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>Rate Parity Penalty Watchdog</span>
                    </li>
                    <li className="flex items-center gap-2 text-foreground font-semibold">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>Campsite & Glamping Operations Suite</span>
                    </li>
                    <li className="flex items-center gap-2 text-foreground font-semibold">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>Housekeeping Turnover Board & Staff HR</span>
                    </li>
                  </ul>
                  <Button
                    onClick={() => {
                      setAuthMode("signup");
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full bg-rentcot-blue hover:bg-rentcot-blue/90 text-white text-xs font-semibold h-10 shadow-md"
                  >
                    Start Free Trial with Growth Pro
                  </Button>
                </CardContent>
              </Card>

              {/* Enterprise */}
              <Card className="border-border hover:shadow-lg transition-shadow flex flex-col justify-between bg-card">
                <CardHeader className="space-y-2">
                  <Badge variant="outline" className="w-fit text-xs font-semibold">Enterprise</Badge>
                  <CardTitle className="text-xl font-bold">Hospitality Chains</CardTitle>
                  <CardDescription className="text-xs">Unlimited properties & custom integrations</CardDescription>
                  <div className="pt-4">
                    <span className="text-3xl sm:text-4xl font-black text-foreground font-mono">
                      ₹{billingCycle === "annual" ? "69,999" : "79,999"}
                    </span>
                    <span className="text-xs text-muted-foreground"> / month</span>
                    <div className="text-[11px] text-muted-foreground mt-1">Setup: ₹99,999+ custom SLA</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-4 border-t border-border">
                  <ul className="space-y-2.5 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2 text-foreground">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>Unlimited properties & accommodations</span>
                    </li>
                    <li className="flex items-center gap-2 text-foreground">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>Dedicated Account Manager & 24/7 Phone SLA</span>
                    </li>
                    <li className="flex items-center gap-2 text-foreground">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>Custom Tally & ERP Accounting connectors</span>
                    </li>
                    <li className="flex items-center gap-2 text-foreground">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>Multi-Cluster Supabase Dedicated Database</span>
                    </li>
                  </ul>
                  <Button
                    onClick={() => {
                      setAuthMode("signup");
                      setIsAuthModalOpen(true);
                    }}
                    variant="outline"
                    className="w-full text-xs font-semibold h-10 border-border"
                  >
                    Contact Enterprise Sales
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* OPERATOR TESTIMONIALS */}
        <section id="testimonials" className="py-16 md:py-24 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-2">
              <Badge variant="outline" className="text-xs font-semibold text-rentcot-blue border-rentcot-blue/30">
                Operator Stories
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                Trusted by Forward-Thinking Hospitality Leaders
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote:
                    "Before Rentcot, we suffered 3 double-bookings every month between Airbnb and MakeMyTrip during peak wedding season. The 2-way sync eliminated collisions completely within 24 hours.",
                  author: "Rajeshwar Rao",
                  role: "Managing Director",
                  property: "Green Valley Farmhouse & Retreats (Hyderabad)",
                },
                {
                  quote:
                    "The campsite operations suite is unmatched. The automatic campfire restriction when winds hit 28 km/h and the sleeping bag UV tracking gave our forest rangers peace of mind.",
                  author: "Siddharth Menon",
                  role: "Co-Founder",
                  property: "Wildwoods Glamping (Wayanad / Vikarabad)",
                },
                {
                  quote:
                    "Our F&B and pool villa revenue jumped 22% simply because room service orders are posted straight from POS to the guest folio with WhatsApp receipts. Game changer.",
                  author: "Ananya Deshmukh",
                  role: "General Manager",
                  property: "Palm Oasis Luxury Resort (Goa / Hyderabad)",
                },
              ].map((t, idx) => (
                <Card key={idx} className="border-border bg-card p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-foreground italic leading-relaxed">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <div className="font-bold text-sm text-foreground">{t.author}</div>
                    <div className="text-[11px] text-muted-foreground">{t.role} &bull; {t.property}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS (SEO ACCORDION) */}
        <section id="faq" className="py-16 md:py-24 border-b border-border bg-muted/20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <Badge variant="outline" className="text-xs font-semibold text-rentcot-blue border-rentcot-blue/30">
                Knowledge Base
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="border border-border rounded-xl bg-background overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-bold text-sm sm:text-base text-foreground"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-rentcot-blue shrink-0 ml-2" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="py-16 md:py-20 bg-rentcot-blue text-white text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Upgrade Your Hospitality Operations?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
              Join 500+ properties streamlining reservations, OTA sync, and POS billing. Start your 14-day free trial today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                size="lg"
                onClick={() => {
                  setAuthMode("signup");
                  setIsAuthModalOpen(true);
                }}
                className="w-full sm:w-auto bg-white text-rentcot-blue hover:bg-white/90 font-bold text-xs h-11 px-8 rounded-xl shadow-lg"
              >
                Start 14-Day Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleDemoAccess}
                className="w-full sm:w-auto border-white/30 text-white bg-white/10 hover:bg-white/20 font-semibold text-xs h-11 px-6 rounded-xl"
              >
                Launch Instant Demo
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* SEO-FRIENDLY MARKETING FOOTER */}
      <footer className="border-t border-border bg-background py-12 text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 space-y-3">
              <div className="relative h-8 w-32">
                <Image
                  src="/brand/rentcot-logo.png"
                  alt="Rentcot Property OS"
                  fill
                  className="object-contain object-left rtl:object-right"
                />
              </div>
              <p className="text-xs leading-relaxed max-w-sm">
                Next-generation multi-tenant property operating system for luxury resorts, private farmhouses, and outdoor camping retreats.
              </p>
              <div className="flex items-center gap-2 pt-1 font-mono text-[11px]">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Enterprise Supabase Multi-Tenant RLS</span>
              </div>
            </div>

            <div>
              <div className="font-bold text-foreground text-xs uppercase mb-3">Product</div>
              <ul className="space-y-2">
                <li><Link href={`/${locale}/dashboard`} className="hover:text-foreground">Operations Dashboard</Link></li>
                <li><Link href={`/${locale}/channels`} className="hover:text-foreground">2-Way OTA Manager</Link></li>
                <li><Link href={`/${locale}/pos`} className="hover:text-foreground">Front-Desk POS & GST</Link></li>
                <li><Link href={`/${locale}/camping`} className="hover:text-foreground">Campsite & Glamping</Link></li>
                <li><Link href={`/${locale}/pricing`} className="hover:text-foreground">Dynamic Surge Pricing</Link></li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-foreground text-xs uppercase mb-3">Solutions</div>
              <ul className="space-y-2">
                <li><a href="#solutions" className="hover:text-foreground">Luxury Resorts</a></li>
                <li><a href="#solutions" className="hover:text-foreground">Private Farmhouses</a></li>
                <li><a href="#solutions" className="hover:text-foreground">Glamping & Camping</a></li>
                <li><Link href={`/${locale}/guest/portal`} className="hover:text-foreground">Guest Self-Portal</Link></li>
                <li><Link href={`/${locale}/billing`} className="hover:text-foreground">Subscription Tiers</Link></li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-foreground text-xs uppercase mb-3">Security & Legal</div>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground">GST Invoicing Rules</a></li>
                <li><a href="#" className="hover:text-foreground">Security Compliance</a></li>
                <li><a href="#" className="hover:text-foreground">Contact Support</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              &copy; {new Date().getFullYear()} Rentcot Property OS. All rights reserved. Powered by Dodail Solutions.
            </div>
            <div className="flex items-center gap-4">
              <span>English &bull; हिन्दी &bull; తెలుగు &bull; العربية</span>
            </div>
          </div>
        </div>
      </footer>

      {/* AUTH MODAL (SIGN IN & SIGN UP) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="relative h-6 w-24">
                  <Image
                    src="/brand/rentcot-logo.png"
                    alt="Rentcot Property OS"
                    fill
                    className="object-contain object-left"
                  />
                </div>
              </div>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <Tabs value={authMode} onValueChange={(val) => setAuthMode(val as "signin" | "signup")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signup" className="text-xs font-bold">
                  Sign Up (14-Day Trial)
                </TabsTrigger>
                <TabsTrigger value="signin" className="text-xs font-bold">
                  Sign In
                </TabsTrigger>
              </TabsList>

              {/* SIGN UP TAB */}
              <TabsContent value="signup" className="space-y-4 pt-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-foreground">Create Your Property OS Account</h3>
                  <p className="text-[11px] text-muted-foreground">Start your 14-day full feature trial. No credit card required.</p>
                </div>

                <form onSubmit={handleSignUpSubmit} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <Label className="text-xs">Your Full Name</Label>
                    <Input
                      required
                      placeholder="e.g. Vikram Sharma"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Property / Business Name</Label>
                    <Input
                      required
                      placeholder="e.g. Whispering Pines Eco Farmhouse"
                      value={signUpProperty}
                      onChange={(e) => setSignUpProperty(e.target.value)}
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Property Category</Label>
                    <select
                      value={signUpCategory}
                      onChange={(e) => setSignUpCategory(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-border bg-background"
                    >
                      <option value="resort">Luxury Resort & Villas</option>
                      <option value="farmhouse">Private Farmhouse & Agro-Retreat</option>
                      <option value="campsite">Glamping Domes & Campsite</option>
                      <option value="multi">Multi-Property Portfolio</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Work Email</Label>
                      <Input
                        type="email"
                        required
                        placeholder="owner@property.com"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        className="text-xs h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Mobile Number</Label>
                      <Input
                        type="tel"
                        required
                        placeholder="+91 98480 12345"
                        value={signUpPhone}
                        onChange={(e) => setSignUpPhone(e.target.value)}
                        className="text-xs h-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Choose Password</Label>
                    <Input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      className="text-xs h-9"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={signUpLoading}
                    className="w-full bg-rentcot-blue hover:bg-rentcot-blue/90 text-white font-semibold text-xs h-10 mt-2"
                  >
                    {signUpLoading ? "Creating Organization..." : "Create Account & Setup Property"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>

                <div className="flex items-center justify-center gap-2 pt-2 border-t border-border text-[11px] text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>14-day free access &bull; Automatic RLS database provisioning</span>
                </div>
              </TabsContent>

              {/* SIGN IN TAB */}
              <TabsContent value="signin" className="space-y-4 pt-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-foreground">Sign In to Your Property OS</h3>
                  <p className="text-[11px] text-muted-foreground">Access your front desk, reservations, and POS terminal.</p>
                </div>

                <form onSubmit={handleSignInSubmit} className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <Label className="text-xs">Work Email</Label>
                    <Input
                      type="email"
                      required
                      placeholder="owner@property.com"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs">Password</Label>
                      <a href="#" className="text-[10px] text-rentcot-blue hover:underline">Forgot?</a>
                    </div>
                    <Input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="text-xs h-9"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={signInLoading}
                    className="w-full bg-rentcot-blue hover:bg-rentcot-blue/90 text-white font-semibold text-xs h-10"
                  >
                    {signInLoading ? "Authenticating..." : "Sign In to Dashboard"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>

                <div className="pt-3 border-t border-border space-y-2">
                  <button
                    type="button"
                    onClick={handleDemoAccess}
                    className="w-full py-2 px-3 rounded-lg border border-emerald-600/30 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Zap className="h-3.5 w-3.5" />
                    <span>Quick 1-Click Demo Login (Instant Access)</span>
                  </button>

                  <div className="text-center">
                    <Link
                      href={`/${locale}/auth/login`}
                      className="text-[11px] text-muted-foreground hover:text-foreground"
                    >
                      Prefer OTP or Magic Link? Open Full Auth Page
                    </Link>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}

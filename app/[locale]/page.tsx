"use client";

import React, { useState, useEffect, useRef } from "react";
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
  RefreshCw,
  TrendingUp,
  Sliders,
  Wind,
  Shield,
  Activity,
  Printer,
  Share2,
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

  // Interactive Hero Cockpit View Switcher
  const [heroPropertyType, setHeroPropertyType] = useState<"resort" | "farmhouse" | "campsite">("resort");

  // Interactive Bento Grid States
  const [interactiveWindSpeed, setInteractiveWindSpeed] = useState(16); // km/h
  const [interactiveResortName, setInteractiveResortName] = useState("Palm Oasis Luxury Retreat");
  const [interactiveGstRate, setInteractiveGstRate] = useState<5 | 18>(18);
  const [surgeOccupancyInput, setSurgeOccupancyInput] = useState(85);

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

  // Live Notification Feed for Hero Cockpit
  const liveNotifications = [
    { id: 1, icon: "🔒", text: "Airbnb reservation locked Villa 102 → MMT stop-sell pushed", time: "Just now", color: "emerald" },
    { id: 2, icon: "💳", text: "Walk-in POS Invoice #RC-8942 generated → WhatsApp sent", time: "2m ago", color: "blue" },
    { id: 3, icon: "🌡️", text: "Wind speed dropped to 14 km/h → Campfire checkout re-enabled", time: "5m ago", color: "amber" },
    { id: 4, icon: "📊", text: "Occupancy crossed 85% → Weekend surge +25% activated", time: "8m ago", color: "blue" },
    { id: 5, icon: "🧹", text: "Villa 104 housekeeping complete → Status: Inspected Clean", time: "12m ago", color: "emerald" },
    { id: 6, icon: "✈️", text: "Booking.com reservation #BK-44921 confirmed → Auto-assigned", time: "15m ago", color: "blue" },
  ];
  const [activeNotifIndex, setActiveNotifIndex] = useState(0);
  const [notifAnimating, setNotifAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setNotifAnimating(true);
      setTimeout(() => {
        setActiveNotifIndex((prev) => (prev + 1) % liveNotifications.length);
        setNotifAnimating(false);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        "description":
          "Multi-tenant operating system for resorts, farmhouses, camping zones, and vacation stays with 2-way OTA synchronization, GST invoicing, and dynamic pricing.",
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
    ],
  };

  const faqs = [
    {
      q: "How does Rentcot Property OS eliminate double-bookings across OTAs?",
      a: "Rentcot connects directly via real-time 2-way API adapters to Airbnb, Booking.com, MakeMyTrip, Goibibo, and Agoda. The millisecond an inbound reservation is confirmed from any OTA or direct walk-in, the physical unit is locked, and a zero-availability stop-sell is immediately broadcast to all other connected channels within 15–30 milliseconds.",
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
      q: "Is Rentcot multi-tenant and cryptographically secure?",
      a: "Yes. Rentcot is built with Supabase enterprise PostgreSQL featuring strict Row Level Security (RLS). All guest data, financial ledgers, and inventory are cryptographically isolated per organization. Role-based access control (RBAC) ensures front-desk staff, housekeeping, and accountants only see what they need.",
    },
    {
      q: "Can front desk and housekeeping use Rentcot on tablets and phones?",
      a: "Yes. Rentcot Property OS is 100% responsive and PWA-ready. Front-desk staff can use iPads for POS and check-in, housekeepers can inspect room statuses on smartphones, and owners have a live mobile executive dashboard with biometric sign-in.",
    },
  ];

  const otaPartners = [
    { name: "Airbnb", badge: "Direct 2-Way Sync", ping: "18ms" },
    { name: "Booking.com", badge: "API Push/Pull", ping: "22ms" },
    { name: "MakeMyTrip", badge: "Domestic Leader", ping: "26ms" },
    { name: "Agoda", badge: "Asia-Pacific Feed", ping: "31ms" },
    { name: "Vrbo / Expedia", badge: "Global Connectivity", ping: "35ms" },
    { name: "Google Vacation Rentals", badge: "Direct Zero-Fee", ping: "19ms" },
    { name: "WhatsApp Business API", badge: "Instant Invoicing", ping: "12ms" },
    { name: "Razorpay & UPI", badge: "Instant Settlement", ping: "14ms" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-rentcot-blue selection:text-white relative overflow-x-hidden">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Sticky Marketing Header / Navbar */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-border/70 transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <div className="relative h-8 w-32 sm:h-9 sm:w-36 transition-transform group-hover:scale-[1.02]">
              <Image
                src="/brand/rentcot-logo.png"
                alt="Rentcot Property OS"
                fill
                className="object-contain object-left rtl:object-right"
                priority
              />
            </div>
          </Link>

          {/* Navigation Links with Micro-Underline effect */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-muted-foreground">
            <a href="#solutions" className="hover:text-foreground transition-colors relative py-1">
              Solutions
            </a>
            <a href="#features" className="hover:text-foreground transition-colors relative py-1">
              Capabilities
            </a>
            <a href="#channel-manager" className="hover:text-foreground transition-colors relative py-1">
              OTA Sync
            </a>
            <a href="#pricing" className="hover:text-foreground transition-colors relative py-1">
              Pricing
            </a>
            <a href="#roi" className="hover:text-foreground transition-colors relative py-1">
              ROI Calculator
            </a>
            <a href="#faq" className="hover:text-foreground transition-colors relative py-1">
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
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-all active:scale-95"
            >
              Sign In
            </button>

            <Button
              onClick={() => {
                setAuthMode("signup");
                setIsAuthModalOpen(true);
              }}
              className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white text-xs font-semibold h-9 px-4 rounded-lg shadow-sm shadow-rentcot-blue/25 hover:shadow-rentcot-blue/40 transition-all active:scale-95"
            >
              Start Free Trial
            </Button>

            <button
              onClick={handleDemoAccess}
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600/20 border border-emerald-600/20 transition-all active:scale-95"
              title="Launch instant live demo"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Landing Page Content */}
      <main>
        {/* HERO SECTION WITH AMBIENT AURA, STAGGERED REVEALS & LIVE COCKPIT */}
        <section className="relative overflow-hidden pt-14 pb-20 md:pt-24 md:pb-32 border-b border-border">
          {/* Layered Background: dot-pattern + gradient mesh + secondary glow orb */}
          <div className="absolute inset-0 dot-pattern opacity-60 pointer-events-none" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] md:w-[900px] md:h-[500px] bg-gradient-to-tr from-rentcot-blue/25 via-sky-400/15 to-emerald-400/15 blur-[120px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-gradient-to-tl from-emerald-500/10 via-transparent to-transparent blur-[80px] pointer-events-none rounded-full" />

          {/* Floating Live Indicator Badges */}
          <div className="hidden xl:block absolute top-32 left-6 2xl:left-16 animate-float z-10 pointer-events-none">
            <div className="glass-panel border border-emerald-500/30 shadow-lg rounded-2xl p-3 px-4 flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse-emerald shrink-0" />
              <div>
                <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  2-Way Channel Lock
                </div>
                <div className="text-xs font-bold text-foreground">Airbnb booked &bull; MMT locked in 18ms</div>
              </div>
            </div>
          </div>

          <div className="hidden xl:block absolute top-52 right-6 2xl:right-16 animate-float-reverse z-10 pointer-events-none">
            <div className="glass-panel border border-rentcot-blue/30 shadow-lg rounded-2xl p-3 px-4 flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-rentcot-blue animate-pulse-glow shrink-0" />
              <div>
                <div className="text-[10px] font-bold text-rentcot-blue uppercase tracking-wider">
                  Live Operations Radar
                </div>
                <div className="text-xs font-bold text-foreground">94.2% Occupancy &bull; Zero Overbookings</div>
              </div>
            </div>
          </div>

          {/* Third floating badge (bottom-left, only on 2xl) */}
          <div className="hidden 2xl:block absolute bottom-36 left-12 animate-float z-10 pointer-events-none" style={{ animationDelay: '1.5s' }}>
            <div className="glass-panel border border-amber-500/30 shadow-lg rounded-2xl p-3 px-4 flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0 animate-pulse" />
              <div>
                <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  GST Invoice Pushed
                </div>
                <div className="text-xs font-bold text-foreground">₹24,500 receipt → WhatsApp delivered</div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* Staggered Reveal: Version Badge */}
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-rentcot-blue/30 shimmer-badge px-4 py-1.5 text-xs font-semibold text-rentcot-blue shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-rentcot-blue" />
                <span>Next-Gen 2026 Hospitality Architecture &bull; Multi-Tenant Supabase RLS</span>
              </div>
            </div>

            {/* Staggered Reveal: Main Headline with Animated Gradient */}
            <h1 className="animate-fade-up delay-100 mx-auto max-w-4xl text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem] xl:text-6xl leading-[1.1] mt-6">
              The Unified Operating System for{" "}
              <span className="bg-gradient-to-r from-rentcot-blue via-sky-500 to-emerald-500 bg-clip-text text-transparent animate-gradient-text">
                Resorts, Farmhouses & Glamping
              </span>
            </h1>

            {/* Staggered Reveal: Sub-headline */}
            <p className="animate-fade-up delay-200 mx-auto max-w-2xl text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed mt-5">
              Consolidate reservations, collision-proof 2-way OTA channel synchronization, front-desk POS billing with GST,
              dynamic surge pricing, and campsite weather safety into a single high-performance cockpit.
            </p>

            {/* Staggered Reveal: Action Buttons */}
            <div className="animate-fade-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-6">
              <Button
                size="lg"
                onClick={() => {
                  setAuthMode("signup");
                  setIsAuthModalOpen(true);
                }}
                className="w-full sm:w-auto bg-rentcot-blue hover:bg-rentcot-blue/90 text-white font-semibold text-sm h-12 px-8 rounded-xl shadow-lg shadow-rentcot-blue/25 hover:shadow-xl hover:shadow-rentcot-blue/30 transition-all duration-200 active:scale-[0.97] gap-2 group"
              >
                <span>Start 14-Day Free Trial</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={handleDemoAccess}
                className="w-full sm:w-auto border-border bg-card/80 hover:bg-muted text-foreground font-semibold text-sm h-12 px-6 rounded-xl transition-all duration-200 active:scale-[0.97] gap-2 shadow-xs"
              >
                <Zap className="h-4 w-4 text-emerald-600" />
                <span>Explore Live Demo Portal</span>
              </Button>
            </div>

            {/* Staggered Reveal: Social Proof Inline */}
            <div className="animate-fade-up delay-400 flex items-center justify-center gap-3 mt-5 text-[11px] text-muted-foreground">
              <div className="flex -space-x-2">
                {["RR", "SM", "AD", "VK"].map((initials, i) => (
                  <div
                    key={i}
                    className="h-7 w-7 rounded-full bg-rentcot-blue/10 border-2 border-background text-rentcot-blue flex items-center justify-center font-bold text-[9px]"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <span>Trusted by <strong className="text-foreground">500+ hospitality operators</strong> across India</span>
            </div>

            {/* Staggered Reveal: Trust Metrics Strip */}
            <div className="animate-fade-up delay-500 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-border/60">
              {[
                { value: "500+", label: "Properties Live", color: "text-foreground" },
                { value: "₹45 Cr+", label: "Bookings Processed", color: "text-foreground" },
                { value: "0%", label: "Double-Bookings", color: "text-emerald-600" },
                { value: "99.98%", label: "Edge Uptime SLA", color: "text-rentcot-blue" },
              ].map((metric, i) => (
                <div key={i} className="text-center group pt-4">
                  <div className={`text-xl sm:text-2xl font-black font-mono ${metric.color} animate-count-up transition-transform group-hover:scale-110`} style={{ animationDelay: `${600 + i * 120}ms` }}>
                    {metric.value}
                  </div>
                  <div className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider">{metric.label}</div>
                </div>
              ))}
            </div>

            {/* Staggered Reveal: INTERACTIVE HERO COCKPIT */}
            <div className="animate-fade-up delay-700 pt-10 max-w-5xl mx-auto">
              <div className="cockpit-glow rounded-2xl bg-card/95 shadow-2xl p-4 sm:p-6 backdrop-blur-md text-left transition-all">
                {/* Cockpit Title Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors" />
                      <div className="h-3 w-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors" />
                      <div className="h-3 w-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors" />
                    </div>
                    <span className="text-xs font-bold text-foreground ml-2 font-mono">rentcot-cockpit // v2.4</span>
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-semibold">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                      Live Stream
                    </span>
                  </div>

                  {/* Property Category View Chips */}
                  <div className="inline-flex p-1 rounded-xl bg-muted/60 border border-border/80 text-xs">
                    {([
                      { key: "resort" as const, label: "Boutique Resort" },
                      { key: "farmhouse" as const, label: "Private Farmhouse" },
                      { key: "campsite" as const, label: "Glamping & Camp" },
                    ]).map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setHeroPropertyType(tab.key)}
                        className={`px-3 py-1 rounded-lg font-bold transition-all duration-200 ${
                          heroPropertyType === tab.key
                            ? "bg-background text-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* KPI Metrics Row with Occupancy Progress Bars */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                  <div className="p-3.5 rounded-xl border border-border/60 bg-background/80 space-y-1.5 hover:bg-background transition-colors">
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center justify-between">
                      <span>Today&apos;s Revenue</span>
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <div className="text-lg sm:text-xl font-bold font-mono text-foreground kpi-value">
                      {heroPropertyType === "resort" ? "₹3,42,800" : heroPropertyType === "farmhouse" ? "₹1,85,000" : "₹1,12,400"}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +18.4% vs last week
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border/60 bg-background/80 space-y-1.5 hover:bg-background transition-colors">
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center justify-between">
                      <span>Live Occupancy</span>
                      <Activity className="h-3.5 w-3.5 text-rentcot-blue" />
                    </div>
                    <div className="text-lg sm:text-xl font-bold font-mono text-foreground kpi-value">
                      {heroPropertyType === "resort" ? "92.4%" : heroPropertyType === "farmhouse" ? "100%" : "84.0%"}
                    </div>
                    {/* Occupancy Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full animate-bar-fill transition-all duration-500"
                        style={{
                          width: heroPropertyType === "resort" ? "92.4%" : heroPropertyType === "farmhouse" ? "100%" : "84%",
                          background: heroPropertyType === "farmhouse"
                            ? "linear-gradient(90deg, #10b981, #059669)"
                            : "linear-gradient(90deg, #0263e0, #29b6f6)",
                        }}
                      />
                    </div>
                    <div className="text-[10px] text-rentcot-blue font-semibold kpi-value">
                      {heroPropertyType === "resort" ? "24 / 26 Suites Active" : heroPropertyType === "farmhouse" ? "Full Buyout Confirmed" : "21 / 25 Pitches Taken"}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border/60 bg-background/80 space-y-1.5 hover:bg-background transition-colors">
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center justify-between">
                      <span>OTA Sync Latency</span>
                      <Zap className="h-3.5 w-3.5 text-amber-500" />
                    </div>
                    <div className="text-lg sm:text-xl font-bold font-mono text-foreground">18 ms</div>
                    {/* Channel Sync Dots */}
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      {["Airbnb", "Booking", "MMT"].map((ch, i) => (
                        <span key={i} className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" style={{ animationDelay: `${i * 200}ms` }} />
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border/60 bg-background/80 space-y-1.5 hover:bg-background transition-colors">
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center justify-between">
                      <span>Safety Watchdog</span>
                      <Shield className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <div className="text-lg sm:text-xl font-bold font-mono text-emerald-600 kpi-value">
                      {heroPropertyType === "campsite" ? "16 km/h (Safe)" : "Optimal"}
                    </div>
                    {/* Safety Level Mini Bar */}
                    <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: heroPropertyType === "campsite" ? "36%" : "15%",
                          background: "linear-gradient(90deg, #10b981, #f59e0b)",
                        }}
                      />
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {heroPropertyType === "campsite" ? "Auto-Ban at 28 km/h" : "All Systems Normal"}
                    </div>
                  </div>
                </div>

                {/* LIVE ACTIVITY FEED BAR */}
                <div className="mt-3 rounded-xl border border-border/60 bg-muted/30 px-4 py-2.5 flex items-center gap-3 overflow-hidden">
                  <span className="shrink-0 inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full bg-rentcot-blue/10 text-rentcot-blue border border-rentcot-blue/20 font-bold uppercase tracking-wider">
                    <Activity className="h-3 w-3" />
                    Live Feed
                  </span>
                  <div className={`flex-1 min-w-0 ${notifAnimating ? 'animate-slide-out-right' : 'animate-slide-in-right'}`} key={activeNotifIndex}>
                    <div className="flex items-center gap-2 text-xs">
                      <span>{liveNotifications[activeNotifIndex].icon}</span>
                      <span className="text-foreground font-medium truncate">{liveNotifications[activeNotifIndex].text}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0 hidden sm:inline">{liveNotifications[activeNotifIndex].time}</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Live Unit Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  {heroPropertyType === "resort" && (
                    <>
                      <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/5 space-y-1 hover:border-emerald-500/60 transition-all group">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">Villa 101 (Pool View)</span>
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        </div>
                        <div className="text-[11px] text-emerald-600 font-medium">Available &bull; ₹14,500/nt</div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Check className="h-3 w-3 text-emerald-500" />
                          Turnover Inspected
                        </div>
                      </div>
                      <div className="p-3 rounded-xl border border-amber-500/40 bg-amber-500/5 space-y-1 hover:border-amber-500/60 transition-all group">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">Villa 102 (Royal Suite)</span>
                          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                        </div>
                        <div className="text-[11px] text-amber-600 font-medium">Occupied &bull; via Airbnb</div>
                        <div className="text-[10px] text-muted-foreground">Check-out Tomorrow 11 AM</div>
                      </div>
                      <div className="p-3 rounded-xl border border-blue-500/40 bg-blue-500/5 space-y-1 hover:border-blue-500/60 transition-all group">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">Villa 103 (Garden Deluxe)</span>
                          <span className="h-2 w-2 rounded-full bg-blue-500" />
                        </div>
                        <div className="text-[11px] text-rentcot-blue font-medium">Direct Booking &bull; ₹12,000</div>
                        <div className="text-[10px] text-muted-foreground">Arriving Today 2 PM</div>
                      </div>
                      <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/5 space-y-1 hover:border-red-500/50 transition-all group">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">Villa 104 (Executive)</span>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                        </div>
                        <div className="text-[11px] text-red-600 font-medium">Housekeeping In-Progress</div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <RefreshCw className="h-3 w-3 text-red-400 animate-spin" style={{ animationDuration: '3s' }} />
                          Turnover 14m remaining
                        </div>
                      </div>
                    </>
                  )}

                  {heroPropertyType === "farmhouse" && (
                    <>
                      <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/5 space-y-1 hover:border-emerald-500/60 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">Main Farmhouse Buyout</span>
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        </div>
                        <div className="text-[11px] text-emerald-600 font-medium">Reserved Weekend &bull; ₹65,000</div>
                        <div className="text-[10px] text-muted-foreground">Private Pool & Lawns</div>
                      </div>
                      <div className="p-3 rounded-xl border border-blue-500/40 bg-blue-500/5 space-y-1 hover:border-blue-500/60 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">Day-Picnic Slot</span>
                          <span className="h-2 w-2 rounded-full bg-blue-500" />
                        </div>
                        <div className="text-[11px] text-rentcot-blue font-medium">10 AM – 6 PM Package</div>
                        <div className="text-[10px] text-muted-foreground">22 Guests &bull; Organic Lunch</div>
                      </div>
                      <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-1 hover:border-amber-500/50 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">Mango Grove Bonfire</span>
                          <span className="h-2 w-2 rounded-full bg-amber-500" />
                        </div>
                        <div className="text-[11px] text-amber-600 font-medium">Hardwood Kit Ready</div>
                        <div className="text-[10px] text-muted-foreground">Billed at ₹1,500</div>
                      </div>
                      <div className="p-3 rounded-xl border border-border bg-background space-y-1 hover:border-emerald-500/40 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">Pet Parent Check</span>
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        </div>
                        <div className="text-[11px] text-emerald-600 font-medium">2 Golden Retrievers</div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Check className="h-3 w-3 text-emerald-500" />
                          Deposit Cleared
                        </div>
                      </div>
                    </>
                  )}

                  {heroPropertyType === "campsite" && (
                    <>
                      <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/5 space-y-1 hover:border-emerald-500/60 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">Glamping Dome 01</span>
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        </div>
                        <div className="text-[11px] text-emerald-600 font-medium">Wooden Deck &bull; AC Glamp</div>
                        <div className="text-[10px] text-muted-foreground">Occupied &bull; Check-out 11 AM</div>
                      </div>
                      <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/5 space-y-1 hover:border-emerald-500/60 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">Pitch P-04 (Lawn)</span>
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        </div>
                        <div className="text-[11px] text-emerald-600 font-medium">Vacant Clean &bull; ₹2,200</div>
                        <div className="text-[10px] text-muted-foreground">Includes 4-person Tent</div>
                      </div>
                      <div className="p-3 rounded-xl border border-amber-500/40 bg-amber-500/5 space-y-1 hover:border-amber-500/60 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">UV Sanitization Desk</span>
                          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                        </div>
                        <div className="text-[11px] text-amber-600 font-medium">12 Bags Cycled Today</div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Check className="h-3 w-3 text-amber-500" />
                          UV Chamber Passed
                        </div>
                      </div>
                      <div className="p-3 rounded-xl border border-border bg-background space-y-1 hover:border-emerald-500/40 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">Wind Watchdog</span>
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        </div>
                        <div className="text-[11px] text-emerald-600 font-medium">Gusts 16 km/h &bull; Safe</div>
                        <div className="text-[10px] text-muted-foreground">Auto-Ban at 28 km/h</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* INFINITE MARQUEE: CONNECTED OTA CHANNELS & INTEGRATIONS */}
        <section id="channel-manager" className="py-6 border-b border-border bg-muted/30 overflow-hidden relative">
          <div className="text-center pb-3">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Direct Two-Way Sync With Leading Global & Domestic Booking Channels
            </span>
          </div>

          <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            <div className="animate-marquee gap-6 items-center">
              {[...otaPartners, ...otaPartners].map((partner, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-background border border-border/70 shadow-xs hover:border-rentcot-blue/40 transition-all cursor-default shrink-0"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-foreground">{partner.name}</span>
                  <Badge variant="outline" className="text-[9px] font-mono text-muted-foreground">
                    {partner.ping}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2026 INTERACTIVE BENTO GRID: CORE CAPABILITIES */}
        <section id="features" className="py-16 md:py-24 border-b border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-2">
              <Badge variant="outline" className="text-xs font-semibold text-rentcot-blue border-rentcot-blue/30">
                2026 Core Architecture
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                Engineered for High-Yield Property Operations
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
                Explore our interactive modules below. Test wind safety rules, configure custom GST receipts, and simulate live surge pricing.
              </p>
            </div>

            {/* BENTO GRID LAYOUT */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* BENTO CARD 1: 2-Way OTA Collision Proof Engine (2 cols) */}
              <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6 md:p-8 flex flex-col justify-between hover:shadow-xl hover:border-rentcot-blue/40 transition-all duration-300 relative overflow-hidden group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rentcot-blue/10 text-rentcot-blue">
                      <CalendarCheck className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono text-emerald-600 border-emerald-500/30 bg-emerald-500/5">
                      Zero-Collision Guarantee
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-foreground">Sub-50ms Two-Way OTA Synchronization</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                      Never suffer an overbooking penalty again. When a guest books on Airbnb, Rentcot immediately blocks the unit across Booking.com, MakeMyTrip, and Agoda in milliseconds.
                    </p>
                  </div>

                  {/* Visual Channel Sync Diagram */}
                  <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { name: "Airbnb", status: "Active Push/Pull", latency: "18ms" },
                      { name: "Booking.com", status: "Active Push/Pull", latency: "22ms" },
                      { name: "MakeMyTrip", status: "Active Push/Pull", latency: "26ms" },
                      { name: "Agoda", status: "Active Push/Pull", latency: "31ms" },
                    ].map((ch, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-border/70 bg-muted/20 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">{ch.name}</span>
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <div className="text-[10px] text-emerald-600 font-semibold">{ch.status}</div>
                        <div className="text-[9px] text-muted-foreground font-mono">Ping: {ch.latency}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>Includes automatic rate parity protection against OTA undercutting</span>
                  <Link href={`/${locale}/channels`} className="text-rentcot-blue font-bold hover:underline flex items-center gap-1">
                    <span>View Channels</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* BENTO CARD 2: Campsite Wind & Fire Watchdog (1 col, interactive) */}
              <div className="rounded-2xl border border-border bg-card p-6 md:p-8 flex flex-col justify-between hover:shadow-xl hover:border-amber-500/40 transition-all duration-300 relative overflow-hidden group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                      <Flame className="h-5 w-5" />
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono ${
                        interactiveWindSpeed >= 28
                          ? "text-rose-600 border-rose-500/30 bg-rose-500/10"
                          : "text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
                      }`}
                    >
                      {interactiveWindSpeed >= 28 ? "FIRE BAN ACTIVE" : "CAMPFIRE SAFE"}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-foreground">Campfire & Weather Safety Watchdog</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Interactive test: drag wind speed past 28 km/h to test automated safety lockouts.
                    </p>
                  </div>

                  {/* Interactive Wind Slider */}
                  <div className="p-3 rounded-xl border border-border/80 bg-muted/20 space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Wind className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Live Wind Gusts</span>
                      </span>
                      <span className="font-mono font-bold text-foreground">{interactiveWindSpeed} km/h</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={45}
                      value={interactiveWindSpeed}
                      onChange={(e) => setInteractiveWindSpeed(Number(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-muted-foreground">
                      <span>Calm (5 km/h)</span>
                      <span>Breeze (20 km/h)</span>
                      <span>High Wind (45 km/h)</span>
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl text-xs space-y-1 transition-all ${
                    interactiveWindSpeed >= 28
                      ? "border border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                      : "border border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300"
                  }`}>
                    <div className="font-bold flex items-center gap-1.5">
                      {interactiveWindSpeed >= 28 ? (
                        <>
                          <X className="h-4 w-4 text-rose-600" />
                          <span>Campfire Checkout Auto-Disabled</span>
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 text-emerald-600" />
                          <span>Wood Bonfires Permitted</span>
                        </>
                      )}
                    </div>
                    <p className="text-[11px] opacity-80">
                      {interactiveWindSpeed >= 28
                        ? "Wind gusts exceed 28 km/h. POS stops hardwood bonfires instantly to protect tents & trees."
                        : "Safe weather conditions. Hardwood bundles can be added to guest folios."}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>Pitch ground allocations & UV tent sanitation</span>
                  <Link href={`/${locale}/camping`} className="text-amber-600 font-bold hover:underline flex items-center gap-1">
                    <span>Learn more</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* BENTO CARD 3: Dynamic Surge Pricing (1 col) */}
              <div className="rounded-2xl border border-border bg-card p-6 md:p-8 flex flex-col justify-between hover:shadow-xl hover:border-rentcot-blue/40 transition-all duration-300 relative overflow-hidden group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-rentcot-blue">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono text-rentcot-blue">
                      Automated Yield
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-foreground">Dynamic Surge Pricing</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Rate multipliers automatically apply when occupancy thresholds, weekend surges, or holidays trigger.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border/80 bg-muted/20 space-y-2.5">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span>Simulated Live Occupancy</span>
                      <span className="font-mono text-rentcot-blue font-bold">{surgeOccupancyInput}%</span>
                    </div>
                    <input
                      type="range"
                      min={30}
                      max={100}
                      value={surgeOccupancyInput}
                      onChange={(e) => setSurgeOccupancyInput(Number(e.target.value))}
                      className="w-full accent-rentcot-blue cursor-pointer"
                    />
                    <div className="flex justify-between items-center text-xs pt-1 border-t border-border/50">
                      <span className="text-muted-foreground">Calculated Nightly Rate:</span>
                      <span className="font-mono font-bold text-emerald-600">
                        ₹{Math.round(8000 * (1 + (surgeOccupancyInput > 80 ? 0.35 : surgeOccupancyInput > 60 ? 0.20 : 0))).toLocaleString()}
                        {surgeOccupancyInput > 80 && (
                          <span className="ml-1 text-[9px] text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded font-semibold">
                            +35% Surge
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border text-xs text-muted-foreground">
                  Protects margin automatically without manual adjustments.
                </div>
              </div>

              {/* BENTO CARD 4: Interactive Live GST POS Receipt Simulator (2 cols) */}
              <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6 md:p-8 flex flex-col justify-between hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 relative overflow-hidden group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                      <Receipt className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono text-emerald-600 border-emerald-500/30 bg-emerald-500/5">
                      Interactive Live Receipt
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-foreground">Custom Branded POS with Instant WhatsApp Invoicing</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Type your resort or farmhouse name below and watch your compliant GST tax invoice preview generate in real-time.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    {/* Controls */}
                    <div className="space-y-3 text-xs">
                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-muted-foreground">Your Property / Resort Name</Label>
                        <Input
                          value={interactiveResortName}
                          onChange={(e) => setInteractiveResortName(e.target.value)}
                          placeholder="e.g. Whispering Oaks Resort"
                          className="h-9 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-muted-foreground">GST Tax Slab</Label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setInteractiveGstRate(18)}
                            className={`flex-1 py-1.5 text-xs rounded-lg font-bold border transition-all ${
                              interactiveGstRate === 18
                                ? "bg-rentcot-blue text-white border-rentcot-blue shadow-xs"
                                : "border-border text-muted-foreground"
                            }`}
                          >
                            18% Luxury GST (9% CGST + 9% SGST)
                          </button>
                          <button
                            type="button"
                            onClick={() => setInteractiveGstRate(5)}
                            className={`flex-1 py-1.5 text-xs rounded-lg font-bold border transition-all ${
                              interactiveGstRate === 5
                                ? "bg-rentcot-blue text-white border-rentcot-blue shadow-xs"
                                : "border-border text-muted-foreground"
                            }`}
                          >
                            5% Standard
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Live Rendered Receipt Preview */}
                    <div className="p-4 rounded-xl border border-border/80 bg-background shadow-md space-y-2 text-[11px] font-mono">
                      <div className="text-center border-b border-border/60 pb-2 space-y-0.5">
                        <div className="font-bold text-xs text-foreground uppercase truncate">
                          {interactiveResortName || "Your Resort Name"}
                        </div>
                        <div className="text-[9px] text-muted-foreground">GSTIN: 36ABCDE1234F1Z5 &bull; SAC: 996311</div>
                        <div className="text-[9px] text-emerald-600 font-semibold">TAX INVOICE #RC-2026-8941</div>
                      </div>

                      <div className="space-y-1 border-b border-border/60 pb-2 text-muted-foreground">
                        <div className="flex justify-between">
                          <span>1x Pool Villa (2 Nights)</span>
                          <span className="text-foreground">₹24,000.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>1x Organic BBQ Kit</span>
                          <span className="text-foreground">₹2,500.00</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span>CGST ({interactiveGstRate / 2}%)</span>
                          <span>₹{((26500 * (interactiveGstRate / 100)) / 2).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span>SGST ({interactiveGstRate / 2}%)</span>
                          <span>₹{((26500 * (interactiveGstRate / 100)) / 2).toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex justify-between font-bold text-xs text-foreground pt-0.5">
                        <span>Total Paid (UPI)</span>
                        <span className="text-emerald-600">
                          ₹{(26500 * (1 + interactiveGstRate / 100)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="text-center text-[9px] text-muted-foreground pt-1 border-t border-border/50">
                        ⚡ Powered by Rentcot Property OS
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>Send PDF receipts directly to guest WhatsApp with 1 tap</span>
                  <Link href={`/${locale}/pos`} className="text-emerald-600 font-bold hover:underline flex items-center gap-1">
                    <span>Open POS Terminal</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SOLUTIONS BY PROPERTY TYPE */}
        <section id="solutions" className="py-16 md:py-24 border-b border-border bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-2">
              <Badge variant="outline" className="text-xs font-semibold text-rentcot-blue border-rentcot-blue/30">
                Tailored Solutions
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                Built Specifically for Diverse Hospitality Formats
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
                Whether you manage a private agro-estate, a boutique luxury resort, or an outdoor glamping camp.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Solution 1: Luxury Resorts & Villas */}
              <Card className="border-border hover:border-rentcot-blue/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between bg-card">
                <CardHeader className="space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-rentcot-blue">
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
              <Card className="border-border hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between bg-card">
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
              <Card className="border-border hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between bg-card">
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

        {/* OTA COMMISSION SAVINGS / ROI CALCULATOR WITH VISUAL PROGRESS BREAKDOWN */}
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
                See how much revenue you lose to ~18% OTA commissions each year compared to running direct booking channels with Rentcot Property OS.
              </p>
            </div>

            <Card className="max-w-4xl mx-auto border-border shadow-xl bg-card overflow-hidden">
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

                    {/* Visual Comparison Split Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span className="text-rose-600">OTA Commission Drain ({otaPercentage}%)</span>
                        <span className="text-emerald-600">Direct Retained ({100 - otaPercentage}%)</span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex">
                        <div style={{ width: `${otaPercentage}%` }} className="bg-rose-500 transition-all duration-300" />
                        <div style={{ width: `${100 - otaPercentage}%` }} className="bg-emerald-500 transition-all duration-300" />
                      </div>
                    </div>
                  </div>

                  {/* ROI Outcome Box */}
                  <div className="p-6 rounded-2xl bg-muted/40 border border-border space-y-4">
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Estimated Yearly OTA Commission Paid:</div>
                      <div className="text-2xl font-black text-rose-600 font-mono">
                        ₹{annualOtaCommissionsPaid.toLocaleString("en-IN")} / year
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">Based on standard ~18% OTA commission cut.</div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="text-xs text-muted-foreground font-medium">Estimated Yearly Savings with Rentcot Direct:</div>
                      <div className="text-3xl font-black text-emerald-600 font-mono">
                        ₹{estimatedRentcotDirectSavings.toLocaleString("en-IN")} / year
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
                    className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white font-semibold text-xs h-11 px-8 rounded-xl shadow-md active:scale-95 transition-all"
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
              <div className="inline-flex items-center p-1 rounded-xl bg-background border border-border shadow-xs">
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
              <Card className="border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between bg-card">
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
                    className="w-full text-xs font-semibold h-10 border-border active:scale-95 transition-all"
                  >
                    Start 14-Day Trial
                  </Button>
                </CardContent>
              </Card>

              {/* Growth Pro (Featured with Ambient Glow Border) */}
              <Card className="border-rentcot-blue shadow-xl relative flex flex-col justify-between bg-card hover:-translate-y-1 transition-all duration-300">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rentcot-blue text-white px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md">
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
                    className="w-full bg-rentcot-blue hover:bg-rentcot-blue/90 text-white text-xs font-semibold h-10 shadow-md active:scale-95 transition-all"
                  >
                    Start Free Trial with Growth Pro
                  </Button>
                </CardContent>
              </Card>

              {/* Enterprise */}
              <Card className="border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between bg-card">
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
                    className="w-full text-xs font-semibold h-10 border-border active:scale-95 transition-all"
                  >
                    Contact Enterprise Sales
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* OPERATOR TESTIMONIALS WITH VERIFIED PROPERTY BADGES */}
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
                  initials: "RR",
                },
                {
                  quote:
                    "The campsite operations suite is unmatched. The automatic campfire restriction when winds hit 28 km/h and the sleeping bag UV tracking gave our forest rangers peace of mind.",
                  author: "Siddharth Menon",
                  role: "Co-Founder",
                  property: "Wildwoods Glamping (Wayanad / Vikarabad)",
                  initials: "SM",
                },
                {
                  quote:
                    "Our F&B and pool villa revenue jumped 22% simply because room service orders are posted straight from POS to the guest folio with WhatsApp receipts. Game changer.",
                  author: "Ananya Deshmukh",
                  role: "General Manager",
                  property: "Palm Oasis Luxury Resort (Goa / Hyderabad)",
                  initials: "AD",
                },
              ].map((t, idx) => (
                <Card
                  key={idx}
                  className="border-border bg-card p-6 flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
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
                  <div className="pt-3 border-t border-border flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-rentcot-blue/10 text-rentcot-blue font-bold text-xs flex items-center justify-center shrink-0">
                      {t.initials}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground">{t.author}</div>
                      <div className="text-[11px] text-muted-foreground">{t.role} &bull; {t.property}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS (FLUID ACCORDION) */}
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
                    className={`border rounded-xl bg-background overflow-hidden transition-all duration-200 ${
                      isOpen ? "border-rentcot-blue/50 shadow-sm" : "border-border"
                    }`}
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

        {/* BOTTOM CTA BANNER WITH AURA */}
        <section className="py-16 md:py-20 bg-gradient-to-r from-rentcot-blue via-blue-600 to-emerald-600 text-white text-center relative overflow-hidden">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Upgrade Your Hospitality Operations?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
              Join 500+ properties streamlining reservations, 2-way OTA synchronization, and POS billing. Start your 14-day free trial today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Button
                size="lg"
                onClick={() => {
                  setAuthMode("signup");
                  setIsAuthModalOpen(true);
                }}
                className="w-full sm:w-auto bg-white text-rentcot-blue hover:bg-white/95 font-bold text-xs h-11 px-8 rounded-xl shadow-xl active:scale-95 transition-all"
              >
                Start 14-Day Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleDemoAccess}
                className="w-full sm:w-auto border-white/30 text-white bg-white/10 hover:bg-white/20 font-semibold text-xs h-11 px-6 rounded-xl active:scale-95 transition-all"
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
                    className="w-full bg-rentcot-blue hover:bg-rentcot-blue/90 text-white font-semibold text-xs h-10 mt-2 active:scale-95 transition-all"
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
                    className="w-full bg-rentcot-blue hover:bg-rentcot-blue/90 text-white font-semibold text-xs h-10 active:scale-95 transition-all"
                  >
                    {signInLoading ? "Authenticating..." : "Sign In to Dashboard"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>

                <div className="pt-3 border-t border-border space-y-2">
                  <button
                    type="button"
                    onClick={handleDemoAccess}
                    className="w-full py-2 px-3 rounded-lg border border-emerald-600/30 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
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

"use client";

import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Check,
  Zap,
  Download,
  ShieldCheck,
  Building,
  ArrowUpRight,
  Receipt,
  Sparkles,
  TrendingUp,
  Percent,
  CheckCircle2,
  Wrench,
  DollarSign,
  HelpCircle,
} from "lucide-react";

export default function BillingPage() {
  const { t } = useTranslation();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const plans = [
    {
      id: "starter",
      name: "Starter",
      tagline: "For boutique farmhouses, private villas & campsites up to 10 units.",
      priceMonthly: 19999,
      priceAnnualMonthly: 14999,
      setupFee: 19999,
      setupFeeNote: "One-time guided setup & unit configuration",
      features: [
        "1 Physical Property Account",
        "Up to 10 Overnight Units / Tents / Day Slots",
        "Direct WhatsApp Guest Self-Service Portal",
        "Front-Desk POS Quick Terminal",
        "Basic Housekeeping Turnover Board",
        "Guest CRM & Aadhaar/ID Compliance",
        "Multi-Tenant Supabase RLS Isolation",
        "Standard Email & Chat Support",
      ],
      cta: "Switch to Starter",
      highlight: false,
    },
    {
      id: "growth_pro",
      name: "Growth Pro",
      tagline: "The complete resort operating system for multi-unit farmhouses & glamping hubs.",
      priceMonthly: 39999,
      priceAnnualMonthly: 34999,
      setupFee: 39999,
      setupFeeNote: "White-glove OTA mapping & staff training included",
      features: [
        "Up to 5 Physical Properties",
        "Unlimited Units, Glamping Domes & Lawns",
        "2-Way OTA Channel Manager (Airbnb, Booking.com, MMT, Agoda)",
        "Instant Cross-OTA Double-Booking Prevention Lock",
        "Rate Parity Watchdog & Auto-Fix System",
        "Dynamic Demand-Based Pricing Engine",
        "Full Front-Desk POS with Room Folio Posting",
        "Live Housekeeping Turnover State Machine",
        "Linen & Supplies Inventory Tracker with Low-Stock Alerts",
        "Staff Shifts, Attendance & Payroll Roster",
        "Revenue Analytics (ADR, RevPAR, Channel Margin Breakdown)",
        "Priority WhatsApp & Phone Support",
      ],
      cta: "Current Active Plan",
      highlight: true,
    },
    {
      id: "enterprise",
      name: "Enterprise Chains",
      tagline: "For luxury hospitality chains, multi-resort groups & enterprise portfolios.",
      priceMonthly: 79999,
      priceAnnualMonthly: 69999,
      setupFee: 99999,
      setupFeeNote: "Custom ERP sync, data migration & on-site rollout",
      features: [
        "Unlimited Properties & Regional Clusters",
        "Unlimited Rooms, Tents, Banquets & Experiences",
        "Custom ERP & Tally / SAP Accounting Integration",
        "Custom Direct Booking Engine Whitelabel Domain",
        "Centralized Multi-Property Corporate Rate Cards",
        "Dedicated Enterprise Account Manager",
        "99.9% Uptime Guarantee & Custom Legal SLA",
        "On-Premise Staff Training & Go-Live Support",
      ],
      cta: "Contact Enterprise Sales",
      highlight: false,
    },
  ];

  const invoices = [
    { id: "INV-2026-08", date: "01 Aug 2026", plan: "Growth Pro (Annual Commitment)", amount: 419988, status: "Paid" },
    { id: "INV-SETUP-01", date: "01 Aug 2026", plan: "Growth Pro White-Glove Onboarding & OTA Setup", amount: 39999, status: "Paid" },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {t("nav.billing", "Billing, Subscription & Tenant Plans")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enterprise-grade multi-tenant operating system for resorts, farmhouses, and glamping zones.
          </p>
        </div>

        {/* Annual / Monthly Toggle */}
        <div className="flex items-center gap-2 bg-muted p-1 rounded-xl border border-border self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              billingCycle === "monthly"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("annual")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              billingCycle === "annual"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Annual Commitment</span>
            <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              Save ~15%
            </span>
          </button>
        </div>
      </div>

      {/* Active Subscription Summary */}
      <Card className="border-rentcot-blue/40 bg-gradient-to-br from-card via-card to-rentcot-blue/5 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-rentcot-blue text-white gap-1.5 px-3 py-1 font-semibold">
                  <Sparkles className="h-3.5 w-3.5" /> Current Plan: Growth Pro Tier
                </Badge>
                <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 font-medium">
                  Active (Renews 01 Aug 2027)
                </Badge>
                <Badge variant="secondary" className="font-mono text-xs">
                  Annual Commitment Active
                </Badge>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                  ₹34,999 <span className="text-sm font-normal text-muted-foreground">/ month (Billed Annually)</span>
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mt-1 leading-relaxed">
                  Full multi-property operating system: 2-way OTA channel synchronization, dynamic rate engine, front-desk POS, housekeeping turnover state machine, and guest identity compliance.
                </p>
              </div>

              <div className="flex flex-wrap gap-6 pt-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Properties Quota:</span>
                  <span className="font-bold text-foreground">3 / 5 Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Accommodations & Venues:</span>
                  <span className="font-bold text-foreground">44 Units Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Live OTA Channels:</span>
                  <span className="font-bold text-emerald-600">5 Connected (Airbnb, Booking, MMT, Agoda, Goibibo)</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
              <Button className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white min-h-[44px] font-semibold">
                Upgrade to Enterprise Chains
              </Button>
              <Button variant="outline" className="min-h-[44px]">
                Update Billing Details / GST
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Tiers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const currentPrice =
            billingCycle === "annual" ? plan.priceAnnualMonthly : plan.priceMonthly;

          return (
            <Card
              key={plan.id}
              className={`flex flex-col justify-between transition-all ${
                plan.highlight
                  ? "border-2 border-rentcot-blue shadow-xl relative bg-card"
                  : "border-border hover:border-primary/40"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-rentcot-blue text-white text-[11px] font-bold px-4 py-1 rounded-full shadow-md uppercase tracking-wider">
                  Recommended For Resorts
                </div>
              )}

              <div>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                    {plan.highlight && (
                      <Badge variant="clean" className="text-[10px]">
                        Most Popular
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-xs min-h-[36px] mt-1 leading-relaxed">
                    {plan.tagline}
                  </CardDescription>

                  {/* Pricing Display */}
                  <div className="pt-4 border-t border-border mt-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-foreground">
                        ₹{currentPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">/ month</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {billingCycle === "annual"
                        ? `₹${(currentPrice * 12).toLocaleString()} billed annually`
                        : "Billed monthly"}
                    </div>

                    {/* Setup Fee Pill */}
                    <div className="mt-3 p-2.5 rounded-lg bg-muted/60 border border-border/80 text-xs">
                      <div className="flex items-center justify-between font-semibold text-foreground">
                        <span>Setup & Onboarding:</span>
                        <span className="text-rentcot-blue font-bold">₹{plan.setupFee.toLocaleString()}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {plan.setupFeeNote}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 text-xs pt-0">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground pt-2">
                    Included Modules & Capabilities:
                  </div>
                  <div className="space-y-2.5">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-foreground">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </div>

              <div className="p-6 pt-4 border-t border-border mt-6">
                {plan.id === "growth_pro" ? (
                  <Button
                    disabled
                    className="w-full bg-muted text-muted-foreground min-h-[44px] text-xs font-semibold"
                  >
                    Current Active Plan
                  </Button>
                ) : (
                  <Button
                    variant={plan.highlight ? "default" : "outline"}
                    className={`w-full min-h-[44px] text-xs font-semibold ${
                      plan.highlight ? "bg-rentcot-blue hover:bg-rentcot-blue/90 text-white" : ""
                    }`}
                  >
                    {plan.cta}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* ROI & Value Comparison Benchmark */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-rentcot-blue" />
            <CardTitle className="text-lg font-bold">
              Value Benchmark: Why Rentcot Property OS Pays For Itself
            </CardTitle>
          </div>
          <CardDescription className="text-xs leading-relaxed">
            Unlike legacy software or basic booking plugins, Rentcot functions as your entire operational backbone—anchoring directly against custom PMS maintenance costs and OTA commission leakages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Column 1 */}
            <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-foreground text-sm">
                <Wrench className="h-4 w-4 text-amber-600" />
                <span>Custom-Built Software</span>
              </div>
              <div className="text-xl font-bold text-destructive">₹25,000 – ₹45,000 / mo</div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Ongoing developer retainers, AWS server bills, security patches, broken OTA APIs, and zero feature updates without paying for custom hours.
              </p>
            </div>

            {/* Column 2 */}
            <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-foreground text-sm">
                <DollarSign className="h-4 w-4 text-rose-600" />
                <span>OTA Commission Drain</span>
              </div>
              <div className="text-xl font-bold text-rose-600">₹15L – ₹35L / year</div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                A typical 12-unit resort pays 18%–22% to Airbnb, Booking.com, and MMT. Converting even 25% of repeat guests to direct book saves ₹3.7L–₹8.5L annually.
              </p>
            </div>

            {/* Column 3 */}
            <div className="p-4 rounded-xl border border-rentcot-blue/30 bg-rentcot-blue/5 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-rentcot-blue text-sm">
                <ShieldCheck className="h-4 w-4 text-rentcot-blue" />
                <span>Rentcot Property OS</span>
              </div>
              <div className="text-xl font-bold text-rentcot-blue">₹34,999 / mo</div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Zero developer headaches, instant collision-free 2-way OTA synchronization, rate parity protection, POS, staff payroll, and multi-tenant RLS security.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing & Tax Invoices History */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Receipt className="h-4 w-4 text-rentcot-blue" />
          <span>GST Invoices & Payment History</span>
        </h3>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-4 text-xs sm:text-sm">
                  <div className="space-y-0.5">
                    <div className="font-mono font-bold text-foreground">{inv.id}</div>
                    <div className="text-xs text-muted-foreground">{inv.date} • {inv.plan}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-foreground">₹{inv.amount.toLocaleString()}</div>
                      <Badge variant="secondary" className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30">
                        {inv.status}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Download PDF Tax Invoice">
                      <Download className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

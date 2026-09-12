"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OnboardingChecklist } from "@/components/onboarding/onboarding-checklist";
import { InviteStaffDialog } from "@/components/team/invite-staff-dialog";
import {
  Users,
  CalendarCheck,
  CalendarX,
  TrendingUp,
  PlusCircle,
  QrCode,
  Sparkles,
  Receipt,
  BedDouble,
  TreePine,
  Tent,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  UserPlus
} from "lucide-react";

export default function DashboardPage() {
  const { t, locale } = useTranslation();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const metrics = [
    {
      title: t("dashboard.todayArrivals", "Today's Arrivals"),
      value: "14",
      subtext: "8 checked-in, 6 expected",
      icon: CalendarCheck,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/50",
    },
    {
      title: t("dashboard.todayDepartures", "Today's Departures"),
      value: "9",
      subtext: "5 departed, 4 pending",
      icon: CalendarX,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/50",
    },
    {
      title: t("dashboard.occupancyRate", "Occupancy Rate"),
      value: "84%",
      subtext: "+12% vs last weekend",
      icon: TrendingUp,
      color: "text-rentcot-blue",
      bg: "bg-rentcot-blue/10",
    },
    {
      title: t("dashboard.activeGuests", "In-House Guests"),
      value: "58",
      subtext: "42 adults, 16 children",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/50",
    },
  ];

  const quickActions = [
    { title: t("dashboard.newBooking", "New Booking"), icon: PlusCircle, variant: "default" as const, href: `/${locale}/bookings` },
    { title: t("dashboard.walkIn", "Express Walk-In"), icon: QrCode, variant: "secondary" as const, href: `/${locale}/bookings` },
    { title: "Invite Staff", icon: UserPlus, variant: "secondary" as const, onClick: () => setIsInviteOpen(true) },
    { title: t("dashboard.roomTurnover", "Housekeeping"), icon: Sparkles, variant: "outline" as const, href: `/${locale}/housekeeping` },
  ];

  const sampleUnits = [
    { id: "101", property: "Palm Oasis Resort", name: "Executive Suite 101", type: "Suite", status: "clean" as const },
    { id: "102", property: "Palm Oasis Resort", name: "Deluxe Lake View 102", type: "Deluxe", status: "occupied" as const },
    { id: "103", property: "Palm Oasis Resort", name: "Garden Villa 103", type: "Villa", status: "dirty" as const },
    { id: "FH-1", property: "Green Valley Farmhouse", name: "Main Farmhouse Villa", type: "Estate", status: "inspected" as const },
    { id: "T-01", property: "Wildwoods Campsite", name: "Glamping Dome 01", type: "Dome Tent", status: "vacant" as const },
    { id: "T-02", property: "Wildwoods Campsite", name: "Safari Tent 02", type: "Tent", status: "out_of_service" as const },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {t("nav.dashboard", "Dashboard")}
            </h1>
            <Badge variant="clean" className="flex items-center gap-1 text-[11px] font-medium">
              <ShieldCheck className="h-3 w-3" />
              Multi-Tenant RLS Active
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {t("common.tagline", "All-in-one Resort, Farmhouse & Campsite Management")}
          </p>
        </div>

        {/* Action button bar */}
        <div className="flex flex-wrap items-center gap-2">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            if (action.href) {
              return (
                <Button
                  key={i}
                  asChild
                  variant={action.variant}
                  size="default"
                  className="text-xs md:text-sm font-medium gap-2 min-h-[40px]"
                >
                  <Link href={action.href}>
                    <Icon className="h-4 w-4" />
                    <span>{action.title}</span>
                  </Link>
                </Button>
              );
            }
            return (
              <Button
                key={i}
                variant={action.variant}
                size="default"
                onClick={action.onClick}
                className="text-xs md:text-sm font-medium gap-2 min-h-[40px]"
              >
                <Icon className="h-4 w-4" />
                <span>{action.title}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Guided Onboarding Checklist (Mobile-Friendly Stepper for New Resort Owners) */}
      <OnboardingChecklist onOpenInviteModal={() => setIsInviteOpen(true)} />

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <Card key={i} className="hover:border-rentcot-blue/40 transition-colors">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{metric.title}</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-1">{metric.value}</h2>
                  <p className="text-[11px] text-muted-foreground mt-1">{metric.subtext}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${metric.bg}`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Grid: Active Properties & Live Unit Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Properties Portfolio */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base md:text-lg">
                {t("dashboard.propertyOverview", "Properties & Campsites")}
              </CardTitle>
              <Badge variant="outline">3 Active</Badge>
            </div>
            <CardDescription>Multi-property tenant portfolio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background hover:bg-muted/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <TreePine className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Green Valley Farmhouse</h3>
                  <p className="text-xs text-muted-foreground">Shamirpet, Hyderabad</p>
                </div>
              </div>
              <Badge variant="clean">88% Occ.</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background hover:bg-muted/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  <Tent className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Wildwoods Camping Zone</h3>
                  <p className="text-xs text-muted-foreground">Ananthagiri, Vikarabad</p>
                </div>
              </div>
              <Badge variant="occupied">92% Occ.</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background hover:bg-muted/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Palm Oasis Resort</h3>
                  <p className="text-xs text-muted-foreground">Gandipet Lake Front</p>
                </div>
              </div>
              <Badge variant="vacant">75% Occ.</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Live Operational Room Turnover & Status Grid */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-base md:text-lg">
                  {t("dashboard.roomTurnover", "Live Unit State Machine")}
                </CardTitle>
                <CardDescription>
                  Real-time operational status across housekeeping, reception & PMS
                </CardDescription>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Badge variant="clean">Clean</Badge>
                <Badge variant="dirty">Dirty</Badge>
                <Badge variant="inspected">Inspected</Badge>
                <Badge variant="occupied">Occupied</Badge>
                <Badge variant="vacant">Vacant</Badge>
                <Badge variant="out_of_service">Out of Service</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sampleUnits.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background hover:border-rentcot-blue/50 transition-all shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground font-mono font-bold text-xs">
                      {u.id}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{u.name}</h4>
                      <p className="text-xs text-muted-foreground">{u.property} &bull; {u.type}</p>
                    </div>
                  </div>
                  <Badge variant={u.status}>
                    {t(`unit_status.${u.status}`, u.status)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Invite Dialog */}
      <InviteStaffDialog
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />
    </div>
  );
}

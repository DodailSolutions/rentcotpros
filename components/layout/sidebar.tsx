"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n/context";
import {
  LayoutDashboard,
  Building,
  BedDouble,
  CalendarDays,
  Receipt,
  Sparkles,
  Boxes,
  PartyPopper,
  Users,
  Briefcase,
  BarChart3,
  CreditCard,
  X,
  Tent,
  Flame,
} from "lucide-react";

export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t, locale } = useTranslation();
  const pathname = usePathname();

  const navItems = [
    { label: t("nav.dashboard", "Overview"), href: `/${locale}`, icon: LayoutDashboard },
    { label: t("nav.properties", "Properties"), href: `/${locale}/properties`, icon: Building },
    { label: t("nav.units", "Units & Accommodations"), href: `/${locale}/units`, icon: BedDouble },
    { label: "Pricing Engine", href: `/${locale}/pricing`, icon: CreditCard },
    { label: "Booking Calendar", href: `/${locale}/calendar`, icon: CalendarDays },
    { label: "OTA Channel Manager", href: `/${locale}/channels`, icon: Building },
    { label: "Campsite & Glamping Ops", href: `/${locale}/camping`, icon: Tent },
    { label: t("nav.bookings", "Reservations"), href: `/${locale}/bookings`, icon: CalendarDays },
    { label: t("nav.pos", "Front-Desk POS"), href: `/${locale}/pos`, icon: Receipt },
    { label: t("nav.housekeeping", "Housekeeping"), href: `/${locale}/housekeeping`, icon: Sparkles },
    { label: t("nav.inventory", "Inventory & Linen"), href: `/${locale}/inventory`, icon: Boxes },
    { label: t("nav.events", "Venues & Events"), href: `/${locale}/events`, icon: PartyPopper },
    { label: t("nav.guests", "Guest Profiles"), href: `/${locale}/guests`, icon: Users },
    { label: t("nav.hr", "Staff & Payroll"), href: `/${locale}/hr`, icon: Briefcase },
    { label: t("nav.reports", "Reports & Analytics"), href: `/${locale}/reports`, icon: BarChart3 },
    { label: t("nav.billing", "Billing & Plans"), href: `/${locale}/billing`, icon: CreditCard },
  ];

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar aside */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 z-50 md:z-0 h-full md:h-[calc(100vh-4rem)] w-64 md:w-60 lg:w-64 border-r border-border bg-card p-4 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
        }`}
      >
        {/* Mobile Header inside drawer */}
        <div className="flex md:hidden items-center justify-between pb-4 mb-2 border-b border-border">
          <span className="font-semibold text-sm">Navigation Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:bg-muted"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-6rem)] pr-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === `/${locale}`
                ? pathname === `/${locale}` || pathname === `/${locale}/`
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs md:text-sm font-medium transition-colors min-h-[44px] ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

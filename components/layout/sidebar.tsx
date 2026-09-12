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
  Globe,
  ExternalLink,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

export function Sidebar({
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}: {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const { t, locale } = useTranslation();
  const pathname = usePathname();

  const navItems = [
    { label: t("nav.dashboard", "Overview"), href: `/${locale}/dashboard`, icon: LayoutDashboard },
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
        className={`fixed md:sticky top-0 md:top-16 z-50 md:z-0 h-full md:h-[calc(100vh-4rem)] border-r border-border bg-card transition-all duration-200 ease-in-out md:translate-x-0 ${
          isCollapsed
            ? "w-64 md:w-[68px] p-3 md:p-2"
            : "w-64 md:w-60 lg:w-64 p-4"
        } ${
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

        {/* Desktop Quick Header */}
        <div className="hidden md:flex items-center justify-between pb-2 mb-2 border-b border-border/70">
          {!isCollapsed ? (
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">
              Menu
            </span>
          ) : (
            <span className="sr-only">Menu</span>
          )}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              type="button"
              className={`p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${
                isCollapsed ? "mx-auto" : ""
              }`}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-4 w-4 rtl:rotate-180" />
              ) : (
                <PanelLeftClose className="h-4 w-4 rtl:rotate-180" />
              )}
            </button>
          )}
        </div>

        <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-7.5rem)] pr-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== `/${locale}` && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                title={item.label}
                className={`flex items-center rounded-lg py-2.5 text-xs md:text-sm font-medium transition-colors min-h-[42px] ${
                  isCollapsed
                    ? "justify-center px-2 md:px-0"
                    : "gap-3 px-3"
                } ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                <span className={`truncate ${isCollapsed ? "md:hidden" : ""}`}>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 mt-2 border-t border-border flex flex-col gap-1">
            <Link
              href={`/${locale}`}
              onClick={onClose}
              title="Public Landing Page"
              className={`flex items-center rounded-lg py-2 text-xs font-semibold text-rentcot-blue hover:bg-rentcot-blue/10 transition-colors ${
                isCollapsed ? "justify-center px-2 md:px-0" : "justify-between px-3"
              }`}
            >
              <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-2"}`}>
                <Globe className="h-4 w-4 shrink-0" />
                <span className={isCollapsed ? "md:hidden" : ""}>Public Landing</span>
              </div>
              <ExternalLink className={`h-3 w-3 shrink-0 ${isCollapsed ? "md:hidden" : ""}`} />
            </Link>

            {/* Bottom Collapse Trigger on Desktop */}
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className={`hidden md:flex items-center rounded-lg py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors ${
                  isCollapsed ? "justify-center px-0" : "justify-between px-3"
                }`}
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-2"}`}>
                  {isCollapsed ? (
                    <PanelLeftOpen className="h-4 w-4 shrink-0 rtl:rotate-180" />
                  ) : (
                    <PanelLeftClose className="h-4 w-4 shrink-0 rtl:rotate-180" />
                  )}
                  {!isCollapsed && <span>Collapse Sidebar</span>}
                </div>
                {!isCollapsed && (
                  <span className="text-[10px] text-muted-foreground/70 bg-muted px-1.5 py-0.5 rounded font-mono">
                    Fold
                  </span>
                )}
              </button>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}

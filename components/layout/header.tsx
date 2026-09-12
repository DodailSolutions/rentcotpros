"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/context";
import { LanguageSwitcher } from "./language-switcher";
import { 
  Building2, 
  Menu, 
  Bell, 
  ChevronDown,
  Compass,
  TreePine,
  Tent,
  UserPlus,
  Globe,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

export function Header({
  onToggleSidebar,
  onToggleCollapse,
  isSidebarCollapsed,
  onOpenInviteModal,
}: {
  onToggleSidebar?: () => void;
  onToggleCollapse?: () => void;
  isSidebarCollapsed?: boolean;
  onOpenInviteModal?: () => void;
}) {
  const { t, locale } = useTranslation();
  const [isPropertyMenuOpen, setIsPropertyMenuOpen] = useState(false);

  // Active property state
  const properties = [
    { id: "all", name: t("common.allProperties", "All Properties"), icon: Building2 },
    { id: "prop-1", name: "Green Valley Farmhouse (Shamirpet)", icon: TreePine },
    { id: "prop-2", name: "Wildwoods Campsite (Vikarabad)", icon: Tent },
    { id: "prop-3", name: "Palm Oasis Luxury Resort", icon: Compass },
  ];
  const [activeProperty, setActiveProperty] = useState(properties[0]);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/95 px-4 md:px-6 backdrop-blur supports-[backdrop-filter]:bg-card/75">
      <div className="flex items-center gap-2 md:gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleSidebar}
          type="button"
          className="flex md:hidden h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground hover:bg-muted"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop sidebar collapse/expand trigger */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            type="button"
            className="hidden md:flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-2xs"
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="h-4 w-4 rtl:rotate-180" />
            ) : (
              <PanelLeftClose className="h-4 w-4 rtl:rotate-180" />
            )}
          </button>
        )}

        {/* Official Brand Logo */}
        <Link href={`/${locale}/dashboard`} className="flex items-center gap-2" title="Rentcot Property OS Dashboard">
          <div className="relative h-8 w-32 md:h-9 md:w-36">
            <Image
              src="/brand/rentcot-logo.png"
              alt="Rentcot Property OS"
              fill
              className="object-contain object-left rtl:object-right"
              priority
            />
          </div>
        </Link>

        {/* Multi-Property Switcher Dropdown */}
        <div className="relative hidden sm:block ml-4 rtl:ml-0 rtl:mr-4">
          <button
            type="button"
            onClick={() => setIsPropertyMenuOpen(!isPropertyMenuOpen)}
            className="flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors shadow-2xs"
          >
            <activeProperty.icon className="h-3.5 w-3.5 text-rentcot-blue" />
            <span className="max-w-[200px] truncate">{activeProperty.name}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>

          {isPropertyMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsPropertyMenuOpen(false)}
              />
              <div className="absolute left-0 rtl:left-auto rtl:right-0 mt-2 w-72 rounded-xl border border-border bg-card p-1 shadow-xl z-40 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Switch Active Property
                </div>
                {properties.map((p) => {
                  const Icon = p.icon;
                  const isSelected = p.id === activeProperty.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActiveProperty(p);
                        setIsPropertyMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-left rtl:text-right transition-colors ${
                        isSelected ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-rentcot-blue" />
                      <span className="truncate">{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Actions: Quick Invite, Notifications, Language Switcher, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Invite Staff Button */}
        {onOpenInviteModal && (
          <button
            type="button"
            onClick={onOpenInviteModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rentcot-blue/30 bg-rentcot-blue/10 hover:bg-rentcot-blue/20 text-rentcot-blue text-xs font-semibold transition-colors"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Invite Team</span>
          </button>
        )}

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Public Landing Page Link */}
        <Link
          href={`/${locale}`}
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground text-xs font-medium transition-colors"
          title="View Public Marketing Landing Page"
        >
          <Globe className="h-3.5 w-3.5 text-rentcot-blue" />
          <span>Public Site</span>
        </Link>

        {/* Notification Bell */}
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rentcot-cyan ring-2 ring-background" />
        </button>

        {/* User Pill / Profile */}
        <Link
          href={`/${locale}/auth/login`}
          className="flex items-center gap-2 rounded-lg border border-border bg-background p-1 pr-2.5 rtl:pr-1 rtl:pl-2.5 hover:bg-muted transition-colors"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-rentcot-blue text-white font-semibold text-xs shadow-2xs">
            JD
          </div>
          <div className="hidden lg:flex flex-col text-left rtl:text-right">
            <span className="text-xs font-semibold leading-tight">John Doe</span>
            <span className="text-[10px] text-muted-foreground leading-tight">Owner</span>
          </div>
        </Link>
      </div>
    </header>
  );
}

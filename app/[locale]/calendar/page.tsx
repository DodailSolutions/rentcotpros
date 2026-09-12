"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  ShieldCheck,
  Building2,
  Users,
  CreditCard,
  Phone,
  Mail,
  X,
  Lock,
} from "lucide-react";

interface CalendarBooking {
  id: string;
  unitId: string;
  unitName: string;
  guestName: string;
  guestPhone: string;
  source: "direct" | "airbnb" | "booking_com" | "makemytrip" | "agoda" | "walk_in";
  startDayIndex: number;
  durationDays: number;
  payoutAmount: number;
  adults: number;
  children: number;
  status: "confirmed" | "checked_in";
}

export default function UnifiedCalendarPage() {
  const { t } = useTranslation();
  const [selectedBooking, setSelectedBooking] = useState<CalendarBooking | null>(null);

  // Date columns (7 days from Sep 18, 2026)
  const days = [
    { num: 18, name: "Fri", date: "2026-09-18", isWeekend: true },
    { num: 19, name: "Sat", date: "2026-09-19", isWeekend: true },
    { num: 20, name: "Sun", date: "2026-09-20", isWeekend: false },
    { num: 21, name: "Mon", date: "2026-09-21", isWeekend: false },
    { num: 22, name: "Tue", date: "2026-09-22", isWeekend: false },
    { num: 23, name: "Wed", date: "2026-09-23", isWeekend: false },
    { num: 24, name: "Thu", date: "2026-09-24", isWeekend: false },
  ];

  // Physical units
  const units = [
    { id: "U-101", name: "Suite 101", type: "Executive Suite", property: "Palm Oasis" },
    { id: "U-102", name: "Cottage 102", type: "Lake View Cottage", property: "Palm Oasis" },
    { id: "U-103", name: "Villa 103", type: "Garden Villa", property: "Palm Oasis" },
    { id: "U-FH1", name: "Farmhouse Estate", type: "3-BHK Villa", property: "Green Valley" },
    { id: "U-T01", name: "Dome 01", type: "Glamping Dome", property: "Wildwoods" },
    { id: "U-T02", name: "Dome 02", type: "Glamping Dome", property: "Wildwoods" },
    { id: "U-T03", name: "Safari Tent 01", type: "Safari Canvas Tent", property: "Wildwoods" },
  ];

  // Bookings across units & days
  const bookings: CalendarBooking[] = [
    {
      id: "BK-DIR-101",
      unitId: "U-101",
      unitName: "Suite 101",
      guestName: "Ananya Roy",
      guestPhone: "+91 98450 11223",
      source: "direct",
      startDayIndex: 0,
      durationDays: 2,
      payoutAmount: 11000,
      adults: 2,
      children: 0,
      status: "checked_in",
    },
    {
      id: "BK-ABNB-9988",
      unitId: "U-102",
      unitName: "Cottage 102",
      guestName: "Rohit Sharma",
      guestPhone: "+91 98112 34567",
      source: "airbnb",
      startDayIndex: 2,
      durationDays: 2,
      payoutAmount: 11200,
      adults: 2,
      children: 0,
      status: "confirmed",
    },
    {
      id: "BK-BCOM-4410",
      unitId: "U-103",
      unitName: "Villa 103",
      guestName: "David Miller",
      guestPhone: "+44 7700 900123",
      source: "booking_com",
      startDayIndex: 1,
      durationDays: 3,
      payoutAmount: 22500,
      adults: 3,
      children: 1,
      status: "confirmed",
    },
    {
      id: "BK-MMT-7721",
      unitId: "U-FH1",
      unitName: "Farmhouse Estate",
      guestName: "Sanjay Reddy",
      guestPhone: "+91 94400 88776",
      source: "makemytrip",
      startDayIndex: 0,
      durationDays: 2,
      payoutAmount: 19000,
      adults: 6,
      children: 2,
      status: "checked_in",
    },
    {
      id: "BK-AGD-3019",
      unitId: "U-T01",
      unitName: "Dome 01",
      guestName: "Kavita Rao",
      guestPhone: "+91 97000 55443",
      source: "agoda",
      startDayIndex: 1,
      durationDays: 2,
      payoutAmount: 9200,
      adults: 2,
      children: 1,
      status: "confirmed",
    },
    {
      id: "BK-WALK-881",
      unitId: "U-T02",
      unitName: "Dome 02",
      guestName: "Deepak Mehta",
      guestPhone: "+91 99880 22114",
      source: "walk_in",
      startDayIndex: 0,
      durationDays: 1,
      payoutAmount: 4800,
      adults: 2,
      children: 0,
      status: "checked_in",
    },
    {
      id: "BK-DIR-105",
      unitId: "U-T02",
      unitName: "Dome 02",
      guestName: "Pooja Hegde",
      guestPhone: "+91 96111 33445",
      source: "direct",
      startDayIndex: 3,
      durationDays: 3,
      payoutAmount: 14400,
      adults: 2,
      children: 1,
      status: "confirmed",
    },
  ];

  const sourceConfig = {
    direct: { label: "Direct Website", bg: "bg-emerald-600 hover:bg-emerald-700 text-white", border: "border-emerald-700" },
    airbnb: { label: "Airbnb", bg: "bg-[#ff5a5f] hover:bg-[#e04e53] text-white", border: "border-[#ff5a5f]" },
    booking_com: { label: "Booking.com", bg: "bg-[#003580] hover:bg-[#002868] text-white", border: "border-[#003580]" },
    makemytrip: { label: "MakeMyTrip", bg: "bg-[#ea2330] hover:bg-[#c91823] text-white", border: "border-[#ea2330]" },
    agoda: { label: "Agoda", bg: "bg-[#00a699] hover:bg-[#008f83] text-white", border: "border-[#00a699]" },
    walk_in: { label: "Walk-In / POS", bg: "bg-purple-600 hover:bg-purple-700 text-white", border: "border-purple-700" },
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Unified Booking Calendar
            </h1>
            <Badge variant="clean" className="flex items-center gap-1 text-[11px] font-semibold">
              <Lock className="h-3 w-3 text-emerald-600" />
              Double-Booking Locked
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Single view of all physical units synced across Direct, Airbnb, Booking.com, MMT & Walk-Ins
          </p>
        </div>

        {/* Calendar Nav */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 px-2.5">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs font-bold text-foreground px-2">18 Sep – 24 Sep 2026</span>
          <Button variant="outline" size="sm" className="h-9 px-2.5">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button size="sm" className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white text-xs font-semibold gap-1.5 ml-2">
            <Plus className="h-3.5 w-3.5" />
            New Reservation
          </Button>
        </div>
      </div>

      {/* Source Color Legend */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl border border-border bg-card text-xs">
        <span className="font-semibold text-muted-foreground text-[11px] mr-1">Channel Sources:</span>
        {Object.entries(sourceConfig).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`h-3 w-3 rounded-md ${cfg.bg}`} />
            <span className="text-foreground text-[11px] font-medium">{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* Main Timeline Grid */}
      <Card className="border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[850px]">
            {/* Date Header Row */}
            <div className="grid grid-cols-8 border-b border-border bg-muted/40 text-xs font-bold text-muted-foreground">
              <div className="p-3 border-r border-border flex items-center">
                <span>Unit / Accommodation</span>
              </div>
              {days.map((day) => (
                <div
                  key={day.date}
                  className={`p-2.5 text-center border-r last:border-r-0 border-border ${
                    day.isWeekend ? "bg-amber-500/5 text-amber-900 dark:text-amber-300" : ""
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold block">{day.name}</span>
                  <span className="text-sm font-extrabold text-foreground">{day.num}</span>
                </div>
              ))}
            </div>

            {/* Unit Rows */}
            <div className="divide-y divide-border">
              {units.map((unit) => {
                const unitBookings = bookings.filter((b) => b.unitId === unit.id);

                return (
                  <div key={unit.id} className="grid grid-cols-8 relative hover:bg-muted/15 transition-colors">
                    {/* Unit Info Cell */}
                    <div className="p-3 border-r border-border flex flex-col justify-center bg-card">
                      <span className="text-xs font-bold text-foreground">{unit.name}</span>
                      <span className="text-[10px] text-muted-foreground truncate">{unit.type}</span>
                    </div>

                    {/* 7 Day Slot Cells */}
                    {days.map((day, dIdx) => (
                      <div
                        key={day.date}
                        className={`min-h-[64px] border-r last:border-r-0 border-border relative flex items-center justify-center ${
                          day.isWeekend ? "bg-amber-500/5" : ""
                        }`}
                      >
                        {/* Render booking block if starting on this day */}
                        {unitBookings
                          .filter((b) => b.startDayIndex === dIdx)
                          .map((b) => {
                            const cfg = sourceConfig[b.source];
                            // calculate width percentage across columns: durationDays * 100%
                            const colWidthPercent = b.durationDays * 100;

                            return (
                              <div
                                key={b.id}
                                onClick={() => setSelectedBooking(b)}
                                style={{ width: `calc(${colWidthPercent}% - 8px)` }}
                                className={`absolute left-1 z-10 h-11 rounded-lg px-2.5 py-1 text-xs cursor-pointer shadow-sm transition-all hover:scale-[1.01] flex flex-col justify-center select-none ${cfg.bg}`}
                              >
                                <div className="flex items-center justify-between gap-1 overflow-hidden">
                                  <span className="font-bold truncate text-[11px] leading-tight">
                                    {b.guestName}
                                  </span>
                                  <span className="text-[9px] uppercase font-mono font-bold shrink-0 opacity-85">
                                    {b.source.replace("_", ".")}
                                  </span>
                                </div>
                                <span className="text-[10px] opacity-90 truncate">
                                  ₹{b.payoutAmount.toLocaleString()} &bull; {b.adults}A {b.children > 0 ? `${b.children}C` : ""}
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Reservation Inspector Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-5 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-md ${sourceConfig[selectedBooking.source].bg}`} />
                <h3 className="font-bold text-base text-foreground">Reservation Details</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-muted/40 border border-border">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Booking Reference</span>
                  <span className="font-mono font-bold text-sm text-rentcot-blue">{selectedBooking.id}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Channel Source</span>
                  <Badge variant="outline" className="capitalize font-bold text-xs">
                    {selectedBooking.source.replace("_", " ")}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guest:</span>
                  <span className="font-bold">{selectedBooking.guestName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contact:</span>
                  <span className="font-mono">{selectedBooking.guestPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assigned Unit:</span>
                  <span className="font-bold">{selectedBooking.unitName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span>{selectedBooking.durationDays} Nights</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Registered Party:</span>
                  <span>{selectedBooking.adults} Adults, {selectedBooking.children} Children</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border font-bold text-sm">
                  <span>Channel Payout:</span>
                  <span className="text-emerald-600">₹{selectedBooking.payoutAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <Button
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1 bg-rentcot-blue hover:bg-rentcot-blue/90 text-white text-xs"
                >
                  Close Inspection
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

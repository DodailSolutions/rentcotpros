"use client";

import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Search,
  Filter,
  UserCheck,
  UserX,
  CreditCard,
  Phone,
  MessageCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  Dog,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface Reservation {
  id: string;
  guestName: string;
  phone: string;
  property: string;
  unit: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  pets: number;
  source: "direct" | "airbnb" | "booking" | "agoda" | "makemytrip";
  status: "confirmed" | "checked_in" | "checked_out" | "cancelled";
  totalAmount: number;
  paidAmount: number;
  specialRequests?: string;
}

const mockReservations: Reservation[] = [
  {
    id: "RES-9081",
    guestName: "Aditya Verma",
    phone: "+91 98480 12345",
    property: "Green Valley Farmhouse",
    unit: "Heritage Villa 1",
    checkIn: "2026-09-12",
    checkOut: "2026-09-14",
    adults: 4,
    children: 1,
    pets: 1,
    source: "direct",
    status: "checked_in",
    totalAmount: 24500,
    paidAmount: 24500,
    specialRequests: "Arriving with Golden Retriever, requested campfire setup",
  },
  {
    id: "RES-9082",
    guestName: "Sarah Jenkins",
    phone: "+1 415 555 2671",
    property: "Palm Oasis Resort",
    unit: "Pool Villa 102",
    checkIn: "2026-09-12",
    checkOut: "2026-09-16",
    adults: 2,
    children: 0,
    pets: 0,
    source: "airbnb",
    status: "confirmed",
    totalAmount: 38000,
    paidAmount: 38000,
    specialRequests: "Late check-in approx 7:00 PM",
  },
  {
    id: "RES-9083",
    guestName: "Mohammed Al-Nuaimi",
    phone: "+971 50 123 4567",
    property: "Palm Oasis Resort",
    unit: "Presidential Cottage 01",
    checkIn: "2026-09-13",
    checkOut: "2026-09-17",
    adults: 3,
    children: 2,
    pets: 0,
    source: "booking",
    status: "confirmed",
    totalAmount: 62000,
    paidAmount: 30000,
    specialRequests: "Halal dining options requested",
  },
  {
    id: "RES-9084",
    guestName: "Rohan & Priyam Mehra",
    phone: "+91 98200 99881",
    property: "Wildwoods Glamping",
    unit: "Luxury Glamping Tent 04",
    checkIn: "2026-09-11",
    checkOut: "2026-09-13",
    adults: 2,
    children: 0,
    pets: 0,
    source: "makemytrip",
    status: "checked_in",
    totalAmount: 11200,
    paidAmount: 11200,
  },
  {
    id: "RES-9085",
    guestName: "TechCorp Offsite Group",
    phone: "+91 99001 44321",
    property: "Green Valley Farmhouse",
    unit: "Full Farmhouse + Lawn",
    checkIn: "2026-09-15",
    checkOut: "2026-09-16",
    adults: 18,
    children: 0,
    pets: 0,
    source: "direct",
    status: "confirmed",
    totalAmount: 85000,
    paidAmount: 40000,
    specialRequests: "Day-picnic + evening overnight catering package",
  },
  {
    id: "RES-9079",
    guestName: "Vikram Kulkarni",
    phone: "+91 94401 77654",
    property: "Wildwoods Glamping",
    unit: "Safari Dome Tent 02",
    checkIn: "2026-09-10",
    checkOut: "2026-09-12",
    adults: 2,
    children: 1,
    pets: 1,
    source: "agoda",
    status: "checked_out",
    totalAmount: 9600,
    paidAmount: 9600,
  },
];

export default function BookingsPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);

  const filteredReservations = reservations.filter((res) => {
    const matchesSearch =
      res.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.phone.includes(searchTerm) ||
      res.unit.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || res.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, newStatus: Reservation["status"]) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const getSourceBadge = (source: Reservation["source"]) => {
    switch (source) {
      case "airbnb":
        return <Badge variant="secondary" className="bg-[#FF5A5F]/15 text-[#FF5A5F] border-[#FF5A5F]/30 font-semibold">Airbnb</Badge>;
      case "booking":
        return <Badge variant="secondary" className="bg-[#003580]/15 text-[#003580] border-[#003580]/30 font-semibold">Booking.com</Badge>;
      case "makemytrip":
        return <Badge variant="secondary" className="bg-[#EB2226]/15 text-[#EB2226] border-[#EB2226]/30 font-semibold">MakeMyTrip</Badge>;
      case "agoda":
        return <Badge variant="secondary" className="bg-[#2B86E8]/15 text-[#2B86E8] border-[#2B86E8]/30 font-semibold">Agoda</Badge>;
      case "direct":
      default:
        return <Badge variant="secondary" className="bg-rentcot-blue/15 text-rentcot-blue border-rentcot-blue/30 font-semibold">Direct Book</Badge>;
    }
  };

  const getStatusBadge = (status: Reservation["status"]) => {
    switch (status) {
      case "checked_in":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white">Checked In</Badge>;
      case "confirmed":
        return <Badge className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white">Confirmed</Badge>;
      case "checked_out":
        return <Badge variant="secondary">Checked Out</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {t("nav.bookings", "Reservations & Bookings")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time multi-channel booking register across rooms, tents, and event venues.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white min-h-[44px]">
            <Plus className="h-4 w-4 mr-1.5" />
            <span>New Walk-in / Booking</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs text-muted-foreground">Today's Arrivals</span>
            <div className="text-xl sm:text-2xl font-bold text-foreground mt-1">4 Stays</div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">2 already checked-in</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs text-muted-foreground">Departures</span>
            <div className="text-xl sm:text-2xl font-bold text-foreground mt-1">2 Units</div>
            <span className="text-[11px] text-muted-foreground">Housekeeping notified</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs text-muted-foreground">Active In-House</span>
            <div className="text-xl sm:text-2xl font-bold text-foreground mt-1">6 Guests</div>
            <span className="text-[11px] text-rentcot-blue font-medium">1 Pet on premise</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs text-muted-foreground">Uncollected Folio</span>
            <div className="text-xl sm:text-2xl font-bold text-foreground mt-1">₹77,000</div>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Collect upon check-in</span>
          </CardContent>
        </Card>
      </div>

      {/* Controls: Search and Filters */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search guest name, phone, reservation ID or unit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {["all", "confirmed", "checked_in", "checked_out", "cancelled"].map((st) => (
                <Button
                  key={st}
                  variant={statusFilter === st ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(st)}
                  className="capitalize whitespace-nowrap text-xs h-9 min-h-[36px]"
                >
                  {st.replace("_", " ")}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-3">
        {filteredReservations.length === 0 ? (
          <Card className="p-10 text-center">
            <CalendarDays className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
            <h3 className="font-semibold text-foreground">No reservations found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search criteria or create a manual booking.
            </p>
          </Card>
        ) : (
          filteredReservations.map((res) => {
            const balanceDue = res.totalAmount - res.paidAmount;
            return (
              <Card key={res.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Guest & Stay Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-muted-foreground">{res.id}</span>
                        {getSourceBadge(res.source)}
                        {getStatusBadge(res.status)}
                        {res.pets > 0 && (
                          <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50 dark:bg-purple-950/30 gap-1">
                            <Dog className="h-3 w-3" />
                            <span>{res.pets} Pet</span>
                          </Badge>
                        )}
                      </div>

                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                          {res.guestName}
                        </h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                          <span className="font-medium text-foreground">{res.property}</span>
                          <span>•</span>
                          <span className="text-rentcot-blue font-semibold">{res.unit}</span>
                          <span>•</span>
                          <span>{res.adults} Adults {res.children > 0 ? `, ${res.children} Kids` : ""}</span>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 font-mono">
                          <CalendarDays className="h-3.5 w-3.5 text-rentcot-blue" />
                          {res.checkIn} → {res.checkOut}
                        </span>
                        <a
                          href={`tel:${res.phone}`}
                          className="flex items-center gap-1 text-foreground hover:text-rentcot-blue underline decoration-dotted"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          {res.phone}
                        </a>
                      </div>

                      {res.specialRequests && (
                        <div className="text-xs bg-muted/60 p-2 rounded-md text-muted-foreground">
                          <span className="font-semibold text-foreground">Note: </span>
                          {res.specialRequests}
                        </div>
                      )}
                    </div>

                    {/* Financials & Quick Action Buttons */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between sm:justify-start gap-3 border-t lg:border-t-0 pt-3 lg:pt-0">
                      <div className="text-left sm:text-right">
                        <div className="text-xs text-muted-foreground">Total Folio</div>
                        <div className="text-lg font-bold text-foreground">
                          ₹{res.totalAmount.toLocaleString()}
                        </div>
                        {balanceDue > 0 ? (
                          <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                            Due: ₹{balanceDue.toLocaleString()}
                          </div>
                        ) : (
                          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end">
                            <ShieldCheck className="h-3 w-3" />
                            <span>Fully Paid</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <a
                          href={`https://wa.me/${res.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(res.guestName)},%20welcome%20to%20our%20property!`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center h-9 px-3 rounded-lg border border-emerald-500/40 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-medium transition-colors"
                          title="WhatsApp Guest"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span>WhatsApp</span>
                        </a>

                        {res.status === "confirmed" && (
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white min-h-[36px] flex-1 sm:flex-initial"
                            onClick={() => handleStatusChange(res.id, "checked_in")}
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            <span>Check-In</span>
                          </Button>
                        )}

                        {res.status === "checked_in" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="min-h-[36px] border-border text-foreground hover:bg-muted flex-1 sm:flex-initial"
                            onClick={() => handleStatusChange(res.id, "checked_out")}
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            <span>Check-Out</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

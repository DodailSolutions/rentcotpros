"use client";

import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Search,
  Star,
  Dog,
  ShieldCheck,
  AlertCircle,
  Phone,
  Mail,
  Share2,
  MessageCircle,
  Plus,
  CalendarDays,
} from "lucide-react";

interface GuestProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalStays: number;
  totalSpent: number;
  isVIP: boolean;
  hasPets: boolean;
  idVerified: boolean;
  notes: string;
  lastVisit: string;
}

const mockGuests: GuestProfile[] = [
  {
    id: "G-1001",
    name: "Aditya Verma",
    phone: "+91 98480 12345",
    email: "aditya.v@example.com",
    totalStays: 4,
    totalSpent: 98000,
    isVIP: true,
    hasPets: true,
    idVerified: true,
    notes: "Prefers quiet garden-facing villas. Always travels with Golden Retriever.",
    lastVisit: "Currently In-House",
  },
  {
    id: "G-1002",
    name: "Sarah Jenkins",
    phone: "+1 415 555 2671",
    email: "sarah.j@caltech.edu",
    totalStays: 1,
    totalSpent: 38000,
    isVIP: false,
    hasPets: false,
    idVerified: true,
    notes: "International guest. Requested late check-out on departure day.",
    lastVisit: "Currently In-House",
  },
  {
    id: "G-1003",
    name: "Mohammed Al-Nuaimi",
    phone: "+971 50 123 4567",
    email: "m.alnuaimi@dxb.ae",
    totalStays: 3,
    totalSpent: 185000,
    isVIP: true,
    hasPets: false,
    idVerified: true,
    notes: "Family stays. Requires halal food menu and extra swimming towels.",
    lastVisit: "Arrival 13 Sep 2026",
  },
  {
    id: "G-1004",
    name: "Rohan Mehra",
    phone: "+91 98200 99881",
    email: "rohan.mehra@mumbai.co",
    totalStays: 2,
    totalSpent: 22400,
    isVIP: false,
    hasPets: false,
    idVerified: false,
    notes: "Awaiting Aadhaar upload via guest portal.",
    lastVisit: "Currently In-House",
  },
  {
    id: "G-1005",
    name: "Dr. K. Srinivas Rao",
    phone: "+91 99882 11223",
    email: "dr.srinivas@aims.org",
    totalStays: 6,
    totalSpent: 310000,
    isVIP: true,
    hasPets: false,
    idVerified: true,
    notes: "Corporate & family patron. Hosted 50th birthday banquet.",
    lastVisit: "22 Aug 2026",
  },
];

export default function GuestsPage() {
  const { t, locale } = useTranslation();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filteredGuests = mockGuests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.phone.includes(search) ||
      g.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "vip" && g.isVIP) ||
      (filter === "pets" && g.hasPets) ||
      (filter === "unverified" && !g.idVerified);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {t("nav.guests", "Guest CRM & Compliance Profiles")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Government ID compliance, guest preferences, lifetime spend, pet records, and self-service portals.
          </p>
        </div>
        <Button className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white min-h-[44px]">
          <Plus className="h-4 w-4 mr-1.5" />
          <span>New Guest Record</span>
        </Button>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search guest name, mobile number, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {[
                { id: "all", label: "All Guests" },
                { id: "vip", label: "VIP Only" },
                { id: "pets", label: "Pet Parents" },
                { id: "unverified", label: "ID Pending" },
              ].map((f) => (
                <Button
                  key={f.id}
                  variant={filter === f.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(f.id)}
                  className="whitespace-nowrap text-xs h-9 min-h-[36px]"
                >
                  {f.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guests Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGuests.map((guest) => (
          <Card key={guest.id} className="hover:border-primary/50 transition-colors">
            <CardContent className="p-4 sm:p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-base text-foreground">{guest.name}</h3>
                    {guest.isVIP && (
                      <Badge className="bg-amber-500 hover:bg-amber-600 text-white gap-1 text-[10px] px-1.5 py-0">
                        <Star className="h-2.5 w-2.5 fill-current" /> VIP
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{guest.email}</div>
                </div>

                {guest.idVerified ? (
                  <Badge variant="secondary" className="text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 gap-1 text-[10px]">
                    <ShieldCheck className="h-3 w-3" /> ID Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/40 gap-1 text-[10px]">
                    <AlertCircle className="h-3 w-3" /> ID Pending
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-border">
                <div>
                  <span className="text-muted-foreground">Total Stays:</span>
                  <div className="font-bold text-foreground">{guest.totalStays} Stays</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Lifetime Value:</span>
                  <div className="font-bold text-rentcot-blue">₹{guest.totalSpent.toLocaleString()}</div>
                </div>
              </div>

              {guest.hasPets && (
                <div className="flex items-center gap-1.5 text-xs text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/30 p-2 rounded-md font-medium">
                  <Dog className="h-3.5 w-3.5 shrink-0" />
                  <span>Pet-Friendly Guest (Pet policy signed)</span>
                </div>
              )}

              {guest.notes && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  <span className="font-medium text-foreground">Preferences: </span>
                  {guest.notes}
                </p>
              )}

              <div className="pt-2 flex items-center justify-between gap-2 border-t border-border">
                <a
                  href={`tel:${guest.phone}`}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>{guest.phone}</span>
                </a>

                <a
                  href={`/${locale}/guest/portal`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs text-rentcot-blue hover:underline font-medium"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Portal Link</span>
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

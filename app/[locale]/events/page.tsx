"use client";

import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PartyPopper,
  Calendar,
  Clock,
  Users,
  Plus,
  SunMedium,
  Sparkles,
  MapPin,
  CheckCircle2,
  Phone,
} from "lucide-react";

interface VenueSlot {
  id: string;
  name: string;
  property: string;
  capacity: number;
  rateType: "slot" | "hourly" | "per_person";
  rate: number;
  type: "lawn" | "banquet" | "poolside" | "amphitheater";
  upcomingBookingsCount: number;
}

const venues: VenueSlot[] = [
  {
    id: "ven-1",
    name: "Lakeview Wedding Lawn & Stage",
    property: "Green Valley Farmhouse",
    capacity: 450,
    rateType: "slot",
    rate: 65000,
    type: "lawn",
    upcomingBookingsCount: 3,
  },
  {
    id: "ven-2",
    name: "Grand Palm Banquet Hall",
    property: "Palm Oasis Resort",
    capacity: 250,
    rateType: "slot",
    rate: 50000,
    type: "banquet",
    upcomingBookingsCount: 5,
  },
  {
    id: "ven-3",
    name: "Sunset Poolside Deck & BBQ Pergola",
    property: "Palm Oasis Resort",
    capacity: 80,
    rateType: "hourly",
    rate: 4500,
    type: "poolside",
    upcomingBookingsCount: 2,
  },
  {
    id: "ven-4",
    name: "Wildwoods Starry Sky Amphitheater",
    property: "Wildwoods Campsite",
    capacity: 120,
    rateType: "slot",
    rate: 18000,
    type: "amphitheater",
    upcomingBookingsCount: 4,
  },
];

const upcomingEvents = [
  {
    id: "EVT-401",
    title: "Corporate Day-Outing & Hackathon",
    client: "Razorpay Engg Team",
    phone: "+91 98490 88776",
    venue: "Lakeview Wedding Lawn & Stage",
    property: "Green Valley Farmhouse",
    date: "14 Sep 2026",
    slot: "10:00 AM – 06:00 PM (Day Use)",
    pax: 65,
    amount: 72000,
    status: "confirmed",
  },
  {
    id: "EVT-402",
    title: "50th Golden Jubilee Birthday Party",
    client: "Dr. K. Srinivas Rao",
    phone: "+91 99882 11223",
    venue: "Grand Palm Banquet Hall",
    property: "Palm Oasis Resort",
    date: "19 Sep 2026",
    slot: "06:00 PM – 11:30 PM (Evening Gala)",
    pax: 140,
    amount: 110000,
    status: "advance_received",
  },
  {
    id: "EVT-403",
    title: "Acoustic Campfire Music Night",
    client: "Hyderabad Hikers Club",
    phone: "+91 97000 33441",
    venue: "Wildwoods Starry Sky Amphitheater",
    property: "Wildwoods Campsite",
    date: "20 Sep 2026",
    slot: "05:00 PM – 10:00 PM",
    pax: 45,
    amount: 28000,
    status: "confirmed",
  },
];

export default function EventsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {t("nav.events", "Venues, Day-Picnics & Events")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage banquets, open lawns, day-use farmhouse slots (10am–6pm), and corporate offsite gatherings.
          </p>
        </div>
        <Button className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white min-h-[44px]">
          <Plus className="h-4 w-4 mr-1.5" />
          <span>Book Event Slot</span>
        </Button>
      </div>

      {/* Venues Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-rentcot-blue" />
          <span>Bookable Venues & Lawns</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {venues.map((venue) => (
            <Card key={venue.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-4 sm:p-5 space-y-3">
                <div>
                  <Badge variant="secondary" className="text-[10px] uppercase tracking-wider mb-2">
                    {venue.type}
                  </Badge>
                  <h3 className="font-bold text-base text-foreground leading-tight">{venue.name}</h3>
                  <div className="text-xs text-muted-foreground mt-1">{venue.property}</div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> Capacity:
                    </span>
                    <span className="font-bold text-foreground">{venue.capacity} Guests</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Standard Rate:</span>
                    <span className="font-bold text-rentcot-blue">
                      ₹{venue.rate.toLocaleString()} / {venue.rateType}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full text-xs h-9">
                    Schedule / Block Dates
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Upcoming Event Schedule */}
      <div className="space-y-3 pt-4">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4 text-rentcot-blue" />
          <span>Upcoming Confirmed Events</span>
        </h2>
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-muted-foreground">{event.id}</span>
                      <Badge className="bg-emerald-600 text-white">Confirmed</Badge>
                      <Badge variant="outline" className="text-xs">
                        <Users className="h-3 w-3 mr-1" /> {event.pax} Guests
                      </Badge>
                    </div>

                    <h3 className="text-base font-bold text-foreground">{event.title}</h3>

                    <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-medium text-foreground">{event.client}</span>
                      <span>•</span>
                      <a href={`tel:${event.phone}`} className="text-rentcot-blue hover:underline">
                        {event.phone}
                      </a>
                      <span>•</span>
                      <span>{event.venue}</span>
                    </div>

                    <div className="text-xs font-mono text-muted-foreground flex items-center gap-1.5 pt-1">
                      <Clock className="h-3.5 w-3.5 text-rentcot-blue" />
                      <span>{event.date} • {event.slot}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 border-t lg:border-t-0 pt-3 lg:pt-0">
                    <div className="text-left sm:text-right">
                      <div className="text-xs text-muted-foreground">Package Total</div>
                      <div className="text-lg font-bold text-foreground">₹{event.amount.toLocaleString()}</div>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs h-9">
                      View Event Banquet Sheet
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

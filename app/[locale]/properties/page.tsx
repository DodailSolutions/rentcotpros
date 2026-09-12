"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VisualAvailabilityRadar } from "@/components/properties/visual-availability-radar";
import {
  Building2,
  TreePine,
  Tent,
  Compass,
  MapPin,
  Clock,
  Plus,
  ArrowRight,
  Trash2,
  Power,
  BedDouble,
  Sparkles,
  X,
  CheckCircle2,
  Layers,
} from "lucide-react";

interface PropertyItem {
  id: string;
  name: string;
  type: "Farmhouse Estate" | "Campsite & Tents" | "Luxury Resort" | "Luxury Villa";
  location: string;
  unitsCount: number;
  occupancy: string;
  checkIn: string;
  checkOut: string;
  currency: string;
  status: "active" | "seasonal_closure";
  iconName: "treepine" | "tent" | "compass" | "building";
  color: string;
}

const initialProperties: PropertyItem[] = [
  {
    id: "prop-1",
    name: "Green Valley Farmhouse & Retreat",
    type: "Farmhouse Estate",
    location: "Shamirpet, Hyderabad, Telangana",
    unitsCount: 8,
    occupancy: "88%",
    checkIn: "14:00",
    checkOut: "11:00",
    currency: "INR",
    status: "active",
    iconName: "treepine",
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  },
  {
    id: "prop-2",
    name: "Wildwoods Glamping & Campsite",
    type: "Campsite & Tents",
    location: "Ananthagiri Hills Road, Vikarabad, Telangana",
    unitsCount: 12,
    occupancy: "100% (Sold Out)",
    checkIn: "14:00",
    checkOut: "11:00",
    currency: "INR",
    status: "active",
    iconName: "tent",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  },
  {
    id: "prop-3",
    name: "Palm Oasis Luxury Resort",
    type: "Luxury Resort",
    location: "Gandipet Lake Front, Hyderabad, Telangana",
    unitsCount: 24,
    occupancy: "75%",
    checkIn: "14:00",
    checkOut: "11:00",
    currency: "INR",
    status: "active",
    iconName: "compass",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  },
];

export default function PropertiesPage() {
  const { t, locale } = useTranslation();
  const [properties, setProperties] = useState<PropertyItem[]>(initialProperties);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Property Form State
  const [newPropName, setNewPropName] = useState("");
  const [newPropType, setNewPropType] = useState<PropertyItem["type"]>("Campsite & Tents");
  const [newPropLocation, setNewPropLocation] = useState("");
  const [newPropUnits, setNewPropUnits] = useState(6);
  const [newPropCheckIn, setNewPropCheckIn] = useState("14:00");
  const [newPropCheckOut, setNewPropCheckOut] = useState("11:00");

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropName.trim() || !newPropLocation.trim()) return;

    let iconName: PropertyItem["iconName"] = "building";
    let color = "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300";

    if (newPropType === "Campsite & Tents") {
      iconName = "tent";
      color = "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";
    } else if (newPropType === "Farmhouse Estate") {
      iconName = "treepine";
      color = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
    } else if (newPropType === "Luxury Resort") {
      iconName = "compass";
      color = "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300";
    }

    const created: PropertyItem = {
      id: `prop-${Date.now()}`,
      name: newPropName,
      type: newPropType,
      location: newPropLocation,
      unitsCount: Number(newPropUnits),
      occupancy: "0%",
      checkIn: newPropCheckIn,
      checkOut: newPropCheckOut,
      currency: "INR",
      status: "active",
      iconName,
      color,
    };

    setProperties((prev) => [...prev, created]);
    setIsAddModalOpen(false);
    setNewPropName("");
    setNewPropLocation("");
    setNewPropUnits(6);
  };

  const handleToggleStatus = (id: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "active" ? "seasonal_closure" : "active" }
          : p
      )
    );
  };

  const handleRemoveProperty = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from your portfolio?`)) {
      setProperties((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const renderIcon = (name: PropertyItem["iconName"]) => {
    switch (name) {
      case "tent":
        return <Tent className="h-5 w-5" />;
      case "treepine":
        return <TreePine className="h-5 w-5" />;
      case "compass":
        return <Compass className="h-5 w-5" />;
      default:
        return <Building2 className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Properties & Campsites Portfolio
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Manage physical resorts, farmhouses, camping zones, and view live availability in real-time.
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white text-xs font-semibold gap-1.5 min-h-[44px]"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Property / Campsite</span>
        </Button>
      </div>

      {/* Visual Real-Time Availability Radar Component */}
      <VisualAvailabilityRadar />

      {/* Properties Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-4 w-4 text-rentcot-blue" />
            <span>Active Property Entities ({properties.length})</span>
          </h2>
          <span className="text-xs text-muted-foreground">Tenant Isolation Enforced via RLS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => {
            const isActive = p.status === "active";
            return (
              <Card
                key={p.id}
                className={`border shadow-xs transition-all flex flex-col justify-between ${
                  isActive ? "border-border hover:border-rentcot-blue/50" : "border-border/60 opacity-75 bg-muted/20"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${p.color}`}>
                        {renderIcon(p.iconName)}
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold text-foreground leading-snug">
                          {p.name}
                        </CardTitle>
                        <span className="text-xs text-muted-foreground">{p.type}</span>
                      </div>
                    </div>
                    {isActive ? (
                      <Badge variant="clean" className="text-[10px]">Open</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">Closed</Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-rentcot-blue" />
                    <span className="truncate">{p.location}</span>
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-muted/30 border border-border">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Accommodations</span>
                      <span className="font-bold text-foreground">{p.unitsCount} Units/Pitches</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Live Occupancy</span>
                      <span className="font-bold text-emerald-600">{p.occupancy}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Check-In</span>
                      <span>{p.checkIn}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Check-Out</span>
                      <span>{p.checkOut}</span>
                    </div>
                  </div>

                  {/* Actions & Lifecycle Toggle */}
                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-border">
                    <Link
                      href={p.type === "Campsite & Tents" ? `/${locale}/camping` : `/${locale}/units`}
                      className="text-xs font-semibold text-rentcot-blue hover:underline flex items-center gap-1"
                    >
                      <BedDouble className="h-3.5 w-3.5" />
                      <span>{p.type === "Campsite & Tents" ? "Campsite Ops" : "Manage Units"}</span>
                    </Link>

                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleStatus(p.id)}
                        className={`h-8 px-2 text-xs font-medium ${
                          isActive ? "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20" : "text-emerald-600 hover:bg-emerald-50"
                        }`}
                        title={isActive ? "Pause bookings for season" : "Re-open for bookings"}
                      >
                        <Power className="h-3.5 w-3.5 mr-1" />
                        <span>{isActive ? "Pause" : "Re-open"}</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveProperty(p.id, p.name)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Remove property"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Modal: Add New Property / Campsite */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-rentcot-blue/10 flex items-center justify-center text-rentcot-blue">
                  <Plus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Add New Property or Campsite</h3>
                  <p className="text-xs text-muted-foreground">Define a new physical stay location under your organization</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddProperty} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Property Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Whispering Pines Glamping Zone"
                  value={newPropName}
                  onChange={(e) => setNewPropName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Property Category</label>
                  <select
                    value={newPropType}
                    onChange={(e) => setNewPropType(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs"
                  >
                    <option value="Campsite & Tents">Campsite & Tents</option>
                    <option value="Farmhouse Estate">Farmhouse Estate</option>
                    <option value="Luxury Resort">Luxury Resort</option>
                    <option value="Luxury Villa">Luxury Villa</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Initial Unit / Pitch Count</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newPropUnits}
                    onChange={(e) => setNewPropUnits(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Physical Address / Landmark</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Ananthagiri Hills Road, Vikarabad, Telangana"
                  value={newPropLocation}
                  onChange={(e) => setNewPropLocation(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Standard Check-In</label>
                  <input
                    type="text"
                    value={newPropCheckIn}
                    onChange={(e) => setNewPropCheckIn(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Standard Check-Out</label>
                  <input
                    type="text"
                    value={newPropCheckOut}
                    onChange={(e) => setNewPropCheckOut(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white text-xs font-semibold h-9"
                >
                  Create Property & Launch Units
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

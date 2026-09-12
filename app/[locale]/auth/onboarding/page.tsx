"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  User,
  Building2,
  TreePine,
  BedDouble,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Tent,
  PawPrint,
  Compass,
  ShieldCheck,
} from "lucide-react";

export default function OnboardingPage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Account
    fullName: "Ravi Teja",
    email: "owner@rentcot.com",
    phone: "+91 98765 43210",
    password: "",

    // Step 2: Organization
    orgName: "Serenity Hospitality Group",
    orgSlug: "serenity-resorts",
    orgType: "resort" as "resort" | "farmhouse" | "camping_zone" | "villa",

    // Step 3: Property
    propertyName: "Green Valley Farmhouse & Retreat",
    city: "Shamirpet, Hyderabad",
    state: "Telangana",
    country: "India",
    checkInTime: "14:00",
    checkOutTime: "11:00",
    currency: "INR",

    // Step 4: Unit Type
    unitTypeName: "Luxury Glamping Dome with Private Plunge Pool",
    category: "tent" as "room" | "tent" | "cottage" | "dorm_bed" | "villa",
    baseCapacity: 2,
    maxCapacity: 4,
    basePrice: 6500,
    unitsCount: 4,
    petsAllowed: true,
    petFee: 500,
  });

  const steps = [
    { number: 1, title: "Owner Account", icon: User },
    { number: 2, title: "Organization", icon: Building2 },
    { number: 3, title: "First Property", icon: TreePine },
    { number: 4, title: "Unit Type", icon: BedDouble },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    // Simulate multi-tenant creation and session setup
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentStep(5); // Completion step
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="relative h-10 w-44">
            <Image
              src="/brand/rentcot-logo.png"
              alt="Rentcot Property OS"
              fill
              className="object-contain"
              priority
            />
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">
            Multi-Tenant Property Setup &bull; Launch Your Resort in 4 Steps
          </p>
        </div>

        {/* Stepper Progress Bar */}
        {currentStep <= 4 && (
          <div className="bg-card rounded-xl border border-border p-4 shadow-xs">
            <div className="flex items-center justify-between">
              {steps.map((s, idx) => {
                const Icon = s.icon;
                const isCompleted = currentStep > s.number;
                const isCurrent = currentStep === s.number;
                return (
                  <React.Fragment key={s.number}>
                    <div className="flex flex-col items-center space-y-1">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-xs transition-colors ${
                          isCompleted
                            ? "bg-rentcot-blue text-white"
                            : isCurrent
                            ? "bg-rentcot-cyan text-rentcot-dark ring-4 ring-rentcot-cyan/20"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                      </div>
                      <span className="text-[11px] font-medium hidden sm:inline text-muted-foreground">
                        {s.title}
                      </span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-2 rounded-full transition-colors ${
                          currentStep > idx + 1 ? "bg-rentcot-blue" : "bg-muted"
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* Step Card Content */}
        <Card className="border-border shadow-md">
          {currentStep === 1 && (
            <div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Step 1 of 4</Badge>
                  <span className="text-xs text-muted-foreground">Owner Credentials</span>
                </div>
                <CardTitle className="text-xl">Create Your Owner Account</CardTitle>
                <CardDescription>
                  This master account manages billing, team roles, and all resort properties.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Full Name</Label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="owner@yourresort.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Mobile Phone</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Create a secure password (min 8 chars)"
                  />
                </div>
                <div className="rounded-lg bg-rentcot-blue/5 border border-rentcot-blue/20 p-3 text-xs text-rentcot-dark flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-rentcot-blue shrink-0" />
                  <span>Your account will be secured with Supabase Auth and Row Level Security.</span>
                </div>
              </CardContent>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Step 2 of 4</Badge>
                  <span className="text-xs text-muted-foreground">Tenant Setup</span>
                </div>
                <CardTitle className="text-xl">Set Up Your Organization</CardTitle>
                <CardDescription>
                  Your tenant account. You can operate multiple resorts or campsites under this organization.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Organization / Business Legal Name</Label>
                  <Input
                    value={formData.orgName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        orgName: e.target.value,
                        orgSlug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                      })
                    }
                    placeholder="e.g. Olivemount Retreats Pvt Ltd"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Tenant Subdomain Slug</Label>
                  <div className="flex items-center">
                    <Input
                      value={formData.orgSlug}
                      onChange={(e) => setFormData({ ...formData, orgSlug: e.target.value })}
                      className="rounded-r-none"
                    />
                    <span className="inline-flex h-11 items-center px-3 text-xs bg-muted border border-l-0 border-input rounded-r-lg text-muted-foreground">
                      .rentcot.com
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Primary Hospitality Category</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "resort", label: "Resort", icon: Compass },
                      { id: "farmhouse", label: "Farmhouse", icon: TreePine },
                      { id: "camping_zone", label: "Campsite", icon: Tent },
                      { id: "villa", label: "Villa Stay", icon: Building2 },
                    ].map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = formData.orgType === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, orgType: cat.id as any })}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                            isSelected
                              ? "border-rentcot-blue bg-rentcot-blue/10 text-rentcot-blue ring-2 ring-rentcot-blue/30"
                              : "border-border hover:bg-muted text-foreground"
                          }`}
                        >
                          <Icon className="h-5 w-5 mb-1 text-rentcot-blue" />
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Step 3 of 4</Badge>
                  <span className="text-xs text-muted-foreground">Physical Location</span>
                </div>
                <CardTitle className="text-xl">Add Your First Physical Property</CardTitle>
                <CardDescription>
                  Configure the primary physical property, check-in rules, and operational currency.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Property Name</Label>
                  <Input
                    value={formData.propertyName}
                    onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                    placeholder="e.g. Wildwoods Campsite Vikarabad"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5 sm:col-span-1">
                    <Label>City / Region</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Shamirpet"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-1">
                    <Label>State</Label>
                    <Input
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="Telangana"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-1">
                    <Label>Country</Label>
                    <Input
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="India"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label>Standard Check-In</Label>
                    <Input
                      type="time"
                      value={formData.checkInTime}
                      onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Standard Check-Out</Label>
                    <Input
                      type="time"
                      value={formData.checkOutTime}
                      onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <Label>Operating Currency</Label>
                    <Input
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      placeholder="INR"
                    />
                  </div>
                </div>
              </CardContent>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Step 4 of 4</Badge>
                  <span className="text-xs text-muted-foreground">Inventory Setup</span>
                </div>
                <CardTitle className="text-xl">Add Your First Bookable Unit Type</CardTitle>
                <CardDescription>
                  Define room, tent, cottage, or dorm bed configurations with capacity and pricing.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Unit Type Name</Label>
                  <Input
                    value={formData.unitTypeName}
                    onChange={(e) => setFormData({ ...formData, unitTypeName: e.target.value })}
                    placeholder="e.g. Deluxe Glamping Dome, Pool Villa"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1.5">
                    <Label>Base Capacity</Label>
                    <Input
                      type="number"
                      min={1}
                      value={formData.baseCapacity}
                      onChange={(e) => setFormData({ ...formData, baseCapacity: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Max Capacity</Label>
                    <Input
                      type="number"
                      min={1}
                      value={formData.maxCapacity}
                      onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Base Rate / Night (₹)</Label>
                    <Input
                      type="number"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Number of Units</Label>
                    <Input
                      type="number"
                      min={1}
                      value={formData.unitsCount}
                      onChange={(e) => setFormData({ ...formData, unitsCount: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                </div>

                {/* Pet Policy Toggle */}
                <div className="p-3.5 rounded-xl border border-border bg-background space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PawPrint className="h-4 w-4 text-rentcot-blue" />
                      <div>
                        <h4 className="text-xs font-semibold">Pet Friendly Accommodation?</h4>
                        <p className="text-[11px] text-muted-foreground">Allow guests to bring pets to this unit</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.petsAllowed}
                      onChange={(e) => setFormData({ ...formData, petsAllowed: e.target.checked })}
                      className="h-5 w-5 rounded border-border text-rentcot-blue focus:ring-rentcot-blue"
                    />
                  </div>
                  {formData.petsAllowed && (
                    <div className="flex items-center gap-3 pt-2 border-t border-border">
                      <Label className="text-[11px]">Extra Pet Cleaning Fee (₹):</Label>
                      <Input
                        type="number"
                        className="w-28 h-9 text-xs"
                        value={formData.petFee}
                        onChange={(e) => setFormData({ ...formData, petFee: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </div>
          )}

          {currentStep === 5 && (
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <Sparkles className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-foreground">Welcome to Rentcot Property OS!</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  <span className="font-semibold text-foreground">{formData.orgName}</span> and{" "}
                  <span className="font-semibold text-foreground">{formData.propertyName}</span> are ready with{" "}
                  {formData.unitsCount} units created.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-muted/40 max-w-md mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Owner:</span>
                  <span className="font-semibold">{formData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property:</span>
                  <span className="font-semibold">{formData.propertyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Unit Type:</span>
                  <span className="font-semibold">{formData.unitTypeName} ({formData.unitsCount} units)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pet Policy:</span>
                  <span className="font-semibold">{formData.petsAllowed ? `Allowed (₹${formData.petFee} fee)` : "Not Allowed"}</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  onClick={() => router.push(`/${locale}`)}
                  className="w-full sm:w-auto bg-rentcot-blue hover:bg-rentcot-blue/90 text-white font-semibold"
                >
                  Enter Owner Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          {currentStep <= 4 && (
            <div className="p-5 border-t border-border flex items-center justify-between bg-muted/20">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1 || isSubmitting}
                className="text-xs"
              >
                <ArrowLeft className="mr-2 h-3.5 w-3.5" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={isSubmitting}
                className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white text-xs font-semibold"
              >
                {isSubmitting ? (
                  "Provisioning Organization..."
                ) : currentStep === 4 ? (
                  "Complete & Launch Property"
                ) : (
                  <>
                    Next Step
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </div>
          )}
        </Card>

        {/* Bottom Login Link */}
        {currentStep <= 4 && (
          <p className="text-center text-xs text-muted-foreground">
            Already have a Rentcot account?{" "}
            <Link href={`/${locale}/auth/login`} className="text-rentcot-blue font-medium hover:underline">
              Sign In to Your Dashboard
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

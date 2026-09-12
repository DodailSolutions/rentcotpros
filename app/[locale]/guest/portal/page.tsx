"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import {
  MapPin,
  Upload,
  CheckCircle2,
  CreditCard,
  Phone,
  PawPrint,
  Clock,
  ArrowRight,
  FileCheck,
  Navigation,
} from "lucide-react";

function GuestPortalContent() {
  const searchParams = useSearchParams();

  // If params are passed via WhatsApp/SMS link, auto-authenticate guest
  const initialRef = searchParams.get("ref") || "BK-8924";
  const [bookingRef, setBookingRef] = useState(initialRef);
  const [phone, setPhone] = useState("+91 98765 43210");
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Guest State
  const [idUploaded, setIdUploaded] = useState(false);
  const [idFileName, setIdFileName] = useState<string | null>(null);
  const [earlyCheckInRequested, setEarlyCheckInRequested] = useState(false);
  const [hasPets, setHasPets] = useState(true);
  const [petBreed, setPetBreed] = useState("Golden Retriever (1)");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessingPay, setIsProcessingPay] = useState(false);

  // Mock reservation data
  const reservation = {
    guestName: "Vikram Malhotra",
    bookingRef: "BK-8924",
    propertyName: "Wildwoods Glamping & Campsite",
    propertyAddress: "Ananthagiri Hills Road, Vikarabad, Telangana 501101",
    unitName: "Glamping Dome 02 (Lake View)",
    checkInDate: "Sat, Sep 19, 2026",
    checkInTime: "14:00",
    checkOutDate: "Sun, Sep 20, 2026",
    checkOutTime: "11:00",
    adults: 2,
    children: 1,
    totalAmount: 7500,
    paidAmount: 2500,
    balanceDue: 5000,
    receptionPhone: "+91 98480 22338",
  };

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdFileName(e.target.files[0].name);
      setIdUploaded(true);
    }
  };

  const handleSettlePayment = () => {
    setIsProcessingPay(true);
    setTimeout(() => {
      setIsProcessingPay(false);
      setPaymentSuccess(true);
    }, 1200);
  };

  return (
    <>
      {!isAuthenticated ? (
        <Card className="border-border shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Guest Self-Service Portal</CardTitle>
            <CardDescription className="text-xs">
              Enter your booking confirmation reference and registered mobile number
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsAuthenticated(true);
              }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label>Booking Reference</Label>
                <Input
                  required
                  placeholder="e.g. BK-8924"
                  value={bookingRef}
                  onChange={(e) => setBookingRef(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Phone Number</Label>
                <Input
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full bg-rentcot-blue hover:bg-rentcot-blue/90 text-white font-semibold text-xs">
                Access My Reservation
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Reservation Overview Card */}
          <Card className="border-border shadow-sm overflow-hidden">
            <div className="bg-rentcot-blue text-white p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest font-semibold text-rentcot-cyan">
                  Confirmed Reservation
                </span>
                <Badge variant="outline" className="text-white border-white/40 text-xs">
                  {reservation.bookingRef}
                </Badge>
              </div>
              <h2 className="text-xl font-bold tracking-tight">{reservation.propertyName}</h2>
              <p className="text-xs text-blue-100 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>{reservation.propertyAddress}</span>
              </p>
            </div>

            <CardContent className="p-5 space-y-4">
              {/* Stay Dates & Unit */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-muted/40 border border-border text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Check-In</span>
                  <strong className="text-foreground text-xs sm:text-sm">{reservation.checkInDate}</strong>
                  <span className="text-muted-foreground block text-[11px] mt-0.5">From {reservation.checkInTime}</span>
                </div>
                <div className="border-l border-border pl-3 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-3">
                  <span className="text-muted-foreground block text-[11px]">Check-Out</span>
                  <strong className="text-foreground text-xs sm:text-sm">{reservation.checkOutDate}</strong>
                  <span className="text-muted-foreground block text-[11px] mt-0.5">By {reservation.checkOutTime}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Assigned Stay:</span>
                <span className="font-semibold text-foreground">{reservation.unitName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Registered Party:</span>
                <span className="font-semibold text-foreground">
                  {reservation.adults} Adults, {reservation.children} Child
                </span>
              </div>

              {/* Quick Map Directions & Help */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("https://maps.google.com", "_blank")}
                  className="text-xs gap-1.5"
                >
                  <Navigation className="h-3.5 w-3.5 text-rentcot-blue" />
                  Get Directions
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`tel:${reservation.receptionPhone}`)}
                  className="text-xs gap-1.5"
                >
                  <Phone className="h-3.5 w-3.5 text-emerald-600" />
                  Call Reception
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Step 1: Digital ID Verification */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-rentcot-blue" />
                  Government ID Verification
                </CardTitle>
                <Badge variant={idUploaded ? "clean" : "destructive"}>
                  {idUploaded ? "Uploaded & Verified" : "Action Required"}
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Resort compliance mandates photo ID for primary guest before key handover.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {!idUploaded ? (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-rentcot-blue/50 rounded-xl p-6 cursor-pointer bg-background transition-colors">
                  <Upload className="h-7 w-7 text-rentcot-blue mb-2" />
                  <span className="text-xs font-semibold text-foreground">
                    Take Photo or Upload ID Document
                  </span>
                  <span className="text-[11px] text-muted-foreground mt-0.5">
                    Aadhaar Card, Passport, or Driver's License (JPG, PNG, PDF)
                  </span>
                  <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleIdUpload} />
                </label>
              ) : (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <div>
                      <span className="font-semibold block">{idFileName || "aadhaar_card_front.jpg"}</span>
                      <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                        Digital verification registered for contactless check-in
                      </span>
                    </div>
                  </div>
                  <label className="text-rentcot-blue text-xs font-semibold hover:underline cursor-pointer">
                    Replace
                    <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleIdUpload} />
                  </label>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 2: Payment & Outstanding Balance Settlement */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-rentcot-blue" />
                  Payment & Balance
                </CardTitle>
                <Badge variant={paymentSuccess ? "clean" : "occupied"}>
                  {paymentSuccess ? "Fully Paid" : "Balance Pending"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Booking Amount:</span>
                  <span className="font-semibold">₹{reservation.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Advance Deposit Paid:</span>
                  <span className="font-semibold text-emerald-600">
                    -₹{(paymentSuccess ? reservation.totalAmount : reservation.paidAmount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border font-bold text-sm">
                  <span>Outstanding Balance Due:</span>
                  <span className={paymentSuccess ? "text-emerald-600" : "text-amber-600"}>
                    ₹{(paymentSuccess ? 0 : reservation.balanceDue).toLocaleString()}
                  </span>
                </div>
              </div>

              {!paymentSuccess ? (
                <Button
                  onClick={handleSettlePayment}
                  disabled={isProcessingPay}
                  className="w-full bg-rentcot-blue hover:bg-rentcot-blue/90 text-white font-semibold text-xs mt-2"
                >
                  {isProcessingPay ? "Processing Secure Checkout..." : `Pay ₹${reservation.balanceDue.toLocaleString()} via UPI / Card`}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Balance cleared! Instant digital receipt generated.</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 3: Pet Policy & Preferences */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <PawPrint className="h-4 w-4 text-rentcot-blue" />
                Pets & Stay Preferences
              </CardTitle>
              <CardDescription className="text-xs">
                Tell the reception team about your arrival preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-background">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <h4 className="text-xs font-semibold">Request Early Check-in (12:00 PM)</h4>
                    <p className="text-[11px] text-muted-foreground">Subject to unit cleaning readiness</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={earlyCheckInRequested}
                  onChange={(e) => setEarlyCheckInRequested(e.target.checked)}
                  className="h-5 w-5 rounded border-border text-rentcot-blue focus:ring-rentcot-blue"
                />
              </div>

              <div className="space-y-1.5 p-3 rounded-xl border border-border bg-background">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">Traveling with Pets?</span>
                  <input
                    type="checkbox"
                    checked={hasPets}
                    onChange={(e) => setHasPets(e.target.checked)}
                    className="h-5 w-5 rounded border-border text-rentcot-blue focus:ring-rentcot-blue"
                  />
                </div>
                {hasPets && (
                  <div className="pt-2">
                    <Label className="text-[11px]">Pet Details (Breed / Count):</Label>
                    <Input
                      value={petBreed}
                      onChange={(e) => setPetBreed(e.target.value)}
                      className="h-9 text-xs mt-1"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-[11px] text-muted-foreground pt-2">
            Powered by Rentcot Property OS &bull; Contactless Resort Experience
          </p>
        </div>
      )}
    </>
  );
}

export default function GuestPortalPage() {
  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col items-center py-6 px-4">
      <div className="w-full max-w-xl space-y-5">
        {/* Top Header with Brand and Language Switcher */}
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <div className="relative h-8 w-32">
            <Image
              src="/brand/rentcot-logo.png"
              alt="Rentcot Property OS"
              fill
              className="object-contain object-left rtl:object-right"
              priority
            />
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
          </div>
        </div>

        <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading guest reservation...</div>}>
          <GuestPortalContent />
        </Suspense>
      </div>
    </div>
  );
}

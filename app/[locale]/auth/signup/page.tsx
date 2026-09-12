"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export default function SignUpPage() {
  const { locale } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [propertyCategory, setPropertyCategory] = useState("resort");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(`/${locale}/auth/onboarding`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href={`/${locale}`}>
            <div className="relative h-10 w-44">
              <Image
                src="/brand/rentcot-logo.png"
                alt="Rentcot Property OS"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <p className="text-xs text-muted-foreground">
            Start your 14-day free trial. No credit card required.
          </p>
        </div>

        <Card className="border-border shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-bold">Register Property</CardTitle>
            <CardDescription className="text-xs">
              Provision your isolated multi-tenant property environment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-3 text-xs">
              <div className="space-y-1">
                <Label className="text-xs">Your Full Name</Label>
                <Input
                  required
                  placeholder="e.g. Rahul Varma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Property / Business Name</Label>
                <Input
                  required
                  placeholder="e.g. Whispering Woods Glamping"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Property Category</Label>
                <select
                  value={propertyCategory}
                  onChange={(e) => setPropertyCategory(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-border bg-background"
                >
                  <option value="resort">Luxury Resort & Villas</option>
                  <option value="farmhouse">Private Farmhouse & Agro-Retreat</option>
                  <option value="campsite">Glamping Domes & Campsite</option>
                  <option value="multi">Multi-Property Group</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Work Email</Label>
                  <Input
                    type="email"
                    required
                    placeholder="owner@retreat.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Mobile Number</Label>
                  <Input
                    type="tel"
                    required
                    placeholder="+91 98480 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Create Password</Label>
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-rentcot-blue hover:bg-rentcot-blue/90 text-white font-semibold text-xs h-10 mt-3"
              >
                {loading ? "Setting Up..." : "Start 14-Day Free Trial"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Already registered?</span>
              <Link
                href={`/${locale}/auth/login`}
                className="text-rentcot-blue font-semibold hover:underline"
              >
                Sign In Instead &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Encrypted with Row Level Security & HTTPS</span>
        </div>
      </div>
    </div>
  );
}

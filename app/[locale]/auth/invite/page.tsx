"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, ArrowRight, Building2 } from "lucide-react";

function InviteForm() {
  const { locale } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  const role = searchParams.get("role") || "frontdesk";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push(`/${locale}`);
    }, 1000);
  };

  return (
    <Card className="border-border shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="clean" className="capitalize text-xs font-semibold">
            Role: {role}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Building2 className="h-3.5 w-3.5 text-rentcot-blue" />
            <span>Serenity Resorts</span>
          </div>
        </div>
        <CardTitle className="text-xl font-bold mt-2">Join Your Property Team</CardTitle>
        <CardDescription className="text-xs">
          Set your account password to activate your access to the front-desk operations dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAccept} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Your Full Name</Label>
            <Input defaultValue="Staff Member" readOnly className="bg-muted/50 cursor-not-allowed text-xs" />
          </div>

          <div className="space-y-1.5">
            <Label>Create Password</Label>
            <Input
              type="password"
              required
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Confirm Password</Label>
            <Input
              type="password"
              required
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="p-3 rounded-lg bg-rentcot-blue/5 border border-rentcot-blue/20 text-xs text-rentcot-dark flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-rentcot-blue shrink-0" />
            <span>Your access is limited to your assigned role ({role}) and properties.</span>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || password.length < 6}
            className="w-full bg-rentcot-blue hover:bg-rentcot-blue/90 text-white font-semibold text-xs"
          >
            {isSubmitting ? "Activating Access..." : "Accept Invitation & Enter"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function AcceptInvitePage() {
  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
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
          <p className="text-xs text-muted-foreground">Team Member Invitation Acceptance</p>
        </div>

        <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading invitation...</div>}>
          <InviteForm />
        </Suspense>
      </div>
    </div>
  );
}

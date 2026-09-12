"use client";

import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Mail,
  Phone,
  Shield,
  Building,
  Copy,
  Check,
  Share2,
  UserPlus,
} from "lucide-react";
import type { UserRole } from "@/types/auth";

interface InviteStaffDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteStaffDialog({ isOpen, onClose }: InviteStaffDialogProps) {
  const { t, locale } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [inviteGenerated, setInviteGenerated] = useState(false);

  const [form, setForm] = useState({
    name: "",
    emailOrPhone: "",
    role: "frontdesk" as UserRole,
    allProperties: true,
    selectedProperties: ["prop-1"] as string[],
  });

  const availableProperties = [
    { id: "prop-1", name: "Green Valley Farmhouse (Shamirpet)" },
    { id: "prop-2", name: "Wildwoods Campsite (Vikarabad)" },
    { id: "prop-3", name: "Palm Oasis Luxury Resort (Gandipet)" },
  ];

  const roles: { role: UserRole; title: string; desc: string }[] = [
    { role: "manager", title: "General Manager", desc: "Operates assigned properties, manages staff & inventory (no billing)" },
    { role: "frontdesk", title: "Front Desk / Receptionist", desc: "Reservation calendar, guest check-in/out, POS orders" },
    { role: "housekeeping", title: "Housekeeping / Maintenance", desc: "Room cleaning status board, turnover checklist, linen consumption" },
    { role: "hr", title: "HR & Payroll Staff", desc: "Employee rosters, attendance, salary disbursement" },
    { role: "event_coordinator", title: "Event Coordinator", desc: "Banquet lawn, wedding & day-outing slot bookings" },
  ];

  const generatedInviteLink = typeof window !== "undefined"
    ? `${window.location.origin}/${locale}/auth/invite?token=inv_98f4a21e7d9b01&role=${form.role}`
    : `https://rentcot.com/${locale}/auth/invite?token=inv_demo`;

  const handleGenerateInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteGenerated(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedInviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Hi ${form.name || "there"}, you have been invited to join the Rentcot Property OS team as ${form.role}. Click here to set up your account: ${generatedInviteLink}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rentcot-blue/10 text-rentcot-blue">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Invite Team Member</h3>
              <p className="text-xs text-muted-foreground">Assign role and property permissions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {!inviteGenerated ? (
            <form onSubmit={handleGenerateInvite} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Staff Member Name</Label>
                <Input
                  required
                  placeholder="e.g. Suresh Kumar"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Email or WhatsApp Mobile Number</Label>
                <Input
                  required
                  placeholder="suresh@resort.com or +91 9876543210"
                  value={form.emailOrPhone}
                  onChange={(e) => setForm({ ...form, emailOrPhone: e.target.value })}
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label>Assign System Role (RBAC)</Label>
                <div className="grid grid-cols-1 gap-2">
                  {roles.map((r) => {
                    const isSelected = form.role === r.role;
                    return (
                      <div
                        key={r.role}
                        onClick={() => setForm({ ...form, role: r.role })}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? "border-rentcot-blue bg-rentcot-blue/5 ring-1 ring-rentcot-blue"
                            : "border-border hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">{r.title}</span>
                          <Badge variant={isSelected ? "default" : "outline"} className="text-[10px]">
                            {r.role}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{r.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Property Scope */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <Label>Property Access Scope</Label>
                  <label className="flex items-center gap-1.5 text-xs font-normal cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.allProperties}
                      onChange={(e) => setForm({ ...form, allProperties: e.target.checked })}
                      className="rounded border-border text-rentcot-blue focus:ring-rentcot-blue"
                    />
                    <span>All Properties</span>
                  </label>
                </div>

                {!form.allProperties && (
                  <div className="space-y-1.5 p-3 rounded-xl border border-border bg-muted/30">
                    <span className="text-[11px] font-medium text-muted-foreground">Select authorized properties:</span>
                    {availableProperties.map((p) => {
                      const isChecked = form.selectedProperties.includes(p.id);
                      return (
                        <label key={p.id} className="flex items-center gap-2 text-xs cursor-pointer py-1">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setForm({ ...form, selectedProperties: [...form.selectedProperties, p.id] });
                              } else {
                                setForm({
                                  ...form,
                                  selectedProperties: form.selectedProperties.filter((id) => id !== p.id),
                                });
                              }
                            }}
                            className="rounded border-border text-rentcot-blue focus:ring-rentcot-blue"
                          />
                          <span>{p.name}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white text-xs font-semibold">
                  Generate Invitation Link
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-1">
                <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                  Invitation Created for {form.name}
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Assigned as <strong>{form.role.toUpperCase()}</strong> &bull; Valid for 7 days
                </p>
              </div>

              <div className="space-y-1.5">
                <Label>Direct Access Link</Label>
                <div className="flex items-center gap-2">
                  <Input readOnly value={generatedInviteLink} className="text-xs font-mono select-all" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCopyLink}
                    className="shrink-0 text-xs gap-1"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold gap-1.5"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Send via WhatsApp
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setInviteGenerated(false);
                    onClose();
                  }}
                  className="text-xs"
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

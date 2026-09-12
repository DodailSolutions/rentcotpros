"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Globe,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Settings,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Search,
  ExternalLink,
  Plus,
  Sliders,
  Share2,
} from "lucide-react";
import type { OTAChannel } from "@/lib/ota/types";

export default function ChannelsPage() {
  const { t } = useTranslation();
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  // Active OTA Channels State
  const [channels, setChannels] = useState([
    {
      id: "airbnb",
      name: "Airbnb",
      category: "Homestays & Villas",
      hotelId: "ABNB_88924",
      status: "active" as const,
      lastSync: "3 mins ago",
      mappedUnits: 4,
      markupPercent: 12,
      color: "border-[#ff5a5f]/40 bg-[#ff5a5f]/5 text-[#ff5a5f]",
      badgeBg: "bg-[#ff5a5f] text-white",
      icon: "/brand/rentcot-icon.png",
    },
    {
      id: "booking_com",
      name: "Booking.com",
      category: "Global Travel OTA",
      hotelId: "BCOM_44102",
      status: "active" as const,
      lastSync: "8 mins ago",
      mappedUnits: 6,
      markupPercent: 15,
      color: "border-[#003580]/40 bg-[#003580]/5 text-[#003580]",
      badgeBg: "bg-[#003580] text-white",
      icon: "/brand/rentcot-icon.png",
    },
    {
      id: "makemytrip",
      name: "MakeMyTrip",
      category: "India Domestic OTA",
      hotelId: "MMT_7721",
      status: "active" as const,
      lastSync: "12 mins ago",
      mappedUnits: 6,
      markupPercent: 15,
      color: "border-[#ea2330]/40 bg-[#ea2330]/5 text-[#ea2330]",
      badgeBg: "bg-[#ea2330] text-white",
      icon: "/brand/rentcot-icon.png",
    },
    {
      id: "agoda",
      name: "Agoda",
      category: "Asia-Pacific OTA",
      hotelId: "AGD_3019",
      status: "active" as const,
      lastSync: "15 mins ago",
      mappedUnits: 4,
      markupPercent: 14,
      color: "border-[#00a699]/40 bg-[#00a699]/5 text-[#00a699]",
      badgeBg: "bg-[#00a699] text-white",
      icon: "/brand/rentcot-icon.png",
    },
    {
      id: "goibibo",
      name: "Goibibo",
      category: "IngoMMT Network",
      hotelId: "GIB_9182",
      status: "paused" as const,
      lastSync: "Yesterday",
      mappedUnits: 2,
      markupPercent: 15,
      color: "border-orange-300 bg-orange-50 text-orange-700",
      badgeBg: "bg-orange-600 text-white",
      icon: "/brand/rentcot-icon.png",
    },
    {
      id: "vrbo",
      name: "Vrbo",
      category: "Expedia Vacation Rentals",
      hotelId: "VRBO_5510",
      status: "disconnected" as const,
      lastSync: "Never",
      mappedUnits: 0,
      markupPercent: 10,
      color: "border-slate-300 bg-slate-50 text-slate-700",
      badgeBg: "bg-slate-600 text-white",
      icon: "/brand/rentcot-icon.png",
    },
  ]);

  // Rate Parity Audit Watchdog
  const [parityDiscrepancies, setParityDiscrepancies] = useState([
    {
      channel: "Agoda",
      room: "Deluxe Lake View Cottage",
      date: "Sep 22, 2026",
      directPrice: 5500,
      otaPrice: 4890,
      diff: -610,
      diffPercent: -11,
      risk: "high" as const,
      reason: "Agoda Private Member Promotion automatically applied",
    },
    {
      channel: "MakeMyTrip",
      room: "Glamping Dome 02",
      date: "Sep 25, 2026",
      directPrice: 6500,
      otaPrice: 5900,
      diff: -600,
      diffPercent: -9,
      risk: "high" as const,
      reason: "MMT App Flash Discount active on Friday",
    },
    {
      channel: "Booking.com",
      room: "Executive Farmhouse Villa",
      date: "Sep 28, 2026",
      directPrice: 12000,
      otaPrice: 13500,
      diff: +1500,
      diffPercent: +12.5,
      risk: "medium" as const,
      reason: "Markup percentage (+15%) higher than direct website",
    },
  ]);

  // Sync Event Logs
  const [syncLogs, setSyncLogs] = useState([
    {
      id: "log-1",
      channel: "Airbnb",
      direction: "pull_bookings",
      status: "success" as const,
      summary: "Imported 1 reservation (ABNB-99882) for Rohit Sharma. Physical unit 101 locked.",
      latency: "42ms",
      time: "2 mins ago",
    },
    {
      id: "log-2",
      channel: "Booking.com",
      direction: "push_availability",
      status: "success" as const,
      summary: "Closed availability on Unit 101 for Sep 20-22 across Booking.com.",
      latency: "38ms",
      time: "2 mins ago",
    },
    {
      id: "log-3",
      channel: "MakeMyTrip",
      direction: "push_rates",
      status: "success" as const,
      summary: "Pushed 30-day rate matrix with +15% commission offset markup.",
      latency: "65ms",
      time: "12 mins ago",
    },
    {
      id: "log-4",
      channel: "Agoda",
      direction: "rate_parity_check",
      status: "warning" as const,
      summary: "Parity discrepancy detected on Deluxe Lake View Cottage (OTA undercutting by 11%).",
      latency: "112ms",
      time: "25 mins ago",
    },
    {
      id: "log-5",
      channel: "Goibibo",
      direction: "push_availability",
      status: "failed" as const,
      summary: "API session token expired (Error 401: Unauthorized). Re-authentication required.",
      latency: "210ms",
      time: "1 hour ago",
    },
  ]);

  const handleSyncAll = () => {
    setIsSyncingAll(true);
    setSyncSuccessMsg(null);
    setTimeout(() => {
      setIsSyncingAll(false);
      setSyncSuccessMsg("All active OTA channels synchronized! Rates and inventory updated.");
      setSyncLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          channel: "All Channels",
          direction: "push_rates",
          status: "success",
          summary: "Bulk push: Synchronized 30-day rates and availability across Airbnb, Booking.com, MMT, and Agoda.",
          latency: "74ms",
          time: "Just now",
        },
        ...prev,
      ]);
    }, 1200);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              OTA Channel Manager
            </h1>
            <Badge variant="clean" className="flex items-center gap-1 text-[11px] font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Double-Booking Lock Active
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Two-way sync with Airbnb, Booking.com, MakeMyTrip, Agoda & Goibibo
          </p>
        </div>

        {/* Global Sync Action Button */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSyncAll}
            disabled={isSyncingAll}
            className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white font-semibold text-xs gap-2"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncingAll ? "animate-spin" : ""}`} />
            <span>{isSyncingAll ? "Synchronizing Channels..." : "Sync All Channels Now"}</span>
          </Button>
        </div>
      </div>

      {syncSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{syncSuccessMsg}</span>
          </div>
          <button onClick={() => setSyncSuccessMsg(null)} className="text-xs text-muted-foreground hover:text-foreground">
            &times;
          </button>
        </div>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="channels" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="channels" className="text-xs gap-1.5">
            <Globe className="h-3.5 w-3.5" />
            Connectors ({channels.filter((c) => c.status === "active").length})
          </TabsTrigger>
          <TabsTrigger value="parity" className="text-xs gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" />
            Rate Parity ({parityDiscrepancies.length})
          </TabsTrigger>
          <TabsTrigger value="logs" className="text-xs gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Sync Logs
          </TabsTrigger>
        </TabsList>

        {/* 1. Channel Connectors Tab */}
        <TabsContent value="channels" className="pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {channels.map((chan) => (
              <Card key={chan.id} className="border-border shadow-xs hover:border-rentcot-blue/40 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold text-sm ${chan.color}`}>
                        {chan.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold">{chan.name}</CardTitle>
                        <span className="text-[11px] text-muted-foreground">{chan.category}</span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        chan.status === "active"
                          ? "clean"
                          : chan.status === "paused"
                          ? "occupied"
                          : "destructive"
                      }
                      className="capitalize text-[10px]"
                    >
                      {chan.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-muted/30 border border-border">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Hotel / Property ID</span>
                      <span className="font-mono font-semibold text-foreground text-xs">{chan.hotelId}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Mapped Units</span>
                      <span className="font-semibold text-foreground">{chan.mappedUnits} Unit Types</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">OTA Markup</span>
                      <span className="font-semibold text-rentcot-blue">+{chan.markupPercent}% markup</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Last Synced</span>
                      <span className="text-muted-foreground">{chan.lastSync}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button
                      type="button"
                      className="text-rentcot-blue font-semibold hover:underline flex items-center gap-1"
                    >
                      <Settings className="h-3 w-3" />
                      Configure Mapping
                    </button>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={chan.status === "active"}
                        onChange={() => {
                          setChannels((prev) =>
                            prev.map((c) =>
                              c.id === chan.id
                                ? { ...c, status: c.status === "active" ? "paused" : "active" }
                                : c
                            )
                          );
                        }}
                        className="rounded border-border text-rentcot-blue focus:ring-rentcot-blue"
                      />
                      <span className="text-[11px] text-muted-foreground">Auto-Sync</span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 2. Rate Parity Watchdog Tab */}
        <TabsContent value="parity" className="pt-4 space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Live Rate Parity Watchdog
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Detects discrepancies between Rentcot Best Available Rates and live OTA listing prices to prevent penalties
                  </CardDescription>
                </div>
                <Badge variant="occupied" className="text-xs font-semibold">
                  {parityDiscrepancies.length} Discrepancies Flagged
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {parityDiscrepancies.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-border bg-background hover:border-rentcot-blue/40 transition-colors space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-bold text-xs">
                          {item.channel}
                        </Badge>
                        <h4 className="text-sm font-bold text-foreground">{item.room}</h4>
                        <span className="text-xs text-muted-foreground">&bull; {item.date}</span>
                      </div>

                      <Badge variant={item.risk === "high" ? "destructive" : "occupied"} className="text-[10px]">
                        {item.risk === "high" ? "High Penalty Risk" : "Margin Variance"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-muted/40 border border-border text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Rentcot Direct Rate:</span>
                        <strong className="text-foreground">₹{item.directPrice.toLocaleString()}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Live OTA Price:</span>
                        <strong className={item.diff < 0 ? "text-rose-600" : "text-emerald-600"}>
                          ₹{item.otaPrice.toLocaleString()}
                        </strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Variance:</span>
                        <strong className={item.diff < 0 ? "text-rose-600 font-mono" : "text-emerald-600 font-mono"}>
                          {item.diff < 0 ? `₹${item.diff} (${item.diffPercent}%)` : `+₹${item.diff} (+${item.diffPercent}%)`}
                        </strong>
                      </div>
                      <div className="flex items-center sm:justify-end">
                        <Button
                          size="sm"
                          className="h-8 text-[11px] bg-rentcot-blue hover:bg-rentcot-blue/90 text-white"
                          onClick={() => {
                            setParityDiscrepancies((prev) => prev.filter((_, i) => i !== idx));
                          }}
                        >
                          Auto-Fix Parity
                        </Button>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground italic">
                      Cause: {item.reason}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Sync Event Logs Tab */}
        <TabsContent value="logs" className="pt-4 space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold">Sync Event Audit History</CardTitle>
                  <CardDescription className="text-xs">
                    Auditable push/pull event log with latency and status diagnostics
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSyncAll}
                  className="text-xs gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  Refresh Logs
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {syncLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-border bg-background hover:bg-muted/30 transition-colors gap-2 text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {log.status === "success" ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : log.status === "warning" ? (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-rose-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-foreground">{log.channel}</strong>
                          <Badge variant="outline" className="text-[10px] font-mono">
                            {log.direction}
                          </Badge>
                          <span className="text-[10px] font-mono text-muted-foreground">{log.latency}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{log.summary}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 sm:self-center ml-7 sm:ml-0">
                      <span className="text-[10px] text-muted-foreground">{log.time}</span>
                      {log.status === "failed" && (
                        <Button size="sm" variant="destructive" className="h-7 text-[10px]">
                          Retry Sync
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  Download,
  Calendar,
  DollarSign,
  PieChart,
  BedDouble,
  Building,
} from "lucide-react";

export default function ReportsPage() {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "mtd" | "ytd">("mtd");

  const channelStats = [
    { name: "Direct Bookings (Website + Walk-in)", percentage: 46, revenue: 223560, color: "bg-rentcot-blue" },
    { name: "Airbnb", percentage: 24, revenue: 116640, color: "bg-[#FF5A5F]" },
    { name: "Booking.com", percentage: 18, revenue: 87480, color: "bg-[#003580]" },
    { name: "MakeMyTrip & Goibibo", percentage: 12, revenue: 58320, color: "bg-[#EB2226]" },
  ];

  const categoryBreakdown = [
    { category: "Room & Tent Night Stays", amount: 345000, percentage: 71 },
    { category: "Events & Lawn Bookings", amount: 82000, percentage: 17 },
    { category: "F&B, POS & Campfire Kits", amount: 44000, percentage: 9 },
    { category: "Activities (ATV / Kayaking)", amount: 15000, percentage: 3 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {t("nav.reports", "Reports & Revenue Analytics")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Financial performance, occupancy metrics, ADR, RevPAR, and OTA channel contribution.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="min-h-[44px]">
            <Download className="h-4 w-4 mr-1.5" />
            <span>Export Financial GST Report</span>
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs text-muted-foreground">September MTD Revenue</span>
            <div className="text-xl sm:text-2xl font-bold text-foreground mt-1">₹4,86,000</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5 mt-1">
              <TrendingUp className="h-3 w-3" /> +18.4% vs last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs text-muted-foreground">Average Occupancy</span>
            <div className="text-xl sm:text-2xl font-bold text-foreground mt-1">84.6%</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5 mt-1">
              <TrendingUp className="h-3 w-3" /> Peak weekend: 100%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs text-muted-foreground">ADR (Average Daily Rate)</span>
            <div className="text-xl sm:text-2xl font-bold text-foreground mt-1">₹6,450</div>
            <div className="text-[11px] text-rentcot-blue font-medium mt-1">
              Rooms ₹7,200 • Tents ₹3,800
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs text-muted-foreground">RevPAR</span>
            <div className="text-xl sm:text-2xl font-bold text-foreground mt-1">₹5,456</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5 mt-1">
              <TrendingUp className="h-3 w-3" /> +12.1% YoY
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Channel Breakdown & Category Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OTA Channel Contribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <PieChart className="h-4 w-4 text-rentcot-blue" />
              <span>Channel Share of Revenue</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Direct bookings generate the highest net margin (zero OTA commission).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {channelStats.map((ch) => (
              <div key={ch.name} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">{ch.name}</span>
                  <span className="font-bold text-foreground">
                    ₹{ch.revenue.toLocaleString()} ({ch.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${ch.color}`}
                    style={{ width: `${ch.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Revenue Streams */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-rentcot-blue" />
              <span>Revenue by Department</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Breakdown across lodging, banquets, F&B POS, and activities.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryBreakdown.map((cat) => (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">{cat.category}</span>
                  <span className="font-bold text-foreground">
                    ₹{cat.amount.toLocaleString()} ({cat.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-rentcot-blue"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

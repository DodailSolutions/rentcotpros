"use client";

import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  UserCheck,
  UserPlus,
  Clock,
  Banknote,
  Calendar,
  Shield,
  Phone,
  Mail,
  MoreVertical,
} from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  role: "General Manager" | "Receptionist" | "Head Housekeeper" | "Housekeeper" | "Chef" | "Security";
  phone: string;
  email: string;
  property: string;
  shift: string;
  status: "on_shift" | "off_duty" | "on_leave";
  monthlySalary: number;
  attendanceDays: number;
}

const staffList: StaffMember[] = [
  {
    id: "EMP-101",
    name: "Rajesh Sharma",
    role: "General Manager",
    phone: "+91 98490 11223",
    email: "rajesh.m@rentcot-resorts.com",
    property: "All Properties",
    shift: "09:00 AM – 06:00 PM",
    status: "on_shift",
    monthlySalary: 65000,
    attendanceDays: 24,
  },
  {
    id: "EMP-102",
    name: "Kavita Nair",
    role: "Receptionist",
    phone: "+91 99001 55443",
    email: "kavita.n@rentcot-resorts.com",
    property: "Green Valley Farmhouse",
    shift: "07:00 AM – 03:30 PM (Morning)",
    status: "on_shift",
    monthlySalary: 28000,
    attendanceDays: 23,
  },
  {
    id: "EMP-103",
    name: "Ramesh Kumar",
    role: "Head Housekeeper",
    phone: "+91 94401 22334",
    email: "ramesh.k@rentcot-resorts.com",
    property: "Green Valley Farmhouse",
    shift: "08:00 AM – 04:30 PM",
    status: "on_shift",
    monthlySalary: 24000,
    attendanceDays: 25,
  },
  {
    id: "EMP-104",
    name: "Lakshmi S.",
    role: "Housekeeper",
    phone: "+91 91234 56789",
    email: "lakshmi.s@rentcot-resorts.com",
    property: "Palm Oasis Resort",
    shift: "08:00 AM – 04:30 PM",
    status: "on_shift",
    monthlySalary: 18000,
    attendanceDays: 22,
  },
  {
    id: "EMP-105",
    name: "Chef Anjaneya",
    role: "Chef",
    phone: "+91 98881 23456",
    email: "chef.a@rentcot-resorts.com",
    property: "Palm Oasis Resort",
    shift: "11:00 AM – 09:30 PM (Split)",
    status: "off_duty",
    monthlySalary: 38000,
    attendanceDays: 21,
  },
];

export default function HRPage() {
  const { t } = useTranslation();

  const getStatusBadge = (status: StaffMember["status"]) => {
    switch (status) {
      case "on_shift":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white gap-1 text-[11px]"><UserCheck className="h-3 w-3" /> On Shift</Badge>;
      case "off_duty":
        return <Badge variant="secondary" className="gap-1 text-[11px]"><Clock className="h-3 w-3" /> Off Duty</Badge>;
      case "on_leave":
        return <Badge variant="destructive" className="gap-1 text-[11px]">On Leave</Badge>;
    }
  };

  const totalPayroll = staffList.reduce((acc, s) => acc + s.monthlySalary, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {t("nav.hr", "Staff, Shifts & Payroll Roster")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage resort staff shifts, daily attendance, payroll calculations, and role permissions.
          </p>
        </div>
        <Button className="bg-rentcot-blue hover:bg-rentcot-blue/90 text-white min-h-[44px]">
          <UserPlus className="h-4 w-4 mr-1.5" />
          <span>Add / Invite Staff</span>
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs text-muted-foreground">Total Staff</span>
            <div className="text-xl sm:text-2xl font-bold text-foreground mt-1">5 Active</div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">4 On-Shift Now</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs text-muted-foreground">Estimated Monthly Payroll</span>
            <div className="text-xl sm:text-2xl font-bold text-foreground mt-1">₹{totalPayroll.toLocaleString()}</div>
            <span className="text-[11px] text-muted-foreground">Excl. OT & Tips</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs text-muted-foreground">Avg Attendance</span>
            <div className="text-xl sm:text-2xl font-bold text-foreground mt-1">94.2%</div>
            <span className="text-[11px] text-rentcot-blue font-medium">Biometric & Geo-fenced</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs text-muted-foreground">Current Shift</span>
            <div className="text-xl sm:text-2xl font-bold text-foreground mt-1">Morning Shift</div>
            <span className="text-[11px] text-muted-foreground">Ends 3:30 PM</span>
          </CardContent>
        </Card>
      </div>

      {/* Staff Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffList.map((emp) => (
          <Card key={emp.id} className="hover:border-primary/50 transition-colors">
            <CardContent className="p-4 sm:p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-base text-foreground">{emp.name}</h3>
                  <Badge variant="outline" className="text-xs mt-1 text-rentcot-blue border-rentcot-blue/30 bg-rentcot-blue/5">
                    {emp.role}
                  </Badge>
                </div>
                {getStatusBadge(emp.status)}
              </div>

              <div className="space-y-1 text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-lg">
                <div className="flex justify-between">
                  <span>Assigned Property:</span>
                  <span className="font-semibold text-foreground">{emp.property}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shift Schedule:</span>
                  <span className="font-mono text-foreground">{emp.shift}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Base Salary:</span>
                  <span className="font-bold text-rentcot-blue">₹{emp.monthlySalary.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2 border-t border-border">
                <a
                  href={`tel:${emp.phone}`}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>{emp.phone}</span>
                </a>
                <span className="text-xs text-muted-foreground">
                  Days: <span className="font-bold text-foreground">{emp.attendanceDays}/30</span>
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

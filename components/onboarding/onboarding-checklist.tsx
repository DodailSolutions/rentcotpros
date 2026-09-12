"use client";

import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  X,
  UserPlus,
  MessageSquare,
  BedDouble,
  QrCode,
} from "lucide-react";

interface OnboardingChecklistProps {
  onOpenInviteModal?: () => void;
}

export function OnboardingChecklist({ onOpenInviteModal }: OnboardingChecklistProps) {
  const { t, locale } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  const [tasks, setTasks] = useState([
    {
      id: "org_setup",
      title: "Organization & Physical Property Created",
      description: "Organization profile, address, and check-in/out hours configured",
      completed: true,
      actionLabel: null,
      action: null,
    },
    {
      id: "units_setup",
      title: "First Bookable Unit Type Configured",
      description: "Glamping Domes defined with base capacity, rates, and pet policy",
      completed: true,
      actionLabel: null,
      action: null,
    },
    {
      id: "invite_staff",
      title: "Invite Receptionist or Manager",
      description: "Grant RBAC permissions to front-desk staff or property manager",
      completed: false,
      actionLabel: "Invite Team",
      action: onOpenInviteModal,
      icon: UserPlus,
    },
    {
      id: "guest_comms",
      title: "Enable WhatsApp Guest Portal Links",
      description: "Send automated check-in links and balance payment URLs to guests",
      completed: false,
      actionLabel: "Test Portal",
      href: `/${locale}/guest/portal`,
      icon: MessageSquare,
    },
    {
      id: "first_booking",
      title: "Record First Walk-In or Direct Reservation",
      description: "Test express check-in, guest party composition, and instant room assignment",
      completed: false,
      actionLabel: "New Booking",
      href: `/${locale}/bookings`,
      icon: QrCode,
    },
  ]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  if (isDismissed) return null;

  return (
    <div className="rounded-2xl border border-rentcot-blue/20 bg-card p-4 sm:p-5 shadow-sm transition-all">
      {/* Header / Summary Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rentcot-blue/10 text-rentcot-blue">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm md:text-base font-bold text-foreground">
                Property Launch Checklist
              </h3>
              <Badge variant="clean" className="text-[11px] font-semibold">
                {completedCount} of {tasks.length} Done ({progressPercent}%)
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Follow these recommended steps to get your resort fully operational
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted"
            aria-label="Toggle checklist"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted"
            aria-label="Dismiss checklist"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-muted rounded-full mt-3 overflow-hidden">
        <div
          className="h-full bg-rentcot-blue transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Collapsible Task Items */}
      {isExpanded && (
        <div className="mt-4 space-y-2.5 pt-2 border-t border-border">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-start justify-between p-3 rounded-xl border transition-colors ${
                task.completed
                  ? "bg-muted/30 border-border/60 text-muted-foreground"
                  : "bg-background border-border hover:border-rentcot-blue/40 text-foreground"
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className="mt-0.5 text-rentcot-blue focus:outline-none"
                  aria-label="Toggle completion"
                >
                  {task.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground hover:text-rentcot-blue" />
                  )}
                </button>
                <div>
                  <h4 className={`text-xs sm:text-sm font-semibold ${task.completed ? "line-through" : ""}`}>
                    {task.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{task.description}</p>
                </div>
              </div>

              {task.actionLabel && !task.completed && (
                <div className="ml-3 shrink-0">
                  {task.href ? (
                    <a
                      href={task.href}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-rentcot-blue hover:underline bg-rentcot-blue/10 px-3 py-1.5 rounded-lg"
                    >
                      {task.actionLabel}
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  ) : (
                    <Button
                      size="sm"
                      onClick={task.action || undefined}
                      className="h-8 text-xs bg-rentcot-blue hover:bg-rentcot-blue/90 text-white font-semibold"
                    >
                      {task.actionLabel}
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

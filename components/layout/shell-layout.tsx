"use client";

import React, { useState } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { InviteStaffDialog } from "@/components/team/invite-staff-dialog";

export function ShellLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onOpenInviteModal={() => setIsInviteModalOpen(true)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-secondary/30">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* Global Staff Invite Modal */}
      <InviteStaffDialog
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  );
}

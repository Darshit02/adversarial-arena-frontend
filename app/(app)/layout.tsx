"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/app/Sidebar";
import { TopBar } from "@/components/app/TopBar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex">
      {/* 240px collapsible sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      {/* Main 1fr section */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 max-w-[1440px] w-full mx-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

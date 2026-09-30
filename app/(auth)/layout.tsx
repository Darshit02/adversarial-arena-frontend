import React from "react";
import { BrandPanel } from "@/components/auth/BrandPanel";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex bg-[var(--bg-base)]">
      {/* Left (60%, full-width on mobile): Auth Form */}
      <div className="w-full lg:w-[60%] flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Right (40%, hidden <lg): BrandPanel */}
      <div className="hidden lg:block lg:w-[40%] h-screen sticky top-0">
        <BrandPanel />
      </div>
    </div>
  );
}

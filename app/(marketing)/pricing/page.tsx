import React from "react";
import { PricingTeaser } from "@/components/marketing/PricingTeaser";
import { FAQ } from "@/components/marketing/FAQ";

export default function PricingPage() {
  return (
    <div className="py-12">
      <PricingTeaser />
      <FAQ />
    </div>
  );
}

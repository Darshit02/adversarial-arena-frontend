"use client";

import React from "react";
import { motion } from "framer-motion";
import { Hero } from "@/components/marketing/Hero";
import { HeroVisual } from "@/components/marketing/HeroVisual";
import { LogoStrip } from "@/components/marketing/LogoStrip";
import { ProblemSolution } from "@/components/marketing/ProblemSolution";
import { FeatureBento } from "@/components/marketing/FeatureBento";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Research } from "@/components/marketing/Research";
import { PricingTeaser } from "@/components/marketing/PricingTeaser";
import { FAQ } from "@/components/marketing/FAQ";
import { FinalCTA } from "@/components/marketing/FinalCTA";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function MarketingLandingPage() {
  return (
    <div className="w-full overflow-hidden">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Hero Visual Section with Parallax */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <HeroVisual />
      </motion.div>

      {/* 3. Logo Strip */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <LogoStrip />
      </motion.div>

      {/* 4. Problem & Solution Comparison */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <ProblemSolution />
      </motion.div>

      {/* 5. Feature Bento */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <FeatureBento />
      </motion.div>

      {/* 6. How It Works */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <HowItWorks />
      </motion.div>

      {/* 7. Published Research */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <Research />
      </motion.div>

      {/* 8. Pricing Teaser */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <PricingTeaser />
      </motion.div>

      {/* 9. FAQ */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <FAQ />
      </motion.div>

      {/* 10. Final CTA */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <FinalCTA />
      </motion.div>
    </div>
  );
}

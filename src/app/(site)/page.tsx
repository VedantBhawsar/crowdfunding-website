"use client";
import React from "react";
import HeroSection from "@/components/landing/HeroSection";
import FeatureSection from "@/components/landing/FeatureSection";
import CTASection from "@/components/landing/CTASection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import SecuritySection from "@/components/landing/SecuritySection";
import { TestimonialSection } from "@/components/landing/TestimonialSection";

const LandingPage = () => {
  return (
    <div className="min-h-full mt-10 ">
      <HeroSection />
      <FeatureSection />
      <SecuritySection />
      <HowItWorksSection />
      <TestimonialSection />
      <CTASection />
    </div>
  );
};

export default LandingPage;

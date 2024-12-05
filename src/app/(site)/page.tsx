import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CarIcon, UsersIcon, ShieldCheckIcon, RocketIcon } from "lucide-react";
import HeroSection from "@/components/landing/HeroSection";
import FeatureSection from "@/components/landing/FeatureSection";
import CTASection from "@/components/landing/CTASection";
import HowItWorksSection  from "@/components/landing/HowItWorksSection";
import SecuritySection from "@/components/landing/SecuritySection";
import { TestimonialSection } from "@/components/landing/TestimonialSection";

const LandingPage = () => {
  return (
    <div className="min-h-full">
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

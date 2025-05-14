'use client';
import React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import ServicesSection from '@/components/landing/ServicesSection';
import StatsSection from '@/components/landing/StatsSection';
import PricingSection from '@/components/landing/PricingSection';
import IntegrationSection from '@/components/landing/IntegrationSection';
import Footer from '@/components/footer';

const LandingPage = () => {
  return (
    <div className="min-h-full">
      <HeroSection />
      <ServicesSection />
      <StatsSection />

      <PricingSection />
      <IntegrationSection />
      <Footer />
    </div>
  );
};

export default LandingPage;

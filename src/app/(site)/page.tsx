import React from 'react';
import dynamic from 'next/dynamic';

const HeroSection = dynamic(() => import('@/components/landing/HeroSection'), { ssr: false });
const ServicesSection = dynamic(() => import('@/components/landing/ServicesSection'), {
  ssr: false,
});
const StatsSection = dynamic(() => import('@/components/landing/StatsSection'), { ssr: false });
const PricingSection = dynamic(() => import('@/components/landing/PricingSection'), { ssr: false });
const IntegrationSection = dynamic(() => import('@/components/landing/IntegrationSection'), {
  ssr: false,
});
const Footer = dynamic(() => import('@/components/footer'), { ssr: false });

const LandingPage = () => {
  return (
    <div className="min-h-full flex flex-col mt-5">
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

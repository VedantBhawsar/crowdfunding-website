'use client';
import React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/footer';

const LandingPage = () => {
  return (
    <div className="min-h-full mt-10 ">
      <HeroSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;

'use client';
import React, { createContext, useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { CustomCursor } from '@/components/CustomCursor';
import {
  ArrowRight,
  Star,
  Settings2,
  MoveRight,
  FileText,
  BarChartBig,
  Waves,
  TrendingUp,
  Shuffle,
  BarChartHorizontalBig,
  Play,
  Shield,
  Zap,
} from 'lucide-react';

// Create a context for cursor state
interface CursorContextType {
  cursorType: string;
  setCursorType: (type: string) => void;
}

const CursorContext = createContext<CursorContextType>({
  cursorType: 'default',
  setCursorType: () => {},
});

export const useCursor = () => useContext(CursorContext);

const HeroSection = () => {
  const [cursorType, setCursorType] = useState('default');

  const fadeInUpVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const cardAnimationDelay = 0.5; // Start card animations after hero text

  return (
    <CursorContext.Provider value={{ cursorType, setCursorType }}>
      <div className="relative">
        {/* Hero Content with CustomCursor - the cursor-none class hides the default cursor */}
        <div className="relative pt-10 pb-16 lg:pt-12 lg:pb-24 overflow-hidden cursor-none">
          <CustomCursor enabled={true} />

          {/* Floating Decorative Icons */}
          <motion.div
            className="absolute top-[30%] left-[calc(50%-600px)] sm:left-[5%] lg:left-[10%] xl:left-[15%] z-0 hidden sm:block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Settings2 className="w-7 h-7 text-teal-600 opacity-80" />
          </motion.div>
          <motion.div
            className="absolute top-[38%] left-[calc(50%-580px)] sm:left-[4%] lg:left-[8%] xl:left-[13%] z-0 hidden sm:block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-gray-300 bg-white shadow-sm">
              <MoveRight className="w-4 h-4 text-gray-500" />
            </div>
          </motion.div>
          <motion.div
            className="absolute top-[46%] left-[calc(50%-600px)] sm:left-[5%] lg:left-[10%] xl:left-[15%] z-0 hidden sm:block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <FileText className="w-7 h-7 text-lime-500 opacity-80" />
          </motion.div>

          <motion.div
            className="absolute top-[30%] right-[calc(50%-600px)] sm:right-[5%] lg:right-[10%] xl:right-[15%] z-0 hidden sm:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <BarChartBig className="w-7 h-7 text-lime-500 opacity-80" />
          </motion.div>
          <motion.div
            className="absolute top-[38%] right-[calc(50%-580px)] sm:right-[4%] lg:right-[8%] xl:right-[13%] z-0 hidden sm:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-gray-300 bg-white shadow-sm">
              <Waves className="w-4 h-4 text-gray-500" />
            </div>
          </motion.div>

          {/* Hero Text Content */}
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.2 } },
              }}
            >
              {/* Subtitle */}
              <motion.div variants={fadeInUpVariants} className="mb-4">
                <span className="inline-block bg-teal-50 text-teal-700 text-sm font-semibold px-4 py-1.5 rounded-full">
                  <Zap className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
                  Decentralized Crowdfunding Platform
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUpVariants}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-gray-800"
              >
                The Future of <span className="text-teal-600">Crowdfunding</span>
                <br />
                with{' '}
                <span className="relative inline-block">
                  Blockchain Technology
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-lime-300 rounded-full"></span>
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUpVariants}
                className="text-base sm:text-lg lg:text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
              >
                Secure, transparent, and decentralized funding for innovative projects. Let&apos;s
                take your ideas further with blockchain technology.
              </motion.p>

              <motion.div
                variants={fadeInUpVariants}
                className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10"
              >
                <Button
                  size="lg"
                  className="bg-teal-700 hover:bg-teal-800 text-white rounded-lg px-8 py-3 text-base font-semibold w-full sm:w-auto group transition-all duration-300"
                >
                  Launch Campaign
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-teal-700 text-teal-700 hover:bg-teal-50 rounded-lg px-8 py-3 text-base font-semibold w-full sm:w-auto group transition-all duration-300"
                >
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Explore Projects
                </Button>
              </motion.div>

              <motion.div
                variants={fadeInUpVariants}
                className="flex justify-center items-center mb-12"
              >
                <div className="bg-white px-5 py-2 rounded-full shadow-md flex items-center space-x-2">
                  <div className="flex items-center text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-800">5.0</span>
                  <span className="text-xs text-gray-500">from 80+ reviews</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Stats Cards Row */}
          <div className="container mx-auto px-4 mt-16 lg:mt-20 relative z-10">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 items-stretch"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.1, delayChildren: cardAnimationDelay },
                },
              }}
            >
              {/* Card 1: Projects */}
              <motion.div
                variants={fadeInUpVariants}
                className="bg-teal-700 text-white p-6 rounded-xl shadow-xl flex flex-col justify-center h-[200px]"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <BarChartHorizontalBig className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold mb-2">100+</div>
                <p className="text-sm font-medium text-teal-100">Successful Projects</p>
              </motion.div>

              {/* Card 2: Total Funds */}
              <motion.div
                variants={fadeInUpVariants}
                className="bg-white p-6 rounded-xl shadow-xl flex flex-col justify-between h-[200px]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-lime-100 rounded-md">
                    <BarChartHorizontalBig className="w-5 h-5 text-lime-600" />
                  </div>
                  <div className="flex items-center text-xs text-green-600 font-semibold">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>8%</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Total Funds</div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">1951+ ETH</div>
                  <p className="text-xs text-gray-500">
                    Increase of <span className="font-semibold text-gray-700">126</span> this month
                  </p>
                </div>
              </motion.div>

              {/* Card 3: Blockchain Networks */}
              <motion.div
                variants={fadeInUpVariants}
                className="bg-lime-100 p-6 rounded-xl shadow-xl flex flex-col justify-between h-[200px]"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-teal-700/20 flex items-center justify-center">
                    <Shuffle className="w-5 h-5 text-teal-700" />
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-teal-800 mb-2">6+</div>
                  <p className="text-sm font-medium text-teal-700">Blockchain Networks</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Security Feature Card */}
            <motion.div
              variants={fadeInUpVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: cardAnimationDelay + 0.3, duration: 0.6 }}
              className="mt-6 bg-teal-700 text-white p-6 rounded-xl shadow-xl"
            >
              <div className="flex items-center space-x-4 justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold leading-snug mb-1">
                      Secure Smart Contracts and Transparent Funding
                    </p>
                    <p className="text-sm text-teal-100">
                      Our blockchain technology ensures complete transparency and security for all
                      transactions
                    </p>
                  </div>
                </div>
                <div className="ml-auto">
                  <Button
                    variant="ghost"
                    className="text-teal-100 hover:text-white hover:bg-white/10 px-4"
                  >
                    Learn More <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </CursorContext.Provider>
  );
};

export default HeroSection;

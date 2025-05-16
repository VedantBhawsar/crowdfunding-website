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

  const floatingAnimation = {
    y: ['-4px', '4px', '-4px'],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: 'loop' as const,
      ease: 'easeInOut',
    },
  };

  const cardAnimationDelay = 0.5; // Start card animations after hero text

  return (
    <CursorContext.Provider value={{ cursorType, setCursorType }}>
      <div className="relative overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-slate-50/20 pointer-events-none"></div>

        {/* Decorative blurred circles */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-teal-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/5 w-80 h-80 bg-lime-100/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-100/20 rounded-full blur-3xl"></div>

        {/* Hero Content with CustomCursor - the cursor-none class hides the default cursor */}
        <div className="relative pt-10 pb-16 lg:pt-16 lg:pb-28 overflow-hidden">
          <CustomCursor enabled={true} />

          {/* Floating Decorative Icons */}
          <motion.div
            className="absolute top-[30%] left-[5%] md:left-[10%] lg:left-[15%] z-0 hidden sm:block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.9, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <motion.div animate={floatingAnimation}>
              <Settings2 className="w-5 h-5 md:w-7 md:h-7 text-teal-600 drop-shadow-md" />
            </motion.div>
          </motion.div>
          <motion.div
            className="absolute top-[38%] left-[4%] md:left-[8%] lg:left-[13%] z-0 hidden sm:block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.9, x: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            whileHover={{ scale: 1.1, rotate: -5 }}
          >
            <motion.div animate={floatingAnimation} transition={{ delay: 0.2 }}>
              <div className="flex items-center justify-center w-7 h-7 md:w-9 md:h-9 rounded-full border-2 border-gray-300 bg-white/80 backdrop-blur-sm shadow-lg">
                <MoveRight className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            className="absolute top-[46%] left-[5%] md:left-[10%] lg:left-[15%] z-0 hidden sm:block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.9, x: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <motion.div animate={floatingAnimation} transition={{ delay: 0.4 }}>
              <FileText className="w-5 h-5 md:w-7 md:h-7 text-lime-500 drop-shadow-md" />
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute top-[30%] right-[5%] md:right-[10%] lg:right-[15%] z-0 hidden sm:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 0.9, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            whileHover={{ scale: 1.1, rotate: -5 }}
          >
            <motion.div animate={floatingAnimation} transition={{ delay: 0.1 }}>
              <BarChartBig className="w-5 h-5 md:w-7 md:h-7 text-lime-500 drop-shadow-md" />
            </motion.div>
          </motion.div>
          <motion.div
            className="absolute top-[38%] right-[4%] md:right-[8%] lg:right-[13%] z-0 hidden sm:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 0.9, x: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <motion.div animate={floatingAnimation} transition={{ delay: 0.3 }}>
              <div className="flex items-center justify-center w-7 h-7 md:w-9 md:h-9 rounded-full border-2 border-gray-300 bg-white/80 backdrop-blur-sm shadow-lg">
                <Waves className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
              </div>
            </motion.div>
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
                <span className="inline-block bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 rounded-full shadow-sm border border-teal-100">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1.5 -mt-0.5" />
                  Decentralized Crowdfunding Platform
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUpVariants}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 sm:mb-6"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
                  The Future of{' '}
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-teal-500 to-teal-400">
                  Crowdfunding
                </span>
                <br className="hidden sm:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
                  with{' '}
                </span>
                <span className="relative inline-block">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-lime-500">
                    Blockchain Technology
                  </span>
                  <span className="absolute -bottom-1 left-0 w-full h-1.5 bg-gradient-to-r from-lime-300 to-lime-400 rounded-full"></span>
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUpVariants}
                className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-10 max-w-2xl mx-auto"
              >
                Secure, transparent, and decentralized funding for innovative projects. Let&apos;s
                take your ideas further with blockchain technology.
              </motion.p>

              <motion.div
                variants={fadeInUpVariants}
                className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-8 sm:mb-10"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-800 hover:to-teal-700 text-white rounded-lg px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold w-full sm:w-auto group transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Launch Campaign
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </motion.div>

              <motion.div
                variants={fadeInUpVariants}
                className="flex justify-center items-center mb-8 sm:mb-12"
              >
                <div className="bg-white/90 backdrop-blur-sm px-4 sm:px-5 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow flex items-center space-x-2">
                  <div className="flex items-center text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-current drop-shadow-sm" />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-gray-800">5.0</span>
                  <span className="text-xs text-gray-500">from 80+ reviews</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Stats Cards Row */}
          <div className="container mx-auto px-4 mt-8 sm:mt-16 lg:mt-20 relative z-10">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 items-stretch"
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
                whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
                className="bg-gradient-to-br from-teal-700 to-teal-600 text-white p-4 sm:p-6 rounded-xl shadow-xl flex flex-col justify-center h-[160px] sm:h-[200px] border border-teal-500/20 relative overflow-hidden group"
              >
                <div className="absolute -top-12 -right-12 h-28 w-28 rounded-full bg-white/10 blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <BarChartHorizontalBig className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-bold mb-2">100+</div>
                <p className="text-xs sm:text-sm font-medium text-teal-100">Successful Projects</p>
              </motion.div>

              {/* Card 2: Total Funds */}
              <motion.div
                variants={fadeInUpVariants}
                whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
                className="bg-white p-4 sm:p-6 rounded-xl shadow-xl flex flex-col justify-between h-[160px] sm:h-[200px] border border-gray-100 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-lime-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <div className="p-2 bg-gradient-to-r from-lime-100 to-lime-200 rounded-md shadow-sm">
                    <BarChartHorizontalBig className="w-4 h-4 sm:w-5 sm:h-5 text-lime-600" />
                  </div>
                  <div className="flex items-center text-xs text-green-600 font-semibold">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span>8%</span>
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="text-xs text-gray-500 mb-1">Total Funds</div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    $2.5M+
                  </div>
                  <div className="text-xs text-gray-500">Securely raised through our platform</div>
                </div>
              </motion.div>

              {/* Card 3: Active Users */}
              <motion.div
                variants={fadeInUpVariants}
                whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
                className="bg-gradient-to-br from-lime-600 to-lime-500 text-white p-4 sm:p-6 rounded-xl shadow-xl flex flex-col justify-between h-[160px] sm:h-[200px] border border-lime-500/20 relative overflow-hidden group"
              >
                <div className="absolute -bottom-12 -left-12 h-28 w-28 rounded-full bg-white/10 blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="flex items-center text-xs text-lime-100 font-semibold">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span>12%</span>
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="text-3xl sm:text-4xl font-bold mb-2">5,000+</div>
                  <p className="text-xs sm:text-sm font-medium text-lime-100">Active Users</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </CursorContext.Provider>
  );
};

export default HeroSection;

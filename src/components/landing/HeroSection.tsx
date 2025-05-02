'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RocketIcon, WalletIcon } from 'lucide-react';

const HeroSection = () => {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.2,
      },
    },
  };

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

  return (
    <div className="relative overflow-hidden py-20 md:py-28 lg:py-36">
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20 pointer-events-none"
      >
        <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700"></div>
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
      </div>
      <div className="container px-4 mx-auto relative z-10">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h1
            variants={fadeInUpVariants}
            className="text-4xl tracking-tight md:text-5xl lg:text-6xl font-bold text-foreground mb-6 md:mb-8 leading-tight"
          >
            Empower Your Ideas with <span className="text-primary">Crowdfundify</span>
          </motion.h1>

          <motion.p
            variants={fadeInUpVariants}
            className="text-lg md:text-xl font-medium text-muted-foreground mb-10 md:mb-12 max-w-3xl mx-auto"
          >
            Launch innovative projects, support groundbreaking ideas, and transform funding with
            secure blockchain technology.
          </motion.p>

          <motion.div
            variants={fadeInUpVariants}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto transition-transform duration-200 hover:scale-105"
            >
              <RocketIcon className="h-5 w-5 mr-2" /> Launch Campaign
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto transition-transform duration-200 hover:scale-105"
            >
              <WalletIcon className="h-5 w-5 mr-2" /> Explore Projects
            </Button>
          </motion.div>
        </motion.div>
      </div>{' '}
    </div>
  );
};

export default HeroSection;

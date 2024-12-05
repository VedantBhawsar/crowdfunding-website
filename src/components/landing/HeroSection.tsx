'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { RocketIcon, WalletIcon } from "lucide-react";

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="relative pt-24 pb-12  mx-auto px-4">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-4xl mx-auto"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight"
        >
          Empower Your Ideas with Decentralized Crowdfunding
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-xl text-gray-600 mb-8"
        >
          Launch innovative projects, support groundbreaking ideas, and transform the future of funding with blockchain technology
        </motion.p>
        
        <motion.div 
          variants={itemVariants}
          className="flex justify-center space-x-4"
        >
          <Button size="lg" className="gap-2 bg-indigo-600 hover:bg-indigo-700">
            <RocketIcon /> Launch Campaign
          </Button>
          <Button variant="outline" size="lg" className="gap-2 bg-indigo-50 hover:bg-indigo-100 border hover:border-indigo-400">
            <WalletIcon /> Create Account
          </Button>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          delay: 0.8,
          duration: 0.8,
          type: "spring",
          stiffness: 50
        }}
        className="mt-12 relative"
      >
        <div className="bg-indigo-100/50 w-full h-96 rounded-2xl absolute inset-0 blur-2xl"></div>
        <div className="relative bg-white/80 backdrop-blur-md rounded-2xl border border-indigo-100 p-8 shadow-xl">
          {/* Placeholder for campaign preview or stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <h3 className="text-3xl font-bold text-indigo-600">$4.2M</h3>
              <p className="text-gray-500">Total Funded</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-indigo-600">342</h3>
              <p className="text-gray-500">Active Projects</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-indigo-600">1,247</h3>
              <p className="text-gray-500">Backers</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
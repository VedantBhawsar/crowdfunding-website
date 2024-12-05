'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { RocketIcon, InfoIcon } from "lucide-react";

const CTASection = () => {
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
    <div className="relative py-16  mx-auto px-4">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-4xl mx-auto "
      >
        <motion.h2 
          variants={itemVariants}
          className="text-5xl font-extrabold mb-6 leading-tight text-black"
        >
          Ready to Launch Your Next Big Idea?
        </motion.h2>
        
        <motion.p 
          variants={itemVariants}
          className="text-xl  mb-8 text-gray-600"
        >
          Join thousands of innovators who've transformed their vision into reality through our platform.
        </motion.p>
        
        <motion.div 
          variants={itemVariants}
          className="flex justify-center space-x-4"
        >
          <Button size="lg" className="gap-2 bg-white text-indigo-700 hover:bg-gray-100">
            <RocketIcon /> Start Your Campaign
          </Button>
          <Button variant="default" size="lg">
            <InfoIcon /> Learn More
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
        <div className="bg-white/10 w-full h-24 rounded-2xl absolute inset-0 blur-2xl"></div>
      </motion.div>
    </div>
  );
};

export default CTASection;
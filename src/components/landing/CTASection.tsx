'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { RocketIcon } from "lucide-react";

const CTASection = () => {
  return (
    <div className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ 
          type: "spring", 
          stiffness: 100,
          duration: 0.8
        }}
        className="container mx-auto px-4 text-center"
      >
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Transform Your Idea into Reality?
        </h2>
        <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
          Join thousands of innovators who have successfully funded their projects through DecentraliFund
        </p>
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          viewport={{ once: true }}
          transition={{ 
            type: "spring", 
            stiffness: 300 
          }}
        >
          <Button 
            size="lg" 
            className="bg-white text-indigo-600 hover:bg-gray-100 gap-2"
          >
            <RocketIcon /> Start Your Campaign
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CTASection;
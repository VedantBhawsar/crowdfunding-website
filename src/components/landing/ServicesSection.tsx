'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
  Icon as LucideIcon, // For type hinting
  Sparkles,         // Production and Assembly
  Blocks,           // Custom Manufacturing (geometric, like components)
  Wrench,           // Quality Control
  Shield,           // Technology and Innovation
  Box,              // Packaging and Logistics
  TrendingUp,       // Consulting Market Research
  ArrowUpRight,     // For the card link arrow
} from 'lucide-react';

interface ServiceItem {
  icon: typeof LucideIcon;
  title: string;
  description: string;
  href?: string; // Optional link for the card
}

const manufacturingServiceItems: ServiceItem[] = [
  {
    icon: Sparkles,
    title: 'Production and Assembly',
    description: 'Details on production processes, assembly, capacity, and product types.',
    href: '#production',
  },
  {
    icon: Blocks,
    title: 'Custom Manufacturing',
    description: 'Custom product creation with design and customization options.',
    href: '#custom-mfg',
  },
  {
    icon: Wrench,
    title: 'Quality Control',
    description: 'Procedures and systems in place to ensure high product quality.',
    href: '#quality-control',
  },
  {
    icon: Shield,
    title: 'Technology and Innovation',
    description: 'Details on the latest manufacturing technologies and ongoing innovations.',
    href: '#tech-innovation',
  },
  {
    icon: Box,
    title: 'Packaging and Logistics',
    description: 'Packaging and logistics for shipping to customers and distributors.',
    href: '#packaging-logistics',
  },
  {
    icon: TrendingUp,
    title: 'Consulting Market Research',
    description: 'Services to help companies understand market needs and provide strategic advice.',
    href: '#consulting',
  },
];

const ManufacturingServicesSection = () => {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="bg-slate-900 py-16 lg:py-24"> {/* Main dark background, e.g., #0F172A */}
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-12 lg:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={itemVariants} // Use itemVariants for the heading block as a whole
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Efficient and Integrated Manufacturing Services
          </h2>
          <p className="text-slate-400 text-lg">
            Simplify operations with our efficient, quality-focused services.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants} // Stagger children for cards
        >
          {manufacturingServiceItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-slate-800 p-6 rounded-xl border border-slate-700 group
                           hover:bg-slate-700/70 hover:border-slate-600 transition-all duration-300 ease-in-out
                           hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                onClick={() => item.href && (window.location.href = item.href)}
              >
                <div className="flex items-start justify-between mb-4">
                  {/* @ts-ignore */}
                  <IconComponent className="h-7 w-7 text-teal-400 group-hover:text-teal-300 transition-colors" />
                  <ArrowUpRight className="h-5 w-5 text-slate-500 group-hover:text-slate-300 transition-colors" />
                </div>
                <h3 className="text-lg lg:text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default ManufacturingServicesSection;
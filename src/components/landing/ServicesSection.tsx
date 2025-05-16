'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
  Icon as LucideIcon, // For type hinting
  Sparkles, // Production and Assembly
  Blocks, // Custom Manufacturing (geometric, like components)
  Wrench, // Quality Control
  Shield, // Technology and Innovation
  Box, // Packaging and Logistics
  TrendingUp, // Consulting Market Research
  ArrowUpRight, // For the card link arrow
  CircleDashed,
  Lightbulb,
} from 'lucide-react';

interface ServiceItem {
  icon: typeof LucideIcon;
  title: string;
  description: string;
  href?: string;
  color?: string;
}

const manufacturingServiceItems: ServiceItem[] = [
  {
    icon: Sparkles,
    title: 'Production and Assembly',
    description: 'Details on production processes, assembly, capacity, and product types.',
    href: '#production',
    color: 'text-amber-400',
  },
  {
    icon: Blocks,
    title: 'Custom Manufacturing',
    description: 'Custom product creation with design and customization options.',
    href: '#custom-mfg',
    color: 'text-teal-400',
  },
  {
    icon: Wrench,
    title: 'Quality Control',
    description: 'Procedures and systems in place to ensure high product quality.',
    href: '#quality-control',
    color: 'text-blue-400',
  },
  {
    icon: Shield,
    title: 'Technology and Innovation',
    description: 'Details on the latest manufacturing technologies and ongoing innovations.',
    href: '#tech-innovation',
    color: 'text-purple-400',
  },
  {
    icon: Box,
    title: 'Packaging and Logistics',
    description: 'Packaging and logistics for shipping to customers and distributors.',
    href: '#packaging-logistics',
    color: 'text-green-400',
  },
  {
    icon: TrendingUp,
    title: 'Consulting Market Research',
    description: 'Services to help companies understand market needs and provide strategic advice.',
    href: '#consulting',
    color: 'text-rose-400',
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
    <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-16 sm:py-20 lg:py-28 relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-slate-950/50 to-transparent"></div>
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-slate-950/50 to-transparent"></div>

      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-24 -left-24 w-96 h-96 bg-teal-900/20 rounded-full blur-3xl"
          animate={{
            x: [0, 10, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        ></motion.div>
        <motion.div
          className="absolute top-1/4 -right-24 w-80 h-80 bg-blue-900/20 rounded-full blur-3xl"
          animate={{
            x: [0, -15, 0],
            y: [0, 10, 0],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        ></motion.div>
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-purple-900/20 rounded-full blur-3xl"
          animate={{
            x: [0, 20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        ></motion.div>
      </div>

      {/* Decorative patterns */}
      <div className="absolute top-10 right-10 opacity-20 hidden lg:block">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="20" cy="20" r="8" fill="rgba(56, 189, 248, 0.1)" />
          <circle cx="60" cy="20" r="8" fill="rgba(56, 189, 248, 0.1)" />
          <circle cx="100" cy="20" r="8" fill="rgba(56, 189, 248, 0.1)" />
          <circle cx="20" cy="60" r="8" fill="rgba(56, 189, 248, 0.1)" />
          <circle cx="60" cy="60" r="8" fill="rgba(56, 189, 248, 0.1)" />
          <circle cx="100" cy="60" r="8" fill="rgba(56, 189, 248, 0.1)" />
          <circle cx="20" cy="100" r="8" fill="rgba(56, 189, 248, 0.1)" />
          <circle cx="60" cy="100" r="8" fill="rgba(56, 189, 248, 0.1)" />
          <circle cx="100" cy="100" r="8" fill="rgba(56, 189, 248, 0.1)" />
        </svg>
      </div>
      <div className="absolute bottom-10 left-10 opacity-20 hidden lg:block">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="20" cy="20" r="8" fill="rgba(236, 72, 153, 0.1)" />
          <circle cx="60" cy="20" r="8" fill="rgba(236, 72, 153, 0.1)" />
          <circle cx="100" cy="20" r="8" fill="rgba(236, 72, 153, 0.1)" />
          <circle cx="20" cy="60" r="8" fill="rgba(236, 72, 153, 0.1)" />
          <circle cx="60" cy="60" r="8" fill="rgba(236, 72, 153, 0.1)" />
          <circle cx="100" cy="60" r="8" fill="rgba(236, 72, 153, 0.1)" />
          <circle cx="20" cy="100" r="8" fill="rgba(236, 72, 153, 0.1)" />
          <circle cx="60" cy="100" r="8" fill="rgba(236, 72, 153, 0.1)" />
          <circle cx="100" cy="100" r="8" fill="rgba(236, 72, 153, 0.1)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-10 sm:mb-14 lg:mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={itemVariants} // Use itemVariants for the heading block as a whole
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-3 py-1 bg-slate-800/90 border border-slate-700 rounded-full text-teal-400 text-xs font-medium tracking-wide mb-3"
          >
            <span className="flex h-5 w-5 items-center justify-center mr-2">
              <span className="absolute h-3 w-3 animate-ping rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            OUR SERVICES
          </motion.div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
            Efficient and Integrated Manufacturing Services
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Simplify operations with our efficient, quality-focused services.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
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
                whileHover={{
                  y: -10,
                  transition: { duration: 0.2 },
                }}
                className="bg-gradient-to-b from-slate-800/90 to-slate-800/80 p-5 sm:p-6 rounded-xl border border-slate-700 group
                           hover:border-slate-600 transition-all duration-300 ease-in-out
                           hover:shadow-xl hover:shadow-slate-900/50 backdrop-blur-sm cursor-pointer
                           relative overflow-hidden"
                onClick={() => item.href && (window.location.href = item.href)}
              >
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Illuminated corner */}
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-400/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="flex items-start justify-between mb-4 sm:mb-5 relative">
                  <div className="p-2.5 rounded-lg bg-slate-800/90 border border-slate-700/80 shadow-inner">
                    {/* @ts-ignore */}
                    <IconComponent
                      className={`h-5 w-5 sm:h-6 sm:w-6 ${item.color || 'text-teal-400'} group-hover:text-white transition-colors`}
                    />
                  </div>
                  <motion.div
                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center border border-slate-700 bg-slate-800 group-hover:bg-slate-700 transition-colors"
                    whileHover={{ rotate: 45 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                  </motion.div>
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2 group-hover:text-teal-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  {item.description}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
                  <span className="text-xs font-medium text-teal-400 group-hover:text-teal-300 transition-colors">
                    Learn more
                  </span>

                  {/* Progress bar that fills on hover */}
                  <div className="h-1 w-16 bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-teal-400 w-0"
                      initial={{ width: '0%' }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    ></motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Contact/CTA Section */}
        <motion.div
          className="mt-12 sm:mt-16 lg:mt-20 bg-gradient-to-r from-slate-800/90 to-slate-900/80 border border-slate-700 rounded-xl p-6 sm:p-8 lg:p-10 relative overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background decorations */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl"></div>
          <div className="absolute top-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>

          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-6 lg:mb-0 lg:mr-8">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center mr-3">
                  <Lightbulb className="h-5 w-5 text-teal-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Have a specific project in mind?
                </h3>
              </div>
              <p className="text-slate-400 max-w-2xl">
                Our team of experts is ready to help you with your customized manufacturing needs
                and guide you through the entire process.
              </p>
            </div>
            <motion.button
              className="inline-flex items-center px-5 py-3 rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-medium text-sm sm:text-base whitespace-nowrap transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <CircleDashed className="mr-2 h-4 w-4" />
              Schedule a Consultation
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ManufacturingServicesSection;

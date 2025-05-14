'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button'; // Assuming this is from ShadCN UI

import {
  Icon as LucideIcon, // For type hinting
  Slack,
  Target,
  Filter,
  Settings2,
  Triangle,
  Repeat,
  Blocks,
  BarChart2,
  Cog, // Using Cog instead of Wrench for visual similarity
  Network, // Alternative for center icon
} from 'lucide-react';

interface IconInfo {
  id: string;
  Component: typeof LucideIcon ;
  color: string;
  sizeClass?: string; // For central icon potentially
  wrapperSizeClass?: string; // for icon wrapper
  iconSizeClass?: string; // for icon itself
  fillCurrent?: boolean; // For icons like Triangle
}

const orbitalIconsList: IconInfo[] = [
  { id: 'slack', Component: Slack, color: 'text-pink-600', fillCurrent: true }, // Slack uses fill
  { id: 'target', Component: Target, color: 'text-red-500' },
  { id: 'filter', Component: Filter, color: 'text-orange-500' },
  { id: 'settings2', Component: Settings2, color: 'text-purple-600' },
  { id: 'repeat', Component: Repeat, color: 'text-teal-500' },
  { id: 'blocks', Component: Blocks, color: 'text-yellow-500', fillCurrent: true }, // Blocks benefits from fill
  { id: 'barchart', Component: BarChart2, color: 'text-sky-500' },
  { id: 'cog', Component: Cog, color: 'text-gray-500' },
];

const centerIconInfo: IconInfo = {
  id: 'triangle',
  Component: Triangle,
  color: 'text-blue-600',
  sizeClass: 'w-10 h-10 md:w-12 md:h-12', // Icon size directly
  fillCurrent: true,
};


const IntegrationShowcaseSection = () => {
  const iconWrapperBaseSize = "w-10 h-10 md:w-12 md:h-12";
  const iconItselfBaseSize = "w-5 h-5 md:w-6 md:h-6";

  return (
    <div className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left content */}
          <motion.div
            className="lg:w-1/2 xl:w-5/12 text-center lg:text-left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
              Decentralized Crowdfunding Integrations
              <br />
              for Global Transparency & Trust
            </h2>
            <p className="text-gray-600 mb-8 text-base lg:text-lg">
              Seamlessly connect your crowdfunding campaigns to the blockchain. Enable transparent, secure, and borderless funding for creators and backers worldwide. Our platform integrates with leading Web3 protocols to ensure every transaction is verifiable and every project is accessible to a global audience.
            </p>

            <Button
              size="lg"
              className="bg-teal-700 hover:bg-teal-800 text-white font-semibold transition-colors px-8 py-3 rounded-lg"
            >
              Explore Decentralized Integrations
            </Button>
          </motion.div>

          {/* Right content - Integration icons art */}
          <motion.div
            className="lg:w-1/2 xl:w-7/12"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="relative bg-green-100/80 rounded-2xl p-6 sm:p-8 md:p-10 aspect-[4/3] md:aspect-video lg:aspect-[5/3.5] xl:min-h-[400px]">
              {/* Orbital Lines */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
                  <circle cx="100" cy="100" r="55" stroke="rgba(107, 114, 128, 0.15)" strokeWidth="1" fill="none" />
                  <circle cx="100" cy="100" r="75" stroke="rgba(107, 114, 128, 0.15)" strokeWidth="1" fill="none" />
                </svg>
              </div>

              {/* Central Icon */}
              <motion.div
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                {/* @ts-ignore */}
                <centerIconInfo.Component
                  className={`${centerIconInfo.sizeClass} ${centerIconInfo.color}`}
                  fill={centerIconInfo.fillCurrent ? 'currentColor' : 'none'}
                />
              </motion.div>

              {/* Orbital Icons */}
              {orbitalIconsList.map((icon, index) => {
                const angle = (index / orbitalIconsList.length) * 2 * Math.PI - (Math.PI / 2); // Start from top
              const radiusPercentage = 38; // Percentage of the smaller dimension (approx)
                
                // For simplicity, using percentages for left/top based on typical aspect ratio
                // x = 50% + R * cos(angle), y = 50% + R * sin(angle)
                // These values position the center of the icon.
                // Adjust with -translate-x-1/2 -translate-y-1/2
                const xPos = 50 + radiusPercentage * Math.cos(angle);
                const yPos = 50 + radiusPercentage * Math.sin(angle);


                return (
                  <motion.div
                    key={icon.id}
                    className={`absolute bg-white shadow-lg rounded-lg flex items-center justify-center 
                                ${icon.wrapperSizeClass || iconWrapperBaseSize}
                                transform -translate-x-1/2 -translate-y-1/2`}
                    style={{
                      left: `${xPos}%`,
                      top: `${yPos}%`,
                    }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.07, ease: "easeOut" }}
                    viewport={{ once: true }}
                  >
                    {/* @ts-ignore */}
                    <icon.Component
                      className={`${icon.iconSizeClass || iconItselfBaseSize} ${icon.color}`}
                      fill={icon.fillCurrent ? 'currentColor' : 'none' }
                      strokeWidth={icon.id === 'triangle' || icon.id === 'slack' || icon.id === 'blocks' ? 1.5 : 2} // Thicker for filled typically
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationShowcaseSection;
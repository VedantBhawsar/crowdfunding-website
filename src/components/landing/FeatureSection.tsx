'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheckIcon, GlobeIcon, BarChartIcon, UsersIcon } from 'lucide-react';
import { HeaderText } from '@/components/ui/headerText';

const FeatureSection = () => {
  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Secure Funding',
      description:
        'Transparent, immutable smart contracts ensure every transaction is secure and traceable.',
    },
    {
      icon: GlobeIcon,
      title: 'Global Accessibility',
      description:
        'Break geographical barriers. Fund and support projects from anywhere in the world.',
    },
    {
      icon: BarChartIcon,
      title: 'Flexible Models',
      description:
        'Choose from multiple funding approaches: all-or-nothing, flexible funding, and milestone-based campaigns.',
    },
    {
      icon: UsersIcon,
      title: 'Community Driven',
      description:
        'Direct interaction between creators and backers. Vote, provide feedback, and engage directly.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger the appearance of children
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
    hover: {
      y: -5, // Lift card slightly on hover
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <HeaderText
          title="Why Choose Crowdfundify?"
          description="Experience a new era of crowdfunding powered by blockchain technology."
          className="mb-12 md:mb-16"
        />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants} whileHover="hover" className="h-full">
              <Card className="h-full group border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-card flex flex-col">
                <CardHeader className="pb-4">
                  <feature.icon className="w-10 h-10 text-primary mb-4" />{' '}
                  <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default FeatureSection;

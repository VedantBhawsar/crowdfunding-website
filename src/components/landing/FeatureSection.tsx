"use client";
import React from "react";
import { AnimatePresence, delay, motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShieldCheckIcon,
  GlobeIcon,
  BarChartIcon,
  UsersIcon,
} from "lucide-react";
import { HeaderText } from "../ui/headerText";

const FeatureSection = () => {
  const features = [
    {
      icon: ShieldCheckIcon,
      title: "Secure Funding",
      description:
        "Transparent, immutable smart contracts ensure every transaction is secure and traceable.",
    },
    {
      icon: GlobeIcon,
      title: "Global Accessibility",
      description:
        "Break geographical barriers. Fund and support projects from anywhere in the world.",
    },
    {
      icon: BarChartIcon,
      title: "Flexible Models",
      description:
        "Choose from multiple funding approaches: all-or-nothing, flexible funding, and milestone-based campaigns.",
    },
    {
      icon: UsersIcon,
      title: "Community Driven",
      description:
        "Direct interaction between creators and backers. Vote, provide feedback, and engage directly.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="py-16 relative">
      <div className="mx-auto px-4">
        <HeaderText
          title="Why Choose DecentraliFund?"
          description="Experience a new era of crowdfunding powered by blockchain technology"
        />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants} className="">
              <Card className="h-full group transition-shadow hover:border-primary/50">
                <CardHeader>
                  <feature.icon className="w-12 h-12 text-primary mb-4" />
                  <CardTitle className="group-hover:text-primary cursor-default">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground cursor-default">
                    {feature.description}
                  </p>
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

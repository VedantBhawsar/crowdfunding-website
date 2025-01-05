"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RocketIcon, WalletIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="relative py-8 md:py-16 lg:py-24 lg:pt-10">
      <div className="container px-4 mx-auto relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto relative"
        >
          <motion.h1
            variants={itemVariants}
            className="text-3xl tracking-wider md:text-4xl lg:text-5xl font-bold text-primary mb-4 md:mb-6 leading-tight"
          >
            Empower Your Ideas with Crowdfundify Crowdfunding
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg font-semibold tracking-wide text-muted-foreground mb-6 md:mb-10 max-w-3xl mx-auto"
          >
            Launch innovative projects, support groundbreaking ideas, and
            transform the future of funding with cutting-edge blockchain
            technology
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-2 sm:space-x-4"
          >
            <Button size="lg" variant={"default"} className="w-full sm:w-auto">
              <RocketIcon className="h-4 w-4" /> Launch Campaign
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <WalletIcon className="h-4 w-4" /> Create Account
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
            stiffness: 50,
          }}
          className="mt-8 md:mt-16 relative"
        >
          <Card className="relative bg-background/80 w-1/2 mx-auto  backdrop-blur-md border-primary/20 shadow-lg shadow-primary/10 rounded-lg ">
            <CardContent className=" p-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 text-center">
                <div className="border-r-2 py-5">
                  <h3 className="text-2xl md:text-3xl font-bold text-primary">
                    $4.2M
                  </h3>
                  <p className="text-muted-foreground font">Total Funded</p>
                </div>
                <div className="border-r-2 py-5">
                  <h3 className="text-2xl md:text-3xl font-bold text-primary">
                    342
                  </h3>
                  <p className="text-muted-foreground">Active Projects</p>
                </div>
                <div className=" py-5">
                  <h3 className="text-2xl md:text-3xl font-bold text-primary">
                    1,247
                  </h3>
                  <p className="text-muted-foreground">Backers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;

"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RocketIcon, WalletIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Separator } from "../ui/separator";

const HeroSection = () => {
  const { theme, setTheme } = useTheme();
  console.log(theme);
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
    <div className="relative py-8 md:py-16 lg:py-24">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50 dark:from-background dark:to-background/80" />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 blur-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/2 to-transparent" />
        </div>
      </div>

      <div className="container px-4 mx-auto relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6 leading-tight tracking-tight"
          >
            Empower Your Ideas with Decentralized Crowdfunding
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-10 max-w-3xl mx-auto"
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
              <RocketIcon className=" h-4 w-4" /> Launch Campaign
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <WalletIcon className=" h-4 w-4" /> Create Account
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
          {/* Card background blur effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl blur-2xl" />
          <Card className="relative bg-background/80 w-1/2 mx-auto backdrop-blur-md border-primary/10">
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3  text-center">
                <div className="border-r-2 ">
                  <h3 className="text-2xl md:text-3xl font-bold text-primary">
                    $4.2M
                  </h3>
                  <p className="text-muted-foreground">Total Funded</p>
                </div>
                <div className="border-r-2 ">
                  <h3 className="text-2xl md:text-3xl font-bold text-primary">
                    342
                  </h3>
                  <p className="text-muted-foreground">Active Projects</p>
                </div>
                <div className="">
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

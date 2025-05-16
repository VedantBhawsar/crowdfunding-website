'use client';

import React from 'react';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const containerAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="py-10 bg-background max-w-7xl mx-auto px-4 mt-10">
      <div className="">
        <motion.div
          // initial="hidden"
          // animate="visible"
          variants={containerAnimation}
          className="space-y-16"
        >
          <motion.div variants={itemAnimation} className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-primary">About Crowdfundify</h1>
            <div className="h-1 w-20 bg-primary/20 mx-auto rounded-full" />
          </motion.div>

          <motion.section variants={itemAnimation} className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              At DecentraliFund, our mission is to empower individuals and communities by providing
              a secure, transparent, and Crowdfundify platform to fund projects that make a positive
              impact in the world. We believe in creating opportunities for everyone to achieve
              their dreams.
            </p>
          </motion.section>

          <motion.section variants={itemAnimation} className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Our Vision</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our vision is to become the leading Crowdfundify crowdfunding platform, enabling
              global participation in creating innovative solutions for pressing societal
              challenges. We aim to bridge the gap between dreamers and supporters by leveraging
              blockchain technology for transparency and trust.
            </p>
          </motion.section>

          <motion.section variants={itemAnimation} className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Why Choose Us?</h2>
            <ul className="grid gap-3 text-muted-foreground">
              <li className="flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mr-3" />
                Secure and Crowdfundify funding system
              </li>
              <li className="flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mr-3" />
                Transparent transactions powered by blockchain
              </li>
              <li className="flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mr-3" />
                Global reach for contributors and creators
              </li>
              <li className="flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mr-3" />
                Easy-to-use interface for all users
              </li>
              <li className="flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mr-3" />
                Commitment to social impact and innovation
              </li>
            </ul>
          </motion.section>

          <motion.section variants={itemAnimation} className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Meet Our Team</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our team is made up of passionate individuals dedicated to transforming the
              crowdfunding landscape. From blockchain experts to community builders, we work
              tirelessly to ensure every campaign on our platform is successful and impactful.
            </p>
          </motion.section>

          <motion.div variants={itemAnimation}>
            <Separator className="my-8" />
            <p className="text-center text-muted-foreground">
              Thank you for choosing DecentraliFund to make a difference in the world.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

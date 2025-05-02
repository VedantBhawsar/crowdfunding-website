'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RocketIcon, InfoIcon } from 'lucide-react';

const CTASection = () => {
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
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className="relative py-16 md:py-20">
      <div className="container relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-6 leading-tight text-foreground tracking-tight"
          >
            Ready to Launch Your Next Big Idea?
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl mb-10 text-muted-foreground"
          >
            Join thousands of innovators who&apos;ve transformed their vision into reality through
            our platform.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Button size="lg" className="gap-2">
              <RocketIcon className="w-4 h-4" />
              Start Your Campaign
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <InfoIcon className="w-4 h-4" />
              Learn More
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.8,
            duration: 0.8,
            type: 'spring',
            stiffness: 50,
          }}
          className="mt-12 relative"
        >
          <div
            className="w-full h-full absolute inset-0 rounded-2xl opacity-20"
            style={{
              background:
                'radial-gradient(circle at center, hsl(var(--primary)) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HomeIcon, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background">
      <div className="container max-w-md">
        <motion.div 
          className="text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative"
          >
            <div className="text-9xl font-bold text-primary/10">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Page Not Found
              </h1>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground"
          >
            Oops! The page you&apos;re looking for seems to have wandered off into the blockchain.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild variant="default" className="gap-2">
              <Link href="/">
                <HomeIcon className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/projects">
                <ArrowLeft className="w-4 h-4" />
                Browse Projects
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FaGoogle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

// === Define Icons ===
const IconIdea = () => (
  <svg
    width="52"
    height="52"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-primary"
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.47 10.47a7 7 0 0 0 6.36-6.36M13.53 13.53a7 7 0 0 0-6.36 6.36" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 19.07A10 10 0 0 0 22 12h-1" />
    <path d="M12 4.93A10 10 0 0 0 2 12h1" />
  </svg>
);

const IconCommunity = () => (
  <svg
    width="52"
    height="52"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-primary"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconGrowth = () => (
  <svg
    width="52"
    height="52"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-primary"
  >
    <line x1="3" y1="22" x2="21" y2="22" />
    <line x1="6" y1="18" x2="6" y2="10" />
    <line x1="12" y1="18" x2="12" y2="6" />
    <line x1="18" y1="18" x2="18" y2="14" />
  </svg>
);

// Additional icon for enhanced UI
const IconRocket = () => (
  <svg
    width="52"
    height="52"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-primary"
  >
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

// Array of icon components
const icons = [IconIdea, IconCommunity, IconGrowth, IconRocket];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      delay: 0.2,
    },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.03,
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    transition: { type: 'spring', stiffness: 400 },
  },
  tap: { scale: 0.97 },
};

export default function SignInPage() {
  const router = useRouter();
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Effect to change the icon periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIconIndex(prevIndex => (prevIndex + 1) % icons.length);
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  // Get the current icon component based on the index
  const CurrentIcon = icons[currentIconIndex];

  // Handle Google sign-in
  const handleGoogleSignin = async () => {
    setIsLoadingGoogle(true);
    setLoginError(null);

    try {
      await signIn('google', {
        callbackUrl: '/onboarding',
      });
      // The redirect is handled by NextAuth.js
    } catch (error) {
      console.error('Google sign-in error:', error);
      setLoginError('Failed to sign in with Google. Please try again.');
      setIsLoadingGoogle(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background p-4 overflow-hidden">
      <div className="container mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 lg:items-center">
        {/* Left Column: Branding & Visuals */}
        <motion.div
          className="hidden flex-col items-center justify-center space-y-8 text-center lg:flex"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="relative h-20 w-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIconIndex}
                initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotate: 5 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <CurrentIcon />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.h1
            className="text-6xl font-bold tracking-tight text-transparent lg:text-5xl bg-clip-text bg-gradient-to-r from-primary to-primary/70"
            variants={itemVariants}
          >
            Fund the Future. <br /> Empower Ideas.
          </motion.h1>

          <motion.p className="text-base text-slate-600 max-w-md" variants={itemVariants}>
            Join the <span className="font-semibold text-primary">Crowdfundify</span> community and
            bring innovative projects to life through blockchain technology.
          </motion.p>
        </motion.div>

        {/* Right Column: Login Form */}
        <motion.div
          className="flex w-full flex-col items-center justify-center"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="w-full max-w-md shadow-lg bg-background/95 backdrop-blur-sm">
            <CardHeader className="space-y-3">
              <div className="mx-auto flex justify-center lg:hidden">
                <motion.div
                  initial={{ rotate: -5 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <CurrentIcon />
                </motion.div>
              </div>
              <CardTitle className="text-3xl font-bold text-center">Welcome Back</CardTitle>
              <CardDescription className="text-center text-base">
                Sign in to your account and continue your journey
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-0">
              {loginError && (
                <Alert variant="destructive" className="mb-4">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}

              <motion.div
                className="relative flex items-center justify-center my-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Separator className="absolute" />
                <span className="relative bg-background px-3 text-sm font-medium text-muted-foreground">
                  SIGN IN WITH
                </span>
              </motion.div>

              <Button
                type="button"
                variant="default"
                className="w-full h-12 text-base flex items-center gap-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary hover:bg-primary/90"
                onClick={handleGoogleSignin}
                disabled={isLoadingGoogle}
              >
                <FaGoogle className="h-5 w-5" />
                {isLoadingGoogle ? 'Connecting...' : 'Continue with Google'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { FaGoogle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
// === Define Icons (Place the Icon components from Step 1 here) ===
const IconIdea = () => (
  <svg
    width="48"
    height="48"
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
    width="48"
    height="48"
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
    width="48"
    height="48"
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

// Array of icon components
const icons = [IconIdea, IconCommunity, IconGrowth];
// === End Icon Definitions ===

// Function for handling Credentials login

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

const iconTransitionVariants = {
  initial: { opacity: 0, scale: 0.95 }, // Start slightly smaller and faded
  animate: { opacity: 1, scale: 1 }, // Fade in and scale to normal
  exit: { opacity: 0, scale: 0.95 }, // Fade out and scale down slightly
};
// --- End Animation Variants ---

export default function SignInPage() {
  const router = useRouter();
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingCredentials, setIsLoadingCredentials] = useState(false);
  const [currentIconIndex, setCurrentIconIndex] = useState(0); // State for current icon index
  const [loginError, setLoginError] = useState<string | null>(null);

  // Effect to change the icon periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIconIndex(prevIndex => (prevIndex + 1) % icons.length); // Cycle through icons
    }, 4000); // Change icon every 4 seconds (adjust timing as needed)

    // Clear interval on component unmount to prevent memory leaks
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs only once on mount

  // Get the current icon component based on the index
  const CurrentIcon = icons[currentIconIndex];

  // Handle form submission for credentials login
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoadingCredentials(true);
    setLoginError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      if (!email || !password) {
        setLoginError('Email and password are required');
        setIsLoadingCredentials(false);
        return;
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        console.error('Login error:', result.error);
        setLoginError('Invalid email or password. Please try again.');
        setIsLoadingCredentials(false);
      } else if (result?.url) {
        // Successful login - redirect to callback URL or dashboard
        router.push(result.url);
      } else {
        // Fallback redirect to dashboard if no URL is provided
        router.push('/account');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An error occurred during login. Please try again.');
      setIsLoadingCredentials(false);
    }
  };

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
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background p-4">
      <div className="container mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 lg:items-center">
        {/* Left Column: Branding & Visuals */}
        <motion.div
          className="hidden flex-col items-center justify-center space-y-8 text-center lg:flex"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="relative h-16 w-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIconIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <CurrentIcon />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold tracking-tight text-foreground lg:text-5xl"
            variants={itemVariants}
          >
            Fund the Future. <br /> Empower Ideas.
          </motion.h1>

          <motion.p className="text-lg text-muted-foreground max-w-md" variants={itemVariants}>
            Join the <span className="font-semibold text-primary">Crowdfundify</span> community and
            bring innovative projects to life through blockchain technology.
          </motion.p>

          <motion.div variants={itemVariants} className="py-4">
            <span className="text-sm text-muted-foreground">
              Don{"'"}t have an account?{' '}
              <Link href="/signup" className="font-medium text-primary hover:underline">
                Sign Up
              </Link>
            </span>
          </motion.div>
        </motion.div>

        {/* Right Column: Login Form */}
        <div className="flex w-full flex-col items-center justify-center">
          <Card className="w-full max-w-md border-border/40 shadow-md">
            <CardHeader className="space-y-1">
              <div className="mx-auto mb-2 flex justify-center lg:hidden">
                <CurrentIcon />
              </div>
              <CardTitle className="text-2xl font-semibold text-center">Welcome Back</CardTitle>
              <CardDescription className="text-center">
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
              {loginError && (
                <Alert variant="destructive" className="mb-4">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="h-11"
                  />
                </div>

                <Button type="submit" className="w-full h-11" disabled={isLoadingCredentials}>
                  {isLoadingCredentials ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <div className="relative flex items-center justify-center">
                <Separator className="absolute" />
                <span className="relative bg-background px-2 text-xs text-muted-foreground">
                  OR CONTINUE WITH
                </span>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11 flex items-center gap-2"
                onClick={handleGoogleSignin}
                disabled={isLoadingGoogle}
              >
                <FaGoogle className="h-4 w-4" />
                {isLoadingGoogle ? 'Connecting...' : 'Google'}
              </Button>
            </CardContent>

            <CardFooter className="flex justify-center border-t p-4 lg:hidden">
              <div className="text-sm text-muted-foreground">
                Don{"'"}t have an account?{' '}
                <Link href="/signup" className="font-medium text-primary hover:underline">
                  Sign Up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

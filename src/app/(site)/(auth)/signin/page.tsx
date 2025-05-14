'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { FaGoogle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
        {/* Left Column: Branding & Visuals (Animated Icon) */}
        <motion.div
          className="hidden min-h-[250px] flex-col items-center justify-center space-y-6 text-center md:flex" // Added min-h for layout stability during icon change
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Apply item variant for initial entrance */}
          <motion.div
            variants={itemVariants}
            className="relative h-12 w-12" // Set fixed height/width for the container
          >
            {/* AnimatePresence handles the transition between icons */}
            <AnimatePresence mode="wait">
              {' '}
              {/* 'wait' ensures exit animation finishes before enter starts */}
              <motion.div
                key={currentIconIndex}
                initial={{ opacity: 0, left: 50 }}
                animate={{ opacity: 1, left: 0 }}
                exit={{ opacity: 0, right: 50 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <CurrentIcon />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.h1
            className="text-3xl font-bold tracking-tight lg:text-4xl"
            variants={itemVariants}
          >
            Fund the Future. <br /> Empower Ideas.
          </motion.h1>

          <motion.p className="text-muted-foreground" variants={itemVariants}>
            Join the <span className="font-semibold text-primary">Crowdfundify</span> community and
            bring projects to life.
          </motion.p>
        </motion.div>

        {/* Right Column: Login Form & Actions (Remains unchanged) */}
        <div className="flex w-full flex-col items-center justify-center space-y-6">
          {/* Login Card */}
          <Card className="w-full max-w-sm border-border/40 shadow-sm">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-fit md:hidden">
                {/* You might want the cycling icon here on mobile too? */}
                {/* <div className="relative h-12 w-12"> <AnimatePresence>...</AnimatePresence> </div> */}
                <IconIdea /> {/* Or just a static one */}
              </div>
              <CardTitle className="text-2xl font-semibold tracking-tight">Log In</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* --- Rest of your form and buttons --- */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* ... email input ... */}
                <div>
                  <Label htmlFor="email" className="sr-only">
                    Email or Username
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Mobile number, username or email address"
                    required
                    className="h-10 bg-secondary/30 border-border/40 focus:border-primary focus:ring-primary"
                    disabled={isLoadingCredentials || isLoadingGoogle}
                  />
                </div>
                {/* ... password input ... */}
                <div>
                  <Label htmlFor="password" className="sr-only">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    className="h-10 bg-secondary/30 border-border/40 focus:border-primary focus:ring-primary"
                    disabled={isLoadingCredentials || isLoadingGoogle}
                  />
                </div>
                {/* ... login button ... */}
                <Button
                  type="submit"
                  className="w-full h-9 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isLoadingCredentials || isLoadingGoogle}
                  aria-disabled={isLoadingCredentials || isLoadingGoogle}
                >
                  {isLoadingCredentials ? 'Logging in...' : 'Log in'}
                </Button>
              </form>

              {/* ... separator ... */}
              <div className="relative my-6">
                <Separator className="absolute left-0 top-1/2 w-full -translate-y-1/2 transform" />
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground font-medium">OR</span>
                </div>
              </div>

              {/* ... google button ... */}
              <Button
                variant="secondary"
                className="w-full h-9 border border-transparent hover:bg-secondary/60"
                onClick={handleGoogleSignin}
                disabled={isLoadingGoogle || isLoadingCredentials}
                aria-disabled={isLoadingGoogle || isLoadingCredentials}
              >
                {isLoadingGoogle ? (
                  <span className="animate-spin mr-2">⏳</span>
                ) : (
                  <FaGoogle className="mr-2 h-4 w-4" />
                )}
                Log in with Google
              </Button>

              {/* ... forgotten password link ... */}
              <div className="mt-4 text-center text-sm">
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgotten password?
                </Link>
              </div>

              {/* Error message display */}
              {loginError && (
                <div className="mt-2 text-center text-sm text-red-500">{loginError}</div>
              )}
              {/* --- End of form and buttons --- */}
            </CardContent>
          </Card>

          {/* Sign Up Card/Link */}
          <Card className="w-full max-w-sm border-border/40 shadow-sm">
            <CardContent className="p-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/sign-up" className="font-semibold text-primary hover:underline">
                Sign up
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

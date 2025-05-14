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
import { toast } from 'sonner';

// === Define Icons ===
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

export default function SignupPage() {
  const router = useRouter();
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingSignup, setIsLoadingSignup] = useState(false);
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(
    null
  );

  // Form validation states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Effect to change the icon periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIconIndex(prevIndex => (prevIndex + 1) % icons.length);
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  // Get the current icon component based on the index
  const CurrentIcon = icons[currentIconIndex];

  // Handle input changes and validate in real-time
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear errors when user starts typing again
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Password strength check
    if (name === 'password') {
      checkPasswordStrength(value);

      // Check if confirm password matches
      if (formData.confirmPassword && formData.confirmPassword !== value) {
        setFormErrors(prev => ({
          ...prev,
          confirmPassword: 'Passwords do not match',
        }));
      } else if (formData.confirmPassword) {
        setFormErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }

    // Confirm password validation
    if (name === 'confirmPassword') {
      if (value !== formData.password) {
        setFormErrors(prev => ({
          ...prev,
          confirmPassword: 'Passwords do not match',
        }));
      } else {
        setFormErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  // Check password strength
  const checkPasswordStrength = (password: string) => {
    if (password.length < 8) {
      setPasswordStrength('weak');
      return;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strength =
      hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars
        ? 'strong'
        : (hasUpperCase || hasLowerCase) && (hasNumbers || hasSpecialChars)
          ? 'medium'
          : 'weak';

    setPasswordStrength(strength);
  };

  // Validate form before submission
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...formErrors };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  // Handle signup form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoadingSignup(true);
    setSignupError(null);

    try {
      // Call your API to register the user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create account');
      }

      // Show success message
      toast.success('Account created successfully!');

      // Sign in the user automatically after successful registration
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        // If auto sign-in fails, redirect to sign-in page
        router.push('/signin');
      } else if (signInResult?.url) {
        // Redirect to onboarding or dashboard
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSignupError(
        error instanceof Error ? error.message : 'Failed to create account. Please try again.'
      );
      setIsLoadingSignup(false);
    }
  };

  // Handle Google sign-up
  const handleGoogleSignup = async () => {
    setIsLoadingGoogle(true);
    setSignupError(null);

    try {
      await signIn('google', {
        callbackUrl: '/onboarding',
      });
      // The redirect is handled by NextAuth.js
    } catch (error) {
      console.error('Google sign-up error:', error);
      setSignupError('Failed to sign up with Google. Please try again.');
      setIsLoadingGoogle(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
        {/* Left Column: Branding & Visuals */}
        <motion.div
          className="hidden min-h-[250px] flex-col items-center justify-center space-y-6 text-center md:flex"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="relative h-12 w-12">
            <AnimatePresence mode="wait">
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
            Join Our Community. <br /> Start Your Journey.
          </motion.h1>

          <motion.p className="text-muted-foreground" variants={itemVariants}>
            Create your <span className="font-semibold text-primary">Crowdfundify</span> account and
            bring your ideas to life.
          </motion.p>
        </motion.div>

        {/* Right Column: Signup Form */}
        <div className="flex w-full flex-col items-center justify-center space-y-6">
          {/* Signup Card */}
          <Card className="w-full max-w-sm border-border/40 shadow-sm">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-fit md:hidden">
                <IconIdea />
              </div>
              <CardTitle className="text-2xl font-semibold tracking-tight">Sign Up</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name input */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`h-10 bg-secondary/30 border-border/40 focus:border-primary focus:ring-primary ${formErrors.name ? 'border-red-500' : ''}`}
                    disabled={isLoadingSignup || isLoadingGoogle}
                  />
                  {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
                </div>

                {/* Email input */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`h-10 bg-secondary/30 border-border/40 focus:border-primary focus:ring-primary ${formErrors.email ? 'border-red-500' : ''}`}
                    disabled={isLoadingSignup || isLoadingGoogle}
                  />
                  {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
                </div>

                {/* Password input */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`h-10 bg-secondary/30 border-border/40 focus:border-primary focus:ring-primary ${formErrors.password ? 'border-red-500' : ''}`}
                    disabled={isLoadingSignup || isLoadingGoogle}
                  />
                  {formErrors.password && (
                    <p className="text-xs text-red-500">{formErrors.password}</p>
                  )}
                  {passwordStrength && formData.password && !formErrors.password && (
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="h-1 flex-1 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className={`h-full ${passwordStrength === 'weak' ? 'w-1/3 bg-red-500' : passwordStrength === 'medium' ? 'w-2/3 bg-yellow-500' : 'w-full bg-green-500'}`}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {passwordStrength === 'weak'
                          ? 'Weak'
                          : passwordStrength === 'medium'
                            ? 'Medium'
                            : 'Strong'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm Password input */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`h-10 bg-secondary/30 border-border/40 focus:border-primary focus:ring-primary ${formErrors.confirmPassword ? 'border-red-500' : ''}`}
                    disabled={isLoadingSignup || isLoadingGoogle}
                  />
                  {formErrors.confirmPassword && (
                    <p className="text-xs text-red-500">{formErrors.confirmPassword}</p>
                  )}
                </div>

                {/* Sign up button */}
                <Button
                  type="submit"
                  className="w-full h-9 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isLoadingSignup || isLoadingGoogle}
                  aria-disabled={isLoadingSignup || isLoadingGoogle}
                >
                  {isLoadingSignup ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>

              {/* Separator */}
              <div className="relative my-6">
                <Separator className="absolute left-0 top-1/2 w-full -translate-y-1/2 transform" />
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground font-medium">OR</span>
                </div>
              </div>

              {/* Google signup button */}
              <Button
                variant="secondary"
                className="w-full h-9 border border-transparent hover:bg-secondary/60"
                onClick={handleGoogleSignup}
                disabled={isLoadingGoogle || isLoadingSignup}
                aria-disabled={isLoadingGoogle || isLoadingSignup}
              >
                {isLoadingGoogle ? (
                  <span className="animate-spin mr-2">⏳</span>
                ) : (
                  <FaGoogle className="mr-2 h-4 w-4" />
                )}
                Sign up with Google
              </Button>

              {/* Error message display */}
              {signupError && (
                <div className="mt-2 text-center text-sm text-red-500">{signupError}</div>
              )}
            </CardContent>
          </Card>

          {/* Sign In Card/Link */}
          <Card className="w-full max-w-sm border-border/40 shadow-sm">
            <CardContent className="p-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/signin" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

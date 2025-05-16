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
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Progress } from '@/components/ui/progress';

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
      const response = await fetch('/api/auth/signup', {
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
        throw new Error(data.message || 'Registration failed');
      }

      // Success - sign in the user
      toast.success('Account created successfully! Signing you in...');

      // Sign in the user
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        // If sign-in fails after registration, redirect to sign-in page
        toast.info('Please sign in with your new account');
        router.push('/signin');
      } else {
        // Redirect to onboarding
        router.push('/onboarding');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setSignupError(error.message || 'Failed to create account. Please try again.');
      setIsLoadingSignup(false);
    }
  };

  // Handle Google signup
  const handleGoogleSignup = async () => {
    setIsLoadingGoogle(true);
    setSignupError(null);

    try {
      await signIn('google', {
        callbackUrl: '/onboarding',
      });
      // The redirect is handled by NextAuth.js
    } catch (error) {
      console.error('Google sign-in error:', error);
      setSignupError('Failed to sign in with Google. Please try again.');
      setIsLoadingGoogle(false);
    }
  };

  // Password strength indicator color
  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'strong':
        return 'bg-green-500';
      default:
        return 'bg-slate-200';
    }
  };

  // Password strength progress value
  const getPasswordStrengthProgress = () => {
    switch (passwordStrength) {
      case 'weak':
        return 33;
      case 'medium':
        return 66;
      case 'strong':
        return 100;
      default:
        return 0;
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
            Join Our Community. <br /> Launch Your Ideas.
          </motion.h1>

          <motion.p className="text-lg text-muted-foreground max-w-md" variants={itemVariants}>
            Create your <span className="font-semibold text-primary">Crowdfundify</span> account and
            start raising funds with blockchain technology.
          </motion.p>

          <motion.div variants={itemVariants} className="py-4">
            <span className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/signin" className="font-medium text-primary hover:underline">
                Sign In
              </Link>
            </span>
          </motion.div>
        </motion.div>

        {/* Right Column: Signup Form */}
        <div className="flex w-full flex-col items-center justify-center">
          <Card className="w-full max-w-md border-border/40 shadow-md">
            <CardHeader className="space-y-1">
              <div className="mx-auto mb-2 flex justify-center lg:hidden">
                <CurrentIcon />
              </div>
              <CardTitle className="text-2xl font-semibold text-center">
                Create an Account
              </CardTitle>
              <CardDescription className="text-center">
                Join thousands of creators and backers
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
              {signupError && (
                <Alert variant="destructive" className="mb-4">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertDescription>{signupError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="h-11"
                  />
                  {formErrors.name && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="h-11"
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="h-11"
                  />
                  {formData.password && (
                    <div className="mt-2 space-y-1">
                      <Progress
                        value={getPasswordStrengthProgress()}
                        className={`h-1 ${getPasswordStrengthColor()}`}
                      />
                      <p className="text-xs text-muted-foreground flex justify-between">
                        <span>Password strength:</span>
                        <span
                          className={
                            passwordStrength === 'weak'
                              ? 'text-red-500'
                              : passwordStrength === 'medium'
                                ? 'text-yellow-500'
                                : 'text-green-500'
                          }
                        >
                          {passwordStrength || 'None'}
                        </span>
                      </p>
                    </div>
                  )}
                  {formErrors.password && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="h-11"
                  />
                  {formErrors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.confirmPassword}</p>
                  )}
                </div>

                <Button type="submit" className="w-full h-11" disabled={isLoadingSignup}>
                  {isLoadingSignup ? 'Creating Account...' : 'Sign Up'}
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
                onClick={handleGoogleSignup}
                disabled={isLoadingGoogle}
              >
                <FaGoogle className="h-4 w-4" />
                {isLoadingGoogle ? 'Connecting...' : 'Google'}
              </Button>
            </CardContent>

            <CardFooter className="flex justify-center border-t p-4 lg:hidden">
              <div className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/signin" className="font-medium text-primary hover:underline">
                  Sign In
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

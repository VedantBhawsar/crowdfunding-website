'use client';
import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { FaGithub, FaGoogle, FaTwitter } from 'react-icons/fa';
import { LiteralUnion, signIn } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers/index';

export default function SignInPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSignin(provider: LiteralUnion<BuiltInProviderType> | undefined) {
    setIsSubmitting(true);
    signIn(provider, {
      redirect: true,
      callbackUrl: '/onboarding',
    });
  }

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="font-bold text-center">
            Welcome back to <span className="text-primary">Crowdfundify</span>
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-between gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="w-full"
              onClick={() => {}}
              disabled={isSubmitting}
            >
              <FaTwitter className="h-2 w-2" />
              Continue with Twitter
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="w-full"
              onClick={() => handleSignin('github')}
              disabled={isSubmitting}
            >
              <FaGithub className="h-2 w-2" />
              Continue with Github
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="w-full"
              onClick={() => handleSignin('google')}
              disabled={isSubmitting}
            >
              <FaGoogle className="h-2 w-2" />
              Continue with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

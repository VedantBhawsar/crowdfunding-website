"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FaGithub, FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { Metadata } from "next";

// export const metadata = {
//   title: "Login to Your Account - Secure Access | YourSite",
//   description:
//     "Sign in to YourSite using your email and password or log in with Google or GitHub for a fast, secure experience.",
// } satisfies Metadata;

export default function SignInPage() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
  }

  return (
    <>
      <div className="w-full flex justify-center items-center h-[80vh]">
        <Card className="min-w-[400px] min-h-[450px]">
          <CardHeader>
            <CardTitle className="text-2xl">Sign In to Your Account</CardTitle>
            <CardDescription className="text-base">
              Enter your email and password to access your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-3">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    required
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                  />
                </div>
                <div>
                  <Button className="w-full h-11">
                    <Label className="font-bold text-base">Sign In</Label>
                  </Button>
                </div>
              </div>
            </form>
            <Separator className="my-4" />
            <div className="flex justify-between gap-4">
              <Button variant={"outline"} className="flex-1 h-12">
                <FaGoogle size={18} />
                <Label className="ml-2">Sign in with Google</Label>
              </Button>
              <Button variant={"outline"} className="flex-1 h-12">
                <FaGithub size={18} />
                <Label className="ml-2">Sign in with GitHub</Label>
              </Button>
            </div>
            <Separator className="mt-4 mb-2" />
            <Label>
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-primary hover:underline">
                Register here
              </Link>
            </Label>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

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

export default function SignUpPage() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
  }

  return (
    <>
      <div className="w-full flex justify-center items-center h-[80vh]">
        <Card className="min-w-[400px] min-h-[500px]">
          <CardHeader>
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription className="text-base">
              Sign up to start funding or creating campaigns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-3">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
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
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
                <div>
                  <Button className="w-full h-11">
                    <Label className="font-bold text-base">Sign Up</Label>
                  </Button>
                </div>
              </div>
            </form>
            <Separator className="my-4" />
            <div className="flex justify-between gap-4">
              <Button variant={"outline"} className="flex-1 h-12">
                <FaGoogle size={18} />
                <Label className="ml-2">Sign up with Google</Label>
              </Button>
              <Button variant={"outline"} className="flex-1 h-12">
                <FaGithub size={18} />
                <Label className="ml-2">Sign up with GitHub</Label>
              </Button>
            </div>
            <Separator className="mt-4 mb-2" />
            <Label>
              Already have an account?{" "}
              <Link href="/sign-in" className="text-primary hover:underline">
                Sign in here
              </Link>
            </Label>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

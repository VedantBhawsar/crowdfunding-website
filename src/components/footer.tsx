"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Github,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/crowdfundify", label: "Twitter" },
  {
    icon: Facebook,
    href: "https://facebook.com/crowdfundify",
    label: "Facebook",
  },
  {
    icon: Instagram,
    href: "https://instagram.com/crowdfundify",
    label: "Instagram",
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com/company/crowdfundify",
    label: "LinkedIn",
  },
  { icon: Github, href: "https://github.com/crowdfundify", label: "GitHub" },
];

function Footer() {
  const animationSettings = {
    whileInView: { opacity: 1, y: 0 },
    initial: { opacity: 0, y: 20 },
    transition: { duration: 0.6 },
    viewport: { once: true },
  };

  return (
    <footer className="border-t bg-background ">
      <motion.div className="max-w-7xl py-12 pb-3 mx-auto">
        <div className="grid md:grid-cols-3 gap-8" {...animationSettings}>
          <div className="flex flex-col space-y-4" {...animationSettings}>
            <div>
              <h1 className="text-2xl font-bold text-primary">Crowdfundify</h1>
              <p className="text-base text-muted-foreground mt-2">
                Empowering dreams through Crowdfundify crowdfunding
              </p>
            </div>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-base font-semibold text-foreground mb-4">
                Platform
              </h3>
              <ul className="space-y-2">
                {["Browse Projects", "Launch Campaign", "How It Works"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-base text-muted-foreground hover:text-primary transition-colors "
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground mb-4">
                Company
              </h3>
              <ul className="space-y-2">
                {["About Us", "Contact", "Careers"].map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase().replace(/\s+/g, "")}`}
                      className="text-base text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-foreground mb-4">
              Stay Updated
            </h3>
            <div className="flex flex-col space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background"
              />
              <Button>
                <Mail className="mr-2 h-4 w-4" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center text-lg text-muted-foreground mt-8 pt-4 border-t">
          &copy; {new Date().getFullYear()} Crowdfundify. All rights reserved.
        </div>
      </motion.div>
    </footer>
  );
}

export default Footer;

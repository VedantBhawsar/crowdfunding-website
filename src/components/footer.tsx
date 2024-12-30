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

function Footer() {
  const socialLinks = [
    {
      icon: Twitter,
      href: "https://twitter.com/crowdfundify",
      label: "Twitter",
    },
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
    {
      icon: Github,
      href: "https://github.com/crowdfundify",
      label: "GitHub",
    },
  ];

  const animationSettings = {
    whileInView: { opacity: 1, y: 0 },
    initial: { opacity: 0, y: 20 },
    transition: { duration: 0.6 },
    viewport: { once: true },
  };

  return (
    <footer className="bg-white border-t">
      <div className="mx-auto px-4 py-12 pb-3 max-w-7xl">
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          {...animationSettings}
        >
          {/* Brand Section */}
          <motion.div
            className="flex flex-col space-y-4"
            {...animationSettings}
          >
            <div>
              <h1 className="text-2xl font-bold text-indigo-600">
                Crowdfundify
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Empowering dreams through decentralized crowdfunding
              </p>
            </div>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-500 hover:text-indigo-600"
                  aria-label={social.label}
                  {...animationSettings}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div className="grid grid-cols-2 gap-4" {...animationSettings}>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Platform
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/projects"
                    className="text-sm text-gray-500 hover:text-indigo-600"
                  >
                    Browse Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/launch"
                    className="text-sm text-gray-500 hover:text-indigo-600"
                  >
                    Launch Campaign
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-it-works"
                    className="text-sm text-gray-500 hover:text-indigo-600"
                  >
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Company
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-gray-500 hover:text-indigo-600"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-gray-500 hover:text-indigo-600"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-sm text-gray-500 hover:text-indigo-600"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Newsletter / Contact */}
          <motion.div {...animationSettings}>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Stay Updated
            </h3>
            <motion.div
              className="flex flex-col space-y-4"
              {...animationSettings}
            >
              <motion.div
                className="flex items-center bg-gray-50 rounded-lg "
                {...animationSettings}
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-transparent w-full text-sm focus:outline-none"
                />
              </motion.div>
              <Button
                className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors"

              >
                <Mail/>
                Subscribe
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="text-center text-sm text-gray-500 mt-8 pt-4 border-t"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
        >
          &copy; {new Date().getFullYear()} Crowdfundify. All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;

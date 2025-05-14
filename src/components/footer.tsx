'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Linkedin, Facebook, Instagram, Github } from 'lucide-react';
import Link from 'next/link';
import { Input } from './ui/input';
import { Button } from './ui/button';

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Facebook, href: '#', label: 'Facebook' },
];

const footerLinks = {
  platform: [
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Browse Campaigns', href: '/campaigns' },
    { name: 'Launch Campaign', href: '/campaigns/create' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Community', href: '/community' },
  ],
  resources: [
    { name: 'Blockchain Basics', href: '/resources/blockchain-basics' },
    { name: 'Smart Contract Audits', href: '/resources/audits' },
    { name: 'Developer Docs', href: '/docs' },
    { name: 'Governance', href: '/governance' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Contact', href: '/contact' },
  ],
};

function Footer() {
  return (
    <footer className="bg-primary">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 text-white mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-2">
                <span className="text-primary font-bold">C</span>
              </div>
              <span className="text-xl font-bold">CrowdChain</span>
            </div>
            <p className="text-white/70 text-sm mb-4">
              Decentralized crowdfunding powered by blockchain technology for transparent, secure
              fundraising.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 mt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <div className="text-white/50 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} CrowdChain, all rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link
              href="/terms"
              className="text-white/50 hover:text-white text-sm transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/privacy"
              className="text-white/50 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

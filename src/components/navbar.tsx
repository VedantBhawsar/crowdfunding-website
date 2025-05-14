'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, Moon, Sun, X, Factory } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { Skeleton } from './ui/skeleton';

const navLinks = [
  { label: 'Home', url: '/' },
  { label: 'About', url: '/about' },
  { label: 'Campaigns', url: '/campaigns' },
  { label: 'Contact', url: '/contact' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data, status } = useSession();
  const { setTheme } = useTheme();

  const menuVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      transition: { when: 'afterChildren' },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center font-bold text-xl text-primary">
            <Factory className="h-8 w-8 text-teal-600" />
            <span className="ml-2 text-2xl font-bold text-gray-800">Crowdfundify</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.url}
                className="text-gray-600 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Auth/Avatar/Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' ? (
              <Skeleton className="w-12 h-8" />
            ) : status === 'unauthenticated' ? (
              <>
                <Link href="/signin">
                  <Button variant="outline" className="rounded-lg px-6 py-2.5 text-sm font-semibold">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-teal-700 hover:bg-teal-800 text-white rounded-lg px-6 py-2.5 text-sm font-semibold">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-8 h-8 cursor-pointer">
                    <AvatarImage src={data?.user?.image || ''} alt={data?.user?.name || ''} />
                    <AvatarFallback />
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/account">Account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden border-t bg-slate-50/95 backdrop-blur-md"
            >
              <motion.ul
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex flex-col p-4 space-y-4"
              >
                {navLinks.map((link) => (
                  <motion.li key={link.label} variants={itemVariants}>
                    <Link
                      href={link.url}
                      className="block text-gray-600 hover:text-teal-600 px-3 py-2 rounded-md text-base font-medium transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
                <div className="flex flex-col gap-2 pt-4">
                  {status === 'loading' ? (
                    <Skeleton className="w-full h-8" />
                  ) : status === 'unauthenticated' ? (
                    <>
                      <Link href="/signin">
                        <Button variant="outline" className="w-full rounded-lg px-6 py-2.5 text-sm font-semibold">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/signup">
                        <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white rounded-lg px-6 py-2.5 text-sm font-semibold">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Avatar className="w-8 h-8 cursor-pointer">
                          <AvatarImage src={data?.user?.image || ''} alt={data?.user?.name || ''} />
                          <AvatarFallback />
                        </Avatar>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuItem asChild>
                            <Link href="/account">Account</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setIsMenuOpen(false); signOut(); }}>Log out</DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;

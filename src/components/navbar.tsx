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
import { Menu, Moon, Sun, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { Skeleton } from './ui/skeleton';

const links = [{ label: 'Campaigns', url: '/campaigns' }];

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
    <nav className="sticky top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md">
      <div className=" max-w-7xl mx-auto">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="font-bold text-xl text-primary">
            Crowdfundify
          </Link>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <ul className="flex gap-6 items-center">
              {links.map((link, index) => (
                <li
                  key={index}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Link
                    href={link.url}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              {status === 'loading' ? (
                <div className="flex gap-2">
                  <Skeleton className="w-12 h-8" />
                </div>
              ) : status === 'unauthenticated' ? (
                <div className="flex gap-2">
                  <Link href="/signin">
                    <Button variant="outline" size="sm">

                      Sign in
                    </Button>
                  </Link>
                </div>
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
            </ul>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden border-t bg-background"
            >
              <motion.ul
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex flex-col p-4 space-y-4"
              >
                {links.map((link, index) => (
                  <motion.li key={index} variants={itemVariants}>
                    <Link
                      href={link.url}
                      className="block text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
                <div className="flex flex-col gap-2 pt-4">
                  <Link href="/signin">
                    <Button variant="outline" className="w-full">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full">Sign up</Button>
                  </Link>
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

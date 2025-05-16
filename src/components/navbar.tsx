'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
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
import { Menu, Moon, Sun, X, Factory, ChevronDown, LogOut, User, PanelRight } from 'lucide-react';
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
  const [isScrolled, setIsScrolled] = useState(false);
  const { data, status } = useSession();
  const { setTheme } = useTheme();
  const pathname = usePathname();

  // Track scroll position to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
    <motion.nav
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed shadow-sm top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white backdrop-blur-md shadow-md' : 'bg-white backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center font-bold text-xl text-primary group">
            <motion.span
              className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 shadow-md mr-2"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Factory className="h-5 w-5 text-white" />
              <motion.span
                className="absolute -inset-1 rounded-lg bg-gradient-to-br from-teal-400 to-teal-500 opacity-0"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.3 }}
                transition={{ duration: 0.2 }}
              ></motion.span>
            </motion.span>
            <span className="ml-1 text-base sm:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
              Crowdfundify
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map(link => {
              const isActive =
                pathname === link.url || (link.url !== '/' && pathname?.startsWith(link.url));

              return (
                <Link
                  key={link.label}
                  href={link.url}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all relative group ${
                    isActive ? 'text-teal-700' : 'text-gray-600 hover:text-teal-600'
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>

                  {/* Active indicator */}
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active-indicator"
                      className="absolute inset-0 bg-teal-50 rounded-md -z-10"
                      transition={{ type: 'spring', duration: 0.6 }}
                    ></motion.span>
                  )}

                  {/* Hover indicator for inactive items */}
                  {!isActive && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-teal-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: Auth/Avatar/Buttons */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {status === 'loading' ? (
              <Skeleton className="w-12 h-8" />
            ) : status === 'unauthenticated' ? (
              <>
                <Link href="/signin">
                  <Button
                    variant="outline"
                    className="rounded-lg px-4 lg:px-6 py-2 lg:py-2.5 text-sm font-semibold shadow-sm hover:shadow transition-shadow"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button className="bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-800 hover:to-teal-700 text-white rounded-lg px-4 lg:px-6 py-2 lg:py-2.5 text-sm font-semibold shadow-md hover:shadow-lg transition-shadow">
                      Sign Up
                    </Button>
                  </motion.div>
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    className="flex items-center space-x-2 px-2 py-1 cursor-pointer rounded-lg hover:bg-slate-100 transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Avatar className="w-8 h-8 border border-slate-200 shadow-sm">
                      <AvatarImage src={data?.user?.image || ''} alt={data?.user?.name || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-teal-400 to-teal-600 text-white">
                        {data?.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center">
                      <span className="text-sm font-medium hidden lg:block max-w-[90px] truncate">
                        {data?.user?.name}
                      </span>
                      <ChevronDown className="h-4 w-4 ml-1.5 text-gray-600" />
                    </div>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[220px] p-1">
                  <DropdownMenuLabel className="text-xs text-gray-500 px-4 py-2">
                    {data?.user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer rounded-md px-4 py-2.5 text-sm font-medium"
                    >
                      <Link href="/account" className="flex items-center gap-2.5">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>My Account</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer rounded-md px-4 py-2.5 text-sm font-medium"
                    >
                      <Link href="/campaigns" className="flex items-center gap-2.5">
                        <PanelRight className="h-4 w-4 text-gray-500" />
                        <span>My Campaigns</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="text-red-600 focus:text-red-600 cursor-pointer rounded-md px-4 py-2.5 text-sm font-medium"
                    >
                      <LogOut className="h-4 w-4 mr-2.5" />
                      Log out
                    </DropdownMenuItem>
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
              className="text-foreground hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              <motion.div
                initial={false}
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5 text-gray-700" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-700" />
                )}
              </motion.div>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md overflow-hidden"
            >
              <motion.ul
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex flex-col p-4 space-y-3"
              >
                {navLinks.map(link => {
                  const isActive =
                    pathname === link.url || (link.url !== '/' && pathname?.startsWith(link.url));

                  return (
                    <motion.li key={link.label} variants={itemVariants}>
                      <Link
                        href={link.url}
                        className={`flex items-center px-3 py-2.5 rounded-md text-base font-medium transition-colors border-l-2 ${
                          isActive
                            ? 'text-teal-700 border-teal-600 bg-teal-50/50'
                            : 'text-gray-700 hover:text-teal-600 border-transparent hover:border-teal-600 hover:bg-teal-50/50'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  );
                })}
                <motion.div variants={itemVariants} className="pt-3 border-t border-slate-200">
                  {status === 'loading' ? (
                    <Skeleton className="w-full h-10 rounded-lg" />
                  ) : status === 'unauthenticated' ? (
                    <div className="flex flex-col gap-2">
                      <Link href="/signin" onClick={() => setIsMenuOpen(false)}>
                        <Button
                          variant="outline"
                          className="w-full rounded-lg px-6 py-2.5 text-sm font-medium shadow-sm"
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                        <Button className="w-full bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-800 hover:to-teal-700 text-white rounded-lg px-6 py-2.5 text-sm font-medium shadow-md">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center space-x-3 mb-3 pb-3 border-b border-slate-200">
                        <Avatar className="w-10 h-10 border border-slate-200">
                          <AvatarImage src={data?.user?.image || ''} alt={data?.user?.name || ''} />
                          <AvatarFallback className="bg-gradient-to-br from-teal-400 to-teal-600 text-white">
                            {data?.user?.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {data?.user?.name}
                          </span>
                          <span className="text-xs text-gray-500 truncate max-w-[200px]">
                            {data?.user?.email}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link href="/account" onClick={() => setIsMenuOpen(false)}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-left rounded-md bg-transparent hover:bg-slate-100 text-gray-700 font-medium"
                          >
                            <User className="h-4 w-4 mr-2" />
                            My Account
                          </Button>
                        </Link>
                        <Link href="/campaigns" onClick={() => setIsMenuOpen(false)}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-left rounded-md bg-transparent hover:bg-slate-100 text-gray-700 font-medium"
                          >
                            <PanelRight className="h-4 w-4 mr-2" />
                            My Campaigns
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left rounded-md bg-transparent hover:bg-red-50 text-red-600 font-medium"
                          onClick={() => {
                            setIsMenuOpen(false);
                            signOut();
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Log out
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;

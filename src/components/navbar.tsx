"use client";
import Link from "next/link";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { signOut, useSession } from "next-auth/react";

const links = [
  {
    label: "Home",
    url: "/",
  },
  {
    label: "Projects",
    url: "/projects",
  },
  {
    label: "About",
    url: "/about",
  },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data } = useSession();

  const menuVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      transition: {
        when: "afterChildren",
      },
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
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto  border-b bg-white/80 flex w-full  z-50 justify-center "
    >
      <div className="w-full  backdrop-blur-md max-w-7xl  mx-auto ">
        <div className="px-5 md:px-10 lg:max-w-7xl w-full py-4 flex justify-between items-center">
          <Link href={"/"} className="text-indigo-600 font-bold text-xl">
            DecentraliFund
          </Link>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="text-indigo-600" />
              ) : (
                <Menu className="text-indigo-600" />
              )}
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <motion.ul
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              className="flex gap-5 items-center"
            >
              <div className="flex gap-4 px-auto">
                {links.map((link, index) => (
                  <motion.li
                    key={index}
                    initial={{
                      opacity: 0,
                      x: -20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "linear",
                      delay: 0.3 * index,
                    }}
                  >
                    <Link
                      href={link.url}
                      className=" text-gray-700 hover:text-indigo-600 hover:font-semibold transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </div>

              <div className="flex gap-2 items-center ml-4">
                <Link href={"/sign-in"}>
                  <Button variant={"outline"} size={"sm"}>
                    Sign in
                  </Button>
                </Link>
                <Link href={"/sign-up"}>
                  <Button
                    size={"sm"}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Sign up
                  </Button>
                </Link>
              </div>

              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {data?.user && (
                      <Avatar className="w-9 h-9 cursor-pointer">
                        <AvatarImage
                          src={data?.user?.image || ""}
                          alt={data?.user?.name || ""}
                        />
                        <AvatarFallback></AvatarFallback>
                      </Avatar>
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Link
                          href="/account"
                          className="flex items-center w-full"
                        >
                          Account
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link
                          href="/projects"
                          className="flex items-center w-full"
                        >
                          Projects
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link
                          href="/settings"
                          className="flex items-center w-full"
                        >
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Log out</DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.ul>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="md:hidden fixed top-16 left-0 right-0 bg-white shadow-lg"
              >
                <motion.ul
                  variants={menuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="flex flex-col p-4 space-y-4"
                >
                  {["Home", "Projects", "About"].map((item, index) => (
                    <motion.li key={item} variants={itemVariants}>
                      <Link
                        href={"/"}
                        className="block text-gray-700 hover:text-indigo-600 hover:font-semibold transition-colors"
                      >
                        {item}
                      </Link>
                    </motion.li>
                  ))}
                  <div className="flex flex-col space-y-2 pt-4">
                    <Link href={"/signin"}>
                      <Button variant={"outline"} className="w-full">
                        Sign in
                      </Button>
                    </Link>
                    <Link href={"/signup"}>
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                        Sign up
                      </Button>
                    </Link>
                  </div>
                </motion.ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

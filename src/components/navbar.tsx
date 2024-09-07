"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="w-full border-b flex items-center justify-center">
      <div className="px-5 md:px-10 lg:max-w-7xl w-full py-5 flex justify-between items-center">
        <Link href={"/"} className="text-primary font-bold text-xl">
          Crowdfunding
        </Link>
        <div>
          <ul className="flex gap-5 items-center">
            <div className="hidden md:flex gap-5 items-center">
              <Link
                href={"/"}
                className="text-sm text-secondary-foreground hover:text-secondary-hover hover:font-semibold"
              >
                Home
              </Link>

              <Link
                className="text-sm text-secondary-foreground hover:text-secondary-hover hover:font-semibold"
                href={"/"}
              >
                Projects
              </Link>

              <Link
                href={"/"}
                className="text-sm text-secondary-foreground hover:text-secondary-hover hover:font-semibold"
              >
                About
              </Link>
            </div>

            <div className="flex gap-2 items-center">
              <Link href={"/sign-in"}>
                <Button variant={"outline"} size={"sm"}>
                  Sign in
                </Button>
              </Link>
              <Link href={"/sign-up"}>
                <Button size={"sm"} variant={"default"}>
                  Sign up
                </Button>
              </Link>
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-9 h-9 cursor-pointer">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      Account
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Projects
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Settings
                      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>GitHub</DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuItem disabled>API</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Button variant={"outline"} className="w-full bg-red-500">
                      Log out
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

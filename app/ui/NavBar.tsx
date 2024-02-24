"use client";
import React from "react";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
} from "@nextui-org/react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { FaCog, FaPlayCircle } from "react-icons/fa";
import Link from "next/link";
import { FaPlay } from "react-icons/fa6";
const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    <Navbar
      maxWidth="2xl"
      isBordered
      isBlurred={false}
      className=""
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <Link href={"/"} className="flex gap-2 items-center text-lg">
          <span className=" text-2xl text-red-600">
            <FaPlay />
          </span>
          <span className=" font-bold">Videos</span>
        </Link>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex items-center gap-4"
        justify="end"
      >
        <Link color="foreground" href="/">
          Home
        </Link>

        <Link color="foreground" href="/settings/">
          Settings
        </Link>
        <ThemeSwitcher />
      </NavbarContent>

      <NavbarMenu className=" flex items-center">
        <Link color="foreground" href="/">
          Home
        </Link>

        <Link href="/live/" color="foreground">
          Live
        </Link>

        <Link color="foreground" href="/settings/">
          Settings
        </Link>
      </NavbarMenu>
    </Navbar>
  );
};
export default NavBar;

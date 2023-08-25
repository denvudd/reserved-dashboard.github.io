import { UserButton } from "@clerk/nextjs";
import React from "react";
import MainNav from "./MainNav";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  return (
    <div className="border-b h-16 flex items-center px-4">
      <div className="">Switcher</div>
      <MainNav className="" />
      <div className="ml-auto flex items-center space-x-4">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;

import { UserButton, auth } from "@clerk/nextjs";
import React from "react";
import MainNav from "./MainNav";
import StoreSwitcher from "./StoreSwitcher";
import { redirect } from "next/navigation";
import db from "@/lib/prisma";
import { ThemeToggle } from "./ui/ThemeToggle";

const Navbar = async ({}) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await db.store.findMany({
    where: {
      userId,
    },
  });
  return (
    <div className="border-b h-16 flex items-center px-4">
      <StoreSwitcher stores={stores} />
      <MainNav className="" />
      <div className="ml-auto flex items-center space-x-4">
        <ThemeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;

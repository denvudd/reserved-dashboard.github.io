"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {}

const MainNav: React.FC<MainNavProps> = ({ className, ...props }) => {
  const pathname = usePathname();
  const { storeId } = useParams();

  const routes = [
    {
      href: `/${storeId}/settings`,
      label: "Settings",
      active: pathname === `/${storeId}/settings`,
    },
  ];
  return (
    <nav className={cn("flex items-center, space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;

import { auth } from "@clerk/nextjs";
import React from "react";
import { redirect } from "next/navigation";
import db from "@/lib/prisma";
import Navbar from "@/components/Navbar";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const { userId } = auth();
  const { storeId } = params;

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await db.store.findFirst({
    where: {
      id: storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div>
      {/* @ts-expect-error server component */}
      <Navbar />
      {children}
    </div>
  );
}

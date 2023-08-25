import SettingsForm from "@/components/forms/SettingsForm";
import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

interface PageProps {
  params: {
    storeId: string;
  };
}

const Page = async ({ params }: PageProps) => {
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

  if (!store) redirect("/");

  return <div className="flex-col">
    <div className="flex-1 space-y-4 p-8 pt-6">
      <SettingsForm store={store} />
    </div>
  </div>;
};

export default Page;

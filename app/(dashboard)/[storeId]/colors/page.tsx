import Colors from "@/components/Colors";
import db from "@/lib/prisma";
import React from "react";

interface PageProps {
  params: {
    storeId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { storeId } = params;

  const colors = await db.color.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Colors colors={colors} />
      </div>
    </div>
  );
};

export default Page;

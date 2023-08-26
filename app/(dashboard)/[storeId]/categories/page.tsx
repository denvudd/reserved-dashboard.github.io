import Categories from "@/components/Categories";
import db from "@/lib/prisma";
import React from "react";

interface PageProps {
  params: {
    storeId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { storeId } = params;

  const categories = await db.category.findMany({
    where: {
      storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Categories categories={categories} />
      </div>
    </div>
  );
};

export default Page;

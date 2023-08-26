import CategoryForm from "@/components/forms/CategoryForm";
import db from "@/lib/prisma";
import React from "react";

interface PageProps {
  params: {
    categoryId: string;
    storeId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { categoryId, storeId } = params;

  const categories = await db.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  const billboards = await db.billboard.findMany({
    where: {
      storeId,
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm category={categories} billboards={billboards} />
      </div>
    </div>
  );
};

export default Page;

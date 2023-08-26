import CategoryForm from "@/components/forms/CategoryForm";
import SizeForm from "@/components/forms/SizeForm";
import db from "@/lib/prisma";
import React from "react";

interface PageProps {
  params: {
    sizeId: string;
    storeId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { sizeId, storeId } = params;

  const size = await db.size.findUnique({
    where: {
      id: sizeId,
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm size={size} />
      </div>
    </div>
  );
};

export default Page;

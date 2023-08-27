import ColorForm from "@/components/forms/ColorForm";
import db from "@/lib/prisma";
import React from "react";

interface PageProps {
  params: {
    colorId: string;
    storeId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { colorId } = params;

  const color = await db.color.findUnique({
    where: {
      id: colorId,
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm color={color} />
      </div>
    </div>
  );
};

export default Page;

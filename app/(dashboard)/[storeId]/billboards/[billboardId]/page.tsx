import BillboardForm from "@/components/forms/BillboardForm";
import db from "@/lib/prisma";
import React from "react";

interface PageProps {
  params: {
    billboardId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { billboardId } = params;

  const billboard = await db.billboard.findUnique({
    where: {
      id: billboardId,
    },
  });

  return <div className="flex flex-col">
    <div className="flex-1 space-y-4 p-8 pt-6">
      <BillboardForm billboard={billboard} />
    </div>
  </div>;
};

export default Page;

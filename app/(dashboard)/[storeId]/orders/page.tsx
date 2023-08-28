import Orders from "@/components/Orders";
import db from "@/lib/prisma";
import React from "react";

interface PageProps {
  params: {
    storeId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { storeId } = params;

  const orders = await db.order.findMany({
    where: {
      storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Orders orders={orders} />
      </div>
    </div>
  );
};

export default Page;

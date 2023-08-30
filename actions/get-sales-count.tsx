import db from "@/lib/prisma";

export const getSalesCount = async (storeId: string) => {
  const selesCount = await db.order.count({
    where: {
      storeId,
      isPaid: true,
    },
  });

  return selesCount;
};

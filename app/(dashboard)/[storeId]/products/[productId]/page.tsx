import ProductForm from "@/components/forms/ProductForm";
import db from "@/lib/prisma";
import React from "react";

interface PageProps {
  params: {
    productId: string;
    storeId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { productId, storeId } = params;

  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      images: true,
    },
  });

  const categories = await db.category.findMany({
    where: {
      storeId: storeId,
    },
  });

  const sizes = await db.size.findMany({
    where: {
      storeId: storeId,
    },
  });

  const colors = await db.color.findMany({
    where: {
      storeId: storeId,
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          product={product}
          categories={categories}
          sizes={sizes}
          colors={colors}
        />
      </div>
    </div>
  );
};

export default Page;

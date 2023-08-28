"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/Button";
import Heading from "./ui/Heading";
import { Separator } from "./ui/Separator";
import { useParams, useRouter } from "next/navigation";
import {
  type Size,
  type Product,
  type Category,
  type Color,
} from "@prisma/client";
import { format } from "date-fns";
import { DataTable } from "./ui/DataTable";
import ApiList from "./ui/ApiList";
import { priceFormatter } from "@/lib/utils";
import { type ProductColumn, columns } from "./tables/products/columns";

interface ProductsProps {
  products: ({
    category: Category;
    size: Size;
    color: Color;
  } & Product)[];
}

const Products: React.FC<ProductsProps> = ({ products }) => {
  const router = useRouter();
  const { storeId } = useParams();

  const formattedProducts: ProductColumn[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    price: priceFormatter(Number(product.price)),
    size: product.size.name,
    category: product.category.name,
    color: product.color.value,
    createdAt: format(product.createdAt, "Pp"),
    updatedAt: format(product.updatedAt, "Pp"),
  }));

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${products.length})`}
          description="Menage products for you store."
        />
        <Button onClick={() => router.push(`/${storeId}/products/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={formattedProducts} searchKey="name" />
      <Heading title="API" description="API calls for products" />
      <Separator />
      <ApiList entityIdName="productId" entityName="products" />
    </>
  );
};

export default Products;

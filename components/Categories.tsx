"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/Button";
import Heading from "./ui/Heading";
import { Separator } from "./ui/Separator";
import { useParams, useRouter } from "next/navigation";
import { type Billboard, type Category } from "@prisma/client";
import { format } from "date-fns";
import { DataTable } from "./ui/DataTable";
import ApiList from "./ui/ApiList";
import { type CategoryColumn, columns } from "./tables/categories/columns";

interface CategoriesProps {
  categories: ({ billboard: Billboard } & Category)[];
}

const Categories: React.FC<CategoriesProps> = ({ categories }) => {
  const router = useRouter();
  const { storeId } = useParams();

  const formattedCategories: CategoryColumn[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    billboardLabel: category.billboard.label,
    createdAt: format(category.createdAt, "Pp"),
    updatedAt: format(category.updatedAt, "Pp"),
  }));

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${categories.length})`}
          description="Menage categories for you store."
        />
        <Button onClick={() => router.push(`/${storeId}/categories/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable
        columns={columns}
        data={formattedCategories}
        searchKey="name"
      />
      <Heading title="API" description="API calls for categories" />
      <Separator />
      <ApiList entityIdName="categoryId" entityName="categories" />
    </>
  );
};

export default Categories;

"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/Button";
import Heading from "./ui/Heading";
import { Separator } from "./ui/Separator";
import { useParams, useRouter } from "next/navigation";
import { type Color } from "@prisma/client";
import { format } from "date-fns";
import { DataTable } from "./ui/DataTable";
import ApiList from "./ui/ApiList";
import { type ColorColumn, columns } from "./tables/colors/columns";

interface ColorsProps {
  colors: Color[];
}

const Colors: React.FC<ColorsProps> = ({ colors }) => {
  const router = useRouter();
  const { storeId } = useParams();

  const formattedColors: ColorColumn[] = colors.map((color) => ({
    id: color.id,
    name: color.name,
    value: color.value,
    createdAt: format(color.createdAt, "Pp"),
    updatedAt: format(color.updatedAt, "Pp"),
  }));

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colors (${colors.length})`}
          description="Menage colors for you store."
        />
        <Button onClick={() => router.push(`/${storeId}/colors/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={formattedColors} searchKey="name" />
      <Heading title="API" description="API calls for colors" />
      <Separator />
      <ApiList entityIdName="colorId" entityName="colors" />
    </>
  );
};

export default Colors;

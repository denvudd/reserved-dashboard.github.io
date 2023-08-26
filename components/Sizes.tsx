"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/Button";
import Heading from "./ui/Heading";
import { Separator } from "./ui/Separator";
import { useParams, useRouter } from "next/navigation";
import { type Size} from "@prisma/client";
import { format } from "date-fns";
import { DataTable } from "./ui/DataTable";
import ApiList from "./ui/ApiList";
import { type SizeColumn, columns } from "./tables/sizes/columns";

interface SizesProps {
  sizes: Size[];
}

const Sizes: React.FC<SizesProps> = ({ sizes }) => {
  const router = useRouter();
  const { storeId } = useParams();

  const formattedSizes: SizeColumn[] = sizes.map((size) => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: format(size.createdAt, "Pp"),
    updatedAt: format(size.updatedAt, "Pp"),
  }));

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes (${sizes.length})`}
          description="Menage sizes for you store."
        />
        <Button onClick={() => router.push(`/${storeId}/sizes/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable
        columns={columns}
        data={formattedSizes}
        searchKey="name"
      />
      <Heading title="API" description="API calls for sizes" />
      <Separator />
      <ApiList entityIdName="sizeId" entityName="sizes" />
    </>
  );
};

export default Sizes;

"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/Button";
import Heading from "./ui/Heading";
import { Separator } from "./ui/Separator";
import { useParams, useRouter } from "next/navigation";
import { type Billboard } from "@prisma/client";
import {
  columns,
  type BillboardColumn,
} from "@/components/tables/billboards/columns";
import { format } from "date-fns";
import { DataTable } from "./ui/DataTable";
import ApiList from "./ui/ApiList";

interface BillboardsProps {
  billboards: Billboard[];
}

const Billboards: React.FC<BillboardsProps> = ({ billboards }) => {
  const router = useRouter();
  const { storeId } = useParams();

  const formattedBillboards: BillboardColumn[] = billboards.map(
    (billboard) => ({
      id: billboard.id,
      label: billboard.label,
      createdAt: format(billboard.createdAt, "Pp"),
      updatedAt: format(billboard.updatedAt, "Pp"),
    })
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${billboards.length})`}
          description="Menage billboards for you store."
        />
        <Button onClick={() => router.push(`/${storeId}/billboards/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable
        columns={columns}
        data={formattedBillboards}
        searchKey="label"
      />
      <Heading title="API" description="API calls for categories" />
      <Separator />
      <ApiList entityIdName="billboardId" entityName="billboards" />
    </>
  );
};

export default Billboards;

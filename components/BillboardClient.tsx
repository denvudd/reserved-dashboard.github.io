"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/Button";
import Heading from "./ui/Heading";
import { Separator } from "./ui/Separator";
import { useParams, useRouter } from "next/navigation";

export const BillboardClient = () => {
  const router = useRouter();
  const { storeId } = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="Billboards (0)"
          description="Menage billboards for you store."
        />
        <Button onClick={() => router.push(`/${storeId}/billboards/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
    </>
  );
};

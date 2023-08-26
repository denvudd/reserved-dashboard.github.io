"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";

export type BillboardColumn = {
  id: string;
  label: string;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
  },
  {
    accessorKey: "updatedAt",
    header: "Last update",
  },
  { id: "actions", cell: ({ row }) => <CellAction column={row.original} /> },
];

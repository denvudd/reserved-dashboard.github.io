"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";

export type SizeColumn = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<SizeColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
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

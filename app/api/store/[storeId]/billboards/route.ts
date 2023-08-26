import db from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
  params: {
    storeId: string;
  };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { storeId } = params;

    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const billboards = await db.billboard.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    // DEV
    console.log("[BILLBOARDS GET]:", error);

    return new NextResponse("Internal error", { status: 500 });
  }
}

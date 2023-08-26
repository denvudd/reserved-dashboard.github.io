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

    const sizes = await db.size.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json(sizes);
  } catch (error) {
    // DEV
    console.log("[SIZES GET]:", error);

    return new NextResponse("Internal error", { status: 500 });
  }
}

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

    const categories = await db.category.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    // DEV
    console.log("[CATEGORIES GET]:", error);

    return new NextResponse("Internal error", { status: 500 });
  }
}

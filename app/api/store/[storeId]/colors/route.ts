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
      return new NextResponse("Color ID is required", { status: 400 });
    }

    const colors = await db.color.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    // DEV
    console.log("[COLORS GET]:", error);

    return new NextResponse("Internal error", { status: 500 });
  }
}

import db from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

interface Params {
  params: {
    storeId: string;
    colorId: string;
  };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { colorId, storeId } = params;

    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Color ID is required", { status: 400 });
    }

    const color = await db.color.findUnique({
      where: {
        id: colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    // DEV
    console.log("[COLOR GET]:", error);

    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data passed", { status: 422 });
    }

    return new NextResponse("Internal error", { status: 500 });
  }
}

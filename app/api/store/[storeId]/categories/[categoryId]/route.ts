import db from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

interface Params {
  params: {
    storeId: string;
    categoryId: string;
  };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { categoryId, storeId } = params;

    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
    }

    const category = await db.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        billboard: true,
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    // DEV
    console.log("[CATEGORY GET]:", error);

    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data passed", { status: 422 });
    }

    return new NextResponse("Internal error", { status: 500 });
  }
}

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
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("categoryId") || undefined;
    const isFeatured = searchParams.get("categoryId");

    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const products = await db.product.findMany({
      where: {
        storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    // DEV
    console.log("[PRODUCTS GET]:", error);

    return new NextResponse("Internal error", { status: 500 });
  }
}

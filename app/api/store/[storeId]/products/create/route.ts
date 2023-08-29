import db from "@/lib/prisma";
import { ProductValidator } from "@/lib/validators/product";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { z } from "zod";

interface Params {
  params: {
    storeId: string;
  };
}

export async function POST(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { storeId } = params;

    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = ProductValidator.parse(body);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const isOwner = await db.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!isOwner) {
      return new NextResponse("You are not owner of this store", {
        status: 403,
      });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    const productExist = await db.product.findFirst({
      where: {
        name,
        storeId,
      },
    });

    if (productExist) {
      return new NextResponse("Product already exists", { status: 409 });
    }

    const product = await db.product.create({
      data: {
        name,
        storeId,
        price,
        isFeatured,
        isArchived,
        categoryId,
        colorId,
        sizeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    // DEV
    console.log("[PRODUCT CREATE]:", error);

    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new NextResponse("Internal error", { status: 500 });
  }
}

import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { CategoryValidator } from "@/lib/validators/category";

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

    const { billboardId, name } = CategoryValidator.parse(body);

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

    const categoryExist = await db.category.findFirst({
      where: {
        name,
        storeId,
      },
    });

    if (categoryExist) {
      return new NextResponse("Category already exists", { status: 409 });
    }

    const category = await db.category.create({
      data: {
        name,
        billboardId,
        storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    // DEV
    console.log("[CATEGORY CREATE]:", error);

    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new NextResponse("Internal error", { status: 500 });
  }
}

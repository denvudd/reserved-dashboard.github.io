import db from "@/lib/prisma";
import { ColorValidator } from "@/lib/validators/color";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { z } from "zod";

interface Params {
  params: {
    storeId: string;
    colorId: string;
  };
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    const { storeId, colorId } = params;

    const body = await req.json();

    const { name, value } = ColorValidator.parse(body);

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Color ID is required", { status: 400 });
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

    const color = await db.size.updateMany({
      where: {
        id: colorId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    // DEV
    console.log("[COLOR UPDATE]:", error);

    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data passed", { status: 422 });
    }

    return new NextResponse("Internal error", { status: 500 });
  }
}

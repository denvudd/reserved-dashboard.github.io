import db from "@/lib/prisma";
import { ColorValidator } from "@/lib/validators/color";
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

    const { name, value } = ColorValidator.parse(body);

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

    const colorExist = await db.color.findFirst({
      where: {
        name,
        value,
        storeId,
      },
    });

    if (colorExist) {
      return new NextResponse("Color already exists", { status: 409 });
    }

    const color = await db.color.create({
      data: {
        name,
        value,
        storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    // DEV
    console.log("[COLOR CREATE]:", error);

    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new NextResponse("Internal error", { status: 500 });
  }
}

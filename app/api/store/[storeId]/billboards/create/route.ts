import db from "@/lib/prisma";
import { BillboardValidator } from "@/lib/validators/billboard";
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

    const { imageUrl, label } = BillboardValidator.parse(body);

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

    const billboardExist = await db.billboard.findFirst({
      where: {
        label,
        storeId,
      },
    });

    if (billboardExist) {
      return new NextResponse("Billboard already exists", { status: 409 });
    }

    const billboard = await db.billboard.create({
      data: {
        label,
        imageUrl,
        storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    // DEV
    console.log("[BILLBOARD CREATE]:", error);

    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new NextResponse("Internal error", { status: 500 });
  }
}

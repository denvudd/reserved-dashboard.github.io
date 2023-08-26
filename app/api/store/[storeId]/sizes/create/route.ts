import db from "@/lib/prisma";
import { SizeValidator } from "@/lib/validators/size";
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

    const { name, value } = SizeValidator.parse(body);

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

    const sizeExist = await db.size.findFirst({
      where: {
        name,
        value,
        storeId,
      },
    });

    if (sizeExist) {
      return new NextResponse("Size already exists", { status: 409 });
    }

    const size = await db.size.create({
      data: {
        name,
        value,
        storeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    // DEV
    console.log("[SIZE CREATE]:", error);

    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new NextResponse("Internal error", { status: 500 });
  }
}

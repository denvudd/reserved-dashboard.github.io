import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { z } from "zod";

interface Params {
  params: {
    storeId: string;
    sizeId: string;
  };
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    const { storeId, sizeId } = params;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size ID is required", { status: 400 });
    }

    const size = await db.size.deleteMany({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    // DEV
    console.log("[SIZE DELETE]:", error);

    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data passed", { status: 422 });
    }

    return new NextResponse("Internal error", { status: 500 });
  }
}

import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { z } from "zod";

interface Params {
  params: {
    storeId: string;
  };
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    const { storeId } = params;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const store = await db.store.deleteMany({
      where: {
        id: storeId,
        userId,
      }, 
    });

    return NextResponse.json(store);
  } catch (error) {
    // DEV
    console.log("[STORE SETTINGS]:", error);

    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data passed", { status: 422 });
    }

    return new NextResponse("Internal error", { status: 500 });
  }
}

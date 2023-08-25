import db from "@/lib/prisma";
import { SettingsValidator } from "@/lib/validators/settings";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { z } from "zod";

interface Params {
  params: {
    storeId: string;
  };
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    const { storeId } = params;

    const body = await req.json();

    const { name } = SettingsValidator.parse(body);

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const store = await db.store.updateMany({
      where: {
        id: storeId,
        userId,
      },
      data: {
        name,
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

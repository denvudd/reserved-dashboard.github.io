import { z } from "zod";

export const BillboardValidator = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

export type BillboardPayload = z.infer<typeof BillboardValidator>;

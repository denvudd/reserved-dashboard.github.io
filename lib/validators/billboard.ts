import { z } from "zod";

export const BillboardValidator = z.object({
  label: z.string().min(1),
  imageUrl: z
    .string()
    .min(1, "You need to choose some picture for your billboard."),
});

export type BillboardPayload = z.infer<typeof BillboardValidator>;

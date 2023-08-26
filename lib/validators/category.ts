import { z } from "zod";

export const CategoryValidator = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1),
});

export type CategoryPayload = z.infer<typeof CategoryValidator>;

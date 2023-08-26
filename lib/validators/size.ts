import { z } from "zod";

export const SizeValidator = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

export type SizePayload = z.infer<typeof SizeValidator>;

import { z } from "zod";

export const ColorValidator = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#/, "String must be a valid hex code."),
});

export type ColorPayload = z.infer<typeof ColorValidator>;

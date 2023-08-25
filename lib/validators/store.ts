import { z } from "zod";

export const CreateStoreValidator = z.object({
  name: z.string().min(1, "Name must contain at least 1 character(s)").max(100),
});

export type CreateStorePayload = z.infer<typeof CreateStoreValidator>;

import { z } from "zod";

export const SettingsValidator = z.object({
  name: z.string().min(1, "Name must contain at least 1 character(s)").max(100),
});

export type SettingsPayload = z.infer<typeof SettingsValidator>;

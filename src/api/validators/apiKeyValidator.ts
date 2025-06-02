import { z } from "zod";

export const apiKeyCreateValidator = z.object({
    name: z.string(),
    permission: z.enum(["READ", "WRITE"]),
});

export const apiKeyInvalidateValidator = z.object({
    authId: z.string(),
});
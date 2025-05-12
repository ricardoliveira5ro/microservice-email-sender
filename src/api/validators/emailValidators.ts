import { z } from "zod";

export const emailSendingValidator = z.object({
    recipients: z.array(z.object({
        email: z.string(),
    })),
    subject: z.string().max(60),
    text: z.string(),
    category: z.string().max(60),
});
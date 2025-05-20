import { z } from "zod";

export const emailSendingValidator = z.object({
    recipients: z.array(z.object({
        email: z.string(),
    })),
    subject: z.string().max(60),
    text: z.string(),
    category: z.string().max(60),
    scheduledAt: z.string().optional(),
});

export const emailQueryValidator = z.object({
    status: z.enum(['delivery', 'bounce', 'suspension', 'unsubscribe', 'open', 'spam', 'click', 'reject']).optional(),
    subject: z.string().optional(),
    recipient: z.string().optional(),
});
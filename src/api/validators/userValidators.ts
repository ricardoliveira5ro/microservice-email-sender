import { z } from 'zod';

export const userSignUpValidator = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
});

export const userLoginValidator = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const userInvalidateKeyValidator = z.object({
    email: z.string().email(),
    password: z.string(),
    id: z.string(),
});

export const userRecoveryPasswordValidator = z.object({
    email: z.string().email(),
});

export const userResetPasswordValidator = z.object({
    password: z.string(),
});
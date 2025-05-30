import { NextFunction, Request, Response } from "express";
import AppError from "../utils/errors/AppError";

export const jwtMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const headerPayload = req.cookies['email-sender-header-payload'] as string;
    const signature = req.cookies['email-sender-signature'] as string;

    if (!headerPayload || !signature) {
        next(new AppError('Authentication required', 401));
        return;
    }

    const token = `${headerPayload}.${signature}`;

    req.headers.authorization = `Bearer ${token}`;
    next();
};
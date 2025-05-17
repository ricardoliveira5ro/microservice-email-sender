import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

import ApiKey from "../models/apiKey";
import { IUser } from "../models/user";

import AppError from "../utils/errors/AppError";

export const apiKeyAuthorizationMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { authId, key } = req.query as { authId: string; key: string };

    const apiKey = await ApiKey.findById(new ObjectId(authId)).populate('user');
    if (!apiKey) {
        next(new AppError("Invalid API Key", 401));
        return;
    }

    if (!apiKey.isActive) {
        next(new AppError("Invalid API Key", 401));
        return;
    }

    const isMatch = await bcrypt.compare(key, apiKey.key);
    if (!isMatch) {
        next(new AppError("Invalid API Key", 401));
        return;
    }
    
    const user = apiKey.user as unknown as IUser;
    (req as Request & { user: IUser }).user = user;

    next();
};
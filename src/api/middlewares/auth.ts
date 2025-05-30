import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import User, { IUser } from "../models/user";
import AppError from "../utils/errors/AppError";
import config from "../config/config";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = (req.get('Authorization') ?? '').replace('Bearer ', '');
    const { _id: decodedId } = jwt.verify(token, config.jwtSecret) as { _id: string };

    const user = await User.findOne({ _id: decodedId, 'tokens.token': token });

    if (!user) {
        res.clearCookie("type-racer-header-payload");
        res.clearCookie("type-racer-signature");
        
        next(new AppError('Please authenticate', 401));
        return;
    }

    (req as Request & { user: IUser }).user = user;
    next();
};
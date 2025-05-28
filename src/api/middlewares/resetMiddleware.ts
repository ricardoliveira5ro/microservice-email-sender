import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { HydratedDocument } from "mongoose";

import User, { IUser } from "../models/user";
import AppError from "../utils/errors/AppError";

export const resetMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { user: username, resetToken } = req.query as { user: string, resetToken: string };

    const user = await User.findOne({ username });
    if (!user) {
        next(new AppError('User not found', 404));
        return;
    }

    if (!user.passwordResetToken || !user.passwordResetExpiration || !resetToken) {
        next(new AppError('Invalid reset token', 401));
        return;
    }

    const isMatch = await bcrypt.compare(resetToken, user.passwordResetToken);
    if (!isMatch) {
        next(new AppError('Invalid reset token', 401));
        return;
    }

    if (new Date() > user.passwordResetExpiration) {
        user.passwordResetToken = undefined;
        user.passwordResetExpiration = undefined;
        await user.save();

        next(new AppError('Reset token expired', 401));
    }

    (req as Request & { user: HydratedDocument<IUser> }).user = user;

    next();
};
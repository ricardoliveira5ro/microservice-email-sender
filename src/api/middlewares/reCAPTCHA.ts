import { NextFunction, Request, Response } from "express";
import axios from "axios";

import config from "../config/config";
import AppError from "../utils/errors/AppError";

export const reCaptchaMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { captchaValue } = req.body as { captchaValue: string; };
    const { data } = await axios.post<{ success: boolean }>(`https://www.google.com/recaptcha/api/siteverify?secret=${config.recaptchaSiteSecret}&response=${captchaValue}`);
    
    if (!data.success)
        next(new AppError("Invalid reCAPTCHA", 401));    

    next();
};
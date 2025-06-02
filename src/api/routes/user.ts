import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { HydratedDocument } from 'mongoose';

import User, { IUser } from '../models/user';

import sendEmail from '../services/email';
import { reCaptchaMiddleware } from '../middlewares/reCAPTCHA';
import { resetMiddleware } from '../middlewares/resetMiddleware';
import { jwtMiddleware } from '../middlewares/jwt';
import { authMiddleware } from '../middlewares/auth';

import { userLoginValidator, userRecoveryPasswordValidator, userResetPasswordValidator, userSignUpValidator } from '../validators/userValidators';
import AppError from '../utils/errors/AppError';
import recoveryTemplate from '../utils/emails/recoveryTemplate';

const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
    userSignUpValidator.parse(req.body);

    const user = new User(req.body);
    await user.save();
    
    res.send({ user });
});

router.post('/login', reCaptchaMiddleware, async (req: Request, res: Response) => {
    userLoginValidator.parse(req.body);

    const { email, password } = req.body as { email: string; password: string };
    const user = await User.authenticate(email, password);
    const token = await user.generateAuthToken();

    const [header, payload, signature] = token.split('.');

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie('email-sender-header-payload', `${header}.${payload}`, {
        httpOnly: false,
        secure: isProduction ? true : false,
        sameSite: isProduction ? 'strict' : 'lax',
    });
    res.cookie('email-sender-signature', signature, {
        httpOnly: true,
        secure: isProduction ? true : false,
        sameSite: isProduction ? 'strict' : 'lax',
    });
    
    res.send({ user });
});

router.get('/token', [jwtMiddleware, authMiddleware], (req: Request, res: Response) => {
    const { user } = req as Request & { user: IUser };
    res.send({ user });
});

router.post('/recovery', async (req: Request, res: Response) => {
    userRecoveryPasswordValidator.parse(req.body);

    const { email } = req.body as { email: string; };
    const user = await User.findOne({ email });

    if (!user) {
        throw new AppError("User not found", 404);
    }

    const uuid = randomUUID();
    user.passwordResetToken = uuid;
    user.passwordResetExpiration = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    await user.save();

    const link = `${req.headers.origin ?? 'http://localhost:3000'}/reset?user=${user.username}&resetToken=${uuid}`;
    const html = recoveryTemplate(user, link);

    await sendEmail([{ email }], "Password Recovery", html, "Password Recovery");

    res.send({ message: "Recovery email sent" });
});

router.post('/reset', resetMiddleware, async (req: Request, res: Response) => {
    userResetPasswordValidator.parse(req.body);

    const { user } = req as Request & { user: HydratedDocument<IUser> };
    const { password } = req.body as { password: string };

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpiration = undefined;

    await user.save();

    res.send({ message: "Reset successful" });
});

router.get('/reset-token', resetMiddleware, (req: Request, res: Response) => {
    res.send({ message: "Verified with success" });
});

export default router;
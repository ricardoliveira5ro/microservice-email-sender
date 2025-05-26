import { Router, Request, Response } from 'express';
import axios from 'axios';
import crypto from 'crypto';
import { ObjectId } from 'mongodb';

import config from '../config/config';

import User from '../models/user';
import ApiKey from '../models/apiKey';

import AppError from '../utils/errors/AppError';
import { userInvalidateKeyValidator, userLoginValidator, userSignUpValidator } from '../validators/userValidators';

const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
    userSignUpValidator.parse(req.body);

    const user = new User(req.body);
    await user.save();
    
    res.send({ user });
});

router.post('/login', async (req: Request, res: Response) => {
    userLoginValidator.parse(req.body);

    const { email, password } = req.body as { email: string; password: string };
    const user = await User.authenticate(email, password);
    
    res.send({ user });
});

router.get('/generateApiKey', async (req: Request, res: Response) => {
    userLoginValidator.parse(req.body);
    
    const { email, password } = req.body as { email: string; password: string };
    const user = await User.authenticate(email, password);

    const tmpKey = crypto.randomBytes(32).toString("hex");
    const apiKey = new ApiKey({ key: tmpKey, user: user });

    await apiKey.save();
    
    res.send({ authId: apiKey._id, apiKey: tmpKey });
});

router.post('/invalidateApiKey', async (req: Request, res: Response) => {
    userInvalidateKeyValidator.parse(req.body);

    const { email, password, id } = req.body as { email: string; password: string, id: string };
    const user = await User.authenticate(email, password);

    await ApiKey.findByIdAndUpdate(new ObjectId(id), { $set: { isActive: false } });
    
    res.send({ user });
});

router.post('/verify-recaptcha', async (req: Request, res: Response) => {
    const { captchaValue } = req.body as { captchaValue: string; };
    const { data } = await axios.post<{ success: boolean }>(`https://www.google.com/recaptcha/api/siteverify?secret=${config.recaptchaSiteSecret}&response=${captchaValue}`);
    
    if (!data.success)
        throw new AppError("Invalid reCAPTCHA", 401);

    res.send({ success: data.success });
});

export default router;
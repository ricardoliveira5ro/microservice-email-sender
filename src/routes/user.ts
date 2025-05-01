import { Router, Request, Response } from 'express';
import crypto from 'crypto';

import User from '../models/user';
import ApiKey from '../models/apiKey';

const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
    const user = new User(req.body);
    
    const tmpKey = crypto.randomBytes(32).toString("hex");
    const apiKey = new ApiKey({ key: tmpKey, user: user._id });

    await user.save();
    await apiKey.save();
    
    res.send({ user, apiKey: tmpKey });
});

export default router;
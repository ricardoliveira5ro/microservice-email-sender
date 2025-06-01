import { Router, Request, Response } from 'express';

import ApiKey from '../models/apiKey';
import { IUser } from '../models/user';

import { jwtMiddleware } from '../middlewares/jwt';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.get('/all', [jwtMiddleware, authMiddleware], async (req: Request, res: Response) => {
    const { user } = req as Request & { user: IUser };

    const apiKeys = await ApiKey.find({ user: user });
    res.send({ apiKeys });
});

export default router;
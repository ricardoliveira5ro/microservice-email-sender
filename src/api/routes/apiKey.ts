import { Router, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import crypto from 'crypto';

import ApiKey from '../models/apiKey';
import { IUser } from '../models/user';

import { jwtMiddleware } from '../middlewares/jwt';
import { authMiddleware } from '../middlewares/auth';

import { apiKeyCreateValidator, apiKeyInvalidateValidator } from '../validators/apiKeyValidator';

const router = Router();

router.get('/all', [jwtMiddleware, authMiddleware], async (req: Request, res: Response) => {
    const { user } = req as Request & { user: IUser };

    const apiKeys = await ApiKey.find({ user: user });
    res.send({ apiKeys });
});

router.post('/generateApiKey', [jwtMiddleware, authMiddleware], async (req: Request, res: Response) => {
    apiKeyCreateValidator.parse(req.body);

    const { name, permission } = req.body as { name: string, permission: string };
    const { user } = req as Request & { user: IUser };

    const tmpKey = crypto.randomBytes(32).toString("hex");
    const apiKey = new ApiKey({ name, permission, key: tmpKey, user: user });

    await apiKey.save();

    res.send({ authId: apiKey._id, apiKey: tmpKey });
});

router.post('/invalidateApiKey', [jwtMiddleware, authMiddleware], async (req: Request, res: Response) => {
    apiKeyInvalidateValidator.parse(req.body);

    const { authId } = req.body as { authId: string; };
    const apiKey = await ApiKey.findByIdAndUpdate(new ObjectId(authId), { $set: { isActive: false } });
    
    res.send({ apiKey });
});

router.delete('/:authId', [jwtMiddleware, authMiddleware], async (req: Request, res: Response) => {
    const authId = req.params.authId;
    
    await ApiKey.findByIdAndDelete(new ObjectId(authId));
    
    res.send({ message: "Success" });
});

export default router;
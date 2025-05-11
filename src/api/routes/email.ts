import { Router, Request, Response } from 'express';
import sendEmail from '../services/email';

const router = Router();

router.post('/send-email', (req: Request, res: Response) => {
    const { recipients, subject, text, category } = req.body as { recipients: [], subject: string, text: string, category: string };

    sendEmail(recipients, subject, text, category);
    
    res.send({ message: "OK" });
});

export default router;
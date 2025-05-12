import { Router, Request, Response } from 'express';

import sendEmail from '../services/email';
import { emailSendingValidator } from '../validators/emailValidators';

const router = Router();

router.post('/send-email', async (req: Request, res: Response) => {
    emailSendingValidator.parse(req.body);

    const { recipients, subject, text, category } = req.body as { recipients: [], subject: string, text: string, category: string };

    await sendEmail(recipients, subject, text, category);

    res.send({ message: "Email sent successfully" });
});

export default router;
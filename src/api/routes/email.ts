import { Router, Request, Response } from 'express';

import { emailSendingValidator } from '../validators/emailValidators';
import { jobQueue } from '../queue/connection';

const router = Router();

router.post('/send-email', async (req: Request, res: Response) => {
    emailSendingValidator.parse(req.body);

    const { recipients, subject, text, category } = req.body as { recipients: [], subject: string, text: string, category: string };

    const jobOptions = {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: true,
    };

    await jobQueue.add('send-email', { recipients, subject, text, category }, jobOptions);

    res.send({ message: "Email queued for delivery" });
});

export default router;
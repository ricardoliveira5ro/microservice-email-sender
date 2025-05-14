import { Router, Request, Response } from 'express';

import { emailSendingValidator } from '../validators/emailValidators';
import { jobQueue } from '../queue/connection';
import { apiKeyAuthorizationMiddleware } from '../middlewares/apiKeyAuthorization';
import config from '../config/config';

const router = Router();

router.post('/send-email', apiKeyAuthorizationMiddleware, async (req: Request, res: Response) => {
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

router.post('/webhooks', (req: Request, res: Response) => {
    const token = req.query.token as string;

    if (token !== config.mailtrapToken) {
        res.status(403).send({ message: 'Forbidden: Not authorized' });
        return;
    }

    const { event, recipient, message_id, timestamp, status } = req.body as { event: string, recipient: string, message_id: string, timestamp: string, status: string };
    console.log(`Webhook ${event}: To ${recipient} with id ${message_id} at ${timestamp} as ${status.toUpperCase()}`);
    // Update database / Logging

    res.send({ message: "Received" });
});

export default router;
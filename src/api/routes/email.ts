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

    const { events } = req.body as { events: MailtrapEvent[] };
    for (const e of events) {
        const { event, email, message_id, timestamp } = e;
        
        console.log(`Webhook ${event}: To ${email} with id ${message_id} at ${new Date(timestamp * 1000).toISOString()}`);
        // Update database / Logging
    }

    res.send({ message: "Received" });
});

interface MailtrapEvent {
    event: string,
    email: string;
    message_id: string;
    timestamp: number;
}

export default router;
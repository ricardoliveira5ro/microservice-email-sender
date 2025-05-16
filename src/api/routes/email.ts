import { Router, Request, Response } from 'express';

import { emailSendingValidator } from '../validators/emailValidators';
import { jobQueue } from '../queue/connection';
import { apiKeyAuthorizationMiddleware } from '../middlewares/apiKeyAuthorization';
import config from '../config/config';
import Email from '../models/email';

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
        console.log(e.message_id);

        //const email = await Email.findOne({ messageId: e.message_id });

        
    }

    res.send({ message: "Received" });
});

interface MailtrapEvent {
    event: string;
    message_id: string;
    event_id: string;
    timestamp: number;
    bounce_category: string;
    response: string;
    reason: string;
    user_agent: string;
}

export default router;
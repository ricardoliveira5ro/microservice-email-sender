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

    const email = new Email({ recipients, subject, text, category });
    await email.save();

    const jobOptions = {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: true,
    };

    await jobQueue.add('send-email', { emailId: email._id, recipients, subject, text, category }, jobOptions);

    res.send({ emailId: email._id, message: "Email queued for delivery" });
});

router.post('/webhooks', async (req: Request, res: Response) => {
    const token = req.query.token as string;

    if (token !== config.mailtrapToken) {
        res.status(403).send({ message: 'Forbidden: Not authorized' });
        return;
    }

    const { events } = req.body as { events: MailtrapEvent[] };
    for (const e of events) {
        const filter = { messageId: e.message_id };
        const update = {
            status: e.event,
            eventId: e.event_id,
            timestamp: e.timestamp,
            bounceCategory: e.bounce_category || undefined,
            response: e.response || undefined,
            reason: e.reason || undefined,
            userAgent: e.user_agent || undefined,
        };

        await Email.findOneAndUpdate(filter, update, { new: true });
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
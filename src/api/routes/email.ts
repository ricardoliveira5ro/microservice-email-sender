import { Router, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { FilterQuery } from 'mongoose';
import { DateTime } from 'luxon';

import config from '../config/config';
import { jobQueue } from '../queue/connection';

import { IUser } from '../models/user';
import Email, { IEmail } from '../models/email';

import { apiKeyAuthorizationMiddleware } from '../middlewares/apiKeyAuthorization';
import { emailQueryValidator, emailSendingValidator } from '../validators/emailValidators';
import AppError from '../utils/errors/AppError';

const router = Router();

router.post('/send-email', apiKeyAuthorizationMiddleware, async (req: Request, res: Response) => {
    emailSendingValidator.parse(req.body);

    const { recipients, subject, text, category, scheduledAt } = req.body as { recipients: [], subject: string, text: string, category: string, scheduledAt: string };

    const email = new Email({ recipients, subject, text, category });
    await email.save();

    let delay = 0;

    if (scheduledAt) {
        const scheduledDate = DateTime.fromISO(scheduledAt);
        if (!scheduledDate.isValid)
            throw new AppError('Invalid date', 400);

        delay = scheduledDate.toUTC().toMillis() - DateTime.utc().toMillis();
    }

    const jobOptions = {
        delay: delay > 0 ? delay : 0,
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

router.get('/status/:id', apiKeyAuthorizationMiddleware, async (req: Request, res: Response) => {
    const id = req.params.id;
    const email = await Email.findById(new ObjectId(id));

    if (!email)
        throw new AppError('Email not found', 404);

    res.send(email);
});

router.get('/all', apiKeyAuthorizationMiddleware, async (req: Request, res: Response) => {
    const { user } = req as Request & { user: IUser };
    const { status, subject, recipient, page = 1, limit = 10 } = req.query;
    const query: FilterQuery<IEmail> = {};

    emailQueryValidator.parse({ status, subject, recipient });

    if (status)
        query.status = status;

    if (subject)
        query.subject = subject;

    if (recipient)
        query.recipients = { $elemMatch: { email: recipient } };

    query.sender = user;

    const options = {
        skip: (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10),
        limit: parseInt(limit as string, 10),
    };

    const emails = await Email.find(query, null, options);

    res.send({ emails });
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
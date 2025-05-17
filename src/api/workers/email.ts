import { Job, Worker } from "bullmq";
import { ObjectId } from "mongoose";

import { redisConnection } from "../queue/connection";
import sendEmail from "../services/email";

import Email from "../models/email";

export function startEmailWorker(): Worker {
    const worker = new Worker('jobQueue', async (job: Job) => {
        if (job.name === 'send-email') {
            const { emailId, recipients, subject, text, category } = job.data as { emailId: ObjectId, recipients: [], subject: string, text: string, category: string };
            const response = await sendEmail(recipients, subject, text, category);

            for (const msgId of response.message_ids) {
                await Email.findByIdAndUpdate(emailId, { messageId: msgId });
            }
        }
    }, { 
        connection: redisConnection, 
        limiter: {
            max: 10,
            duration: 1000,
        },
    });

    worker.on('completed', (job: Job) => {
        console.log(`Job ${job.id ?? 'unknown'} completed successfully`);
    });

    worker.on('failed', (job, err) => {
        console.error(`Job ${job?.id ?? 'unknown'} failed with error ${err.message}`);
    });

    return worker;
}
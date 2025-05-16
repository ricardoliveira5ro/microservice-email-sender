import { Job, Worker } from "bullmq";

import { redisConnection } from "../queue/connection";
import Email from "../models/email";
import sendEmail from "../services/email";

export function startEmailWorker(): Worker {
    const worker = new Worker('jobQueue', async (job: Job) => {
        if (job.name === 'send-email') {
            const { recipients, subject, text, category } = job.data as { recipients: [], subject: string, text: string, category: string };
            const response = await sendEmail(recipients, subject, text, category);

            console.log(response);

            for (const msgId of response.message_ids) {
                const email = new Email({ recipients, subject, text, category, messageId: msgId });
                await email.save();
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
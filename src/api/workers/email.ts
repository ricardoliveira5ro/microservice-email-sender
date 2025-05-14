import { Job, Worker } from "bullmq";
import sendEmail from "../services/email";
import { redisConnection } from "../queue/connection";

export function startEmailWorker(): Worker {
    const worker = new Worker('jobQueue', async (job: Job) => {
        if (job.name === 'send-email') {
            const { recipients, subject, text, category } = job.data as { recipients: [], subject: string, text: string, category: string };
            await sendEmail(recipients, subject, text, category);
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
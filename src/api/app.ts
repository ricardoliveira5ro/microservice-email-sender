import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';

import userRoutes from './routes/user';
import emailRoutes from './routes/email';

import { errorHandler } from './middlewares/errorHandler';
import { Job, Queue, Worker } from 'bullmq';
import sendEmail from './services/email';
import Redis from 'ioredis';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/emails', emailRoutes);

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
    const healthCheck = {
        uptime: process.uptime(),
        message: 'OK',
        timeStamp: Date.now(),
    };

    try {
        res.send(healthCheck);
    
    } catch (error) {
        healthCheck.message = error as string;
        res.status(503).send(healthCheck);
    }
});

// Next js Client Route
const staticPath = path.join(process.cwd(), 'src/client/out');

app.use(express.static(staticPath));

app.get(/(.*)/, (req: Request, res: Response) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

const connection = new Redis({ maxRetriesPerRequest: null });
const jobQueue = new Queue('jobQueue', { connection });

app.post('/api/add-job', async (req, res) => {
    const job = await jobQueue.add('job', req.body);
    res.send({ jobId: job.id });
});

// Worker to process jobs from the queue
const worker = new Worker('jobQueue', async (job: Job) => {
    const { recipients, subject, text, category } = job.data as { recipients: [], subject: string, text: string, category: string };
    await sendEmail(recipients, subject, text, category);
}, { connection });

// Event listeners for worker
worker.on('completed', (job: Job) => {
  console.log(`Job ${job.id ?? 'unknown'} completed successfully`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id ?? 'unknown'} failed with error ${err.message}`);
});

// Error Handler
app.use(errorHandler);

export default app;
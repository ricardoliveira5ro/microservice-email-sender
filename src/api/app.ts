import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/user';
import emailRoutes from './routes/email';

import { errorHandler } from './middlewares/errorHandler';
import { startEmailWorker } from './workers/email';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

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

// Fallback invalid API routes
app.all(/^\/api\/.*/, (req: Request, res: Response) => {
  res.status(404).json({ message: 'API route not found' });
});

// Next js Client Route
const staticPath = path.join(process.cwd(), 'src/client/out');
app.use(express.static(staticPath, { extensions: ['html'] }));

// Error Handler
app.use(errorHandler);

// Queue workers
startEmailWorker();

export default app;
import express, { Request, Response } from 'express';
import cors from 'cors';

import testRoutes from './routes/testRoutes';

import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/test', testRoutes);

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

// Error Handler
app.use(errorHandler);

export default app;
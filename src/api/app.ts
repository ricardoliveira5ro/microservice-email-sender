import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';

import userRoutes from './routes/user';
import emailRoutes from './routes/email';

import { errorHandler } from './middlewares/errorHandler';

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

// Error Handler
app.use(errorHandler);

export default app;
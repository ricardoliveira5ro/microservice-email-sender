import express from 'express';
import testRoutes from './routes/testRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());

// Routes
app.use('/api/test', testRoutes);

// Error Handler
app.use(errorHandler);

export default app;
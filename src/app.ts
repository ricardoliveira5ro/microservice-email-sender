import express from 'express';
import testRoutes from './routes/testRoutes';

const app = express();

app.use(express.json());

// Routes
app.use('/api/test', testRoutes);

export default app;
import app from './app';
import config from './config/config';
import { connectDB } from './db/connection';
import { applicationLogger } from './middlewares/logger';

const startServer = async (): Promise<void> => {
  try {
      await connectDB();
      app.listen(config.port, () => { applicationLogger.info(`Server running on port ${config.port.toString()}`); });
  } catch (error) {
      applicationLogger.error('Failed staring the server', { error });
      process.exit(1); // Stop the process if DB connection fails
  }
};

void startServer();
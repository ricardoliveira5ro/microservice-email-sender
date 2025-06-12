import app from './app';
import config from './config/config';
import { connectDB } from './db/connection';
import { getDateOnly } from './utils/functions';

const startServer = async (): Promise<void> => {
  try {
      await connectDB();
      app.listen(config.port, () => { console.log(`[${getDateOnly(new Date)}] INFO: Server running on port ${config.port.toString()}`); });
  } catch (error) {
      console.error(`[${getDateOnly(new Date)}] ERROR: Failed staring the server`, error);
      process.exit(1); // Stop the process if DB connection fails
  }
};

void startServer();
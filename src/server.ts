import app from './app';
import config from './config/config';
import { connectDB } from './db/connection';

const startServer = async () => {
  try {
      await connectDB()
      app.listen(config.port, () => console.log(`Server running on port ${config.port}`));
  } catch (error) {
      process.exit(1); // Stop the process if DB connection fails
  }
};

startServer();
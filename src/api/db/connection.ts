import mongoose from 'mongoose';
import config from '../config/config';
import { applicationLogger } from '../middlewares/logger';

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(config.dbConnectionString, {
            serverSelectionTimeoutMS: 120000,  // Increase timeout
        });
        applicationLogger.info('MongoDB connected');
    } catch (err) {
        applicationLogger.error('MongoDB connection error', { err });
        process.exit(1);  // Stop the app if DB fails to connect
    }
};
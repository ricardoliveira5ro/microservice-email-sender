import mongoose from 'mongoose';
import config from '../config/config';
import { getDateOnly } from '../utils/functions';

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(config.dbConnectionString, {
            serverSelectionTimeoutMS: 120000,  // Increase timeout
        });
        console.log(`[${getDateOnly(new Date)}] INFO: MongoDB connected`);
    } catch (err) {
        console.error(`[${getDateOnly(new Date)}] ERROR: MongoDB connection error`, err);
        process.exit(1);  // Stop the app if DB fails to connect
    }
};
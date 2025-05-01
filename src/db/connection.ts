import mongoose from 'mongoose';
import config from '../config/config';

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(config.dbConnectionString, {
            serverSelectionTimeoutMS: 120000,  // Increase timeout
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);  // Stop the app if DB fails to connect
    }
};
import { Queue } from 'bullmq';
import Redis from 'ioredis';

import config from '../config/config';

export const redisConnection = new Redis(config.redisURL, {
    maxRetriesPerRequest: null,
});

export const jobQueue = new Queue('jobQueue', {
    connection: redisConnection,
});
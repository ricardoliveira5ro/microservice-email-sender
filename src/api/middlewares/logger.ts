import { Request, Response } from "express";
import winston from "winston";
import expressWinston from 'express-winston';

import { S3DailyTransport } from "../utils/logs/transport";
import { sanitizeUrl } from "../utils/logs/sanitizers";
import { formatLoggerResponse } from "../utils/logs/formatter";

import config from "../config/config";

export const logger = expressWinston.logger({
    transports: [
        new winston.transports.Console(),
        new S3DailyTransport({
            bucket: config.s3Bucket,
            prefix: config.nodeEnv === 'production' ? 'prod/' : 'dev/',
            accessKeyId: config.awsAccessKey,
            secretAccessKey: config.awsSecretAccessKey,
            awsRegion: config.awsRegion,
            flushIntervalMs: 60000,
        }),
    ],
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
            return `[${timestamp as string}] [${message as string}] ${level.toUpperCase()}: ${JSON.stringify(meta)}`;
        }),
    ),
    msg: (req: Request) => `HTTP ${req.method} ${sanitizeUrl(req.originalUrl || req.url)}`,
    level: function (req: Request, res: Response) {
        if (res.statusCode >= 400) return 'error';
        return 'info';
    },
    dynamicMeta: (req: Request, res: Response) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        return { ...formatLoggerResponse(req, res, (res as any).__responseBody), req: undefined, res: undefined };
    },
});
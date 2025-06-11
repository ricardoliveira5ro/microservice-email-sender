import { Request, Response } from "express";

import winston from "winston";
import expressWinston from 'express-winston';

import { sanitizeUrl } from "../utils/logs/sanitizers";
import { dailyFileTransport } from "../utils/logs/transport";
import { formatLoggerResponse } from "../utils/logs/formatter";

export const logger = expressWinston.logger({
    transports: [
        new winston.transports.Console(),
        dailyFileTransport,
    ],
    format: winston.format.combine(
        winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
        winston.format.json(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
            return JSON.stringify({ level, timestamp, message, ...meta });
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
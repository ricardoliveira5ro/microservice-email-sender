import { Request, Response } from "express";
import winston from "winston";
import expressWinston from 'express-winston';
import config from "../config/config";
import { URL } from 'url';

const isProd = config.nodeEnv === 'production';

const sanitizeBody = (body: unknown): unknown => {
    if (!isProd || typeof body !== 'object' || body === null) return body;

    const cloned = { ...body } as Record<string, unknown>;
    if ('password' in cloned) cloned.password = '********';
    
    return cloned;
};

const sanitizeResponse = (body: unknown): unknown => {
  if (!isProd || typeof body !== 'object' || body === null) return body;

  const cloned = { ...body } as Record<string, unknown>;
  if ('apiKey' in cloned) cloned.apiKey = '********';
  return cloned;
};

const sanitizeQuery = (query: unknown): unknown => {
    if (!isProd || typeof query !== 'object' || query === null) return query;

    const cloned = { ...query } as Record<string, unknown>;
    if ('key' in cloned) cloned.key = '********';
    return cloned;
};

const sanitizeUrl = (originalUrl: string): string => {
    if (!isProd) return originalUrl;

    try {
        const urlObj = new URL(originalUrl, 'http://localhost');
        if (urlObj.searchParams.has('key')) {
        urlObj.searchParams.set('key', '********');
        }
        return urlObj.pathname + urlObj.search;
    } catch {
        return originalUrl;
    }
};

const formatLoggerResponse = (
    req: Request,
    res: Response,
    responseBody: unknown,
): object => {
    return {
        request: {
            headers: req.headers,
            host: req.headers.host,
            baseUrl: req.baseUrl,
            url: sanitizeUrl(req.url),
            originalUrl: sanitizeUrl(req.originalUrl),
            method: req.method,
            body: sanitizeBody(req.body),
            params: req.params,
            query: sanitizeQuery(req.query),
            clientIp: req.headers['x-forwarded-for'] ?? req.socket.remoteAddress,
        },
        response: {
            headers: res.getHeaders(),
            statusCode: res.statusCode,
            body: sanitizeResponse(responseBody),
        },
    };
};

export const logger = expressWinston.logger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'logs/application-logs.log',
        }),
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
import { Request, Response } from "express";
import { sanitizeBody, sanitizeQuery, sanitizeResponse, sanitizeUrl } from "./sanitizers";

export const formatLoggerResponse = (
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
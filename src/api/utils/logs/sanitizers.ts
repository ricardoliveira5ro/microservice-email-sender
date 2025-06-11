import { URL } from "url";
import config from "../../config/config";

const isProd = config.nodeEnv === 'production';

export const sanitizeBody = (body: unknown): unknown => {
    if (!isProd || typeof body !== 'object' || body === null) return body;

    const cloned = { ...body } as Record<string, unknown>;
    if ('password' in cloned) cloned.password = '********';
    
    return cloned;
};

export const sanitizeResponse = (body: unknown): unknown => {
    if (!isProd || typeof body !== 'object' || body === null) return body;

    const cloned = { ...body } as Record<string, unknown>;
    if ('apiKey' in cloned) cloned.apiKey = '********';
    return cloned;
};

export const sanitizeQuery = (query: unknown): unknown => {
    if (!isProd || typeof query !== 'object' || query === null) return query;

    const cloned = { ...query } as Record<string, unknown>;
    if ('key' in cloned) cloned.key = '********';
    return cloned;
};

export const sanitizeUrl = (originalUrl: string): string => {
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
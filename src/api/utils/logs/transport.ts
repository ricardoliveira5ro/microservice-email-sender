import fs from 'fs';
import path from 'path';
import AWS from 'aws-sdk';
import DailyRotateFile from "winston-daily-rotate-file";

import config from '../../config/config';

const s3 = new AWS.S3({
    accessKeyId: config.awsAccessKey,
    secretAccessKey: config.awsSecretAccessKey,
    region: config.awsRegion,
});

export function uploadLogToS3(filePath: string): void {
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    const params = {
        Bucket: config.s3Bucket,
        Key: config.nodeEnv === 'production' ? `prod/${fileName}` : `dev/${fileName}`,
        Body: fileContent,
        ContentType: 'text/plain',
    };

    s3.upload(params, (err: unknown) => {
        if (err) console.error('Failed to upload log to S3 bucket:', err);

        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) console.error('Failed to delete local log file:', unlinkErr);
        });
    });
}

export const dailyFileTransport = new DailyRotateFile({
    filename: 'logs/application-logs-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',
});

dailyFileTransport.on('rotate', (oldFilename: string, _newFilename: string) => {
    uploadLogToS3(oldFilename);
});
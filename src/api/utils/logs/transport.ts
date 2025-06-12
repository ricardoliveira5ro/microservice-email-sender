import AWS, { AWSError } from 'aws-sdk';
import Transport  from 'winston-transport';
import dayjs from 'dayjs';
import { getDateOnly } from '../functions';

interface S3DailyTransportOptions extends Transport.TransportStreamOptions {
    bucket: string;
    prefix?: string;
    flushIntervalMs?: number;
    awsRegion?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
}

export class S3DailyTransport extends Transport {
    private s3: AWS.S3;
    private bucket: string;
    private prefix: string;
    private buffer: string[] = []; // Collection of logs to be copied to S3 bucket
    private currentDate: string;
    private flushIntervalMs: number;
    private flushTimer: NodeJS.Timeout;

    constructor(options: S3DailyTransportOptions) {
        super(options);

        this.bucket = options.bucket;
        this.prefix = options.prefix ?? "dev/";
        this.flushIntervalMs = options.flushIntervalMs ?? 60000;
        this.currentDate = dayjs().format('YYYY-MM-DD');

        this.s3 = new AWS.S3({
            region: options.awsRegion,
            accessKeyId: options.accessKeyId,
            secretAccessKey: options.secretAccessKey,
        });
    
        // Periodic flushing
        this.flushTimer = setInterval(() => {
            void this.flush();
        }, this.flushIntervalMs);

        // SIGINT -> CTRL C in terminal
        // exit -> Exiting naturally
        process.on('SIGINT', () => { void this.flush().then(() => process.exit(0)); });
        process.on('exit', () => { void this.flush(); });
    }

    // Core Winston function called every time a new log arrives
    log(info: unknown, callback: () => void): void {
        setImmediate(() => this.emit('logged', info)); // Winston listens for this to know the log has been handled successfully

        const { level, timestamp } = info as { level: string, timestamp: string };

        const line = JSON.stringify(info);
        this.buffer.push(`[${timestamp}] ${level.toUpperCase()}: ${line}`); // Add new log to collection
        callback(); // Tells Winston that the log entry has been processed and it can continue
    }

    private async flush(): Promise<void> {
        if (this.buffer.length === 0) return;

        const nowDate = dayjs().format('YYYY-MM-DD');
        if (nowDate !== this.currentDate) {
            this.currentDate = nowDate;
        }

        const logKey = `application-logs-${this.prefix}${this.currentDate}.log`;
        const contentToAppend = this.buffer.join('\n') + '\n';
        this.buffer = [];

        try {
            let existingLog = '';

            try {
                // Retrieve existing logs
                const existing = await this.s3.getObject({
                    Bucket: this.bucket,
                    Key: logKey,
                }).promise();

                // eslint-disable-next-line @typescript-eslint/no-base-to-string
                existingLog = existing.Body?.toString() ?? '';
            } catch (err: unknown) {
                if ((err as AWSError).code !== 'NoSuchKey') {
                    console.error(`[${getDateOnly(new Date)}] ERROR: Failed to fetch existing log`, err);
                    return;
                }
            }

            const updatedContent = existingLog + contentToAppend;

            // Push new log file
            await this.s3.putObject({
                Bucket: this.bucket,
                Key: logKey,
                Body: updatedContent,
                ContentType: 'text/plain',
            }).promise();

            console.log(`[${getDateOnly(new Date)}] INFO: New logs flushed successfully`);
        } catch (err) {
            console.error(`[${getDateOnly(new Date)}] ERROR: Failed flushing logs`, err);
        }
    }
}
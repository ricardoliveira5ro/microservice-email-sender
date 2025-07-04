import dotenv from 'dotenv';

dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    dbConnectionString: string;
    mailtrapToken: string;
    redisURL: string;
    recaptchaSiteSecret: string;
    jwtSecret: string;
    awsAccessKey: string;
    awsSecretAccessKey: string;
    awsRegion: string;
    s3Bucket: string;
};

const config: Config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV ?? 'development',
    dbConnectionString: process.env.DB_CONNECTION_STRING ?? 'mongodb://127.0.0.1:27017/emailSenderLocalDB',
    mailtrapToken: process.env.MAILTRAP_TOKEN ?? '',
    redisURL: process.env.REDIS_URL ?? 'redis://127.0.0.1:6379',
    recaptchaSiteSecret: process.env.RECAPTCHA_SITE_SECRET ?? '',
    jwtSecret: process.env.JWT_SECRET ?? '',
    awsAccessKey: process.env.AWS_ACCESS_KEY ?? '',
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
    awsRegion: process.env.AWS_REGION ?? '',
    s3Bucket: process.env.S3_BUCKET_NAME ?? '',
};

export default config;
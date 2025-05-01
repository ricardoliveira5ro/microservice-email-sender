import dotenv from 'dotenv';

dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    dbConnectionString: string;
};

const config: Config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV ?? 'development',
    dbConnectionString: process.env.DB_CONNECTION_STRING ?? 'mongodb://127.0.0.1:27017/emailSenderLocalDB',
};

export default config;
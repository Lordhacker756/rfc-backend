import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];

requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
});
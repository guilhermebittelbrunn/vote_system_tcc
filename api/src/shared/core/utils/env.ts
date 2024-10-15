/* eslint-disable @typescript-eslint/no-empty-interface */
import { z } from 'zod';

const envVariables = z.object({
    PORT: z.string().optional(),
    DB_HOST: z.string(),
    DB_PORT: z.string(),
    DB_NAME: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_SCHEMA: z.string(),
    JWT_SECRET: z.string(),
    POSTGRES_VOLUME_PATH: z.string().optional(),
    USE_CACHE: z.string().optional(),
    AWS_RPC_URL: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_REGION: z.string(),
    PRIVATE_KEY: z.string(),
    AMB_ACCESS_POLYGON_MAINNET: z.string(),
    AWS_MQ_HOST: z.string(),
    AWS_MQ_PORT: z.string(),
    AWS_MQ_PROTOCOL: z.string(),
    AWS_MQ_USERNAME: z.string(),
    AWS_MQ_PASSWORD: z.string(),
    UPLOAD_MAX_FILE_SIZE_MB: z.string(),
});

envVariables.parse(process.env);

declare global {
    namespace NodeJS {
        interface ProcessEnv extends z.infer<typeof envVariables> {}
    }
}

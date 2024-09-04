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
});

envVariables.parse(process.env);

declare global {
    namespace NodeJS {
        interface ProcessEnv extends z.infer<typeof envVariables> {}
    }
}

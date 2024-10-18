import { ConnectionOptions } from 'typeorm';

const dbConnectionOptions: ConnectionOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'comanda10_dev',
    synchronize: false,
    dropSchema: false,
    logging: false,
    migrationsRun: true,
};

export default dbConnectionOptions;

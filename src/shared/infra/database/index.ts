import sleep from '@core/utils/sleep';
import connection from './TypeORM/connection';

const connectToDB = async (): Promise<void> => {
    try {
        await connection.create();

        console.info(`database connected successfully (${process.env.DB_HOST})`);
    } catch (error: any) {
        console.error(`an error occurred: ${error}`);
        console.error('retrying connection in 3 seconds...');

        await sleep(3000);

        await connectToDB();
    }
};

export { connectToDB };

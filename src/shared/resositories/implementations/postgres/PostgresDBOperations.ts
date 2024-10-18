import { getConnection } from 'typeorm';
import IDBOperations from '../IDBOperations';


export default class PostgresDBOperations implements IDBOperations {
    public async setTimezone(timezone: string): Promise<void> {
        await getConnection().query(`SET TIMEZONE='${timezone}'`);
    }
}

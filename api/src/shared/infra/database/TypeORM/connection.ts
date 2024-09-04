import { createConnection, getConnection } from 'typeorm';

const connection = {
    async create(): Promise<void> {
        await createConnection();
    },

    async close(): Promise<void> {
        await getConnection().close();
    },

    async clear(entityName: string, ids: Array<number>): Promise<void> {
        if (ids.length <= 0) return;
        const repository = getConnection().getRepository(entityName);

        await repository.query(`DELETE FROM ${repository.metadata.tableName} WHERE id in(${ids.join(', ')})`);
    },
};

export default connection;

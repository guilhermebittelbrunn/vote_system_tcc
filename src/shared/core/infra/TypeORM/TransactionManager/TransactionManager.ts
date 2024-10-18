import { getConnection, QueryRunner } from 'typeorm';

import IOrmContext from '@root-shared/infra/http/contexts/IOrmContext';

import ITransactionManager, { InitReturn } from '../../TransactionManager';

export default class TransactionManager implements ITransactionManager {
    constructor(private ormContext: IOrmContext) {}

    private get queryRunner(): QueryRunner {
        const queryRunner = this.ormContext.getValue('queryRunner');

        if (!queryRunner) {
            throw new Error('ORM context must be initialized on app file');
        }

        return queryRunner;
    }

    private set queryRunner(qr: QueryRunner) {
        this.ormContext.setValue('queryRunner', qr);
    }

    private async commit(): Promise<void> {
        const { queryRunner } = this;

        await queryRunner.commitTransaction();
        await queryRunner.release();

        this.queryRunner = queryRunner;
    }

    private async rollback(): Promise<void> {
        await this.queryRunner.rollbackTransaction();
        await this.queryRunner.release();
    }

    public async init(): Promise<InitReturn> {
        const newQueryRunner = getConnection().createQueryRunner();

        await newQueryRunner.startTransaction();

        this.queryRunner = newQueryRunner;

        return { commit: this.commit.bind(this), rollback: this.rollback.bind(this) };
    }
}

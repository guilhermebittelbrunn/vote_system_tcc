import ITransactionManager, { InitReturn } from '@core/infra/TransactionManager';

export default class FakeTransactionManager implements ITransactionManager {
    private async commit(): Promise<void> {
        return Promise.resolve();
    }

    private async rollback(): Promise<void> {
        return Promise.resolve();
    }

    public async init(): Promise<InitReturn> {
        return Promise.resolve({ commit: this.commit.bind(this), rollback: this.rollback.bind(this) });
    }
}

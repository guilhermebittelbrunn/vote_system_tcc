export interface InitReturn {
    commit: () => Promise<void>;
    rollback: () => Promise<void>;
}

export default interface ITransactionManager {
    init(): Promise<InitReturn>;
}

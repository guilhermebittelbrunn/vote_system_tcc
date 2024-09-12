import { Transaction } from "../domain/transaction";

export interface IWeb3Integrator {
    registerTransaction(data: any): Promise<Transaction>;
    getBlockData(blockNumber: number, prefix: string): Promise<any>;
    getBlock(blockNumber: number): Promise<any>;
}

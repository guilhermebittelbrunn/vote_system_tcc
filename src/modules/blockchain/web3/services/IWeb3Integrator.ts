import { Transaction } from "../domain/transaction";

export interface GetBlockDataResponse{
  value: {
    blockNumber: string;
    hash: string;
    parentHash: string;
    stateRoot: string;
    gasLimit: string;
    gasUsed: string;
    miner: string;
    size: string;
    timestamp: string;
    difficulty: string;
    baseFeePerGas: string;
    transactions: Array<{
        hash: string;
        from: string;
        to: string;
        value: string;
        gas: string;
        gasPrice: string;
    }>
  }
}





export interface IWeb3Integrator {
    registerTransaction(data: any): Promise<Transaction>;
    getBlockData(blockNumber: string | number, prefix: string): Promise<GetBlockDataResponse>;
    getBlock(blockNumber: string | number): Promise<any>;
}

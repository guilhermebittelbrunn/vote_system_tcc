import { HyperledgerFabricConnection } from '@root-shared/infra/blockchain';
import IBaseBlockchain from '../Blockchain'
import Block from "@core/domain/Block";

export class BaseBlockchain<Domain extends Block<any>> implements IBaseBlockchain<Domain> {
    protected contract: any;

    constructor() {
        this.contract = HyperledgerFabricConnection.getContractInstance();
    }

    async save(block: Block<Domain>, transaction?: string): Promise<void> {
        // const blockData = {
        //     voterId: block.voterId.toValue(),
        //     candidateId: block.candidateId.toValue(),
        //     electionId: block.electionId.toValue(),
        //     hash: block.hash,
        //     previousHash: block.previousHash,
        //     timestamp: block.timestamp.toISOString(),
        // };
        const transactionName = transaction ?? `register${String(block.hash).slice(0, 8)}`;

        await this.contract.submitTransaction(transactionName, JSON.stringify(block));
    }
}

import Web3 from 'web3';
import { Transaction } from '../../domain/transaction';
import Logger from '@core/infra/Logger';
import { IWeb3Integrator } from '../IWeb3Integrator';

export class PolygonWeb3 implements IWeb3Integrator {
    protected web3: Web3;
    protected wallet: Web3['eth']['accounts']['wallet'];

    constructor(web3?: Web3, wallet?: Web3['eth']['accounts']['wallet']) {
        this.web3 = web3 || new Web3(process.env.AMB_ACCESS_POLYGON_MAINNET);
        this.wallet = wallet || this.web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY!);
    }

    async registerTransaction(data: any): Promise<Transaction> {
        const encryptedData = this.web3.utils.asciiToHex(JSON.stringify(data));

        const transaction = {
            from: this.wallet[0].address,
            to: this.wallet[0].address,  // Endereço fictício
            value: '0x0',  // Nenhum valor está sendo enviado
            data: encryptedData,
            gasPrice: await this.web3.eth.getGasPrice(),
            gas: await this.web3.eth.estimateGas({ from: this.wallet[0].address }),
        };

        const receipt = await this.web3.eth.sendTransaction(transaction);

        return new Transaction(receipt.blockNumber.toString(), receipt.transactionHash.toString());
    }

    async getBlockData(blockNumber: number, prefix: string): Promise<any> {
        try {
            const block = await this.getBlock(blockNumber);

            if (!block) {
                return null;
            }

            for (const transaction of block.transactions) {
                if (typeof transaction !== 'string' && transaction.input && transaction.input !== '0x') {
                    const dataHex = transaction.input;
                    const dataDecoded = this.web3.utils.hexToAscii(dataHex);

                    if (dataDecoded.indexOf(prefix) !== -1) {
                        return JSON.parse(dataDecoded);
                    }
                }
            }
        } catch (error: any) {
            Logger.error('Error retrieving block data', this.constructor.name);
            throw error;
        }
    }

    async getBlock(blockNumber: number): Promise<any> {
        return await this.web3.eth.getBlock(blockNumber, true);
    }
}

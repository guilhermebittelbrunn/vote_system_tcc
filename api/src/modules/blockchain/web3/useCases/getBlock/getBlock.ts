import UseCase from '@core/domain/UseCase';

import { Either, left, right } from '@root-shared/logic/Either';
import GenericAppError from '@root-shared/logic/GenericAppError';
import { GetBlockDataResponse, IWeb3Integrator } from '../../services/IWeb3Integrator';
import GenericErrors from '@root-shared/logic/GenericErrors';
import requestErrorMessage from '@core/utils/requestErrorMessage';

type Response = Either<GenericAppError, GetBlockDataResponse>;

export default class GetBlockData implements UseCase<string | number, Response> {
    constructor(private web3Integrator: IWeb3Integrator) {}

    public async execute(blockNumber: string | number): Promise<Response> {
        try {
            // Obtendo dados do bloco
            const blockData = await this.web3Integrator.getBlock(blockNumber);

            const response = {
                blockNumber: blockData?.number?.toString() ?? '0', // Adiciona um valor padrão
                hash: blockData?.hash ?? '',
                parentHash: blockData?.parentHash ?? '',
                stateRoot: blockData?.stateRoot ?? '',
                gasLimit: blockData?.gasLimit?.toString() ?? '0',
                gasUsed: blockData?.gasUsed?.toString() ?? '0',
                miner: blockData?.miner ?? '',
                size: blockData?.size?.toString() ?? '0',
                timestamp: blockData?.timestamp?.toString() ?? '0',
                difficulty: blockData?.difficulty?.toString() ?? '0',
                baseFeePerGas: blockData?.baseFeePerGas?.toString() ?? '0', // Lida com o campo opcional
                transactions: blockData?.transactions?.map(tx => ({
                    hash: tx?.hash ?? '',
                    from: tx?.from ?? '',
                    to: tx?.to ?? '',
                    value: tx?.value?.toString() ?? '0',
                    gas: tx?.gas?.toString() ?? '0',
                    gasPrice: tx?.gasPrice?.toString() ?? '0',
                })) ?? [], // Garante que transactions seja um array
                value: blockData?.value?.toString() ?? '0', // Adiciona a propriedade value
            };


            return right(response);

        } catch (error) {
            return left(new GenericErrors.Unexpected(requestErrorMessage(error) as string));
        }
    }
}

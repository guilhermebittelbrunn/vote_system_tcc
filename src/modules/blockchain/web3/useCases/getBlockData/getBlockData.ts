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
        const data = await this.web3Integrator.getBlockData(blockNumber, 'candidate');

        return right(data);

       } catch (error) {
        return left(new GenericErrors.Unexpected(requestErrorMessage(error) as string));
       }
    }
}

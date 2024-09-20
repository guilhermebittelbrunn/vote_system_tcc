import UseCase from '@core/domain/UseCase';

import { Either, left, right } from '@root-shared/logic/Either';
import GenericAppError from '@root-shared/logic/GenericAppError';
import RegisterBlockRequestDTO from './registerBlockRequestDTO';
import { IWeb3Integrator } from '../../services/IWeb3Integrator';
import GenericErrors from '@root-shared/logic/GenericErrors';
import requestErrorMessage from '@core/utils/requestErrorMessage';
import { Transaction } from '../../domain/transaction';

type Response = Either<GenericAppError, Transaction>;

export default class RegisterBlock implements UseCase<RegisterBlockRequestDTO, Response> {
    constructor(private web3Integrator: IWeb3Integrator) {}

    public async execute(dto: RegisterBlockRequestDTO): Promise<Response> {
       try {
        const { data } = dto;

        const transaction = await this.web3Integrator.registerTransaction(data);

        return right(transaction);
       } catch (error) {
        return left(new GenericErrors.Unexpected(requestErrorMessage(error) as string));
       }
    }
}

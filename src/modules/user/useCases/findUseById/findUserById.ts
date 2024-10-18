import UseCase from '@core/domain/UseCase';
import User from '@user/domain/user/user';
import IUserRepository from '@user/repositories/IUserRepository';

import { Either, left, right } from '@root-shared/logic/Either';
import GenericAppError from '@root-shared/logic/GenericAppError';
import GenericErrors from '@root-shared/logic/GenericErrors';

type Response = Either<GenericAppError, User>;


export default class FindUserById implements UseCase<string, Response> {
    constructor(private userRepository: IUserRepository) {}

    public async execute(id: string): Promise<Response> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            return left(new GenericErrors.NotFound('usuário não encontrado'));
        }

        return right(user);
    }
}

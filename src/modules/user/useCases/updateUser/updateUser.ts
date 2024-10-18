import UniqueEntityID from '@core/domain/UniqueEntityID';
import UseCase from '@core/domain/UseCase';
import User from '@user/domain/user/user';
import UserEmail from '@user/domain/user/userEmail';
import IUserRepository from '@user/repositories/IUserRepository';

import UpdateUserErrors from './updateUserErrors';
import UpdateUserRequestDTO from './upateUserRequestDTO';
import { Either, left, right } from '@root-shared/logic/Either';
import GenericAppError from '@root-shared/logic/GenericAppError';
import Guard from '@root-shared/logic/Guard';
import UserCpf from '@user/domain/user/userCpf';
import GenericErrors from '@root-shared/logic/GenericErrors';

type Response = Either<GenericAppError, string>;

export default class UpdateUser implements UseCase<UpdateUserRequestDTO, Response> {
    constructor(private userRepository: IUserRepository) {}

    public async execute(dto: UpdateUserRequestDTO): Promise<Response> {
        const guardedId = Guard.againstNullOrUndefined(dto.id, 'id');

        if (!guardedId.succeeded) {
            return left(new GenericErrors.InvalidParam(guardedId.message));
        }

        const foundUser = await this.userRepository.findById(dto.id);

        if (!foundUser) {
            return left(new GenericErrors.NotFound('Usuário não encontrado'));
        }

        const emailOrError = UserEmail.create(dto.email);

        if (emailOrError.isLeft()) {
            return left(emailOrError.value);
        }

        const userWithSameEmail = await this.userRepository.findByEmail(dto.email);

        if (userWithSameEmail?.id.toValue() !== dto.id) {
            return left(new UpdateUserErrors.EmailAlreadyTaken());
        }

        const userWithSameCpfOrRg = await this.userRepository.findByCpfOrRg({
            cpf: dto.cpf,
            rg: dto.rg,
        })

        if (userWithSameCpfOrRg?.id.toValue() !== dto.id) {
            return left(new UpdateUserErrors.CpfOrRgAlreadyTaken());
        }

        const cpfOrError = UserCpf.create(dto.cpf);

        if(cpfOrError.isLeft()) {
            return left(cpfOrError.value);
        }

        const userOrError = User.create({
            ...foundUser,
            name: dto.name,
            phoneNumber: dto.phoneNumber,
            email: emailOrError.value,
            password: foundUser.password,
            cpf: cpfOrError.value,
            rg: dto.rg,
            birthday: dto.birthday,
        }, new UniqueEntityID(dto.id));

        if (userOrError.isLeft()) {
            return left(userOrError.value);
        }

        const user = await this.userRepository.update(userOrError.value);

        return right(user);
    }
}

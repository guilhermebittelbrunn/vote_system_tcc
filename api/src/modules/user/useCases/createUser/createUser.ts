import UniqueEntityID from '@core/domain/UniqueEntityID';
import UseCase from '@core/domain/UseCase';
import User from '@user/domain/user/user';
import UserEmail from '@user/domain/user/userEmail';
import UserPassword from '@user/domain/user/userPassword';
import IUserRepository from '@user/repositories/IUserRepository';

import CreateUserErrors from './createUserErrors';
import CreateUserRequestDTO from './createUserRequestDTO';
import { Either, left, right } from '@root-shared/logic/Either';
import GenericAppError from '@root-shared/logic/GenericAppError';
import Guard from '@root-shared/logic/Guard';
import UserCpf from '@user/domain/user/userCpf';

type Response = Either<CreateUserErrors.EmailAlreadyTaken | GenericAppError, User>;

export default class CreateUser implements UseCase<CreateUserRequestDTO, Response> {
    constructor(private userRepository: IUserRepository) {}

    public async execute(dto: CreateUserRequestDTO): Promise<Response> {
        const passwordOrError = UserPassword.create({ value: dto.password as string });

        if (passwordOrError.isLeft()) {
            return left(passwordOrError.value);
        }

        const emailOrError = UserEmail.create(dto.email);
        if (emailOrError.isLeft()) {
            return left(emailOrError.value);
        }
        const userWithSameEmail = await this.userRepository.findByEmail(dto.email);

        if (userWithSameEmail) {
            return left(new CreateUserErrors.EmailAlreadyTaken());
        }

        const userWithSameCpfRg = await this.userRepository.findByCpfOrRg({cpf: dto.cpf, rg: dto.rg});

        if (userWithSameCpfRg) {
            return left(new CreateUserErrors.CpfOrRgAlreadyTaken());
        }

        const cpfOrError = UserCpf.create(dto.cpf);


        if(cpfOrError.isLeft()) {
            return left(cpfOrError.value);
        }

        const userOrError = User.create({
            name: dto.name,
            phoneNumber: dto.phoneNumber,
            email: emailOrError.value,
            password: passwordOrError.value,
            cpf: cpfOrError.value,
            rg: dto.rg,
            birthday: dto.birthday,
        });

        if (userOrError.isLeft()) {
            return left(userOrError.value);
        }

        const user = await this.userRepository.insert(userOrError.value);

        return right(user);
    }
}

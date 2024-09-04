
import { Either, left, right } from '@root-shared/logic/Either';
import LoginGestaoErrors from './loginErrors';
import LoginGestaoRequestDTO from './loginRequestDTO';
import LoginGestaoResponseDTO from './loginResponseDTO';
import GenericAppError from '@root-shared/logic/GenericAppError';
import Guard from '@root-shared/logic/Guard';
import GenericErrors from '@root-shared/logic/GenericErrors';
import UseCase from '@core/domain/UseCase';
import IAuthTokenService from '@user/services/IAuthTokenService';
import IUserRepository from '@user/repositories/IUserRepository';

type Response = Either<
    LoginGestaoErrors.EmailNotExist | LoginGestaoErrors.WrongPassword | GenericAppError,
    LoginGestaoResponseDTO
>;

export default class LoginGestao implements UseCase<LoginGestaoRequestDTO, Response> {
    constructor(private userRepo: IUserRepository, private authTokenService: IAuthTokenService) {}

    public async execute(dto: LoginGestaoRequestDTO): Promise<Response> {
        const guardedProps = Guard.againstNullOrUndefinedBulk([
            { argument: dto.email, argumentName: 'email' },
            { argument: dto.password, argumentName: 'senha' },
        ]);

        if (!guardedProps.succeeded) {
            return left(new GenericErrors.InvalidParam(guardedProps.message));
        }

        const user = await this.userRepo.findByEmail(dto.email);

        if (!user || !user.password) {
            return left(new LoginGestaoErrors.EmailNotExist());
        }

        const passwordMatches = await user.password.compare(dto.password);

        if (!passwordMatches) {
            return left(new LoginGestaoErrors.WrongPassword());
        }
        const token = this.authTokenService.encode({
            userId: user.id.toValue(),
        });

        return right({ user, token });
    }
}


import { Either, left, right } from '@root-shared/logic/Either';
import LoginErrors from './loginErrors';
import LoginRequestDTO from './loginRequestDTO';
import LoginResponseDTO from './loginResponseDTO';
import GenericAppError from '@root-shared/logic/GenericAppError';
import Guard from '@root-shared/logic/Guard';
import GenericErrors from '@root-shared/logic/GenericErrors';
import UseCase from '@core/domain/UseCase';
import IAuthTokenService from '@user/services/IAuthTokenService';
import IUserRepository from '@user/repositories/IUserRepository';
import User from '@user/domain/user/user';

type Response = Either<
    LoginErrors.EmailNotExist | LoginErrors.WrongPassword | GenericAppError,
    LoginResponseDTO
>;

export default class LoginGestao implements UseCase<LoginRequestDTO, Response> {
    constructor(private userRepo: IUserRepository, private authTokenService: IAuthTokenService) {}

    public async execute(dto: LoginRequestDTO): Promise<Response> {
        const guardedProps = Guard.againstNullOrUndefinedBulk([
            { argument: dto.email, argumentName: 'email' },
            { argument: dto.password, argumentName: 'senha' },
        ]);

        if (!guardedProps.succeeded) {
            return left(new GenericErrors.InvalidParam(guardedProps.message));
        }

        let user: User | null = null;

        if(dto.cpf || dto.rg) {
            user = await this.userRepo.findByCpfOrRg({
                cpf: dto.cpf,
                rg: dto.rg,
            })
            if(!user) {
                return left(new LoginErrors.CpfOrRgNotExist());
            }
        }

        if(!user){
            user = await this.userRepo.findByEmail(dto.email);
        }

        if (!user || !user.password) {
            return left(new LoginErrors.EmailNotExist());
        }

        const passwordMatches = await user.password.compare(dto.password);

        if (!passwordMatches) {
            return left(new LoginErrors.WrongPassword());
        }
        const token = this.authTokenService.encode({
            userId: user.id.toValue(),
        });

        return right({ user, token });
    }
}

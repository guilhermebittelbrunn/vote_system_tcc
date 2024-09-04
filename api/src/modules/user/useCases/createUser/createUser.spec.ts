import IUserRepository from '@user/repositories/IUserRepository';
import CreateUserErrors from './createUserErrors';
import CreateUser from './createUser';
import User from '@user/domain/user/user';
import GenericErrors from '@root-shared/logic/GenericErrors';

let userRepo: IUserRepository;
let useCase: CreateUser;

describe('Create User', () => {
    beforeEach(() => {
        userRepo = new FakeUserRepository();

        useCase = new CreateUser(userRepo);
    });

    it('should work as expected', async () => {
        const result = await useCase.execute({
            name: name.findName(),
            email: internet.email(),
            password: internet.password(),
            cpf: phone.phoneNumber(),
            rg: phone.phoneNumber(),
            phoneNumber: phone.phoneNumber(),
            birthday: name.findName(),
        });

        expect(result.isLeft()).toBeFalsy();

        if (result.isLeft()) {
            return;
        }

        expect(result.isRight()).toBeTruthy();
        expect(result.value instanceof User).toBeTruthy();
        expect(result.value.id.toValue()).toBeDefined();
    });

    it('should return an error if password is invalid', async () => {
        const result = await useCase.execute({
            name: name.findName(),
            email: internet.email(),
            password: internet.password(),
            phoneNumber: phone.phoneNumber(),
            cpf:name.findName(),
            rg: name.findName(),
            birthday: name.findName(),
        });

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toEqual(
            new GenericErrors.InvalidParam('senha não tem os requisitos mínimos (6 caracteres).'),
        );
    });

    it('should return an error if e-mail is invalid', async () => {
        const result = await useCase.execute({
             name: name.findName(),
            email: internet.email(),
            password: '123',
            phoneNumber: phone.phoneNumber(),
            cpf:name.findName(),
            rg: name.findName(),
            birthday: name.findName(),
        });

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toEqual(new GenericErrors.InvalidParam('e-mail inválido'));
    });

    it('should return an error if email is already in use by another account', async () => {
        jest.spyOn(userRepo, 'findByEmail').mockReturnValueOnce(fakeUser());

        const result = await useCase.execute({
            name: name.findName(),
            email: internet.email(),
            password: internet.password(),
            phoneNumber: phone.phoneNumber(),
            timezone: lorem.word(),
            type: UserTypeEnum.ADMIN,
            allowedOrigins: [],
        });

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toEqual(new CreateUserErrors.EmailAlreadyTaken());
    });
});

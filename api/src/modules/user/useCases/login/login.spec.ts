import { UserType as UserTypeEnum } from '@comanda10/types';

import { lorem, name, phone } from 'faker';

import User from '@user/domain/user/user';
import UserEmail from '@user/domain/user/userEmail';
import UserPassword from '@user/domain/user/userPassword';
import UserType from '@user/domain/user/userType';
import FakeUserRepository from '@user/repositories/tests/fakes/fakeUserRepository';
import AuthTokenService from '@user/services/implementations/AuthTokenService';

import LoginGestao from './login';
import LoginGestaoErrors from './loginErrors';

const userStub = User.create({
    email: UserEmail.create('teste@teste.com').value as UserEmail,
    password: UserPassword.create({ value: '123456' }).value as UserPassword,
    name: name.findName(),
    phoneNumber: phone.phoneNumber(),
    timezone: lorem.word(),
    type: UserType.create(UserTypeEnum.ADMIN).value as UserType,
}).value as User;

class UserRepoStub extends FakeUserRepository {
    constructor() {
        super();
    }

    public findByEmail(): User | null {
        return userStub;
    }
}

let useCase: LoginGestao;
const userRepo = new UserRepoStub();
const tokenService = new AuthTokenService();

describe(' LoginGestao', () => {
    beforeEach(() => {
        useCase = new LoginGestao(userRepo, tokenService);
    });

    it('should work as expected', async () => {
        const result = await useCase.execute({
            email: 'teste@teste.com',
            password: '123456',
        });

        expect(result.isLeft()).toBeFalsy();

        if (result.isLeft()) {
            return;
        }

        expect(result.value.token).toBeDefined();
        expect(result.value.user).toBeDefined();
    });

    it('should return an error if user was not found', async () => {
        jest.spyOn(userRepo, 'findByEmail').mockReturnValueOnce(null);

        const result = await useCase.execute({
            email: 'teste@teste.com',
            password: '123456',
        });

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toEqual(new LoginGestaoErrors.EmailNotExist());
    });

    it('should return an error if password is wrong', async () => {
        const result = await useCase.execute({
            email: 'teste@teste.com',
            password: 'wrongPassword',
        });

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toEqual(new LoginGestaoErrors.WrongPassword());
    });
});

import { UserType } from '@comanda10/types';

import { internet, name, phone } from 'faker';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { getRepository, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import connection from '@database/TypeORM/connection';
import UserEntity from '@database/TypeORM/entities/user/user';
import app from '@root-shared/infra/http/express/app';
import getUserWithBusiness, {
    AuthenticatedUserData,
} from '@user/repositories/tests/helpers/getAuthenticatedUserWithBusiness';

let authInfos: AuthenticatedUserData;
let userRepository: Repository<UserEntity>;

describe('Create user (e2e)', () => {
    beforeAll(async () => {
        await connection.create();

        authInfos = await getUserWithBusiness();
        userRepository = getRepository(UserEntity);
    });

    afterAll(async () => {
        await connection.close();
    });

    it('should be able to create user', async () => {
        const userToRegister = {
            name: name.findName(),
            password: internet.password(),
            email: internet.email().toLowerCase(),
            type: UserType.ADMIN,
            phoneNumber: phone.phoneNumber('33333333333'),
            timezone: 'America/Sao_Paulo',
        };

        const response = await request(app)
            .post(`/api/businesses/${authInfos.businessId}/users`)
            .set('Authorization', authInfos.jwt)
            .send(userToRegister);

        expect(response.status).toBe(StatusCodes.OK);

        const userInDb = await userRepository.findOne({ email: userToRegister.email });

        expect(userInDb).toBeInstanceOf(UserEntity);
    });

    it('should return a conflit status code if email was already registered', async () => {
        const rawUser = {
            id: uuid(),
            name: name.findName(),
            password: internet.password(),
            email: internet.email().toLowerCase(),
            type: UserType.ADMIN,
            phone_number: phone.phoneNumber('33333333333'),
            timezone: 'America/Sao_Paulo',
        };

        await userRepository.insert(rawUser);

        const userToRegister = {
            name: name.findName(),
            password: internet.password(),
            email: rawUser.email,
            type: UserType.ADMIN,
            phoneNumber: phone.phoneNumber('33333333333'),
            timezone: 'America/Sao_Paulo',
        };

        const response = await request(app)
            .post(`/api/businesses/${authInfos.businessId}/users`)
            .set('Authorization', authInfos.jwt)
            .send(userToRegister);

        expect(response.status).toBe(StatusCodes.CONFLICT);
    });
});

import { getRepository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import {} from 'faker'


import User from '@user/domain/user/user';
import UserEmail from '@user/domain/user/userEmail';
import UserPassword from '@user/domain/user/userPassword';
import UserEntity from '@database/TypeORM/entities/User';

export default function fakeUser(overrides?: Partial<User>): User {
    return User.create({
        name: name.findName(),
        email: UserEmail.create(internet.email()).value as UserEmail,
        password: UserPassword.create({ value: internet.password() }).value as UserPassword,
        phoneNumber: phone.phoneNumber(),

        ...overrides,
    }).value as User;
}

export function insertFakeUser(overrides?: Partial<UserEntity>): Promise<UserEntity> {
    return getRepository(UserEntity).save(
        {
            id: uuid(),
            name: name.findName(),
            email: internet.email(),
            password: lorem.words(),
            phone_number: phone.phoneNumber('3333333333'),
            ...overrides,
        },
        { transaction: false, listeners: false },
    );
}

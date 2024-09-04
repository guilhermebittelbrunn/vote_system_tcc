import { BaseFakeRepo } from '@core/tests/BaseFakeRepo';
import UserEntity from '@database/TypeORM/entities/User';
import User from '@user/domain/user/user';
import UserMapper from '@user/mappers/userMapper';
import IUserRepository from '@user/repositories/IUserRepository';

export default class FakeUserRepository extends BaseFakeRepo<User, UserEntity> implements IUserRepository {
    mapper = UserMapper;

    public findByEmail(_: string): User | null {
        return null;
    }

    public findAvailableById(): User | null {
        return null;
    }

    compareFakeItems(item1: UserEntity, item2: UserEntity): boolean {
        return item1.id === item2.id;
    }
}

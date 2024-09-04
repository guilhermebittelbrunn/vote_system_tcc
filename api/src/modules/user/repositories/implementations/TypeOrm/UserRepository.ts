import UniqueEntityID from '@core/domain/UniqueEntityID';
import BaseRepository from '@core/infra/TypeORM/BaseRepository';
import { GenericId } from '@core/utils/types';
import UserEntity from '@database/TypeORM/entities/User';
import User from '@user/domain/user/user';
import UserMapper from '@user/mappers/userMapper';
import IUserRepository, {
} from '@user/repositories/IUserRepository';

export default class UserRepository extends BaseRepository<UserEntity, User> implements IUserRepository {
    mapper = UserMapper;

    entity = UserEntity;

    usesSoftDelete = false;

    public async findByEmail(email: string): Promise<User | null> {
        const result = await this.repository.findOne({
            where: {
                email,
            },
        });

        return result ? this.mapper.toDomain(result) : null;
    }

    public async findAvailableById(id: GenericId): Promise<User | null> {
        const result = await this.repository.findOne({
            where: {
                id: UniqueEntityID.raw(id),
                enabled: true,
            },
        });

        return this.mapper.toDomainOrNull(result);
    }


}

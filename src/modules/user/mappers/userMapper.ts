import Mapper from "@core/domain/Mapper";
import UniqueEntityID from "@core/domain/UniqueEntityID";
import { AllOptional } from "@core/utils/types";
import UserEntity from "@database/TypeORM/entities/User";
import User from "@user/domain/user/user";
import UserCpf from "@user/domain/user/userCpf";
import UserEmail from "@user/domain/user/userEmail";
import UserPassword from "@user/domain/user/userPassword";
import UserDTO from "@user/dtos/user";

class BaseUserMapper extends Mapper<User, UserEntity, UserDTO> {
    public toDomain(data: UserEntity): User {
        const password = UserPassword.create({ value: data.password, hashed: true });
        const email = UserEmail.create(data.email);
        const cpf = UserCpf.create(data.cpf);

        return User.create(
            {
                name: data.name,
                email: email.value as UserEmail,
                password: password.value as UserPassword,
                cpf: cpf.value as UserCpf,
                rg: data.rg,
                birthday: data.birthday,
                phoneNumber: data.phone_number,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
                deletedAt: data.deleted_at,
            },
            new UniqueEntityID(data.id),
        ).value as User;
    }

    public async toPersistence(user: AllOptional<User>): Promise<AllOptional<UserEntity>> {
        return {
            id: user.id?.toValue(),
            name: user.name,
            email: user.email?.value,
            password: user.password?.value,
            cpf: user.cpf?.value,
            rg: user.rg,
            birthday: user.birthday,
            phone_number: user.phoneNumber,
            created_at: user.createdAt,
            updated_at: user.updatedAt,
            deleted_at: user.deletedAt,
        };
    }

    public toDTO(user: User): UserDTO {
        return {
            id: user.id?.toValue(),
            name: user.name,
            email: user.email.value,
            cpf: user.cpf.value,
            rg: user.rg,
            birthday: user.birthday,
            phoneNumber: user.phoneNumber,
            createdAt: user.createdAt as Date,
            updatedAt: user.updatedAt as Date,
            deletedAt: user.deletedAt,
        };
    }
}

const UserMapper = new BaseUserMapper();

export default UserMapper;

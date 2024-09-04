import UserEmail from "./userEmail";
import UserPassword from "./userPassword";
import UniqueEntityID from "@core/domain/UniqueEntityID";
import { Either, left, right } from "@root-shared/logic/Either";
import GenericAppError from "@root-shared/logic/GenericAppError";
import Guard from "@root-shared/logic/Guard";
import GenericErrors from "@root-shared/logic/GenericErrors";
import Entity from "@core/domain/Entity";
import { stringIfExists } from "@core/utils/undefinedHelpers";
import UserCpf from "./userCpf";

interface IUserProps {
    name: string;
    email: UserEmail;
    cpf: UserCpf;
    rg: string;
    password: UserPassword;
    birthday: Date;
    phoneNumber?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export default class User extends Entity<IUserProps> {
    private constructor(props: IUserProps, id?: UniqueEntityID) {
        super(props, id);
    }

    get id(): UniqueEntityID {
        return this._id;
    }

    get name(): string {
        return this.props.name;
    }

    get email(): UserEmail {
        return this.props.email;
    }

    get password(): UserPassword {
        return this.props.password;
    }

    get cpf(): UserCpf {
        return this.props.cpf;
    }

    get rg(): string {
        return this.props.rg;
    }

    get birthday(): Date {
        return this.props.birthday;
    }
    get phoneNumber(): string | null | undefined {
        return this.props.phoneNumber;
    }

    get createdAt(): Date | undefined {
        return this.props.createdAt;
    }

    get updatedAt(): Date | undefined {
        return this.props.updatedAt;
    }

    get deletedAt(): Date | undefined {
        return this.props.deletedAt;
    }

    private static normalize(props: IUserProps) {
        return {
            ...props,
            name: String(props.name),
            phoneNumber: stringIfExists(props.phoneNumber),
        };
    }

    public static create(props: IUserProps, id?: UniqueEntityID): Either<GenericAppError, User> {
        const guardedProps = Guard.againstNullOrUndefinedBulk([
            { argument: props.email, argumentName: 'e-mail' },
            { argument: props.name, argumentName: 'nome' },
            { argument: props.cpf, argumentName: 'CPF' },
            { argument: props.rg, argumentName: 'RG' },
            { argument: props.birthday, argumentName: 'data de nascimento' },
            { argument: props.password, argumentName: 'senha' },
        ]);

        if (!guardedProps.succeeded) {
            return left(new GenericErrors.InvalidParam(guardedProps.message));
        }

        const normalizedProps = this.normalize(props);

        return right(new User(normalizedProps, id));
    }
}

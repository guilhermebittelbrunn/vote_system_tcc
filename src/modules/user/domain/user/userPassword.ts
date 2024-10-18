import HashValueObject from "@core/domain/HashValueObject";
import { SALT_ROUNDS } from "@core/utils/consts";
import { Either, left, right } from "@root-shared/logic/Either";
import GenericAppError from "@root-shared/logic/GenericAppError";
import GenericErrors from "@root-shared/logic/GenericErrors";
import Guard from "@root-shared/logic/Guard";

export interface IUserPasswordProps {
    value: string;
    hashed?: boolean;
}

export default class UserPassword extends HashValueObject<IUserPasswordProps> {
    public static minLength = 6;

    private static userFriendlyName = 'senha';

    protected salt = SALT_ROUNDS;

    get value(): string {
        return this.props.value;
    }

    private constructor(props: IUserPasswordProps) {
        super(props);
    }

    private static isAppropriateLength(password: string): boolean {
        return password.length >= this.minLength;
    }

    public static create(props: IUserPasswordProps): Either<GenericAppError, UserPassword> {
        const propsResult = Guard.againstNullOrUndefined(props.value, this.userFriendlyName);

        if (!propsResult.succeeded) {
            return left(new GenericErrors.InvalidParam(propsResult.message));
        }

        if (!props.hashed) {
            if (!this.isAppropriateLength(props.value)) {
                return left(
                    new GenericErrors.InvalidParam('senha não tem os requisitos mínimos (6 caracteres).'),
                );
            }
        }

        return right(
            new UserPassword({
                value: props.value,
                hashed: !!props.hashed === true,
            }),
        );
    }
}

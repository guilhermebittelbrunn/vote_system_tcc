import ValueObject from "@core/domain/ValueObject";
import { Either, left, right } from "@root-shared/logic/Either";
import GenericAppError from "@root-shared/logic/GenericAppError";
import GenericErrors from "@root-shared/logic/GenericErrors";

export interface UserEmailProps {
    value: string;
}

export default class UserEmail extends ValueObject<UserEmailProps> {
    get value(): string {
        return this.props.value;
    }

    private constructor(props: UserEmailProps) {
        super(props);
    }

    private static isValidEmail(email: string | null): email is string {
        if (!email) return false;

        const re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    private static format(email: string): string {
        return email.trim().toLowerCase();
    }

    public static create(email: string | null): Either<GenericAppError, UserEmail> {
        if (!this.isValidEmail(email)) {
            return left(new GenericErrors.InvalidParam('e-mail inválido'));
        }

        return right(new UserEmail({ value: this.format(email) }));
    }
}

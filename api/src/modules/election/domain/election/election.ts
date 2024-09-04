import UniqueEntityID from "@core/domain/UniqueEntityID";
import Entity from "@core/domain/Entity";
import { Either, left, right } from "@root-shared/logic/Either";
import GenericAppError from "@root-shared/logic/GenericAppError";
import Guard from "@root-shared/logic/Guard";
import GenericErrors from "@root-shared/logic/GenericErrors";

interface IElectionProps {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export default class Election extends Entity<IElectionProps> {
    private constructor(props: IElectionProps, id?: UniqueEntityID) {
        super(props, id);
    }

    get id(): UniqueEntityID {
        return this._id;
    }

    get title(): string {
        return this.props.title;
    }

    get description(): string {
        return this.props.description;
    }

    get startDate(): Date {
        return this.props.startDate;
    }

    get endDate(): Date {
        return this.props.endDate;
    }

    get createdAt(): Date | undefined {
        return this.props.createdAt;
    }

    get updatedAt(): Date | undefined {
        return this.props.updatedAt;
    }
    get deletedAt(): Date | undefined {
        return this.props.updatedAt;
    }

    public static create(props: IElectionProps, id?: UniqueEntityID): Either<GenericAppError, Election> {
        const guardedProps = Guard.againstNullOrUndefinedBulk([
            { argument: props.title, argumentName: 'title' },
            { argument: props.description, argumentName: 'description' },
            { argument: props.startDate, argumentName: 'startDate' },
            { argument: props.endDate, argumentName: 'endDate' },
        ]);

        if (!guardedProps.succeeded) {
            return left(new GenericErrors.InvalidParam(guardedProps.message));
        }

        return right(new Election(props, id));
    }
}

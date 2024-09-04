import UniqueEntityID from "@core/domain/UniqueEntityID";
import Entity from "@core/domain/Entity";
import { Either, left, right } from "@root-shared/logic/Either";
import GenericAppError from "@root-shared/logic/GenericAppError";
import Guard from "@root-shared/logic/Guard";
import GenericErrors from "@root-shared/logic/GenericErrors";

interface IVoteProps {
    blockHash: string;  // Hash do bloco armazenado na blockchain
    electionId: UniqueEntityID;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export default class Vote extends Entity<IVoteProps> {
    private constructor(props: IVoteProps, id?: UniqueEntityID) {
        super(props, id);
    }

    get id(): UniqueEntityID {
        return this._id;
    }

    get blockHash(): string {
        return this.props.blockHash;
    }

    get electionId(): UniqueEntityID {
        return this.props.electionId;
    }

    get createdAt(): Date | undefined {
        return this.props.createdAt;
    }
    get updatedAt(): Date | undefined {
        return this.props.createdAt;
    }
    get deletedAt(): Date | undefined {
        return this.props.createdAt;
    }

    public static create(props: IVoteProps, id?: UniqueEntityID): Either<GenericAppError, Vote> {
        const guardedProps = Guard.againstNullOrUndefinedBulk([
            { argument: props.blockHash, argumentName: 'blockHash' },
            { argument: props.electionId, argumentName: 'electionId' },
        ]);

        if (!guardedProps.succeeded) {
            return left(new GenericErrors.InvalidParam(guardedProps.message));
        }

        return right(new Vote(props, id));
    }
}

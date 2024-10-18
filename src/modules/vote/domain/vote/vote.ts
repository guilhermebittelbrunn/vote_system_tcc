import UniqueEntityID from "@core/domain/UniqueEntityID";
import Entity from "@core/domain/Entity";
import { Either, left, right } from "@root-shared/logic/Either";
import GenericAppError from "@root-shared/logic/GenericAppError";
import Guard from "@root-shared/logic/Guard";
import GenericErrors from "@root-shared/logic/GenericErrors";
import { VoteStatusEnum } from "@root-shared/types/vote";
import Election from "modules/election/domain/election/election";

interface IVoteProps {
    blockHash: string | null;
    electionId: UniqueEntityID;
    userId: UniqueEntityID;
    status: VoteStatusEnum;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    election?: Election;
}

export default class Vote extends Entity<IVoteProps> {
    private constructor(props: IVoteProps, id?: UniqueEntityID) {
        super(props, id);
    }

    get id(): UniqueEntityID {
        return this._id;
    }

    get blockHash(): string | null {
        return this.props.blockHash;
    }

    set blockHash(data: string | null) {
        this.props.blockHash = data;
    }

    get electionId(): UniqueEntityID {
        return this.props.electionId;
    }

    get userId(): UniqueEntityID {
        return this.props.userId;
    }

    get status(): VoteStatusEnum {
        return this.props.status;
    }

    get election(): Election | undefined {
        return this.props.election;
    }

    set status(data: VoteStatusEnum) {
        this.props.status = data;
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
            { argument: props.electionId, argumentName: 'electionId' },
            { argument: props.userId, argumentName: 'user id' },
            { argument: props.status, argumentName: 'status' },
        ]);

        if (!guardedProps.succeeded) {
            return left(new GenericErrors.InvalidParam(guardedProps.message));
        }

        return right(new Vote(props, id));
    }
}

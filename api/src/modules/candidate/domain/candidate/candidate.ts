import UniqueEntityID from "@core/domain/UniqueEntityID";
import Entity from "@core/domain/Entity";
import { Either, left, right } from "@root-shared/logic/Either";
import GenericAppError from "@root-shared/logic/GenericAppError";
import Guard from "@root-shared/logic/Guard";
import GenericErrors from "@root-shared/logic/GenericErrors";
import Election from "modules/election/domain/election/election";

interface ICandidateProps {
    name: string;
    party: string | null;
    electionId: UniqueEntityID;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    election?: Election;
}

export default class Candidate extends Entity<ICandidateProps> {
    private constructor(props: ICandidateProps, id?: UniqueEntityID) {
        super(props, id);
    }

    get id(): UniqueEntityID {
        return this._id;
    }

    get name(): string {
        return this.props.name;
    }

    get party(): string | null {
        return this.props.party;
    }

    get electionId(): UniqueEntityID {
        return this.props.electionId;
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

    get election(): Election | undefined  {
        return this.props.election
    }

    private static normalize(props: ICandidateProps) {
        return {
            ...props,
            name: String(props.name),
            party: String(props.party),
        };
    }

    public static create(props: ICandidateProps, id?: UniqueEntityID): Either<GenericAppError, Candidate> {
        const guardedProps = Guard.againstNullOrUndefinedBulk([
            { argument: props.name, argumentName: 'name' },
            { argument: props.electionId, argumentName: 'electionId' },
        ]);

        if (!guardedProps.succeeded) {
            return left(new GenericErrors.InvalidParam(guardedProps.message));
        }

        const normalizedProps = this.normalize(props);

        return right(new Candidate(normalizedProps, id));
    }
}

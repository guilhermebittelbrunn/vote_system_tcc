import Block from '@core/domain/Block';
import UniqueEntityID from '@core/domain/UniqueEntityID';
import { Either, left, right } from '@root-shared/logic/Either';
import GenericAppError from '@root-shared/logic/GenericAppError';
import GenericErrors from '@root-shared/logic/GenericErrors';
import Guard from '@root-shared/logic/Guard';

interface IVoteBlockProps {
    voterId: UniqueEntityID;
    candidateId: UniqueEntityID;
    electionId: UniqueEntityID;
    previousHash?: string;
    timestamp?: Date;
}

export class VoteBlock extends Block<IVoteBlockProps> {
    private readonly _props: IVoteBlockProps;

    private constructor(props: IVoteBlockProps, id?: UniqueEntityID) {
        super(props, id);
    }

    get voterId(): UniqueEntityID {
        return this._props.voterId;
    }

    get candidateId(): UniqueEntityID {
        return this._props.candidateId;
    }

    get electionId(): UniqueEntityID {
        return this._props.electionId;
    }

    get timestamp(): Date {
        return this._props.timestamp!;
    }

    public static create(props: IVoteBlockProps, id?: UniqueEntityID): Either<GenericAppError, VoteBlock> {
         const guardedProps = Guard.againstNullOrUndefinedBulk([
            { argument: props.candidateId, argumentName: 'id do candidato' },
            { argument: props.electionId, argumentName: 'id da eleição' },
            { argument: props.voterId, argumentName: 'id do votador' }, // kkkkk
        ]);

        if (!guardedProps.succeeded) {
            return left(new GenericErrors.InvalidParam(guardedProps.message));
        }

        return right(new VoteBlock(props, id));
    }
}

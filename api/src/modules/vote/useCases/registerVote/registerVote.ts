import UseCase from '@core/domain/UseCase';
import { Either, left, right } from '@root-shared/logic/Either';
import GenericAppError from '@root-shared/logic/GenericAppError';
import Vote from 'modules/vote/domain/vote/vote';
import IVoteRepository from 'modules/vote/repositories/IVoteRepository';
import RegisterVoteRequestDTO from './registerVoteRequestDTO';
import RegisterVoteErrors from './registerVoteErrors';
import { VoteStatusEnum } from '@root-shared/types/vote';
import IVoteQueue from 'modules/vote/queues/IVoteQueue';
import Guard from '@root-shared/logic/Guard';
import GenericErrors from '@root-shared/logic/GenericErrors';
import IUserRepository from '@user/repositories/IUserRepository';
import IElectionRepository from 'modules/election/repositories/IElectionRepository';

type Response = Either<GenericAppError, null>;

export default class RegisterVote implements UseCase<RegisterVoteRequestDTO, Response> {
    constructor(
        private voteRepo: IVoteRepository,
        private userRepo: IUserRepository,
        private electionRepo: IElectionRepository,
        private queueHandler: IVoteQueue,
    ) {}

    public async execute(dto: RegisterVoteRequestDTO): Promise<Response> {
        const guardedProps = Guard.againstNullOrUndefinedBulk([
            { argument: dto.electionId, argumentName: 'Id da eleição' },
            { argument: dto.userId, argumentName: 'Id do usuário' },
            { argument: dto.candidateId, argumentName: 'Id do candidato' },
        ])

        if (!guardedProps.succeeded) {
            return left(new GenericErrors.InvalidParam(guardedProps.message));
        }

        const user = await this.userRepo.findById(dto.userId);

        if (!user) {
            return left(new GenericErrors.NotFound('Usuário não encontrado'));
        }

        const election = await this.electionRepo.findByIdWithCandidates(dto.electionId);

        if (!election) {
            return left(new GenericErrors.NotFound('Eleição não encontrada'));
        }

        if(election.candidates?.items.find(candidate => candidate.id.toValue() === dto.candidateId) === undefined) {
            return left(new GenericErrors.NotFound('Candidato não encontrada'));
        }

        const voteAlreadyExists = await this.voteRepo.findByUserAndElection(
            user.id.toValue(),
            election.id.toValue(),
        )

        if(voteAlreadyExists) {
            return left(new RegisterVoteErrors.VoteAlreadyExists());
        }

        const voteOrError = Vote.create({
            blockHash: null,
            status: VoteStatusEnum.IN_PROCESS,
            electionId: election.id,
            userId: user.id,
        });


        if (voteOrError.isLeft()) {
            return left(voteOrError.value);
        }

        const vote = await this.voteRepo.insert(voteOrError.value);

        await this.queueHandler.send({
            candidateId: dto.candidateId,
            userId: dto.userId,
            voteId: vote.id.toValue(),
        });

        return right(null);
    }
}

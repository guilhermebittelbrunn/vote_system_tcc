import UniqueEntityID from '@core/domain/UniqueEntityID';
import UseCase from '@core/domain/UseCase';
import { Either, left, right } from '@root-shared/logic/Either';
import GenericAppError from '@root-shared/logic/GenericAppError';
import Vote from 'modules/vote/domain/vote/vote';
import IVoteRepository from 'modules/vote/repositories/IVoteRepository';
import RegisterVoteErrors from './registerVoteErrors';
import RegisterVoteRequestDTO from './registerVoteRequestDTO';
import IVoteChain from 'modules/vote/repositories/IVoteChain';

type Response = Either<GenericAppError, Vote>;

export default class RegisterVote implements UseCase<RegisterVoteRequestDTO, Response> {
    constructor(private voteRepo: IVoteRepository) {}

    public async execute(dto: RegisterVoteRequestDTO): Promise<Response> {
        // const voteExists = await this.voteRepo.findByUserAndElection(dto.userId, dto.electionId);

        // if (voteExists) {
        //     return left(new RegisterVoteErrors.VoteAlreadyExists());
        // }

        // // @todo verificar a criação desse bloco aqui, talvez seja melhor usar apenas o método no blockchain

        // const block = Block.create({
        //     voterId: new UniqueEntityID(dto.userId),
        //     candidateId: new UniqueEntityID(dto.candidateId),
        //     electionId: new UniqueEntityID(dto.electionId),
        // });

        // await this.blockchain.save(block);

        // const voteOrError = Vote.create({
        //     blockHash: block.hash,
        //     electionId: new UniqueEntityID(dto.electionId),
        // });

        // if (voteOrError.isLeft()) {
        //     return left(voteOrError.value);
        // }

        // const vote = await this.voteRepo.insert(voteOrError.value);

        return right(null);
    }
}

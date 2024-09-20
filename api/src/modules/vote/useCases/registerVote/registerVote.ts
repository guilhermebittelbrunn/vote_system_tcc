import UniqueEntityID from '@core/domain/UniqueEntityID';
import UseCase from '@core/domain/UseCase';
import { Either, left, right } from '@root-shared/logic/Either';
import GenericAppError from '@root-shared/logic/GenericAppError';
import Vote from 'modules/vote/domain/vote/vote';
import IVoteRepository from 'modules/vote/repositories/IVoteRepository';
import RegisterVoteRequestDTO from './registerVoteRequestDTO';
import { IWeb3Integrator } from 'modules/blockchain/web3/services/IWeb3Integrator';

type Response = Either<GenericAppError, Vote>;

export default class RegisterVote implements UseCase<RegisterVoteRequestDTO, Response> {
    constructor(private voteRepo: IVoteRepository, private web3Integrator: IWeb3Integrator ) {}

    public async execute(dto: RegisterVoteRequestDTO): Promise<Response> {
        console.log('dto :>> ', dto);

        // const voteExists = await this.voteRepo.findByUserAndElection(dto.userId, dto.electionId);

        // console.log('voteExists :>> ', voteExists);

        // if (voteExists) {
        //     return left(new RegisterVoteErrors.VoteAlreadyExists());
        // }

        const transactionHash = await this.web3Integrator.registerTransaction({candidateId: dto.candidateId});

        console.log('transactionHash :>> ', transactionHash);

        const voteOrError = Vote.create({
            blockHash: transactionHash.blockNumber,
            electionId: new UniqueEntityID(dto.electionId),
            userId: new UniqueEntityID(dto.userId),
        });

        if(voteOrError.isLeft()) {
            return left(voteOrError.value);
        }

        const vote = await this.voteRepo.insert(voteOrError.value);

        return right(vote);
    }
}

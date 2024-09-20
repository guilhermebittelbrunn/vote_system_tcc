import UniqueEntityID from '@core/domain/UniqueEntityID';
import UseCase from '@core/domain/UseCase';
import { Either, left, right } from '@root-shared/logic/Either';
import GenericAppError from '@root-shared/logic/GenericAppError';
import Vote from 'modules/vote/domain/vote/vote';
import IVoteRepository from 'modules/vote/repositories/IVoteRepository';
import RegisterVoteErrors from './registerVoteErrors';
import RegisterVoteRequestDTO from './registerVoteRequestDTO';
import IVoteChain from 'modules/vote/repositories/IVoteChain';
import { VoteBlock } from 'modules/vote/domain/voteBlock/voteBlock';
import { IWeb3Integrator } from 'modules/blockchain/web3/services/IWeb3Integrator';

type Response = Either<GenericAppError, Vote>;

export default class RegisterVote implements UseCase<RegisterVoteRequestDTO, Response> {
<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes

        // const vote = await this.voteRepo.insert(voteOrError.value);

        return right(null);
    }
}

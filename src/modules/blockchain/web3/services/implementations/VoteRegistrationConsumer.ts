import { IWeb3Integrator } from 'modules/blockchain/web3/services/IWeb3Integrator';
import BaseConsumer from '@core/infra/BaseConsumer';
import IVoteRepository from 'modules/vote/repositories/IVoteRepository';
import { VoteStatusEnum } from '@root-shared/types/vote';
import IVoteQueue from 'modules/vote/queues/IVoteQueue';
import ICandidateRepository from 'modules/candidate/repositories/ICandidateRepository';

export default class VoteRegistrationConsumer extends BaseConsumer<any> {
    public queue = 'vote-registration';
    public bindingKey = 'vote.register';
    public exchanges = [{ name: 'voteExchange', type: 'direct' as 'direct' }];

    constructor(
        private voteRepo: IVoteRepository,
        private candidateRepo: ICandidateRepository,
        private web3Integrator: IWeb3Integrator,
        private queueHandler: IVoteQueue)
    {
        super();
    }

    protected async onMessage(data: any): Promise<void> {
        const { voteId, candidateId, userId } = data;

        const vote = await this.voteRepo.findById(voteId);
        const candidate = await this.candidateRepo.findById(candidateId);

        if (!vote) {
            throw new Error('Vote not found');
        }

        if (!candidate) {
            throw new Error('Candidate not found');
        }

        try {

            const transactionHash = await this.web3Integrator.registerTransaction({ candidateId });

            vote.blockHash = transactionHash.blockNumber;
            vote.status = VoteStatusEnum.SUCCESS;
            await this.voteRepo.update(vote);

            candidate.quantity += 1;
            await this.candidateRepo.update(candidate);

        } catch (error) {
            console.error(`Error registering vote ${voteId} on blockchain: `, error);

            await this.queueHandler.send({
                candidateId,
                userId,
                voteId,
            });

            await this.voteRepo.update(vote);
        }
    }
}

import Vote from "modules/vote/domain/vote/vote";
import UniqueEntityID from "@core/domain/UniqueEntityID";
import { BaseBlockchain } from "@core/infra/HyperledgerFabric/BaseBlockchain";
import IVoteChain from "../../IVoteChain";
import { VoteBlock } from "modules/vote/domain/voteBlock/voteBlock";
import GenericAppError from "@root-shared/logic/GenericAppError";
import { Either, left, right } from "@root-shared/logic/Either";
import GenericErrors from "@root-shared/logic/GenericErrors";

export class VoteChain extends BaseBlockchain<VoteBlock> implements IVoteChain {

    async findByUserAndElection(userId: UniqueEntityID, electionId: UniqueEntityID): Promise<Either<GenericAppError, Vote>> {
        const result = await this.contract.evaluateTransaction('FindVoteByUserAndElection', userId.toValue(), electionId.toValue());

        if (!result){
            return left(new GenericErrors.NotFound());
        };

        const blockData = JSON.parse(result.toString());

        const voteBlockOrError = VoteBlock.create({
            voterId: new UniqueEntityID(blockData.voterId),
            candidateId: new UniqueEntityID(blockData.candidateId),
            electionId: new UniqueEntityID(blockData.electionId),
            previousHash: blockData.previousHash,
            timestamp: new Date(blockData.timestamp),
        });

        if (voteBlockOrError.isLeft()) {
            return left(new GenericErrors.InvalidParam(voteBlockOrError.value.message));
        }

        const vote = Vote.create({
            blockHash: voteBlockOrError.value.hash,
            electionId: new UniqueEntityID(blockData.electionId),
        });

        return right(vote.value as Vote);
    }

    async countVotesByElectionId(electionId: UniqueEntityID): Promise<number> {
        const result = await this.contract.evaluateTransaction('CountVotes', electionId.toValue());
        return parseInt(result.toString(), 10);
    }

}

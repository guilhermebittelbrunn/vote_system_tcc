import Vote from "../domain/vote/vote";
import UniqueEntityID from "@core/domain/UniqueEntityID";
import Blockchain, { GenericEitherResponse } from "@core/infra/Blockchain";
import { VoteBlock } from "../domain/voteBlock/voteBlock";

interface IVoteChain extends Blockchain<VoteBlock> {
    findByUserAndElection(userId: UniqueEntityID, electionId: UniqueEntityID): Promise<GenericEitherResponse<Vote>>
    countVotesByElectionId(electionId: UniqueEntityID): Promise<number>
}

export default IVoteChain;

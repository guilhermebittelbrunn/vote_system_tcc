import Mapper from "@core/domain/Mapper";
import UniqueEntityID from "@core/domain/UniqueEntityID";
import { AllOptional } from "@core/utils/types";
import Vote from "../domain/vote/vote";
import VoteDTO from "../dtos/vote";
import VoteEntity from "@database/TypeORM/entities/Vote";

class BaseVoteMapper extends Mapper<Vote, VoteEntity, VoteDTO> {
    public toDomain(data: VoteEntity): Vote {
        return Vote.create(
            {
                blockHash: data.block_hash,
                userId: new UniqueEntityID(data.user_id),
                electionId: new UniqueEntityID(data.election_id),
                createdAt: data.created_at,
            },
            new UniqueEntityID(data.id),
        ).value as Vote;
    }

    public async toPersistence(vote: AllOptional<Vote>): Promise<AllOptional<VoteEntity>> {
        return {
            id: vote.id?.toValue(),
            block_hash: vote.blockHash,
            election_id: vote.electionId?.toValue(),
            user_id: vote.userId?.toValue(),
            created_at: vote.createdAt,
        };
    }

    public toDTO(vote: Vote): VoteDTO {
        return {
            id: vote.id?.toValue(),
            blockHash: vote.blockHash,
            electionId: vote.electionId?.toValue(),
            userId: vote.userId.toValue(),
            createdAt: vote.createdAt as Date,
        };
    }
}

const VoteMapper = new BaseVoteMapper();

export default VoteMapper;

import Mapper from "@core/domain/Mapper";
import UniqueEntityID from "@core/domain/UniqueEntityID";
import { AllOptional } from "@core/utils/types";
import Vote from "../domain/vote/vote";
import VoteEntity from "@database/TypeORM/entities/Votes";
import VoteDTO from "../dtos/vote";
import ElectionMapper from "modules/election/mappers/electionMapper";

class BaseVoteMapper extends Mapper<Vote, VoteEntity, VoteDTO> {
    public toDomain(data: VoteEntity): Vote {
        return Vote.create(
            {
                blockHash: data.block_hash,
                electionId: new UniqueEntityID(data.election_id),
                createdAt: data.created_at,
                updatedAt: data.updated_at,
                deletedAt: data.deleted_at,
            },
            new UniqueEntityID(data.id),
        ).value as Vote;
    }

    public async toPersistence(vote: AllOptional<Vote>): Promise<AllOptional<VoteEntity>> {
        return {
            id: vote.id?.toValue(),
            block_hash: vote.blockHash,
            election_id: vote.electionId?.toValue(),
            created_at: vote.createdAt,
            updated_at: vote.updatedAt,
            deleted_at: vote.deletedAt,
        };
    }

    public toDTO(vote: Vote): VoteDTO {
        return {
            id: vote.id?.toValue(),
            blockHash: vote.blockHash,
            electionId: vote.electionId?.toValue(),
            createdAt: vote.createdAt as Date,
        };
    }
}

const VoteMapper = new BaseVoteMapper();

export default VoteMapper;

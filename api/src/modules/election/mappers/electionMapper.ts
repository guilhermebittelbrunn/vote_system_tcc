import Mapper from "@core/domain/Mapper";
import UniqueEntityID from "@core/domain/UniqueEntityID";
import { AllOptional } from "@core/utils/types";
import ElectionEntity from "@database/TypeORM/entities/Election";
import ElectionDTO from "../dtos/election";
import Election from "../domain/election/election";

class BaseElectionMapper extends Mapper<Election, ElectionEntity, ElectionDTO> {
    public toDomain(data: ElectionEntity): Election {
        return Election.create(
            {
                title: data.title,
                description: data.description,
                startDate: data.start_date,
                endDate: data.end_date,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
                deletedAt: data.deleted_at,
            },
            new UniqueEntityID(data.id),
        ).value as Election;
    }

    public async toPersistence(election: AllOptional<Election>): Promise<AllOptional<ElectionEntity>> {
        return {
            id: election.id?.toValue(),
            title: election.title,
            description: election.description,
            start_date: election.startDate,
            end_date: election.endDate,
            created_at: election.createdAt,
            updated_at: election.updatedAt,
            deleted_at: election.deletedAt,
        };
    }

    public toDTO(election: Election): ElectionDTO {
        return {
            id: election.id?.toValue(),
            title: election.title,
            description: election.description,
            startDate: election.startDate,
            endDate: election.endDate,
            createdAt: election.createdAt as Date,
            updatedAt: election.updatedAt as Date,
            deletedAt: election.deletedAt,
        };
    }
}

const ElectionMapper = new BaseElectionMapper();

export default ElectionMapper;

import Mapper from "@core/domain/Mapper";
import UniqueEntityID from "@core/domain/UniqueEntityID";
import { AllOptional } from "@core/utils/types";
import CandidateEntity from "@database/TypeORM/entities/Candidate";
import Candidate from "../domain/candidate/candidate";
import CandidateDTO from "../dtos/candidate";
import ElectionMapper from "modules/election/mappers/electionMapper";

class BaseCandidateMapper extends Mapper<Candidate, CandidateEntity, CandidateDTO> {
    public toDomain(data: CandidateEntity): Candidate {
        return Candidate.create(
            {
                name: data.name,
                party: data.party,
                electionId: new UniqueEntityID(data.election_id),
                createdAt: data.created_at,
                updatedAt: data.updated_at,
                deletedAt: data.deleted_at,
                election: ElectionMapper.toDomainOrUndefined(data.election)
            },
            new UniqueEntityID(data.id),
        ).value as Candidate;
    }

    public async toPersistence(candidate: AllOptional<Candidate>): Promise<AllOptional<CandidateEntity>> {
        return {
            id: candidate.id?.toValue(),
            name: candidate.name,
            party: candidate.party ?? undefined,
            election_id: candidate.electionId?.toValue(),
            created_at: candidate.createdAt,
            updated_at: candidate.updatedAt,
            deleted_at: candidate.deletedAt,
        };
    }

    public toDTO(candidate: Candidate): CandidateDTO {
        return {
            id: candidate.id?.toValue(),
            name: candidate.name,
            party: candidate.party,
            electionId: candidate.electionId?.toValue(),
            createdAt: candidate.createdAt as Date,
            updatedAt: candidate.updatedAt as Date,
            deletedAt: candidate.deletedAt,
            election: ElectionMapper.toDTOOrUndefined(candidate.election)
        };
    }
}

const CandidateMapper = new BaseCandidateMapper();

export default CandidateMapper;

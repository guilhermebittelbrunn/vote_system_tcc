import CandidateDTO from "modules/candidate/dtos/candidate";

type CreateCandidateRequestDTO = Omit<CandidateDTO, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'election'>

export default CreateCandidateRequestDTO

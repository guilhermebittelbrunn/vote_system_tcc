import ElectionDTO from "modules/election/dtos/election";

export default class CandidateDTO {
    id?: string;
    name: string;
    party: string | null;
    electionId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    election?: ElectionDTO
}

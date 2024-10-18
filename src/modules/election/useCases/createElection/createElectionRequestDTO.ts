import CreateCandidateRequestDTO from "modules/candidate/useCases/createCandidate/createCandidateRequestDTO";

interface CreateElectionRequestDTO {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    candidates: Pick<CreateCandidateRequestDTO, 'name' | 'party'>[];
    image?: string;
}

export default CreateElectionRequestDTO;

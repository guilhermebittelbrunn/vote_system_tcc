import CandidateDTO from "modules/candidate/dtos/candidate";

export default class ElectionDTO {
    id: string;
    title: string;
    description: string;
    image?: string;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    candidates?: Array<CandidateDTO>;
}

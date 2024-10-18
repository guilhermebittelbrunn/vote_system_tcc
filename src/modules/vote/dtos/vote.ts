import { VoteStatusEnum } from "@root-shared/types/vote";
import ElectionDTO from "modules/election/dtos/election";

export default class VoteDTO {
    id?: string;
    blockHash: string | null;
    electionId: string;
    userId: string;
    status: VoteStatusEnum;
    createdAt: Date;

    election?: ElectionDTO;
}

import Repository, { MultiEntityResponse, SingleEntityResponse } from "@core/infra/Repository";
import Vote from "../domain/vote/vote";

interface IVoteRepository extends Repository<Vote> {
    findByUserAndElection(userId: string, electionId: string): SingleEntityResponse<Vote>;
    listByUser(userId: string): MultiEntityResponse<Vote>; {
}

export default IVoteRepository;

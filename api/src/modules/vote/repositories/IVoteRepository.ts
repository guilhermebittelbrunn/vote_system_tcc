import Repository, { SingleEntityResponse } from "@core/infra/Repository";
import Vote from "../domain/vote/vote";

interface IVoteRepository extends Repository<Vote> {
    findByUserAndElection(userId: string, electionId: string): SingleEntityResponse<Vote>;
}

export default IVoteRepository;

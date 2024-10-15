import Repository, { MultiEntityResponse, SingleEntityResponse } from "@core/infra/Repository";
import Election from "../domain/election/election";

interface IElectionRepository extends Repository<Election> {
    findByIdWithCandidates(id: string): SingleEntityResponse<Election>;
    list(): MultiEntityResponse<Election>;
}

export default IElectionRepository;

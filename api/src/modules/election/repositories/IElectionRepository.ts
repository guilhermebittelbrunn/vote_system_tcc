import Repository from "@core/infra/Repository";
import Election from "../domain/election/election";

interface IElectionRepository extends Repository<Election> {
}

export default IElectionRepository;

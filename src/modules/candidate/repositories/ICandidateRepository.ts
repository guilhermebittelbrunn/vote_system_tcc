import Repository from "@core/infra/Repository";
import Candidate from "../domain/candidate/candidate";

interface ICandidateRepository extends Repository<Candidate> {
}

export default ICandidateRepository;

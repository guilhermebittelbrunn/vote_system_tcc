import ElectionRepository from "modules/election/repositories/implementations/ElectionRepository";
import FindElectionById from "./findElectionById";
import FindElectionByIdController from "./findElectionByIdController";

const electionRepo = new ElectionRepository();

const findElectionById = new FindElectionById(electionRepo);

const findElectionByIdController = new FindElectionByIdController(findElectionById);

export { findElectionById, findElectionByIdController };

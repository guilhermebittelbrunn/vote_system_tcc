import ElectionRepository from 'modules/election/repositories/implementations/ElectionRepository';
import CreateElection from './createElection';
import CreateElectionController from './createElectionController';


const electionRepo = new ElectionRepository();
const createElection = new CreateElection(electionRepo);

const createElectionController = new CreateElectionController(createElection);

export { createElection, createElectionController };

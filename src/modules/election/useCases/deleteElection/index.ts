import ElectionRepository from 'modules/election/repositories/implementations/ElectionRepository';
import DeleteElectionController from './deleteElectionController';

const electionRepo = new ElectionRepository();


const deleteElectionController = new DeleteElectionController(electionRepo);

export { deleteElectionController };

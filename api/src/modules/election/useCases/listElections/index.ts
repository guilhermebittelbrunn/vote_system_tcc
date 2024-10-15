import ListElections from './listElections';
import ElectionRepository from 'modules/election/repositories/implementations/ElectionRepository';
import ListElectionsController from './listElectionsController';

const electionRepo = new ElectionRepository();

const listElections = new ListElections(electionRepo);

const listElectionsController = new ListElectionsController(listElections);

export { listElections, listElectionsController };

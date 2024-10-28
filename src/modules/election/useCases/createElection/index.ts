import ElectionRepository from 'modules/election/repositories/implementations/ElectionRepository';
import CreateElection from './createElection';
import CreateElectionController from './createElectionController';
import { transactionManager } from '@core/infra/TypeORM/TransactionManager';


const electionRepo = new ElectionRepository();
const createElection = new CreateElection(electionRepo);

const createElectionController = new CreateElectionController(transactionManager,createElection);

export { createElection, createElectionController };

import CandidateRepository from 'modules/candidate/repositories/implementations/CandidateRepository';
import CreateCandidate from './createCandidate';
import CreateCandidateController from './createCandidateController';


const candidateRepo = new CandidateRepository();
const createCandidate = new CreateCandidate(candidateRepo);

const createCandidateController = new CreateCandidateController(createCandidate);

export { createCandidate, createCandidateController };

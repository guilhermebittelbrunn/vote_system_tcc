import { createCandidate } from '../createCandidate';
import CreateBulkCandidate from './createBulkCandidate';
import CreateBulkCandidateController from './createBulkCandidateController';

const createBulkCandidate = new CreateBulkCandidate(createCandidate);
const createBulkCandidateController = new CreateBulkCandidateController(createBulkCandidate );

export { createBulkCandidate, createBulkCandidateController };

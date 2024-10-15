import { Router } from 'express';
import { createBulkCandidateController } from 'modules/candidate/useCases/createBulkCandidate';
import { createCandidateController } from 'modules/candidate/useCases/createCandidate';

const candidateRootRouter = Router();

candidateRootRouter.post('/', (req, res) => {
    return createCandidateController.execute(req, res);
});

candidateRootRouter.post('/bulk', (req, res) => {
    return createBulkCandidateController.execute(req, res);
});

export default candidateRootRouter;

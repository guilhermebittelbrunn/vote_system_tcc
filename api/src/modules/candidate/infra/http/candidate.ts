import { Router } from 'express';
import { createCandidateController } from 'modules/candidate/useCases/createElection';

const candidateRootRouter = Router();

candidateRootRouter.post('/create', (req, res) => {
    return createCandidateController.execute(req, res);
});

export default candidateRootRouter;

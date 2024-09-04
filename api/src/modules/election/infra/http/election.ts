import { Router } from 'express';
import { createElectionController } from 'modules/election/useCases/createElection';

const electionRootRouter = Router();

electionRootRouter.post('/', (req, res) => {
    return createElectionController.execute(req, res)
});

export default electionRootRouter;

import adaptMiddleware from '@root-shared/infra/http/express/adapters/MiddlewareAdapter';
import { ensureAuthentication } from '@root-shared/infra/http/middlewares/EnsureAuthentication';
import { Router } from 'express';
import { registerVoteController } from 'modules/vote/useCases/registerVote';

const voteRootRouter = Router();

// voteRootRouter.use(adaptMiddleware(ensureAuthentication));

voteRootRouter.post('/register', (req, res) => {
    return registerVoteController.execute(req, res)
});

export default voteRootRouter;

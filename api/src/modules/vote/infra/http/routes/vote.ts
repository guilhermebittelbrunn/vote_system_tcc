import adaptMiddleware from '@root-shared/infra/http/express/adapters/MiddlewareAdapter';
import { ensureAuthentication } from '@root-shared/infra/http/middlewares/EnsureAuthentication';
import { Router } from 'express';
import { listVotesByUserController } from 'modules/vote/useCases/listVotesByUser';
import { registerVoteController } from 'modules/vote/useCases/registerVote';

const voteRouter = Router();

// voteRouter.use(adaptMiddleware(ensureAuthentication));

voteRouter.get('/:id', (req, res) => {
    return listVotesByUserController.execute(req, res)
});

voteRouter.post('/register', (req, res) => {
    return registerVoteController.execute(req, res)
});

export default voteRouter;

import { Router } from 'express';
import voteRootRouter from './vote';

const voteRouter = Router({ mergeParams: true });

voteRouter.use('/', voteRootRouter);

export default voteRouter;

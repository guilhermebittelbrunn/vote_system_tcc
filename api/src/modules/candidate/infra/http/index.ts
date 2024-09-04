import { Router } from 'express';
import candidateRootRouter from './candidate';

const candidateRouter = Router({ mergeParams: true });

candidateRouter.use('/', candidateRootRouter);

export default candidateRouter;

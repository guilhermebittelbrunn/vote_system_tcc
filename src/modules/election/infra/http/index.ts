import { Router } from 'express';
import electionRootRouter from './election';

const electionRouter = Router({ mergeParams: true });

electionRouter.use('/', electionRootRouter);

export default electionRouter;

import { Router } from 'express';
import blockchainRootRouter from './blockchain';

const blockchainRouter = Router({ mergeParams: true });

blockchainRouter.use('/', blockchainRootRouter);

export default blockchainRouter;

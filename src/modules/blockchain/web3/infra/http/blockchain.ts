import { Router } from 'express';
import { getBlockController } from '../../useCases/getBlock';
import { getBlockControllerData } from '../../useCases/getBlockData';

const blockchainRootRouter = Router();

blockchainRootRouter.get('/get-block/:id', (req, res) => {
    return getBlockController.execute(req, res)
});

blockchainRootRouter.get('/get-block-data/:id', (req, res) => {
    return getBlockControllerData.execute(req, res)
});

export default blockchainRootRouter;

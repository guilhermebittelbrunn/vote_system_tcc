import initUpload, { promisifyMiddleware } from '@root-shared/config/upload';
import { Router } from 'express';
import { createBulkCandidateController } from 'modules/candidate/useCases/createBulkCandidate';
import { createCandidateController } from 'modules/candidate/useCases/createCandidate';

const upload = initUpload();
const createUpload = upload.single('image')

const candidateRootRouter = Router();

candidateRootRouter.post('/', promisifyMiddleware(createUpload), (req, res) => {
    console.log('candiate ROUTE')
    return createCandidateController.execute(req, res);
});

candidateRootRouter.post('/bulk', (req, res) => {
    return createBulkCandidateController.execute(req, res);
});

export default candidateRootRouter;

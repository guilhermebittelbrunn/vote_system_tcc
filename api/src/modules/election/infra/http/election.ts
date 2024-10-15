import initUpload, { promisifyMiddleware } from '@root-shared/config/upload';
import { Router } from 'express';
import { createElectionController } from 'modules/election/useCases/createElection';
import { findElectionByIdController } from 'modules/election/useCases/findElectionById';
import { listElectionsController } from 'modules/election/useCases/listElections';

const upload = initUpload();
// const createUpload = upload.single('image');
const createUpload = upload.fields([
    { name: 'image', maxCount: 1 }, // Imagem da eleição
    { name: 'candidateImages', maxCount: 10 } // Imagens dos candidatos
]);

const electionRootRouter = Router();

electionRootRouter.get('/', (req, res) => {
    return listElectionsController.execute(req, res)
});

electionRootRouter.get('/:id', (req, res) => {
    return findElectionByIdController.execute(req, res)
});

electionRootRouter.post('/', promisifyMiddleware(createUpload),(req, res) => {
    return createElectionController.execute(req, res)
});

export default electionRootRouter;

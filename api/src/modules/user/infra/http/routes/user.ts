import adaptMiddleware from '@root-shared/infra/http/express/adapters/MiddlewareAdapter';
import { ensureAuthentication } from '@root-shared/infra/http/middlewares/EnsureAuthentication';
import { createUserController } from '@user/useCases/createUser';
import { findUserController } from '@user/useCases/findUseById';
import { updateUserController } from '@user/useCases/updateUser';
import { Router } from 'express';

const userRootRouter = Router({ mergeParams: true });

// userRootRouter.use(adaptMiddleware(ensureAuthentication));

userRootRouter.get('/:id', async (req, res) => {
    return findUserController.execute(req, res);
});

userRootRouter.put('/:id', async (req, res) => {
    return updateUserController.execute(req, res);
});

userRootRouter.post('/', async (req, res) => {
    return createUserController.execute(req, res);
});

export default userRootRouter;

import adaptMiddleware from '@root-shared/infra/http/express/adapters/MiddlewareAdapter';
import { ensureAuthentication } from '@root-shared/infra/http/middlewares/EnsureAuthentication';
import { createUserController } from '@user/useCases/createUser';
import { Router } from 'express';

const userRootRouter = Router({ mergeParams: true });

userRootRouter.use(adaptMiddleware(ensureAuthentication));

userRootRouter.post('/', async (req, res) => {
    return createUserController.execute(req, res);
});

export default userRootRouter;

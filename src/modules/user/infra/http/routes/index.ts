import { Router } from 'express';
import userRootRouter from './user';

const userRouter = Router({ mergeParams: true });

userRouter.use('/', userRootRouter);

export default userRouter;

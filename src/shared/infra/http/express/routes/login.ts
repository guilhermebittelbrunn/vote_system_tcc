import { loginController } from '@user/useCases/login';
import { Router } from 'express';

const loginRouter = Router();

loginRouter.post('/', async (req, res) => {
    return loginController.execute(req, res);
});


export default loginRouter;

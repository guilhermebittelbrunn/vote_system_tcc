import os from 'os';

import { Router } from 'express';
import loginRouter from './login';
import userRouter from '@user/infra/http/routes';
import electionRouter from 'modules/election/infra/http';
import candidateRouter from 'modules/candidate/infra/http';
import voteRouter from 'modules/vote/infra/http/routes';
import blockchainRouter from 'modules/blockchain/web3/infra/http';


const apiRouter = Router();

// apiRouter.use('/admin', adminRouter);

apiRouter.use('/user', userRouter);
apiRouter.use('/election', electionRouter);
apiRouter.use('/blockchain', blockchainRouter);
apiRouter.use('/candidate', candidateRouter);
apiRouter.use('/vote', voteRouter)
apiRouter.use('/login', loginRouter);

apiRouter.get('/check', (req, res) => {
    return res.json({
        uptime: os.uptime(),
        type: os.type(),
        version: os.version(),
        appVersion: process.env.npm_package_version,
    });
});

export { apiRouter };

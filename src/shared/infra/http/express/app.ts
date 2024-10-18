import os from 'os';

import cors from 'cors';
import express from 'express';
import path from 'path'

import { authUserData } from '../middlewares/AuthUserData';

import adaptMiddleware from './adapters/MiddlewareAdapter';
import contexts from './contexts';
import { apiRouter } from './routes';

const app = express();
const tmpFolder = path.resolve(__dirname, '..', '..', '..','..','..', 'tmp');


app.disable('x-powered-by');

app.use(express.json({ limit: '50mb' }));


app.use(cors());

app.use((req, res, next) => {
    res.setHeader('ngrok-skip-browser-warning', 'true');
    next();
})

app.use(async (req, res, next) => {
    contexts(() => next());
});


app.use(adaptMiddleware(authUserData));

app.use('/files',express.static(tmpFolder));
app.use('/api', apiRouter);


app.get('/robots.txt', function (_, res) {
    res.type('text/plain');
    res.send('User-agent: *\nDisallow: /');
});

app.get('/', (req, res) => {
    return res.json({
        uptime: os.uptime(),
        type: os.type(),
        version: os.version(),
        appVersion: process.env.npm_package_version,
    });
});

export default app;

import '@core/utils/env';

import consoleStamp from 'console-stamp';

import '@root-shared/infra/http/express/server';
import { connectToDB } from '@database/index';
import { connectToAmqp } from '@root-shared/infra/amqp';

consoleStamp(console, {
    format: ':date(dd/mm/yyyy HH:MM:ss.l)',
});

// connectToDB()
connectToDB().then(() => connectToAmqp());



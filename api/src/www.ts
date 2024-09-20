import '@core/utils/env';

import consoleStamp from 'console-stamp';

import '@root-shared/infra/http/express/server';
import { connectToDB } from '@database/index';

consoleStamp(console, {
    format: ':date(dd/mm/yyyy HH:MM:ss.l)',
});

connectToDB();

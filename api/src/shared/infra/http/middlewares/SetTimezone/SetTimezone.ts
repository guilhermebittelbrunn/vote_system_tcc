

import IDBOperations from '@root-shared/resositories/implementations/IDBOperations';
import IAuthContext from '../../contexts/IAuthContext';
import { Middleware, MiddlewareResponse } from '@core/infra/TypeORM/Middleware';
import { right } from '@root-shared/logic/Either';

export default class SetTimezone implements Middleware {
    constructor(private authContext: IAuthContext, private dbOperations: IDBOperations) {}

    public async handle(): Promise<MiddlewareResponse> {
        const timezone = this.authContext.getValue('userTimezone');

        if (!timezone) {
            return right(true);
        }

        process.env.TZ = timezone;

        await this.dbOperations.setTimezone(timezone);

        return right(true);
    }
}

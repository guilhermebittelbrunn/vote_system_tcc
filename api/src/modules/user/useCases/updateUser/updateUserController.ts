import { Response, Request } from 'express';

import BaseController from '@core/infra/BaseController';
import UpdateUser from './updateUser';

export default class UpdateUserController extends BaseController {
    constructor(private useCase: UpdateUser) {
        super();
    }

    public async executeImplementation(req: Request, res: Response): Promise<Response> {
        const result = await this.useCase.execute(this.payload(req));

        if (result.isLeft()) {
            return this.genericErrorResponse(res, result.value);
        }

        return this.ok(res, result.value);
    }
}

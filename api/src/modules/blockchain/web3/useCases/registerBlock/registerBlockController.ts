import { Response, Request } from 'express';

import BaseController from '@core/infra/BaseController';
import RegisterBlock from './registerBlock';


export default class RegisterBlockController extends BaseController {
    constructor(private useCase: RegisterBlock) {
        super();
    }

    public async executeImplementation(req: Request, res: Response): Promise<Response> {
        const result = await this.useCase.execute(this.payload(req));

        if (result.isLeft()) {
            return this.genericErrorResponse(res, result.value);
        }

        return this.ok(res, result);
    }
}

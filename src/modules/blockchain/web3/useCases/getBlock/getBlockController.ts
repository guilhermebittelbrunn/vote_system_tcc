import { Response, Request } from 'express';

import BaseController from '@core/infra/BaseController';
import GetBlock from './getBlock';


export default class GetBlockController extends BaseController {
    constructor(private useCase: GetBlock) {
        super();
    }

    public async executeImplementation(req: Request, res: Response): Promise<Response> {
        const result = await this.useCase.execute(req.params.id);

        if (result.isLeft()) {
            return this.genericErrorResponse(res, result.value);
        }

        return this.ok(res, result);
    }
}

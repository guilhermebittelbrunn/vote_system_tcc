import { Response, Request } from 'express';

import BaseController from '@core/infra/BaseController';
import GetBlockData from './getBlockData';


export default class GetBlockDataController extends BaseController {
    constructor(private useCase: GetBlockData) {
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

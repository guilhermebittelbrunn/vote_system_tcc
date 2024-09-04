import { Response, Request } from 'express';

import BaseController from '@core/infra/BaseController';

import CreateElection from './createElection';
import ElectionMapper from 'modules/election/mappers/electionMapper';

export default class CreateElectionController extends BaseController {
    constructor(private useCase: CreateElection) {
        super();
    }

    public async executeImplementation(req: Request, res: Response): Promise<Response> {
        const result = await this.useCase.execute(this.payload(req));

        if (result.isLeft()) {
            return this.genericErrorResponse(res, result.value);
        }

        return this.ok(res, ElectionMapper.toDTO(result.value));
    }
}

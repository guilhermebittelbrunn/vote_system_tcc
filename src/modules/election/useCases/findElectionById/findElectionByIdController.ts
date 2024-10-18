import { Response, Request } from 'express';

import BaseController from '@core/infra/BaseController';
import FindElectionById from './findElectionById';
import ElectionMapper from 'modules/election/mappers/electionMapper';


export default class FindElectionByIdController extends BaseController {
    constructor(private useCase: FindElectionById) {
        super();
    }

    public async executeImplementation(req: Request, res: Response): Promise<Response> {
        const result = await this.useCase.execute(req.params.id);

        if (result.isLeft()) {
            return this.genericErrorResponse(res, result.value);
        }

        return this.ok(res, ElectionMapper.toDTO(result.value));
    }
}

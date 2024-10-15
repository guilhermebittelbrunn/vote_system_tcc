import { Response, Request } from 'express';

import BaseController from '@core/infra/BaseController';
import CreateCandidate from './createCandidate';
import CandidateMapper from 'modules/candidate/mappers/candidate';

export default class CreateCandidateController extends BaseController {
    constructor(private useCase: CreateCandidate) {
        super();
    }

    public async executeImplementation(req: Request, res: Response): Promise<Response> {
        const result = await this.useCase.execute(this.payload(req));

        if (result.isLeft()) {
            return this.genericErrorResponse(res, result.value);
        }

        return this.ok(res, CandidateMapper.toDTO(result.value));
    }
}

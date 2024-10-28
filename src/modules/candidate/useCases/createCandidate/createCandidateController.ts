import { Response, Request } from 'express';

import BaseController from '@core/infra/BaseController';
import CreateCandidate from './createCandidate';
import CandidateMapper from 'modules/candidate/mappers/candidate';

export default class CreateCandidateController extends BaseController {
    constructor(private useCase: CreateCandidate) {
        super();
    }

    public async executeImplementation(req: Request & any, res: Response): Promise<Response> {
        console.log('req.file?.filename :>> ', req.file?.filename);
        const result = await this.useCase.execute({
                ...this.payload(req),
                image: req.file?.filename,
            });

        if (result.isLeft()) {
            return this.genericErrorResponse(res, result.value);
        }

        return this.ok(res, CandidateMapper.toDTO(result.value));
    }
}

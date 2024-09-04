import { Response, Request } from 'express';

import BaseController from '@core/infra/BaseController';

import RegisterVote from './registerVote';
import VoteMapper from 'modules/vote/mappers/vote';

export default class RegisterVoteController extends BaseController {
    constructor(private useCase: RegisterVote) {
        super();
    }

    public async executeImplementation(req: Request, res: Response): Promise<Response> {
        const result = await this.useCase.execute(this.payload(req));

        if (result.isLeft()) {
            return this.genericErrorResponse(res, result.value);
        }

        return this.ok(res, VoteMapper.toDTO(result.value));
    }
}

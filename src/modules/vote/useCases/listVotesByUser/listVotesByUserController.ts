import { Response, Request } from 'express';

import BaseController from '@core/infra/BaseController';
import ListVotesByUser from './listVotesByUser';
import ElectionMapper from 'modules/election/mappers/electionMapper';
import VoteMapper from 'modules/vote/mappers/vote';


export default class ListVotesByUserController extends BaseController {
    constructor(private useCase: ListVotesByUser) {
        super();
    }

    public async executeImplementation(req: Request, res: Response): Promise<Response> {
        const result = await this.useCase.execute(req.params.id);

        if (result.isLeft()) {
            return this.genericErrorResponse(res, result.value);
        }

        return this.ok(res, result.value.map(VoteMapper.toDTO));
    }
}

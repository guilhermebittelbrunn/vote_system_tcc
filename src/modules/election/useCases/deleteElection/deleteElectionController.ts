import { Response, Request } from 'express';

import BaseController from '@core/infra/BaseController';
import IElectionRepository from 'modules/election/repositories/IElectionRepository';


export default class DeleteElectionController extends BaseController {
    constructor(private electionRepo: IElectionRepository) {
        super();
    }

    public async executeImplementation(req: Request, res: Response): Promise<Response> {
        const result = await this.electionRepo.delete(req.params.id);

        if(!result) {
            return this.fail(res, 'Election not found');
        }

        return this.ok(res, result);
    }
}

import { Response, Request } from 'express';

import BaseController from '@core/infra/BaseController';

import RegisterVote from './registerVote';
import VoteMapper from 'modules/vote/mappers/vote';
import ITransactionManager from '@core/infra/TransactionManager';

export default class RegisterVoteController extends BaseController {
    constructor(private transactionManager: ITransactionManager, private useCase: RegisterVote) {
        super();
    }

    public async executeImplementation(req: Request, res: Response): Promise<Response> {
       const { commit, rollback } = await this.transactionManager.init();

        try {
            const result = await this.useCase.execute(this.payload(req));

            if (result.isLeft()) {
                await rollback();

                return this.genericErrorResponse(res, result.value);
            }

            await commit();

            return this.ok(res, result.value);
        } catch (error) {
            await rollback();

            return this.fail(res, error);
        }
    }
}

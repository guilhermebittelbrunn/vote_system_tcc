import { Response, Request } from 'express';

import BaseController from '@core/infra/BaseController';

import CreateElection from './createElection';
import ElectionMapper from 'modules/election/mappers/electionMapper';
import ITransactionManager from '@core/infra/TransactionManager';

export default class CreateElectionController extends BaseController {
    constructor(private transactionManager: ITransactionManager,private useCase: CreateElection) {
        super();
    }
    public async executeImplementation(req: Request & any, res: Response): Promise<Response> {
        const { commit, rollback } = await this.transactionManager.init();

        try {

            const result = await this.useCase.execute({
                ...this.payload(req),
                image: req.file?.filename,
            });

            if (result.isLeft()) {
                await rollback();

                return this.genericErrorResponse(res, result.value);
            }

            await commit();

            return this.ok(res, ElectionMapper.toDTO(result.value));
        } catch (error) {
            await rollback();

            return this.fail(res, error);
        }
    }
}

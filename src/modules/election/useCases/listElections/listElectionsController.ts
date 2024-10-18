import { Response, Request } from 'express';

import BaseController from '@core/infra/BaseController';
import ListElections from './listElections';
import ElectionMapper from 'modules/election/mappers/electionMapper';


export default class ListElectionsController extends BaseController {
    constructor(private useCase: ListElections) {
        super();
    }

    public async executeImplementation(req: Request, res: Response): Promise<Response> {
        const result = await this.useCase.execute();

        if (result.isLeft()) {
            return this.genericErrorResponse(res, result.value);
        }

        return this.ok(res, result.value.map(ElectionMapper.toDTO));
    }
}

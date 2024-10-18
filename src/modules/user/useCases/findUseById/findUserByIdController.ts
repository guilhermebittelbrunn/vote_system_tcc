import { Response, Request } from 'express';

import BaseController from '@core/infra/BaseController';
import UserMapper from '@user/mappers/userMapper';

import FindUserById from './findUserById';

export default class FindUserByIdController extends BaseController {
    constructor(private useCase: FindUserById) {
        super();
    }

    public async executeImplementation(req: Request, res: Response): Promise<Response> {
        const result = await this.useCase.execute(req.params.id);

        if (result.isLeft()) {
            return this.genericErrorResponse(res, result.value);
        }

        return this.ok(res, UserMapper.toDTO(result.value));
    }
}

import { Response, Request } from 'express';

import BaseController from '@core/infra/BaseController';
import UserMapper from '@user/mappers/userMapper';

import CreateUser from './createUser';

export default class CreateUserController extends BaseController {
    constructor(private useCase: CreateUser) {
        super();
    }

    public async executeImplementation(req: Request, res: Response): Promise<Response> {
        const result = await this.useCase.execute(this.payload(req));

        if (result.isLeft()) {
            return this.genericErrorResponse(res, result.value);
        }

        return this.ok(res, UserMapper.toDTO(result.value));
    }
}

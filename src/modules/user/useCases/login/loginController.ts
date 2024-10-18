import { Response, Request } from 'express';

import BaseController from '@core/infra/BaseController';

import LoginGestao from './login';
import LoginGestaoErrors from './loginErrors';
import GenericAppError from '@root-shared/logic/GenericAppError';
import UserMapper from '@user/mappers/userMapper';

export default class LoginGestaoController extends BaseController {
    constructor(private useCase: LoginGestao) {
        super();
    }

    public async executeImplementation(req: Request, res: Response): Promise<Response> {
        const result = await this.useCase.execute(this.payload(req));

        if (result.isLeft()) {
            if (result.value instanceof GenericAppError) {
                return this.genericErrorResponse(res, result.value);
            }

            switch (result.value.constructor) {
                case LoginGestaoErrors.EmailNotExist:
                    return this.clientError(res, result.value.message);
                case LoginGestaoErrors.WrongPassword:
                    return this.unauthorized(res, result.value.message);
                default:
                    return this.fail(res, result.value.message);
            }
        }

        return this.ok(res, { ...result.value, user: UserMapper.toDTO(result.value.user) });
    }
}

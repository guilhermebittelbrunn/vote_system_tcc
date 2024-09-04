import { left, right } from "@root-shared/logic/Either";
import GenericErrors from "@root-shared/logic/GenericErrors";
import IAuthContext from "../../contexts/IAuthContext";
import { Middleware, MiddlewareResponse } from "@core/infra/TypeORM/Middleware";

export default class EnsureAuthentication implements Middleware {
    constructor(private authContext: IAuthContext) {}

    public async handle(): Promise<MiddlewareResponse> {
        const userId = this.authContext.getValue('userId');

        if (!userId) {
            return left(new GenericErrors.NotAuthorized('usuário não encontrado.'));
        }

        return right(true);
    }
}

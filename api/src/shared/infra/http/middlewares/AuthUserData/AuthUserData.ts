import { Middleware, MiddlewareResponse } from "@core/infra/TypeORM/Middleware";
import IAuthContext from "../../contexts/IAuthContext";
import IAuthTokenService from "@user/services/IAuthTokenService";
import IUserRepository from "@user/repositories/IUserRepository";
import NodeCache from "node-cache";
import { right } from "@root-shared/logic/Either";
import User from "@user/domain/user/user";

interface AuthenticationRequestData {
    accessToken: string;
}

export default class EnsureAuthentication implements Middleware {
    private ONE_HUNDRED_AND_TWENTY_MINUTES_IN_SECONDS = 7200;

    constructor(
        private userRepo: IUserRepository,
        private authTokenService: IAuthTokenService,
        private authContext: IAuthContext,
        private nodeCache: NodeCache,
    ) {}

    public async handle(requestData: AuthenticationRequestData): Promise<MiddlewareResponse> {
        const payload = this.authTokenService.decode(requestData.accessToken);

        if (!payload) {
            return right(true);
        }

        let cachedUser = this.nodeCache.get<User>(`user:${payload.userId}`);

        const useCache = !!process.env.USE_CACHE;

        if (!useCache || !cachedUser) {
            const user = await this.userRepo.findAvailableById(payload.userId);

            if (!user) {
                return right(true);
            }

            cachedUser = user;

            this.nodeCache.set(`user:${payload.userId}`, user, this.ONE_HUNDRED_AND_TWENTY_MINUTES_IN_SECONDS);
        }

        this.authContext.setValue('userId', cachedUser.id.toValue());

        return right(true);
    }
}

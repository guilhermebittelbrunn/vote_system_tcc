import { Either } from "@root-shared/logic/Either";
import GenericAppError from "@root-shared/logic/GenericAppError";

export type MiddlewareResponse = Either<GenericAppError, boolean>;

export interface Middleware<T = any, U = any> {
    handle: (httpRequest: T, httpBody?: U) => Promise<MiddlewareResponse>;
}

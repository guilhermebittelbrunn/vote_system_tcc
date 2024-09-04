import Block from "@core/domain/Block";
import { Either } from "@root-shared/logic/Either";
import GenericAppError from "@root-shared/logic/GenericAppError";

export type GenericEitherResponse<T> =  Either<GenericAppError, T>;

interface Blockchain<Domain> {
    save(block: Block<Domain>, transaction?: string): Promise<void>
}

export default Blockchain;

import GenericErrors from "@root-shared/logic/GenericErrors";
import { UseCaseError } from "@root-shared/logic/UseCaseError";

namespace LoginGestaoErrors {
    export class EmailNotExist extends UseCaseError {
        constructor() {
            super('E-mail não cadastrado no sistema.');
        }
    }

    export class WrongPassword extends UseCaseError {
        constructor() {
            super('Senha incorreta.');
        }
    }

    export class UserNotAllowed extends GenericErrors.NotAuthorized {
        constructor() {
            super('O tipo de usuário não tem permissão de acesso.');
        }
    }
}

export default LoginGestaoErrors;

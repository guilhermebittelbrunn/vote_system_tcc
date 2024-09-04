import GenericErrors from "@root-shared/logic/GenericErrors";

namespace CreateUserErrors {
    export class EmailAlreadyTaken extends GenericErrors.Conflict {
        constructor() {
            super('e-mail já em uso por outro usuário.');
        }
    }
}

export default CreateUserErrors;

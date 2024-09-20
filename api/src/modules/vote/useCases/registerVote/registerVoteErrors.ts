import GenericErrors from "@root-shared/logic/GenericErrors";

namespace RegisterVoteErrors {
    export class VoteAlreadyExists extends GenericErrors.Conflict {
        constructor() {
            super('voto já registrado');
        }
    }

}

export default RegisterVoteErrors;

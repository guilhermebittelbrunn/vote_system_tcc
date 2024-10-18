import GenericErrors from "@root-shared/logic/GenericErrors";

namespace RegisterVoteErrors {
    export class VoteAlreadyExists extends GenericErrors.Conflict {
        constructor() {
            super('voto já registrado');
        }
    }
    export class ElectionNotStarted extends GenericErrors.Conflict {
        constructor() {
            super('eleição ainda não começou');
        }
    }
    export class ElectionAlreadyFinish extends GenericErrors.Conflict {
        constructor() {
            super('eleição já finalizada');
        }
    }

}

export default RegisterVoteErrors;

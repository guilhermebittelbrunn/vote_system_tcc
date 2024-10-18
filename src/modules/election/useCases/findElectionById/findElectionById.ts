import UseCase from '@core/domain/UseCase';

import { Either, left, right } from '@root-shared/logic/Either';
import GenericAppError from '@root-shared/logic/GenericAppError';
import IElectionRepository from 'modules/election/repositories/IElectionRepository';
import Election from 'modules/election/domain/election/election';
import GenericErrors from '@root-shared/logic/GenericErrors';

type Response = Either<GenericAppError, Election>;


export default class FindElectionById implements UseCase<string, Response> {
    constructor(private electionRepo: IElectionRepository) {}

    public async execute(id: string): Promise<Response> {
        const election = await this.electionRepo.findByIdWithCandidates(id);

        if (!election) {
            return left(new GenericErrors.NotFound('Eleição não encontrada'));
        }

        return right(election);
    }
}

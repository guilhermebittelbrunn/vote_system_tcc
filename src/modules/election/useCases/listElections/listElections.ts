import UseCase from '@core/domain/UseCase';

import { Either, right } from '@root-shared/logic/Either';
import GenericAppError from '@root-shared/logic/GenericAppError';
import IElectionRepository from 'modules/election/repositories/IElectionRepository';
import Election from 'modules/election/domain/election/election';

type Response = Either<GenericAppError, Election[]>;


export default class ListElections implements UseCase<string, Response> {
    constructor(private electionRepo: IElectionRepository) {}

    public async execute(): Promise<Response> {
        const elections = await this.electionRepo.list();

        return right(elections);
    }
}

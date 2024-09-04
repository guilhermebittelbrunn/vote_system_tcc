import UseCase from '@core/domain/UseCase';

import { Either, left, right } from '@root-shared/logic/Either';
import GenericAppError from '@root-shared/logic/GenericAppError';
import Election from 'modules/election/domain/election/election';
import IElectionRepository from 'modules/election/repositories/IElectionRepository';
import CreateElectionRequestDTO from './createElectionRequestDTO';

type Response = Either<GenericAppError, Election>;

export default class CreateElection implements UseCase<CreateElectionRequestDTO, Response> {
    constructor(private electionRepo: IElectionRepository) {}

    public async execute(dto: CreateElectionRequestDTO): Promise<Response> {
        const electionOrError = Election.create({
            title: dto.title,
            description: dto.description,
            startDate: dto.startDate,
            endDate: dto.endDate,
        });

        if (electionOrError.isLeft()) {
            return left(electionOrError.value);
        }

        const election = await this.electionRepo.insert(electionOrError.value);

        return right(election);
    }
}

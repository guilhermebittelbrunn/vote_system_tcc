import UseCase from '@core/domain/UseCase';

import { Either, left, right } from '@root-shared/logic/Either';
import GenericAppError from '@root-shared/logic/GenericAppError';
import Election from 'modules/election/domain/election/election';
import IElectionRepository from 'modules/election/repositories/IElectionRepository';
import CreateElectionRequestDTO from './createElectionRequestDTO';
import GenericErrors from '@root-shared/logic/GenericErrors';
import Candidates from 'modules/candidate/domain/candidate/candidates';

type Response = Either<GenericAppError, Election>;

export default class CreateElection implements UseCase<CreateElectionRequestDTO, Response> {
    constructor(private electionRepo: IElectionRepository) {}

    public async execute(dto: CreateElectionRequestDTO): Promise<Response> {
        const electionOrError = Election.create({
            title: dto.title,
            description: dto.description,
            image: dto.image,
            startDate: new Date(dto.startDate),
            endDate: new Date(dto.endDate),
            candidates: Candidates.create(),
        });

        if (electionOrError.isLeft()) {
            return left(electionOrError.value);
        }


        const election = await this.electionRepo.insert(electionOrError.value);

        if (!election) {
            return left(new GenericErrors.Unexpected('Erro ao criar eleição'));
        }

        return right(election);
    }
}

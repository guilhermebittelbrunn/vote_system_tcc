import UseCase from '@core/domain/UseCase';

import { Either, left, right } from '@root-shared/logic/Either';
import GenericAppError from '@root-shared/logic/GenericAppError';
import CreateCandidateRequestDTO from './createCandidateRequestDTO';
import ICandidateRepository from 'modules/candidate/repositories/ICandidateRepository';
import Candidate from 'modules/candidate/domain/candidate/candidate';
import UniqueEntityID from '@core/domain/UniqueEntityID';

type Response = Either<GenericAppError, Candidate>;

export default class CreateCandidate implements UseCase<CreateCandidateRequestDTO, Response> {
    constructor(private candidateRepo: ICandidateRepository) {}

    public async execute(dto: CreateCandidateRequestDTO): Promise<Response> {
        const CandidateOrError = Candidate.create({
            ...dto,
            electionId: new UniqueEntityID(dto.electionId),
        });

        if (CandidateOrError.isLeft()) {
            return left(CandidateOrError.value);
        }

        const candidate = await this.candidateRepo.insert(CandidateOrError.value);

        return right(candidate);
    }
}

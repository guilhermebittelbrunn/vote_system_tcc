import UseCase from '@core/domain/UseCase';

import { Either, left, right } from '@root-shared/logic/Either';
import GenericAppError from '@root-shared/logic/GenericAppError';
import Guard from '@root-shared/logic/Guard';
import GenericErrors from '@root-shared/logic/GenericErrors';
import CreateCandidate from '../createCandidate/createCandidate';
import CreateCandidateRequestDTO from '../createCandidate/createCandidateRequestDTO';

type Response = Either<GenericAppError, null>;

export default class CreateBulkCandidate implements UseCase<CreateCandidateRequestDTO[], Response> {
    constructor(private createCandidate: CreateCandidate) {}

    public async execute(dto: CreateCandidateRequestDTO[]): Promise<Response> {
        const guardedProps = Guard.againstNullOrUndefinedBulk([
            { argument: dto.length, argumentName: 'Lista de candidatos' },
        ])

        if(!guardedProps.succeeded) {
            return left(new GenericErrors.InvalidParam(guardedProps.message));
        }

        const results: any[] = await Promise.all(dto.map((candidate, idx)=>{
            return this.createCandidate.execute({
                name: candidate.name,
                party: candidate.party ?? null,
                electionId: candidate.electionId,
                description: candidate.description ?? null,
                quantity: 0,
            })
        }));

        const error = results.find(result => result.isLeft());

        if(error) {
            return left(error.value);
        }

        return right(null);
    }
}

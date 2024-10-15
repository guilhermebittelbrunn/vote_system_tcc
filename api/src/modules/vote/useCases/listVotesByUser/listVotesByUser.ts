import UseCase from '@core/domain/UseCase';

import { Either, right } from '@root-shared/logic/Either';
import GenericAppError from '@root-shared/logic/GenericAppError';
import IVoteRepository from 'modules/vote/repositories/IVoteRepository';
import Vote from 'modules/vote/domain/vote/vote';

type Response = Either<GenericAppError, Vote[]>;


export default class ListVotesByUser implements UseCase<string, Response> {
    constructor(private voteRepo: IVoteRepository) {}

    public async execute(userId: string): Promise<Response> {
        const results = await this.voteRepo.listByUser(userId);

        return right(results);
    }
}

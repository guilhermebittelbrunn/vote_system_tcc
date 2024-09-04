import { RegisterVote } from './RegisterVote';
import { IVoteRepository } from 'modules/vote/repositories/IVoteRepository';
import { mock, MockProxy } from 'jest-mock-extended';
import { RegisterVoteRequestDTO } from './RegisterVoteRequestDTO';

describe('RegisterVote UseCase', () => {
    let voteRepo: MockProxy<IVoteRepository>;
    let useCase: RegisterVote;

    beforeEach(() => {
        voteRepo = mock<IVoteRepository>();
        useCase = new RegisterVote(voteRepo);
    });

    it('should register a vote successfully', async () => {
        const dto: RegisterVoteRequestDTO = {
            userId: '123',
            candidateId: '456',
            electionId: '789',
        };

        voteRepo.findByUserAndElection.mockResolvedValueOnce(null);

        const result = await useCase.execute(dto);

        expect(result.isRight()).toBeTruthy();
        expect(voteRepo.save).toHaveBeenCalled();
    });

    it('should return an error if vote already exists', async () => {
        const dto: RegisterVoteRequestDTO = {
            userId: '123',
            candidateId: '456',
            electionId: '789',
        };

        voteRepo.findByUserAndElection.mockResolvedValueOnce({} as any);

        const result = await useCase.execute(dto);

        expect(result.isLeft()).toBeTruthy();
        expect(voteRepo.save).not.toHaveBeenCalled();
    });
});

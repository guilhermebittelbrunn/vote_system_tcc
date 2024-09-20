import UniqueEntityID from '@core/domain/UniqueEntityID';
import BaseRepository from '@core/infra/TypeORM/BaseRepository';
import { GenericId } from '@core/utils/types';
import Vote from 'modules/vote/domain/vote/vote';
import VoteMapper from 'modules/vote/mappers/vote';
import IVoteRepository from '../../IVoteRepository';
import VoteEntity from '@database/TypeORM/entities/Vote';

export default class VoteRepository extends BaseRepository<VoteEntity, Vote> implements IVoteRepository {
    mapper = VoteMapper;

    entity = VoteEntity;

    usesSoftDelete = false;

    public async findByUserAndElection(userId: GenericId, electionId: GenericId): Promise<Vote | null> {
        const result = await this.repository.findOne({
            where: {
                election_id: UniqueEntityID.raw(electionId),
                user_id: userId,
            },
        });

        return this.mapper.toDomainOrNull(result);
    }
}

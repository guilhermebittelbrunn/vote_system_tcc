import BaseRepository from '@core/infra/TypeORM/BaseRepository';
import ElectionEntity from '@database/TypeORM/entities/Election';
import Election from 'modules/election/domain/election/election';
import ElectionMapper from 'modules/election/mappers/electionMapper';
import IElectionRepository from '../IElectionRepository';

export default class ElectionRepository extends BaseRepository<ElectionEntity, Election> implements IElectionRepository {
    mapper = ElectionMapper;

    entity = ElectionEntity;

    usesSoftDelete = false;

    public async findByIdWithCandidates(id: string): Promise<Election | null> {
        const result = await this.repository.findOne({where: {id}, relations: ['candidates'] });

        return this.mapper.toDomainOrNull(result)
    }

    public async list(): Promise<Election[]> {
        const result = await this.repository.find();

        return result.map(this.mapper.toDomain);
    }
}

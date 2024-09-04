import BaseRepository from '@core/infra/TypeORM/BaseRepository';
import ElectionEntity from '@database/TypeORM/entities/Election';
import Election from 'modules/election/domain/election/election';
import ElectionMapper from 'modules/election/mappers/electionMapper';
import IElectionRepository from '../IElectionRepository';

export default class ElectionRepository extends BaseRepository<ElectionEntity, Election> implements IElectionRepository {
    mapper = ElectionMapper;

    entity = ElectionEntity;

    usesSoftDelete = false;

    // public async findById(id: GenericId): Promise<Election | null> {
    //     const result = await this.repository.findOne({
    //         where: {
    //             id: UniqueEntityID.raw(id),
    //         },
    //     });

    //     return this.mapper.toDomainOrNull(result);
    // }
}

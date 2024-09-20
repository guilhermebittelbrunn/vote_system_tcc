import Entity from '@core/domain/Entity';
import UniqueEntityID from '@core/domain/UniqueEntityID';
import { GenericEntity, GenericId, RawID, UpdateFields } from '@utils/types';

import IBaseRepository from '../Repository';

import BaseRepositoryManager from './BaseRepositoryManager';
import FormatDatabaseError from './FormatDatabaseError';

export default abstract class BaseRepository<RepoEntity extends GenericEntity, Domain extends Entity<any>>
    extends BaseRepositoryManager<RepoEntity, Domain>
    implements IBaseRepository<Domain>
{
    /**
     * if set to ```true``` database will soft delete record instead of hard delete on ```delete``` method
     */
    protected usesSoftDelete?: boolean;

    async insert(domain: Domain): Promise<Domain> {
        const rawRecord = await this.mapper.toPersistence(domain);

        const recordToSave = this.repository.create(rawRecord as any);

        const recordSaved = await this.repository.save(recordToSave as any);

        return this.mapper.toDomain(recordSaved);
    }

    async update(domain: UpdateFields<Domain>): Promise<RawID> {
        const rawRecord = await this.mapper.toPersistence(domain);

        const recordToSave = this.repository.create(rawRecord as any) ;

        const recordSaved = await this.repository.save(recordToSave as any);

        return UniqueEntityID.raw((recordSaved as any).id);
    }

    async save(domain: Domain): Promise<Domain> {
        const rawRecord = await this.mapper.toPersistence(domain);

        const recordToSave = this.repository.create(rawRecord as any);

        const recordSaved = await this.repository.save(recordToSave as any);

        return this.mapper.toDomain(recordSaved);
    }

    async insertBulk(domains: Array<Domain>): Promise<Array<Domain>> {
        const rawRecordsPromises = domains.map(domain => this.mapper.toPersistence(domain));

        const rawRecords = await Promise.all(rawRecordsPromises);

        const recordsSaved = await this.repository.save(rawRecords as any);

        return Promise.all(recordsSaved.map(this.mapper.toDomain));
    }

    async updateBulk(domains: Array<UpdateFields<Domain>>): Promise<Array<RawID>> {
        const rawRecordsPromises = domains.map(domain => this.mapper.toPersistence(domain));

        const rawRecords = await Promise.all(rawRecordsPromises);

        const recordsSaved = await this.repository.save(rawRecords as any);

        return recordsSaved.map(record => UniqueEntityID.raw(record.id));
    }

    @FormatDatabaseError()
    async deleteBulk(domains: Array<Domain>): Promise<void> {
        if (!Array.isArray(domains)) domains = [domains];

        if (this.usesSoftDelete) {
            await this.repository.softDelete(domains.map((d: any) => UniqueEntityID.raw(d.id)));
            return;
        }

        await this.repository.delete(domains.map((d: any) => UniqueEntityID.raw(d.id)));
    }

    async findById(id: GenericId): Promise<Domain | null> {
        const existentRecord = await this.repository.findOne({
            where: {
                id: UniqueEntityID.raw(id),
            },
        });

        return existentRecord ? this.mapper.toDomain(existentRecord) : null;
    }

    @FormatDatabaseError()
    async delete(id: GenericId): Promise<boolean> {
        if (this.usesSoftDelete) {
            const deleted = await this.repository.softDelete(UniqueEntityID.raw(id));

            return deleted.affected ? deleted.affected > 0 : false;
        }

        const deleted = await this.repository.delete(UniqueEntityID.raw(id));

        return deleted.affected ? deleted.affected > 0 : false;
    }
}

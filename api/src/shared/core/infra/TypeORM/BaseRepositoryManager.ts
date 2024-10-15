import { EntityManager, Repository, getManager } from 'typeorm';

import Entity from '@core/domain/Entity';
import MapperInterface from '@core/domain/MapperInterface';
import ORMContext from '@root-shared/infra/http/contexts/cls/ORMContext';
import BaseRepositoryMethods from './BaseRepositoryMethods';


export default abstract class BaseRepositoryManager<
    RepoEntity extends Record<string | number | symbol, any>,
    Domain extends Entity<any>,
> extends BaseRepositoryMethods {
    protected abstract entity: new () => RepoEntity;

    protected abstract mapper: MapperInterface<Domain, RepoEntity>;

    protected set repository(repository: Repository<RepoEntity>) {
        this.repository = repository;
    }

    protected get repository(): Repository<RepoEntity> {
        return this.entityManager.getRepository(this.entity);
    }

    protected get entityManager(): EntityManager {
        const context = new ORMContext();

        // it is possible to set an already running query runner to have control over transactions in repository actions
        if (context) {
            const queryRunner = context.getValue('queryRunner');

            if (queryRunner && queryRunner.isTransactionActive) {
                return queryRunner.manager;
            }
        }

        return getManager();
    }
}

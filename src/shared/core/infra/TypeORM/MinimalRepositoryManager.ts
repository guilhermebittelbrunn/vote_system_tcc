import ORMContext from '@root-shared/infra/http/contexts/cls/ORMContext';
import { EntityManager, Repository, getManager } from 'typeorm';


export default abstract class MinimalRepositoryManager<
    RepoEntity extends Record<string | number | symbol, any>,
> {
    protected abstract entity: new () => RepoEntity;

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

            if (queryRunner) {
                return queryRunner.manager;
            }
        }

        return getManager();
    }
}

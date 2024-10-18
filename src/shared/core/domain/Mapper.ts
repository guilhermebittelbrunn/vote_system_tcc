
import { AllOptional } from '@core/utils/types';
import MapperInterface from './MapperInterface';

export default abstract class Mapper<Domain, Entity, DTO> implements MapperInterface<Domain, Entity, DTO> {
    abstract toDomain(entity: Entity): Domain;

    abstract toPersistence(domain: AllOptional<Domain>): Promise<AllOptional<Entity>> | AllOptional<Entity>;

    abstract toDTO(domain: Domain): DTO;

    toDomainOrNull(entity: Entity | null | undefined): Domain | null {
        return entity ? this.toDomain(entity) : null;
    }

    toDTOOrNull(domain: Domain | null | undefined): DTO | null {
        return domain ? this.toDTO(domain) : null;
    }

    toDomainOrUndefined(entity: Entity | null | undefined): Domain | undefined {
        return entity ? this.toDomain(entity) : undefined;
    }

    toDTOOrUndefined(domain: Domain | null | undefined): DTO | undefined {
        return domain ? this.toDTO(domain) : undefined;
    }
}

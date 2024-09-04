import { AllOptional } from '@utils/types';

export default interface MapperInterface<Domain, Entity, DTO = any> {
    toDomain(raw: Entity): Promise<Domain> | Domain;
    toPersistence(raw: AllOptional<Domain>): Promise<AllOptional<Entity>> | AllOptional<Entity>;
    toDTO(raw: Domain): Promise<DTO> | DTO;
    toDomainOrNull?: (entity: Entity | null | undefined) => Promise<Domain> | Domain | null;
    toDomainOrUndefined?: (entity: Entity | null | undefined) => Promise<Domain> | Domain | undefined;
    toDTOOrUndefined?: (domain: Domain | null | undefined) => Promise<DTO> | DTO | undefined;
}

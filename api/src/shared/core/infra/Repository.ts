import { GenericId, RawID, UpdateFields } from "@core/utils/types";

export type SingleEntityResponse<T> = Promise<T | null> | T | null;

export type MultiEntityResponse<T> = Promise<T[]> | T[];

export interface GenericDateRangeQuery {
    start: Date;
    end: Date;
}

export interface GenericDateQuery {
    days?: Array<Date>;
    months?: Array<number>;
    range?: GenericDateRangeQuery;
}

interface Repository<Domain> {
    insert(entity: Domain): Promise<Domain> | Domain;
    insertBulk(entity: Array<Domain>): Promise<Array<Domain>> | Array<Domain>;

    update(entity: UpdateFields<Domain>): Promise<RawID> | RawID;
    updateBulk(entity: Array<UpdateFields<Domain>>): Promise<Array<RawID>> | Array<RawID>;

    save(entity: Domain): Promise<Domain> | Domain;

    delete(id: GenericId): Promise<boolean> | boolean;
    deleteBulk(id: Array<Domain>): Promise<void> | void;

    findById(id: GenericId): SingleEntityResponse<Domain>;
}

export default Repository;

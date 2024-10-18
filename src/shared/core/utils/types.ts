/* eslint-disable @typescript-eslint/ban-types */

import UniqueEntityID from "@core/domain/UniqueEntityID";

export type UpdateFields<T> = {
    [P in keyof T]?: T[P];
} & {
    id: UniqueEntityID | RawID;
};

export type UpdateDTO<T> = {
    [P in keyof T]?: T[P] extends Record<any, any> ? Partial<T[P]> : T[P];
} & {
    id: string;
};

export type AllOptional<T> = {
    [P in keyof T]?: T[P] | undefined;
};

export type RawID = string;

export type GenericId = RawID | UniqueEntityID;

export type GenericEntity = Record<string | number | symbol, any> & { id: UniqueEntityID | RawID };

export type GenericTokenPayload = string | object | Buffer;

export type OmitDefault<T extends GenericEntity, OtherFields extends keyof T = 'id'> = Omit<
    T,
    'id' | 'idHead' | 'enabled' | 'createdAt' | 'updatedAt' | 'deletedAt' | OtherFields
>;

export type WithBusinessId<T> = T & {
    business_id?: string;
};

export interface Coordinate {
    lat: number;
    lng: number;
}

export interface PaginationParams {
    take?: number;
    skip?: number;
    term?: string;
}

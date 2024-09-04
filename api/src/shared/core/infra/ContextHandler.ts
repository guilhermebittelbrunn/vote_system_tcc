export type ContextContract = Record<string, any>;

export interface ContextGetValue<T> {
    <K extends keyof T & string>(key: K): T[K];
}

export interface ContextSetValue<T> {
    <K extends keyof T & string>(key: K, value: T[K]): void;
}

export default interface ContextHandler<T extends ContextContract> {
    getValue: ContextGetValue<T>;
    setValue: ContextSetValue<T>;
}

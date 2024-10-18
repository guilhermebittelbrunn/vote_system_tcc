import { v4 as uuid } from 'uuid';
import Identifier from './Identifier';


export default class UniqueEntityID extends Identifier<string> {
    constructor(id: string) {
        super(id);
    }

    public static create(id?: string): UniqueEntityID {
        return new UniqueEntityID(id || uuid());
    }

    /**
     * ID's first 8 characters
     */
    get head(): string {
        return this.toValue().slice(0, 8);
    }

    /**
     * if a valid ID is informed it will return a UniqueEntityID instance, if not, returns undefined
     */
    public static createOrUndefined(id?: string | null): UniqueEntityID | undefined {
        return id ? new UniqueEntityID(id) : undefined;
    }

    public static raw<T>(id: T): Exclude<T, UniqueEntityID> | string {
        if (id instanceof UniqueEntityID) {
            return id.toValue();
        }

        return id as Exclude<T, UniqueEntityID>;
    }
}

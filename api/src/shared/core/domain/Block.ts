/* eslint-disable no-use-before-define */
import UniqueEntityID from './UniqueEntityID';
import crypto from 'crypto';

const isBlock = (v: unknown): v is Block<unknown> => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return v instanceof Block;
};

export default abstract class Block<T> {
    protected readonly _id: UniqueEntityID;

    protected _hash: string;

    public readonly props: T;

    constructor(props: T, id?: UniqueEntityID) {
        this._id = id || UniqueEntityID.create(id);
        this.props = props;
        this._hash = this.calculateHash();
    }

    get hash(): string {
        return this._hash;
    }

    get previousHash(): string | undefined {
        return this.previousHash;
    }

    set previousHash(hash: string) {
        this.previousHash = hash;
    }

    public equals(object?: Block<T>): boolean {
        if (object == null || object === undefined) {
            return false;
        }

        if (this === object) {
            return true;
        }

        if (!isBlock(object)) {
            return false;
        }

        return Boolean(this._id?.equals(object._id));
    }

    private calculateHash(): string {
        let data = ''
        for (const key in this.props) {
            if (Object.prototype.hasOwnProperty.call(this.props, key)) {
                data += `${this.props[key]}-`;
            }
        }
        return crypto.createHash('sha256').update(data).digest('hex');
    }

    public setPreviousHash(hash: string): void {
        this.previousHash = hash;
        this._hash = this.calculateHash(); // Recalcula o hash com o hash anterior
    }
}

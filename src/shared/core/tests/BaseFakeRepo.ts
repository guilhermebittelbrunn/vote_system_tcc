import Entity from '@core/domain/Entity';
import MapperInterface from '@core/domain/MapperInterface';
import UniqueEntityID from '@core/domain/UniqueEntityID';
import Repository from '@core/infra/Repository';
import BaseRepositoryMethods from '@core/infra/TypeORM/BaseRepositoryMethods';
import { AllOptional, GenericEntity, RawID, UpdateFields } from '@utils/types';

export abstract class BaseFakeRepo<Domain extends Entity<any>, Interface extends GenericEntity>
    extends BaseRepositoryMethods
    implements Repository<Domain>
{
    protected _items: Interface[];

    protected abstract mapper: MapperInterface<Domain, Interface>;

    // primary repos servem pra quando um repositório utiliza na verdade os itens de outro
    // isso acontece em casos como o do usuário tipo estabelecimento por exemplo
    // que é um repositório helper e não tem itens próprios, usa os itens do repositório de usuários
    constructor(private primaryRepo?: BaseFakeRepo<any, any>) {
        super();
        this._items = [];
    }

    get items(): Interface[] {
        return this.primaryRepo ? this.primaryRepo.items : this._items;
    }

    set items(items: Interface[]) {
        // eslint-disable-next-line no-unused-expressions
        this.primaryRepo ? (this.primaryRepo.items = items) : (this._items = items);
    }

    protected addFakeItem(rawItem: Interface): Interface {
        let found = false;

        for (const item of this.items) {
            if (this.compareFakeItems(item, rawItem)) {
                found = true;
            }
        }

        if (!found) {
            this.items.push(rawItem);
        }

        return rawItem;
    }

    protected updateFakeItem(rawUpdate: AllOptional<Interface>): Interface {
        let updatedItem: Interface | null = null;

        this.items = this.items.map(item => {
            if (item.id === this.getId(rawUpdate.id as UniqueEntityID)) {
                updatedItem = this.assignDefined(item, rawUpdate);
                return updatedItem;
            }
            return item;
        });

        if (!updatedItem) {
            throw new Error('Item para atualizar não encontrado');
        }

        return updatedItem;
    }

    protected removeFakeItem(id: UniqueEntityID | RawID): boolean {
        const oldItems = this.items;
        this.items = this.items.filter(item => item.id !== this.getId(id));

        return Boolean(oldItems.length - this.items.length);
    }

    protected abstract compareFakeItems(a: Interface, b: Interface): boolean;

    public async insert(item: Domain): Promise<Domain> {
        const persistedItem = (await this.mapper.toPersistence(item)) as any;

        const newItem = this.addFakeItem(persistedItem);

        return this.mapper.toDomain(newItem);
    }

    public async insertBulk(item: Array<Domain>): Promise<Array<Domain>> {
        return item;
    }

    public async save(item: Domain): Promise<Domain> {
        const persistedItem = (await this.mapper.toPersistence(item)) as any;

        const newItem = this.addFakeItem(persistedItem);

        return this.mapper.toDomain(newItem);
    }

    public async update(item: UpdateFields<Domain>): Promise<RawID> {
        // const persistedItem = await this.mapper.toPersistence(item);

        // const updatedItem = this.updateFakeItem(persistedItem);

        return this.getId(item.id);
    }

    public async updateBulk(item: Array<UpdateFields<Domain>>): Promise<Array<RawID>> {
        return item.map(i => this.getId(i.id));
    }

    public delete(): boolean {
        // const deleted = this.removeFakeItem(id);

        return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public deleteBulk(): void {}

    public async findById(id: UniqueEntityID | RawID): Promise<Domain | null> {
        const item = this.items.find(it => it.id === this.getId(id));

        return item ? this.mapper.toDomain(item) : null;
    }

    protected assignDefined(target: Interface, source: AllOptional<Interface>): Interface {
        Object.keys(source).forEach(key => {
            const val = source[key];
            if (val !== undefined) {
                (target as any)[key] = val;
            }
        });

        return target;
    }
}

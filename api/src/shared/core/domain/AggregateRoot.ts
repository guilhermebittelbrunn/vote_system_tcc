import Entity from './Entity';
import DomainEvents from './events/DomainEvents';
import IDomainEvent from './events/IDomainEvent';
import UniqueEntityID from './UniqueEntityID';

export default abstract class AggregateRoot<T> extends Entity<T> {
    private _domainEvents: IDomainEvent[] = [];

    get id(): UniqueEntityID | undefined {
        return this._id;
    }

    get domainEvents(): IDomainEvent[] {
        return this._domainEvents;
    }

    protected addDomainEvent(domainEvent: IDomainEvent): void {
        // Add the domain event to this aggregate's list of domain events
        this._domainEvents.push(domainEvent);
        // Add this aggregate instance to the domain event's list of aggregates who's
        // events it eventually needs to dispatch.
        DomainEvents.markAggregateForDispatch(this);
        // Log the domain event
        this.logDomainEventAdded(domainEvent);
    }

    protected addDomainEventIfNotExists(domainEvent: IDomainEvent): void {
        const domainEventClass = Reflect.getPrototypeOf(domainEvent);

        const existent = this._domainEvents.find(event => {
            const eventClass = Reflect.getPrototypeOf(event);
            return eventClass?.constructor.name === domainEventClass?.constructor.name;
        });

        if (!existent) {
            this.addDomainEvent(domainEvent);
        }
    }

    public clearEvents(): void {
        this._domainEvents.splice(0, this._domainEvents.length);
    }

    private logDomainEventAdded(domainEvent: IDomainEvent): void {
        const thisClass = Reflect.getPrototypeOf(this);
        const domainEventClass = Reflect.getPrototypeOf(domainEvent);

        console.info(
            `[Domain Event Created]:`,
            thisClass?.constructor.name || '',
            '==>',
            domainEventClass?.constructor.name || '',
            `(${domainEvent.aggregateId.head})`,
        );
    }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-prototype-builtins */
import AggregateRoot from '../AggregateRoot';
import UniqueEntityID from '../UniqueEntityID';

import IDomainEvent from './IDomainEvent';

export default class DomainEvents {
    private static handlersMap: Record<string, Array<(event: IDomainEvent) => void>> = {};

    private static markedAggregates: AggregateRoot<any>[] = [];

    /**
     * @method markAggregateForDispatch
     * @static
     * @desc Called by aggregate root objects that have created domain
     * events to eventually be dispatched when the infrastructure commits
     * the unit of work.
     */

    public static markAggregateForDispatch(aggregate: AggregateRoot<any>): void {
        if (!aggregate.id) {
            throw new Error('Aggregate id not provided.');
        }

        const aggregateFound = this.findMarkedAggregateByID(aggregate.id);

        if (!aggregateFound) {
            this.markedAggregates.push(aggregate);
        } else {
            /** @note esta em periodo de observacao pra ver se nao vai gerar outros problemas em relacao a evento  */
            aggregateFound.domainEvents.push(...aggregate.domainEvents);
            this.markedAggregates = this.markedAggregates.filter(agg => agg.id !== aggregateFound.id);
            this.markedAggregates.push(aggregateFound);
        }
    }

    private static removeAggregateFromMarkedDispatchList(aggregate: AggregateRoot<any>): void {
        const index = this.markedAggregates.findIndex(a => a.equals(aggregate));
        this.markedAggregates.splice(index, 1);
    }

    public static findMarkedAggregateByID(id: UniqueEntityID): AggregateRoot<any> | null {
        let found: AggregateRoot<any> | null = null;

        for (const aggregate of this.markedAggregates) {
            if (aggregate.id?.equals(id)) {
                found = aggregate;
            }
        }

        return found;
    }

    public static dispatchEventsForAggregate(id: UniqueEntityID): void {
        const aggregate = this.findMarkedAggregateByID(id);

        if (aggregate) {
            aggregate.clearEvents();
            this.removeAggregateFromMarkedDispatchList(aggregate);
        }
    }

    public static register(callback: (event: IDomainEvent) => void, eventClassName: string): void {
        if (!this.handlersMap.hasOwnProperty(eventClassName)) {
            this.handlersMap[eventClassName] = [];
        }
        this.handlersMap[eventClassName].push(callback);
    }

    public static clearHandlers(): void {
        this.handlersMap = {};
    }

    public static clearMarkedAggregates(): void {
        this.markedAggregates = [];
    }

    static async dispatch(className: string, event: IDomainEvent): Promise<void> {
        if (this.handlersMap.hasOwnProperty(className)) {
            const handlers: any[] = this.handlersMap[className];
            for (const handler of handlers) {
                try {
                    await handler(event);
                } catch (error) {
                    console.error('[DomainEvents] unhandled error', error);
                }
            }
        }
    }
}

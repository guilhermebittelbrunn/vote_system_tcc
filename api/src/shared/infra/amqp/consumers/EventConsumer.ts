import DomainEvents from "@core/domain/events/DomainEvents";
import IDomainEvent from "@core/domain/events/IDomainEvent";
import BaseConsumer from "@core/infra/BaseConsumer";
import { Exchange } from "@core/infra/QueueHandler";

export interface EventQueuePayload {
    className: string;
    event: IDomainEvent;
}

export default class EventConsumer extends BaseConsumer<EventQueuePayload> {
    bindingKey = 'event';

    queue = 'comanda10.event';

    exchanges: Array<Exchange> = [
        {
            name: 'comanda10.direct',
            type: 'direct',
        },
    ];

    protected async onMessage(data: EventQueuePayload): Promise<void> {
        await DomainEvents.dispatch(data.className, data.event);
    }
}

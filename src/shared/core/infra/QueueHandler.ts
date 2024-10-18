export type QueuePayloadType = string | number | Record<any, any>;

export interface Exchange {
    name: string;
    type: 'direct' | 'topic' | 'fanout';
}

export interface SendOptions {
    /** @default true */
    assertExchange?: boolean;
    /** If set, the message will be `mandatory` and the callback will be fired if it could not be routed */
    onFailToRoute?: () => void;
}

export default interface IQueueHandler {
    send(
        exchange: Exchange,
        routingKey: string,
        payload: QueuePayloadType,
        options?: SendOptions,
    ): Promise<void> | void;
}

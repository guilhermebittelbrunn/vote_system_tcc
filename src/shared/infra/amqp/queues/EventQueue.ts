import { Exchange } from '@core/infra/QueueHandler';
import amqpClient from '@root-shared/infra/amqp/client';
import IAuthContext from '@root-shared/infra/http/contexts/IAuthContext';

import { EventQueuePayload } from '../consumers/EventConsumer';

export default class EventQueue {
    constructor(private authContext: IAuthContext) {}

    private getExchange(): Exchange {
        return {
            name: `comanda10.direct`,
            type: 'direct',
        };
    }

    async send(payload: EventQueuePayload): Promise<void> {
        const exchange = this.getExchange();

        const userId = this.authContext.getValue('userId');

        /** Essa exchange somente é validada em casos de desenvolvimento local */
        const assertExchange = process.env.NODE_ENV === 'development';

        /** @note Como a exchange não será validada no envio, tome cuidado caso vá remover essa exchange no RabbitMQ manualmente */
        await amqpClient.send(exchange, 'event', { ...payload, userId }, { assertExchange });
    }
}

import { Channel, connect, Connection, Options } from 'amqplib';

import { isEmpty } from '@core/utils/undefinedHelpers';

import RabbitMQConsumer from '../../../core/infra/BaseConsumer'
import IQueueHandler, { Exchange, QueuePayloadType, SendOptions } from '@core/infra/QueueHandler';


const RECONNECT_TIMEOUT = 1000 * 5;
const NO_ROUTE_REPLY_CODE = 312;

export default class AMQPClient implements IQueueHandler {
    private _channel: Channel | undefined;

    private connection: Connection | undefined;

    private assertedExchanges: Array<Exchange> = [];

    constructor(public consumers: Array<RabbitMQConsumer<any>> = []) {}

    private get vhost(): string {
        return process.env.APP_ENV === 'production' ? '/prod' : '/dev';
    }

    appendConsumer(consumer: RabbitMQConsumer<any>): void {
        this.consumers.push(consumer);
    }

    private get channel(): Channel {
        if (!this._channel) {
            throw new Error('[RabbitMQ] Channel is not open for sending/receiving messages in queues');
        }

        return this._channel;
    }
     public async ensureChannelIsOpen(): Promise<void> {
        if (!this._channel || this._channel.connection?.closed) {
            console.log('[RabbitMQ] Reconnecting...');
            await this.connect();
        }
    }

    public async connect(): Promise<void> {
        const connPayload: Options.Connect = {
            vhost: this.vhost,
            hostname: process.env.AWS_MQ_HOST,
            port: Number(process.env.AWS_MQ_PORT) || 5671,
            username: process.env.AWS_MQ_USERNAME,
            password: process.env.AWS_MQ_PASSWORD,
            protocol: process.env.AWS_MQ_PROTOCOL || 'amqps',
        };

        const hostDesc = `${connPayload.protocol}://${process.env.AWS_MQ_HOST}:${connPayload.port}`;

        try {
            this.connection = await connect(connPayload);

            this._channel = await this.connection.createChannel();
            this._channel.prefetch(Number(process.env.AMQP_PREFETCH) || 1);

            this.startListeners();
            await this.startConsumers();

            console.info(`[RabbitMQ] Connected to AMQP (${hostDesc})`);
        } catch (error) {
            console.error(`[RabbitMQ] Connection error to AMQP (${hostDesc}): ${error}`);

            // Se a conexão falhar, tente reconectar após um tempo
            setTimeout(() => this.connect(), RECONNECT_TIMEOUT);
        }
    }

    private isExchangeAlreadyAsserted({ name, type }: Exchange): boolean {
        return Boolean(
            this.assertedExchanges.find(
                assertedExchange => assertedExchange.name === name && assertedExchange.type === type,
            ),
        );
    }

    private async assertExchange(exchange: Exchange): Promise<void> {
        if (this.isExchangeAlreadyAsserted(exchange)) {
            return;
        }

        await this.channel.assertExchange(exchange.name, exchange.type);

        this.assertedExchanges.push(exchange);
    }

    private startListeners(): void {
        if (!this.connection) return;

        this.connection.on('error', error => {
            console.error(`[RabbitMQ] Connection error: ${error}`);
        });

        this.connection.on('close', () => {
            console.error('[RabbitMQ] Connection to RabbitMQ closed');
            setTimeout(() => this.connect(), RECONNECT_TIMEOUT);
        });
    }

    private sanitizePayload(payload: QueuePayloadType): Buffer {
        if (Buffer.isBuffer(payload)) {
            return payload;
        }

        if (['string', 'number'].includes(typeof payload)) {
            return Buffer.from(String(payload));
        }

        if (typeof payload === 'object') {
            return Buffer.from(JSON.stringify(payload));
        }

        throw new Error('[RabbitMQ] Payload type is not from pre-defined types (string | number | object)');
    }

    public async send(exchange: Exchange, routingKey: string, payload: QueuePayloadType, options?: SendOptions): Promise<void> {
    // Verifique se o canal está aberto
     await this.ensureChannelIsOpen();

    const { assertExchange } = options || {};

    try {
        if (isEmpty(assertExchange) || assertExchange) {
            await this.assertExchange(exchange);
        }

        // const mandatory = onFailToRoute && typeof onFailToRoute === 'function';

        // if (mandatory) {
        //     this._channel.once('return', msg => {
        //         if (msg?.fields?.replyCode === NO_ROUTE_REPLY_CODE) {
        //             onFailToRoute();
        //         }
        //     });
        // }
        console.log({
            exchange, routingKey, payload,
        })


        // Publica a mensagem para a exchange correta
        console.log('cheguei ate aqui')
        this._channel.publish(exchange.name, routingKey, this.sanitizePayload(payload));
    } catch (error) {
        console.error(`[RabbitMQ] Error when publishing message to exchange "${exchange.name}": ${error}`);
    }
}

    async startConsumers(): Promise<void> {
        if (this.consumers?.length) {
            await Promise.all(this.consumers.map(async consumer => this.consume(consumer)));
        }
    }

    async consume(consumer: RabbitMQConsumer<any>): Promise<void> {
        if (consumer.exchanges.length === 0 || !consumer.queue || !consumer.bindingKey) {
            return;
        }

        try {
            /**
             * Queue assertion
             */
            const q = await this.channel.assertQueue(consumer.queue, {
                durable: true,
                /** Talvez valha a pena para que a mensagem não fique sendo reprocessada infinitamente */
                // messageTtl: 1000 * 60 * 5 // 5min
            });

            for (const { name, type } of consumer.exchanges) {
                /**
                 * Exchange assertion and queue bind
                 */
                await this.channel.assertExchange(name, type, {
                    durable: true,
                });

                if (Array.isArray(consumer.bindingKey)) {
                    await Promise.all(
                        consumer.bindingKey.map(async bindingKey => {
                            await this.channel.bindQueue(q.queue, name, bindingKey);
                            console.info('[RabbitMQ] Bound queue to exchange', {
                                queue: q.queue,
                                exchange: name,
                                bindingKey,
                            });
                        }),
                    );
                } else {
                    await this.channel.bindQueue(q.queue, name, consumer.bindingKey);

                    console.info('[RabbitMQ] Bound queue to exchange', {
                        queue: q.queue,
                        exchange: name,
                        bindingKey: consumer.bindingKey,
                    });
                }
            }

            /**
             * Queue consumption
             */
            const consumeResponse = await this.channel.consume(consumer.queue, async msg => {
                if (msg) {
                    try {
                        await consumer.handle(msg);

                        this.channel.ack(msg);
                    } catch (error) {
                        /**
                         * @todo atualmente, apenas casos bastante específicos acabam realmente caindo aqui pois a
                         * maioria das funções executadas (nos eventos principalmente) já possuem seu próprio tryCatch
                         */
                        this.channel.nack(msg, false, false);
                    }
                }
            });

            consumer.tag = consumeResponse.consumerTag;

            console.info('[RabbitMQ] Consuming queue', consumer.queue);
        } catch (error) {
            console.info('[RabbitMQ] Error consuming queue', error);
        }
    }
}

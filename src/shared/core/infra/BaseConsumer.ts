import { ConsumeMessage } from 'amqplib';

import Logger from '@core/infra/Logger';
import AuthContext from '@root-shared/infra/http/contexts/cls/AuthContext';
import contexts from '@root-shared/infra/http/express/contexts';
import { Exchange } from './QueueHandler';

export default abstract class BaseConsumer<T extends Record<string, any>> {
    protected authContext = new AuthContext();

    abstract queue: string;

    /**
     * Defines resource
     */
    abstract bindingKey: string | Array<string>;

    /**
     * Usually one exchange per user business
     */
    abstract exchanges: Array<Exchange>;

    tag?: string;

    protected abstract onMessage(data: T): Promise<void> | void;

    private async applyMiddlewares(payload: any): Promise<void> {
        if (!(typeof payload === 'object')) {
            return;
        }

        if (payload.userId) {
            this.authContext.setValue('userId', payload.userId);
        }

    }

    async handle(message: ConsumeMessage): Promise<void> {
        return new Promise((resolve, reject) => {
            contexts(async () => {
                try {
                    const payload = JSON.parse(message.content.toString());

                    await this.applyMiddlewares(payload);

                    await this.onMessage(payload);

                    resolve();
                } catch (error) {
                    Logger.error(
                        error as any,
                        'Error handling incoming RabbitMQ message',
                        JSON.stringify(this.bindingKey),
                    );
                    reject(error);
                }
            });
        });
    }
}

/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-use-before-define */
import amqpClient from './client';

const connectToAmqp = (): Promise<void> => {
    return amqpClient.connect();
};

export { connectToAmqp };

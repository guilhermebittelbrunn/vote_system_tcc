import EventConsumer from '../consumers/EventConsumer';

import AMQPClient from './client';
import makeVoteRegistrationConsumer from 'modules/blockchain/web3/services/implementations/factories/VoteRegistrationConsumer';

const amqpClient = new AMQPClient();

const voteConsumer = makeVoteRegistrationConsumer();

amqpClient.appendConsumer(voteConsumer);

if (process.env.WORKER) {
    amqpClient.consumers.push(new EventConsumer());
    // @todo tentar usar apenas o de baixo
    amqpClient.consumers.push(voteConsumer);
}

export default amqpClient;

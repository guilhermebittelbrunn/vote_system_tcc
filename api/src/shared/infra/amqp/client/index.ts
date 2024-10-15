import VoteRegistrationConsumer from 'modules/blockchain/web3/services/implementations/RegisterVote';
import EventConsumer from '../consumers/EventConsumer';

import AMQPClient from './client';
import VoteRepository from 'modules/vote/repositories/implementations/TypeORM/VoteRepository';
import { PolygonWeb3 } from 'modules/blockchain/web3/services/implementations/PolygonNetwork';

const voteRepo = new VoteRepository();
const polygon = new PolygonWeb3()

const amqpClient = new AMQPClient();
const voteConsumer = new VoteRegistrationConsumer(voteRepo, polygon);

if (process.env.WORKER) {
    amqpClient.consumers.push(new EventConsumer());
    amqpClient.consumers.push(voteConsumer);
}

export default amqpClient;

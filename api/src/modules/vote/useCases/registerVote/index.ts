// import VoteRepository from "modules/vote/repositories/implementations/TypeORM/VoteRepository";
// import RegisterVote from "./registerVote";
// import RegisterVoteController from "./registerVoteController";
// import { PolygonWeb3 } from "modules/blockchain/web3/services/implementations/PolygonNetwork";
// import VoteRegistrationConsumer from "modules/blockchain/web3/services/implementations/RegisterVote";
// import VoteQueue from "modules/vote/queues/implementations/amqp/VoteQueue";
// import AMQPClient from "@root-shared/infra/amqp/client/client";

// // const amqpClient = new AMQPClient();
// const voteRepo = new VoteRepository();

// const polygon = new PolygonWeb3()


// const amqpClient = new AMQPClient([new VoteRegistrationConsumer(voteRepo, polygon)]);


// const voteQueue = new VoteQueue(amqpClient);

// const registerVote = new RegisterVote(voteRepo, voteQueue) ;


// const registerVoteController = new RegisterVoteController(registerVote);

// export { registerVote, registerVoteController };


import VoteRepository from "modules/vote/repositories/implementations/TypeORM/VoteRepository";
import RegisterVote from "./registerVote";
import RegisterVoteController from "./registerVoteController";
import { PolygonWeb3 } from "modules/blockchain/web3/services/implementations/PolygonNetwork";
import VoteRegistrationConsumer from "modules/blockchain/web3/services/implementations/RegisterVote";
import VoteQueue from "modules/vote/queues/implementations/amqp/VoteQueue";
import AMQPClient from "@root-shared/infra/amqp/client/client";
import { transactionManager } from "@core/infra/TypeORM/TransactionManager";
import UserRepository from "@user/repositories/implementations/TypeOrm/UserRepository";
import ElectionRepository from "modules/election/repositories/implementations/ElectionRepository";

const voteRepo = new VoteRepository();
const userRepo = new UserRepository()
const electionRepo = new ElectionRepository();

const polygon = new PolygonWeb3()
const amqpClient = new AMQPClient();
const voteQueue = new VoteQueue(amqpClient);

const consumer = new VoteRegistrationConsumer(voteRepo, polygon, voteQueue);

amqpClient.appendConsumer(consumer);

const registerVote = new RegisterVote(voteRepo, userRepo, electionRepo, voteQueue) ;

const registerVoteController = new RegisterVoteController(transactionManager,registerVote);

export { registerVote, registerVoteController };

import VoteRepository from "modules/vote/repositories/implementations/TypeORM/VoteRepository";
import VoteRegistrationConsumer from "../VoteRegistrationConsumer";
import { PolygonWeb3 } from "../PolygonNetwork";
import AMQPClient from "@root-shared/infra/amqp/client/client";
import VoteQueue from "modules/vote/queues/implementations/amqp/VoteQueue";
import CandidateRepository from "modules/candidate/repositories/implementations/CandidateRepository";

export default function makeVoteRegistrationConsumer(): VoteRegistrationConsumer {
    const voteRepo = new VoteRepository();
    const candidateRepo = new CandidateRepository()
    const polygon = new PolygonWeb3()
    const amqpClient = new AMQPClient();
    const voteQueue = new VoteQueue(amqpClient);

    return new VoteRegistrationConsumer(voteRepo, candidateRepo, polygon, voteQueue);
}

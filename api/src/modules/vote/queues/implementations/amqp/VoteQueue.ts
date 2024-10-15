import IQueueHandler from "@core/infra/QueueHandler";
import { Exchange } from "@core/infra/QueueHandler";
import IVoteQueue from "../../IVoteQueue";

export default class VoteQueue implements IVoteQueue {
    private queueHandler: IQueueHandler;

    constructor(queueHandler: IQueueHandler) {
        this.queueHandler = queueHandler;
    }

    async send(voteData: any): Promise<void> {
        const exchange: Exchange = {
            name: "voteExchange",
            type: "direct"
        };

        const routingKey = "vote.register";


        // Envia os detalhes do voto para a fila
        await this.queueHandler.send(exchange, routingKey, voteData);
    }
}

import Queue from "@core/infra/Queue";

export interface IVoteSend {
    candidateId: string;
    userId: string;
    voteId: string;
}

type IVoteQueue = Queue<IVoteSend>;

export default IVoteQueue;

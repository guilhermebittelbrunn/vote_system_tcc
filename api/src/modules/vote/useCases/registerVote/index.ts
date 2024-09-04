import VoteRepository from "modules/vote/repositories/implementations/TypeORM/VoteRepository";
import RegisterVote from "./registerVote";
import RegisterVoteController from "./registerVoteController";
import { VoteChain } from "modules/vote/repositories/implementations/HyperledgerFabric/VoteChain";

const voteRepo = new VoteRepository();
const blockchain = new VoteChain();

const registerVote = new RegisterVote(voteRepo, blockchain);

const registerVoteController = new RegisterVoteController(registerVote);

export { registerVote, registerVoteController };

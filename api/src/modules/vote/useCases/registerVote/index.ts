import VoteRepository from "modules/vote/repositories/implementations/TypeORM/VoteRepository";
import RegisterVote from "./registerVote";
import RegisterVoteController from "./registerVoteController";

const voteRepo = new VoteRepository();

const registerVote = new RegisterVote(voteRepo);

const registerVoteController = new RegisterVoteController(registerVote);

export { registerVote, registerVoteController };

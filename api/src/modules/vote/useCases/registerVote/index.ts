import VoteRepository from "modules/vote/repositories/implementations/TypeORM/VoteRepository";
import RegisterVote from "./registerVote";
import RegisterVoteController from "./registerVoteController";
import { PolygonWeb3 } from "modules/blockchain/web3/services/implementations/PolygonNetwork";

const voteRepo = new VoteRepository();
const polygon = new PolygonWeb3()

const registerVote = new RegisterVote(voteRepo, polygon) ;

const registerVoteController = new RegisterVoteController(registerVote);

export { registerVote, registerVoteController };

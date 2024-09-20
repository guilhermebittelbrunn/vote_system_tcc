import VoteRepository from "modules/vote/repositories/implementations/TypeORM/VoteRepository";
import RegisterVote from "./registerVote";
import RegisterVoteController from "./registerVoteController";
<<<<<<< Updated upstream

const voteRepo = new VoteRepository();

const registerVote = new RegisterVote(voteRepo);
=======
import { PolygonWeb3 } from "modules/blockchain/web3/services/implementations/PolygonNetwork";
// import { VoteChain } from "modules/vote/repositories/implementations/Web3/VoteChain";

const voteRepo = new VoteRepository();
const polygon = new PolygonWeb3()

const registerVote = new RegisterVote(voteRepo, polygon) ;
>>>>>>> Stashed changes

const registerVoteController = new RegisterVoteController(registerVote);

export { registerVote, registerVoteController };

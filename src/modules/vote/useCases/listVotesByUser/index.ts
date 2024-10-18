import VoteRepository from "modules/vote/repositories/implementations/TypeORM/VoteRepository";
import ListVotesByUser from "./listVotesByUser";
import ListVotesByUserController from "./listVotesByUserController";

const VoteRepo = new VoteRepository();

const listVotesByUser = new ListVotesByUser(VoteRepo);

const listVotesByUserController = new ListVotesByUserController(listVotesByUser);

export { listVotesByUser, listVotesByUserController };

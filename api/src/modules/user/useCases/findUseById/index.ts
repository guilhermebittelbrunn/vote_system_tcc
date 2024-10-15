import UserRepository from '@user/repositories/implementations/TypeOrm/UserRepository';
import FindUserById from './findUserById';
import FindUserByIdController from './findUserByIdController';

const userRepo = new UserRepository();

const findUser = new FindUserById(userRepo);

const findUserController = new FindUserByIdController(findUser);

export { findUser, findUserController };

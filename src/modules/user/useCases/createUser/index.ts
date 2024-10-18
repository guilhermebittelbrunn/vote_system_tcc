import UserRepository from '@user/repositories/implementations/TypeOrm/UserRepository';
import CreateUser from './createUser';
import CreateUserController from './createUserController';

const userRepo = new UserRepository();

const createUser = new CreateUser(userRepo);

const createUserController = new CreateUserController(createUser);

export { createUser, createUserController };

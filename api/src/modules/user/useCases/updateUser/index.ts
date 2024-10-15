import UserRepository from '@user/repositories/implementations/TypeOrm/UserRepository';
import UpdateUser from './updateUser';
import UpdateUserController from './updateUserController';

const userRepo = new UserRepository();

const updateUser = new UpdateUser(userRepo);

const updateUserController = new UpdateUserController(updateUser);

export { updateUser, updateUserController };

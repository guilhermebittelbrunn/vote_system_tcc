import AuthTokenService from '@user/services/implementations/AuthTokenService';

import Login from './login';
import LoginController from './loginController';
import UserRepository from '@user/repositories/implementations/TypeOrm/UserRepository';

const userRepo = new UserRepository();
const authTokenService = new AuthTokenService();

const login = new Login(userRepo, authTokenService);

const loginController = new LoginController(login);

export { login, loginController };

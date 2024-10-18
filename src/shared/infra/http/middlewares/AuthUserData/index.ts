import NodeCache from 'node-cache';

import AuthTokenService from '@user/services/implementations/AuthTokenService';

import AuthUserData from './AuthUserData';
import UserRepository from '@user/repositories/implementations/TypeOrm/UserRepository';
import AuthContext from '../../contexts/cls/AuthContext';

const userRepo = new UserRepository();

const authTokenService = new AuthTokenService();

const authContext = new AuthContext();

const nodeCache = new NodeCache();

const authUserData = new AuthUserData(userRepo, authTokenService, authContext, nodeCache);

export { authUserData };

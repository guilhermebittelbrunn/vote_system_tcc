import TokenService from '@root-shared/services/implementations/jsonwebtoken/TokenService';
import IAuthTokenService from '../IAuthTokenService';
import { JWTPayload } from '@user/domain/JWTPayload';

export default class AuthTokenService extends TokenService<JWTPayload> implements IAuthTokenService {}

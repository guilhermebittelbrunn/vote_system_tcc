import ITokenService from '@root-shared/services/ITokenService';
import { JWTPayload } from '@user/domain/JWTPayload';

type IAuthTokenService = ITokenService<JWTPayload>;

export default IAuthTokenService;

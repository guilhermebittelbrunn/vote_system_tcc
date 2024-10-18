import BaseContext from '@core/infra/BaseContext';

import IAuthContext, { IAuthContextProps } from '../IAuthContext';

export default class AuthContext extends BaseContext<IAuthContextProps> implements IAuthContext {
    name = 'auth';
}

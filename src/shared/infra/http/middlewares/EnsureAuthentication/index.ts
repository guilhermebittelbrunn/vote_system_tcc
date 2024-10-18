import AuthContext from '../../contexts/cls/AuthContext';

import EnsureAuthentication from './EnsureAuthentication';

const authContext = new AuthContext();

const ensureAuthentication = new EnsureAuthentication(authContext);

export { ensureAuthentication };


import PostgresDBOperations from '@root-shared/resositories/implementations/postgres/PostgresDBOperations';
import AuthContext from '../../contexts/cls/AuthContext';

import SetTimezone from './SetTimezone';

const authContext = new AuthContext();
const dbOperations = new PostgresDBOperations();

const setTimezone = new SetTimezone(authContext, dbOperations);

export { setTimezone };

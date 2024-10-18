import ORMContext from '@root-shared/infra/http/contexts/cls/ORMContext';

import TransactionManager from './TransactionManager';

const ormContext = new ORMContext();

const transactionManager = new TransactionManager(ormContext);

export { transactionManager };

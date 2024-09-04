import ContextHandler from '@core/infra/ContextHandler';

export interface IAuthContextProps {
    userId: string;
}

type IAuthContext = ContextHandler<IAuthContextProps>;

export default IAuthContext;

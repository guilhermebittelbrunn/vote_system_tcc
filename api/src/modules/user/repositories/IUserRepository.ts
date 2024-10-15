import Repository, { SingleEntityResponse } from '@core/infra/Repository';
import { GenericId } from '@core/utils/types';
import User from '@user/domain/user/user';

export interface findByCpfOrRgParams {
    cpf?: string;
    rg?: string
}

interface IUserRepository extends Repository<User> {
    findByEmail(email: string): SingleEntityResponse<User>;
    findByCpfOrRg(params: findByCpfOrRgParams):  SingleEntityResponse<User>;
    findAvailableById(id: GenericId): SingleEntityResponse<User>;
}

export default IUserRepository;

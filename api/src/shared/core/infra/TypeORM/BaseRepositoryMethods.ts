import UniqueEntityID from '@core/domain/UniqueEntityID';
import { RawID } from '@core/utils/types';

export default abstract class BaseRepositoryMethods {
    /**
     * @method getId
     * @description função que auxilia a pegar o valor raw do ID
     */
    getId(id: RawID | UniqueEntityID): RawID {
        if (id instanceof UniqueEntityID) {
            return id.toValue();
        }

        return id;
    }

    /**
     * @method getProps
     * @description função que auxilia a pegar as propriedades do objeto
     */
    getProps(fields: any): any {
        if (fields.props) {
            return fields.props;
        }

        return fields;
    }
}

import { getNamespace, Namespace } from 'cls-hooked';
import ContextHandler, { ContextContract, ContextGetValue, ContextSetValue } from './ContextHandler';


/** @todo could be static */
export default abstract class BaseContext<T extends ContextContract> implements ContextHandler<T> {
    protected abstract name: string;

    private getContext(): Namespace {
        const context = getNamespace(this.name);

        if (!context) {
            throw new Error(`namespace ${this.name} was used before being initialized at server root file`);
        }

        return context;
    }

    public getValue: ContextGetValue<T> = key => {
        const value = this.getContext().get(key);

        return value;
    };

    public setValue: ContextSetValue<T> = (key, value) => {
        this.getContext().set(key, value);
    };
}

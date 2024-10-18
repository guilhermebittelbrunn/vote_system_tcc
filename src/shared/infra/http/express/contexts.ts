import { createNamespace } from 'cls-hooked';

const typeormCtx = createNamespace('typeorm');
const authCtx = createNamespace('auth');
const domainEventCtx = createNamespace('domainEvent');

export default function contexts(callback: () => void): void {
    domainEventCtx.run(() => {
        typeormCtx.run(() => {
            authCtx.run(() => {
                callback();
            });
        });
    });
}

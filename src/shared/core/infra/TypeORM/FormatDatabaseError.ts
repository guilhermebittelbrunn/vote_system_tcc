/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable func-names */
import GenericErrors from '@root-shared/logic/GenericErrors';
import { DatabaseError } from 'pg';
import { QueryFailedError } from 'typeorm';


// eslint-disable-next-line @typescript-eslint/no-unused-vars

export const FOREIGN_KEY_VIOLATION = '23503';

/**
 * Gets the error that was thrown by the request and format it into a {@link GenericAppError}
 */
export default function FormatDatabaseError() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            try {
                return await originalMethod.apply(this, args);
            } catch (error: any) {
                console.error(`[FormatDatabaseError]: Uncaught database error`);
                console.error(error);

                if (error instanceof QueryFailedError) {
                    if ((error as unknown as DatabaseError).code === FOREIGN_KEY_VIOLATION) {
                        throw new GenericErrors.Conflict(
                            'registro não pode ser excluído porque está vinculado à outros registros',
                        );
                    }
                }

                throw error;
            }
        };

        return descriptor;
    };
}

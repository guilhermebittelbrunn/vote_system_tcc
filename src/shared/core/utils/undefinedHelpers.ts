import UniqueEntityID from "@core/domain/UniqueEntityID";

export function validUniqueID(uniqueId?: string): UniqueEntityID | undefined {
    return uniqueId ? new UniqueEntityID(uniqueId) : undefined;
}

export function dateIfExists(maybeDate: string | number | Date | null | undefined): Date | null | undefined {
    if (maybeDate === undefined) return undefined;

    return maybeDate ? new Date(maybeDate) : null;
}

export function stringIfExists(maybeString: unknown): string | null | undefined {
    if (maybeString === undefined) return undefined;

    return maybeString ? String(maybeString) : null;
}

export function numberIfExists(maybeNumber: unknown): number | null | undefined {
    if (maybeNumber === undefined) return undefined;

    return maybeNumber || maybeNumber === 0 ? Number(maybeNumber) : null;
}

/**
 * Retorna o primeiro valor que não seja `null`, `''` ou `undefined`. Ou então o ultimo
 * @note Geralmente usado na edição de campos que são obrigatórios ou setados por default na criação da entidade
 */
export function coalesce(...args: Array<any>): any {
    for (const arg of args) {
        if (arg !== null && arg !== '' && arg !== undefined) {
            return arg;
        }
    }

    return args[args.length - 1];
}

/**
 * Retorna o primeiro valor que não seja `null` nem `''`. Ou então o ultimo
 * @note Geralmente usado na edição de campos que são obrigatórios
 */
export function coalesceEmpty(...args: Array<any>): any {
    for (const arg of args) {
        if (arg !== null && arg !== '') {
            return arg;
        }
    }

    return args[args.length - 1];
}

/**
 * Retorna o primeiro valor que não seja `undefined`. Ou então o ultimo
 * @note Geralmente usado na edição de campos que são opcionais
 */
export function coalesceUndefined(...args: Array<any>): any {
    for (const arg of args) {
        if (arg !== undefined) {
            return arg;
        }
    }

    return args[args.length - 1];
}

/**
 * Retorna verdadeiro se o array é valido e tem ao menos um item
 */
export function filledArray(arr: Array<any> | null | undefined): arr is Array<any> {
    return Boolean(arr && Array.isArray(arr) && arr.length > 0);
}

export function isEmpty(value: any): value is null | undefined | string {
    return value === null || value === undefined || value === '';
}

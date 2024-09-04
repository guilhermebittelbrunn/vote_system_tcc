/* eslint-disable no-plusplus */
import ValueObject from '@core/domain/ValueObject';
import applyStringMask from '@core/utils/applyStringMask';
import { Either, left, right } from '@root-shared/logic/Either';
import GenericAppError from '@root-shared/logic/GenericAppError';
import GenericErrors from '@root-shared/logic/GenericErrors';
import Guard from '@root-shared/logic/Guard';

interface UserCpfProps {
    value: string;
}
export default class UserCpf extends ValueObject<UserCpfProps> {
    private static userFriendlyName = 'CNPJ ou CPF';

    private static IDENTIFIER_MASKS = {
        cpf: '___.___.___-__',
        rg: '__.___.___-_',
    };

    private constructor(value: string) {
        super({ value });
    }

    get value(): string {
        return this.props.value;
    }

    get cpf(): string | undefined {
        if (this.isCNPJ()) {
            return undefined;
        }

        return this.value;
    }

    private static isValidCPF(cpf: string): boolean {
        if (typeof cpf !== 'string') return false;

        if (
            !cpf ||
            cpf.length !== 11 ||
            cpf === '00000000000' ||
            cpf === '11111111111' ||
            cpf === '22222222222' ||
            cpf === '33333333333' ||
            cpf === '44444444444' ||
            cpf === '55555555555' ||
            cpf === '66666666666' ||
            cpf === '77777777777' ||
            cpf === '88888888888' ||
            cpf === '99999999999'
        ) {
            return false;
        }

        let soma = 0;
        let resto;

        for (let i = 1; i <= 9; i++) soma += Number(cpf.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;

        if (resto === 10 || resto === 11) resto = 0;

        if (resto !== Number(cpf.substring(9, 10))) return false;

        soma = 0;

        for (let i = 1; i <= 10; i++) soma += Number(cpf.substring(i - 1, i)) * (12 - i);

        resto = (soma * 10) % 11;

        if (resto === 10 || resto === 11) resto = 0;

        if (resto !== Number(cpf.substring(10, 11))) return false;

        return true;
    }

    private isCNPJ(): boolean {
        return this.value.length === 14;
    }

    private static isValid(value: string): boolean {
        if (value.length === 11) {
            return this.isValidCPF(value);
        }

        return false;
    }

    public static formatCpf(value: string): string {
        if (!value) return '';

        return applyStringMask(value, this.IDENTIFIER_MASKS.cpf);
    }

    static create(value: string): Either<GenericAppError, UserCpf> {
        const guardedProp = Guard.againstNullOrUndefined(value, this.userFriendlyName);

        if (!guardedProp.succeeded) {
            return left(new GenericErrors.InvalidParam(guardedProp.message));
        }

        const valueWithOnlyNumbers = value.replace(/[^\d]/g, '');

        const isValid = this.isValid(valueWithOnlyNumbers);

        if (!isValid) {
            return left(new GenericErrors.InvalidParam(`${this.userFriendlyName} inválido.`));
        }

        return right(new UserCpf(valueWithOnlyNumbers));
    }
}

import UniqueEntityID from "@core/domain/UniqueEntityID";
import { areEqualDates } from "@core/utils/dateHelpers";

export interface IGuardResult {
    succeeded: boolean;
    message?: string;
}

export interface IGuardArgument<T = unknown> {
    argument: T;
    argumentName: string;
}

export type GuardArgumentCollection<T = unknown> = IGuardArgument<T>[];

export interface DatetimeIntervalDates {
    initialDate: Date;
    endDate: Date;
    initialHour?: Date | null;
    endHour?: Date | null;
}

export default class Guard {
    public static combine(guardResults: IGuardResult[]): IGuardResult {
        for (const result of guardResults) {
            if (result.succeeded === false) return result;
        }

        return { succeeded: true };
    }

    public static greaterThan(minValue: number, actualValue: number, argumentName: string): IGuardResult {
        return actualValue > minValue
            ? { succeeded: true }
            : {
                  succeeded: false,
                  message: `${argumentName} é menor que ${minValue}`,
              };
    }

    public static greaterThanBulk(minValue: number, args: GuardArgumentCollection<number>): IGuardResult {
        for (const arg of args) {
            const result = this.greaterThan(minValue, arg.argument, arg.argumentName);
            if (!result.succeeded) return result;
        }

        return { succeeded: true };
    }

    public static againstAtLeast(numChars: number, text: string): IGuardResult {
        return text.length >= numChars
            ? { succeeded: true }
            : {
                  succeeded: false,
                  message: `O texto deve ter pelo menos ${numChars} caracteres`,
              };
    }

    public static againstAtMost(numChars: number, text: string): IGuardResult {
        return text.length <= numChars
            ? { succeeded: true }
            : {
                  succeeded: false,
                  message: `O texto tem mais de ${numChars} caracteres`,
              };
    }

    /**
     * @note Talvez seja interessante adicionar um `argument === ''` também
     * Ou então converter valores empty para null
     */
    public static againstNullOrUndefined(argument: unknown, argumentName: string): IGuardResult {
        if (
            argument instanceof UniqueEntityID &&
            (argument.toValue() === null || argument.toValue() === undefined)
        ) {
            return { succeeded: false, message: `${argumentName} é um campo obrigatório` };
        }

        if (argument === null || argument === undefined) {
            return { succeeded: false, message: `${argumentName} é um campo obrigatório` };
        }
        return { succeeded: true };
    }

    public static againstNullOrUndefinedBulk(args: GuardArgumentCollection): IGuardResult {
        for (const arg of args) {
            const result = this.againstNullOrUndefined(arg.argument, arg.argumentName);
            if (!result.succeeded) return result;
        }

        return { succeeded: true };
    }

    public static isOneOf<T>(value: T, validValues: T[], argumentName: string): IGuardResult {
        let isValid = false;
        for (const validValue of validValues) {
            if (value === validValue) {
                isValid = true;
            }
        }

        if (isValid) {
            return { succeeded: true };
        }
        return {
            succeeded: false,
            message: `${argumentName} (${value}) não está dentro dos itens permitidos (${validValues.join(
                ', ',
            )})`,
        };
    }

    public static inRange(num: number, min: number, max: number, argumentName: string): IGuardResult {
        const isInRange = num >= min && num <= max;
        if (!isInRange) {
            return { succeeded: false, message: `${argumentName} não está entre ${min} e ${max}` };
        }
        return { succeeded: true };
    }

    public static allInRange(numbers: number[], min: number, max: number, argumentName: string): IGuardResult {
        let failingResult: IGuardResult | null = null;

        for (const num of numbers) {
            const numIsInRangeResult = this.inRange(num, min, max, argumentName);
            if (!numIsInRangeResult.succeeded) failingResult = numIsInRangeResult;
        }

        if (failingResult) {
            return { succeeded: false, message: `${argumentName} não está dentro do permitido` };
        }
        return { succeeded: true };
    }

    public static isValidDatetimeInterval(dates: DatetimeIntervalDates): IGuardResult {
        if (dates.initialDate > dates.endDate) {
            return { succeeded: false, message: 'data inicial não pode ser maior que data final' };
        }

        if (areEqualDates(dates.initialDate, dates.endDate)) {
            if (dates.initialHour && dates.endHour && dates.initialHour > dates.endHour) {
                return {
                    succeeded: false,
                    message: 'data/hora inicial não pode ser maior que data/hora final',
                };
            }
        }

        return { succeeded: true };
    }
}

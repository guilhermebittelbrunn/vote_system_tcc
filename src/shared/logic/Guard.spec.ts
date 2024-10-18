import { date } from 'faker';

import Guard from './Guard';

describe('isValidDatetimeInterval', () => {
    it('should return success if relation between initial and end date is valid', () => {
        const result = Guard.isValidDatetimeInterval({
            initialDate: date.recent(2),
            endDate: date.soon(2),
        });

        expect(result.succeeded).toBeTruthy();
    });

    it('should return success if relation between initial and end datetime is valid', () => {
        const result = Guard.isValidDatetimeInterval({
            initialDate: new Date('2021-07-16'),
            endDate: new Date('2021-07-16'),
            initialHour: new Date('2021-07-16 08:00:00'),
            endHour: new Date('2021-07-16 10:00:00'),
        });

        expect(result.succeeded).toBeTruthy();
    });

    it('should return error if relation between initial and end date is invalid', () => {
        const result = Guard.isValidDatetimeInterval({
            initialDate: date.soon(2),
            endDate: date.recent(2),
        });

        expect(result.succeeded).toBeFalsy();
        expect(result.message).toBe('data inicial não pode ser maior que data final');
    });

    it('should return error if relation between initial and end datetime is invalid', () => {
        const result = Guard.isValidDatetimeInterval({
            initialDate: new Date('2021-07-16'),
            endDate: new Date('2021-07-16'),
            initialHour: new Date('2021-07-16 10:00:00'),
            endHour: new Date('2021-07-16 08:00:00'),
        });

        expect(result.succeeded).toBeFalsy();
        expect(result.message).toBe('data/hora inicial não pode ser maior que data/hora final');
    });
});

import { RawID } from '@core/utils/types';

export interface JWTPayload {
    userId: RawID;
    readonly iat?: number;
    readonly exp?: number;
}

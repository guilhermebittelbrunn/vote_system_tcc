import { GenericTokenPayload } from '@core/utils/types';

export default interface ITokenService<T extends GenericTokenPayload> {
    encode(payload: T, exp?: number): string;
    decode(token: string): T | null;
}

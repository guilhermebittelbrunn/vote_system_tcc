export interface LoggerHelper {
    error(message: string, identifier?: string): Promise<void>;
    warn(message: string, identifier?: string): Promise<void>;
    info(message: string, identifier?: string): Promise<void>;
}

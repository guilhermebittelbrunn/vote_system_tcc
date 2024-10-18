/* eslint-disable no-empty */

export default class Logger {

    static logsEnabled = Boolean(['production', 'staging'].includes(process.env.APP_ENV as string));

    private static consoleError(err: any): void {
        console.error(`[LOGGER IMPLEMENTATION ERROR]`, err);
    }

    public static formatErrorMessage(message: any, prefix?: string): string {
        if (typeof message === 'object') {
            if (message instanceof Error) {
                message = message.toString();
            } else {
                try {
                    message = JSON.stringify(message, null, '\t');
                } catch {}
            }
        }

        if (prefix) {
            return `${prefix}: ${message}`;
        }

        return message;
    }

    /**
     * Send error message to discord/console
     * @param prefix add a pre message to error message, also useful for identification purposes
     * @param identifier preferred to be class constructor name to help finding the origin of the log
     * @returns formatted log message
     */
    static error(message: string, prefix?: string, identifier?: string): string {
        const errorMessage = this.formatErrorMessage(message, prefix);

        console.error(identifier || '', errorMessage);


        return errorMessage;
    }

    /**
     * Send info message to discord/console
     * @param prefix add a pre message to info message, also useful for identification purposes
     * @param identifier preferred to be class constructor name to help finding the origin of the log
     * @returns formatted log message
     */
    static info(message: string, prefix?: string, identifier?: string): string {
        const infoMessage = this.formatErrorMessage(message, prefix);

        console.info(identifier || '', infoMessage);

        return infoMessage;
    }

    /**
     * Send warn message to discord/console
     * @param prefix add a pre message to warn message, also useful for identification purposes
     * @param identifier preferred to be class constructor name to help finding the origin of the log
     * @returns formatted log message
     */
    static warn(message: string, prefix?: string, identifier?: string): string {
        const warnMessage = this.formatErrorMessage(message, prefix);

        console.warn(identifier || '', warnMessage);

        return warnMessage;
    }
}

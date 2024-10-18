interface IUseCaseErrorError {
    message: string;
}

export abstract class UseCaseError implements IUseCaseErrorError {
    public message: string;

    addPrefix(text: string): void {
        this.message = `${text} ${this.message}`;
    }

    constructor(message: string) {
        this.message = message;
    }
}

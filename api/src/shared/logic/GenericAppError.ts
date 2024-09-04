interface IGenericAppError {
    message: string;
}

export default abstract class GenericAppError implements IGenericAppError {
    public message: string;

    addPrefix(text: string): void {
        this.message = `${text} ${this.message}`;
    }

    constructor(message: string) {
        this.message = message;
    }
}

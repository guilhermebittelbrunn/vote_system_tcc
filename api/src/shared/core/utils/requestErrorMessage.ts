import axios from 'axios';

export default function requestErrorMessage(error: unknown): string {
    const fallbackMessage = 'Um erro inesperado aconteceu';

    if (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                const responseError = error.response;

                if (responseError.data && responseError.data.message) {
                    return responseError.data.message;
                }

                if (responseError.data && responseError.data.error) {
                    if (responseError.data.error.message) {
                        return responseError.data.error.message;
                    }
                    return responseError.data.error;
                }

                return `${responseError.status} - ${responseError.statusText}`;
            }
        }

        if (error instanceof Error) {
            return error.message;
        }
    }

    return fallbackMessage;
}

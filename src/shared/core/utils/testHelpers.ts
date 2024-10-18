export function isTest(): boolean {
    return process.env.JEST_WORKER_ID !== undefined;
}

interface GqlResponse {
    data: any;
    error: any;
}

export function parseGqlResponse(string: string): GqlResponse {
    try {
        return JSON.parse(string);
    } catch (error) {
        return {
            data: null,
            error: null,
        };
    }
}

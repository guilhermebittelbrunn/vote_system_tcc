import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { QueryFailedError } from 'typeorm';


import { FOREIGN_KEY_VIOLATION } from './TypeORM/FormatDatabaseError';
import Logger from './Logger';
import GenericAppError from '@root-shared/logic/GenericAppError';
import GenericErrors from '@root-shared/logic/GenericErrors';
import { sanitizeObject } from '@core/utils/textHelpers';
import { DatabaseError } from 'pg';


export default abstract class BaseController {
    protected abstract executeImplementation(req: Request, res: Response): Promise<void | Response>;

    public async execute(req: Request, res: Response): Promise<void> {
        const chunks: Uint8Array[] = [];

        this.proxyResponseBody(res, chunks);

        try {
            await this.executeImplementation(req, res);

        } catch (error: any) {
            if (error instanceof GenericAppError) {
                this.genericErrorResponse(res, error);
            } else {
                this.fail(res, error);
            }
        }
    }

    /**
     * returns an object with merged props from req body and params
     */
    public payload(req: Request): any {
        if (Array.isArray(req.body)) {
            return req.body.map(item => ({
                ...sanitizeObject(item),
                ...sanitizeObject(req.query),
                ...sanitizeObject(req.params),
            }));
        }

        return { ...sanitizeObject(req.body), ...sanitizeObject(req.query), ...sanitizeObject(req.params) };
    }

    public static jsonResponse(res: Response, code: number, message: string): Response {
        return res.status(code).json({ message });
    }

    public ok<T>(res: Response, dto?: T): Response {
        if (dto) {
            return res.status(StatusCodes.OK).json(dto);
        }
        return res.sendStatus(StatusCodes.OK);
    }

    public fail(res: Response, error?: any): Response {
        if (error instanceof GenericAppError) {
            return this.genericErrorResponse(res, error);
        }

        if (error instanceof QueryFailedError) {
            if ((error as unknown as DatabaseError).code === FOREIGN_KEY_VIOLATION) {
                console.log({error})
                return res.status(StatusCodes.CONFLICT).json({
                    message: 'Registro não pode ser excluído porque está vinculado à outros registros',
                });
            }
        }

        Logger.error(error, 'BaseController - Uncaught Error', this.constructor.name);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Não foi possível realizar a requisição',
        });
    }

    public clientError(res: Response, message?: string): Response {
        return BaseController.jsonResponse(res, StatusCodes.BAD_REQUEST, message || 'Unauthorized');
    }

    public unauthorized(res: Response, message?: string): Response {
        return BaseController.jsonResponse(res, StatusCodes.UNAUTHORIZED, message || 'Unauthorized');
    }

    public paymentRequired(res: Response, message?: string): Response {
        return BaseController.jsonResponse(res, StatusCodes.PAYMENT_REQUIRED, message || 'Payment required');
    }

    public forbidden(res: Response, message?: string): Response {
        return BaseController.jsonResponse(res, StatusCodes.FORBIDDEN, message || 'Forbidden');
    }

    public notFound(res: Response, message?: string): Response {
        return BaseController.jsonResponse(res, StatusCodes.NOT_FOUND, message || 'Not found');
    }

    public conflict(res: Response, message?: string): Response {
        return BaseController.jsonResponse(res, StatusCodes.CONFLICT, message || 'Conflict');
    }

    public tooMany(res: Response, message?: string): Response {
        return BaseController.jsonResponse(res, StatusCodes.TOO_MANY_REQUESTS, message || 'Too many requests');
    }

    public genericErrorResponse(res: Response, error: GenericAppError): Response {
        const statusCode = GenericErrors.getStatusCode(error);

        return BaseController.jsonResponse(res, statusCode, error.message);
    }

    /**
     * Saves response body into `chunks` to be turned into a string for log purposes
     */
    private proxyResponseBody(res: Response, chunks: Uint8Array[]): void {
        const oldWrite = res.write;
        const oldEnd = res.end;

        res.write = (...restArgs) => {
            chunks.push(Buffer.from(restArgs[0]));
            return oldWrite.apply(res, restArgs as any);
        };

        const overrideFn = (...restArgs: any[]): any => {
            if (restArgs[0]) {
                chunks.push(Buffer.from(restArgs[0]));
            }

            return oldEnd.apply(res, restArgs as any);
        };

        res.end = overrideFn;
    }

    private parseResponseBody(chunks: Uint8Array[]): string {
        return Buffer.concat(chunks).toString('utf8');
    }
}

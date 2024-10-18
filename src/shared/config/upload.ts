import path from 'path';
import { promisify } from 'util';

import { NextFunction, Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import multer, { Multer, StorageEngine, MulterError } from 'multer';
import { v4 as uuid } from 'uuid';

const tmpFolder = path.resolve(__dirname, '..', '..', '..', 'tmp');

interface IMulterUploadLimits {
    fieldNameSize?: number | undefined;
    fieldSize?: number | undefined;
    fields?: number | undefined;
    fileSize?: number | undefined;
    files?: number | undefined;
    parts?: number | undefined;
    headerPairs?: number | undefined;
}

interface IUploadConfig {
    tmpFolder: string;
    uploadFolder: string;

    multer: {
        storage: StorageEngine;
        limits?: IMulterUploadLimits | undefined;
    };
}

const maxFileSize = process.env.UPLOAD_MAX_FILE_SIZE_MB || 5;

export const uploadConfig: IUploadConfig = {
    tmpFolder,
    uploadFolder: path.resolve(tmpFolder, 'uploads'),
    multer: {
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, tmpFolder);
            },
            filename(request, file, callback) {
                console.log('file :>> ', file);
                const filename = `${uuid()}-${file.originalname}`;

                return callback(null, filename);
            },
        }),
        limits: {
            fileSize: Number(maxFileSize) * 1024 * 1024,
        },
    },
};

/**
 * @note Use this to prevent loosing cls-hooked context
 */
export function promisifyMiddleware(handler: RequestHandler) {
    return async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            console.log('começou')
            const handlerPromise = promisify(handler);
            await handlerPromise(req, res);
            next();
        } catch (e: MulterError | any) {
            if (e instanceof MulterError && e.code === 'LIMIT_FILE_SIZE') {
                next(
                    res.status(StatusCodes.REQUEST_TOO_LONG).json({
                        message: `Este arquivo excede o tamanho máximo permitido (${maxFileSize}MB)`,
                    }),
                );
            } else {
                next(
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: 'Não foi possível realizar a requisição',
                    }),
                );
            }
        }
    };
}

export default function initUpload(): Multer {
    return multer(uploadConfig.multer);
}

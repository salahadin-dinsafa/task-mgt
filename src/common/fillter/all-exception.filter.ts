import {
    ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, HttpStatus
}
    from "@nestjs/common";
import { Request, Response } from "express";
import * as fs from 'fs';


import {
    CoustomeHttpExceptionResponse, HttpExceptionResponse
}
    from "@app/common/types/http-exception-response.interface";


@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status: HttpStatus;
        let errorMessage: string;


        if (exception instanceof HttpException) {
            if (exception instanceof BadRequestException) {
                status = exception.getStatus();
                const errorResponse = exception.getResponse();
                errorMessage = (errorResponse as HttpExceptionResponse).message;
            } else {
                status = exception.getStatus();
                const errorResponse = exception.getResponse();
                errorMessage = exception.message || (errorResponse as HttpExceptionResponse).error;
            }
        }
        else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            errorMessage = 'Critical internal server error occurred!'
        }

        const errorResponse = this._getErrorResponse(status, errorMessage, request);
        const errorLog = this._getErrorLog(errorResponse, request, exception);
        this._writeErrorLogToFile(errorLog);
        response.status(status).json(errorResponse);
    }

    _getErrorResponse =
        (status: HttpStatus, errorMessage: string, request: Request):
            CoustomeHttpExceptionResponse => ({
                statusCode: status,
                error: errorMessage,
                path: request.url,
                method: request.method,
                timeStamp: new Date()
            })

    _getErrorLog =
        (errorResponse: CoustomeHttpExceptionResponse, request: Request, exception: unknown)
            : string => {
            const { statusCode, error, method, path } = errorResponse;
            const errorLog = `Response Code: ${statusCode} - Method: ${method} - URL: ${path}\n
    ${JSON.stringify(errorResponse)}\n
    User: ${JSON.stringify(request.user ?? 'Not signed in')}\n
    ${exception instanceof HttpException ? exception.stack : error}\n`;
            return errorLog;
        }

    _writeErrorLogToFile = (errorLog: string): void => {
        fs.appendFile('error.log', errorLog, 'utf-8', (err) => {
            if (err) throw err;
        })
    }

}
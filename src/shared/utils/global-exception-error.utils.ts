import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseCodes, ResponseFormat } from 'src/shared';
import AppValidationError from './app-validation-error.utils';
import AppError from './app-error.utils';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.error('Global Error Handler', exception);

    if (exception instanceof AppError) {
      ResponseFormat.handleAppErrorResponse(
        response,
        exception.responseCode,
        exception.httpStatus(),
        exception.message,
      );
    } else if (exception instanceof AppValidationError) {
      ResponseFormat.sendResponse(
        response,
        ResponseCodes['0002'],
        undefined,
        exception.message,
        400,
      );
    } else if (
      exception.name === 'JsonWebTokenError' ||
      exception.name === 'TokenExpiredError'
    ) {
      ResponseFormat.handleAppErrorResponse(response, '0005', 401);
    } else if (exception instanceof NotFoundException) {
      ResponseFormat.handleAppErrorResponse(response, '0004', 404);
    } else if (exception.name === 'CastError') {
      ResponseFormat.handleAppErrorResponse(response, '0002', 400);
    } else {
      ResponseFormat.handleAppErrorResponse(response, '0006', 403);
    }

    // ER_DUP_ENTRY
  }
}

import { ResponseCodes } from './ResponseCodes';
import { HttpStatus } from '@nestjs/common';

class AppError extends Error {
  message: string;
  isOperational: boolean;
  responseCode: string;
  responseBody: any;
  httpStatusCode: HttpStatus;

  constructor(responseCode: string, message?: string, httpStatus?: HttpStatus) {
    super();

    this.isOperational = true;
    this.message = message ? message : ResponseCodes[responseCode].message;
    this.responseCode = responseCode;
    this.responseBody = ResponseCodes[responseCode];
    this.responseBody = ResponseCodes[responseCode];
    this.httpStatusCode = httpStatus;

    Error.captureStackTrace(this, this.constructor);
  }

  httpStatus() {
    switch (this.responseBody?.status) {
      case 'OK':
        if (this.responseBody.code == '00') {
          return this.httpStatusCode ?? 200;
        }

        if (this.responseBody.code == '01') {
          return this.httpStatusCode ?? 202;
        }

      case 'FAIL':
        if (this.responseBody.code == '01') {
          return this.httpStatusCode ?? 404;
        }

        if (this.responseBody.code == '03') {
          return this.httpStatusCode ?? 400;
        }

        if (this.responseBody.code == '05') {
          return this.httpStatusCode ?? 401;
        }
        console.log(this.httpStatusCode);
        return this.httpStatusCode ?? 400;

      case 'DENIED':
        console.log(this.httpStatusCode);
        return this.httpStatusCode ?? 400;

      default:
        return this.httpStatusCode ?? 500;
    }
  }
}

export default AppError;

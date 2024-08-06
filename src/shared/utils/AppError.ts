import { ResponseCodes } from './ResponseCodes';

class AppError extends Error {
  message: string;
  isOperational: boolean;
  responseCode: string;
  responseBody: any;

  constructor(responseCode: string, message?: string) {
    super();

    this.isOperational = true;
    this.message = message ? message : ResponseCodes[responseCode].message;
    this.responseCode = responseCode;
    this.responseBody = ResponseCodes[responseCode];

    Error.captureStackTrace(this, this.constructor);
  }

  httpStatus() {
    switch (this.responseBody?.status) {
      case 'OK':
        if (this.responseBody.code == '00') {
          return 200;
        }

        if (this.responseBody.code == '01') {
          return 202;
        }

      case 'FAIL':
        if (this.responseBody.code == '02') {
          return 400;
        }

        if (this.responseBody.code == '03') {
          return 400;
        }

        if (this.responseBody.code == '05') {
          return 401;
        }

        return 400;

      case 'DENIED':
        return 400;

      default:
        return 500;
    }
  }
}

export default AppError;

import { ResponseCodes } from './response-codes.utils';

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
    switch (this.responseBody.status) {
      case 'OK':
        return 200;
      case 'FAIL':
        if (this.responseBody.code == '05') {
          return 401;
        }
        return 400;
      case 'DENIED':
        return 400;
      default:
        return 500; // Internal Server Error for unknown status
    }
  }
}

export default AppError;

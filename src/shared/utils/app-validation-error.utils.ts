class AppValidationError extends Error {
  message: string;
  isOperational: boolean;
  responseCode: string;
  responseBody: any;

  constructor(message) {
    super();

    this.isOperational = true;
    this.message = message;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppValidationError;

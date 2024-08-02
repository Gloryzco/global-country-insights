import { Response } from 'express';
import { ResponseCodes } from './response-codes.utils';

export class ResponseFormat {
  /**
   * Sends default JSON resonse to client
   * @param {*} code
   * @param {*} data
   * @param {*} message
   * @param {*} code
   */
  static successResponse(
    res: Response,
    data,
    message: string,
    code: number = 200,
  ) {
    if (data !== undefined && data !== null && Object.keys(data).length > 0) {
      this.sendResponse(res, ResponseCodes['0000'], data, message, code);
    } else {
      this.sendResponse(res, ResponseCodes['0001'], null, message, code);
    }
  }

  static handleAppErrorResponse(
    res: Response,
    errorCode: string,
    code: number = 200,
    message?: string,
  ) {
    this.sendResponse(
      res,
      ResponseCodes[errorCode],
      undefined,
      message || undefined,
      code,
    );
  }

  static sendResponse(
    res: Response,
    resDataType,
    data,
    message: string,
    code: number = 200,
  ) {
    const response = {
      status: resDataType.status ?? 'Fail',
      code: resDataType.code,
      message: message ?? resDataType.message,
      data: data ?? undefined,
    };

    res.status(code).json(response);
  }
}

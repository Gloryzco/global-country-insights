import { Response } from 'express';
import { ResponseCodes } from './ResponseCodes';

export class ResponseFormat {
  /**
   * Sends default JSON resonse to client
   * @param {*} code
   * @param {*} data
   * @param {*} message
   * @param {*} code
   */
  static successResponse<T>(
    res: Response,
    data: T,
    message: string,
    code: number = 200,
  ) {
    return this.sendResponse(res, ResponseCodes['0000'], data, message, code);
  }

  /**
   * Sends default JSON resonse to client
   * @param {*} code
   * @param {*} data
   * @param {*} message
   * @param {*} code
   */
  static requeryResponse<T>(
    res: Response,
    data: T,
    message: string,
    code: number = 202,
  ) {
    this.sendResponse(res, ResponseCodes['0001'], data, message, code);
  }

  /**
   * Sends default JSON resonse to client
   * @param {*} code
   * @param {*} data
   * @param {*} message
   * @param {*} code
   */
  static failureResponse<T>(
    res: Response,
    data: T,
    message: string,
    code: number = 400,
  ) {
    this.sendResponse(res, ResponseCodes['0002'], data, message, code);
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
      status: resDataType?.status ?? 'FAILED',
      code: resDataType?.code ?? '04',
      message: message ?? resDataType?.message,
      data: data ?? undefined,
    };

    return res.status(code).json(response);
  }
}

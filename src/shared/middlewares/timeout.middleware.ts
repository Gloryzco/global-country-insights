import {
  CallHandler,
  ExecutionContext,
  GatewayTimeoutException,
  Injectable,
  NestInterceptor,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Observable, TimeoutError, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import AppError from '../utils/AppError';

@Injectable()
export class RequestTimeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const timeoutMs = 10; 
    const timeoutHandler = setTimeout(() => {
      console.log(
        `Request to ${req.originalUrl} timed out after ${timeoutMs}ms`,
      );
      next();
    }, timeoutMs);

    // Override res.end to clear the timeout and call the original res.end
    const originalEnd = res.end.bind(res); // Bind the original res.end to res
    res.end = function (...args: any[]) {
      clearTimeout(timeoutHandler);
      return originalEnd(...args); // Call the original res.end with the provided arguments
    };
    next();
  }
}

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly timeoutInMillis: number) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(this.timeoutInMillis),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          throw new AppError('0001', 'Gateway timeout has occurred');
        }
        return throwError(() => err);
      }),
    );
  }
}

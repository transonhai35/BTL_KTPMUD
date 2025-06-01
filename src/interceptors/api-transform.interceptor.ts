import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { rankRegex } from '../utils/regex';

export interface IResponse<T> {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: T;
}

@Injectable()
export class ApiTransformInterceptor<T>
  implements NestInterceptor<T, IResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse<T>> {
    if (context.getType() != 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    // return view with url like /rank/{userId}
    if (rankRegex.test(request.url)) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        const statusCode = context.switchToHttp().getResponse().statusCode;
        return {
          success: true,
          statusCode,
          message: 'Success',
          data,
        };
      }),
      // catchError((err) => {
      //     const req = context.switchToHttp().getRequest();
      //     console.warn('[TransformInterceptor] err:', req.method, req.url, err);
      //     throw err;
      // }),
    );
  }
}

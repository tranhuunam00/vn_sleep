import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseConfigInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { statusCode } = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((data) => {
        return {
          success: true,
          message: 'Request successful',
          data,
          statusCode,
        };
      }),
    );
  }
}

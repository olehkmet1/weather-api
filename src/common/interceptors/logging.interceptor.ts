import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const method = request.method;
    const url = request.url;
    const userAgent = request.get('User-Agent') || '';
    const ip = request.ip || request.connection.remoteAddress;
    const startTime = Date.now();

    console.log(`[${new Date().toISOString()}] ${method} ${url} - ${ip} - ${userAgent}`);

    return next.handle().pipe(
      tap({
        next: (data) => {
          const endTime = Date.now();
          const duration = endTime - startTime;
          console.log(
            `[${new Date().toISOString()}] ${method} ${url} - ${response.statusCode} - ${duration}ms`
          );
        },
        error: (error) => {
          const endTime = Date.now();
          const duration = endTime - startTime;
          console.error(
            `[${new Date().toISOString()}] ${method} ${url} - ERROR - ${duration}ms - ${error.message}`
          );
        },
      })
    );
  }
} 
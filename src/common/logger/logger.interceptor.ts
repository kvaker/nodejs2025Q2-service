import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    const logStr = `Incoming Request - ${req.method} ${req.url} - Params: ${JSON.stringify(
      req.params,
    )} Body: ${JSON.stringify(req.body)}`;

    this.logger.log(logStr);

    return next.handle().pipe(
      tap((data) => {
        this.logger.log(`Response: ${JSON.stringify(data)}`);
      }),
    );
  }
}

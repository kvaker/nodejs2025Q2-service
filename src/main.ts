import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingService } from './common/logger/logging.service';
import { LoggerInterceptor } from './common/logger/logger.interceptor';
import { AllExceptionsFilter } from './common/logger/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const logger = app.get(LoggingService);
  app.useGlobalInterceptors(new LoggerInterceptor(logger));
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception: ' + err.message);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection: ' + JSON.stringify(reason));
  });

  await app.listen(process.env.PORT || 4000);
}
bootstrap();

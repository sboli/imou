import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    const ip = ((request.headers['x-forwarded-for'] || '') as string)?.split(
      ',',
    )[0];

    const startAt = process.hrtime();
    response.on('finish', () => {
      try {
        const { statusCode } = response;
        const contentLength = response.get('content-length');
        const diff = process.hrtime(startAt);
        const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
        this.logger.log(
          `${method} ${originalUrl} ${statusCode} ${responseTime}ms ${contentLength} - ${userAgent} ${ip}`,
        );
      } catch (e) {
        this.logger.error(e);
      }
    });

    next();
  }
}

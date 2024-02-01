import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import { BC } from './bash.colors';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl: url, headers } = request;
    const userAgent = request.headers['user-agent'];
    // const userAgent = request.get('user-agent') || '';

    response.on('close', () => {
      const { statusCode } = response;

      this.logger.verbose(
        `\n\t${BC.blue}<CUSTOM_MIDDLEWARE>${BC.rst}${BC.green} ${method} ${
          BC.cyan
        }${url} ${BC.purple}${statusCode}${BC.rst} - ${BC.gray}${userAgent} ${
          BC.yellow
        }${ip}${BC.rst} - ${BC.rst}\n\t${BC.blue}<...HEADERS>${
          BC.rst
        } ${JSON.stringify(headers)}${BC.rst}`,
      );
    });

    next();
  }
}

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly log = new Logger(HttpExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    this.log.debug('Throwing a custom HTTP Exception');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const message = exception.message || null;

    let statusCode = null;
    try {
      statusCode = response.statusCode;
    } catch (e) {}
    try {
      statusCode = exception.getStatus();
    } catch (e) {}

    // const myMessage = exception.getResponse();

    const body = {
      statusCode,
      message,
      timeStamp: new Date().toISOString(),
      endPoint: request.url,
      // notes: myMessage,
    };

    this.log.fatal(`${statusCode} ${message}: ${body}`);
    /**
     * @abstract Using `send(...)` instead of `json(..)` because of [this warning](https://docs.nestjs.com/exception-filters#arguments-host:~:text=of%20the%20exception.-,WARNING,-If%20you%20are)
     */
    response.status(statusCode).send(body);
  }
}

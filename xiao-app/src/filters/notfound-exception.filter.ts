import {
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(NotFoundException)
export class NotFoundExceptionFilter extends NotFoundException {
  private readonly log = new Logger(NotFoundExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    this.log.debug('Throwing a NOT FOUND exception');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();
    const message = exception.message || null;

    const myMessage = exception.getResponse();

    const body = {
      statusCode,
      message,
      timeStamp: new Date().toISOString(),
      endPoint: request.url,
      notes: myMessage,
    };

    this.log.fatal(`${statusCode} ${message}`);
    /**
     * @abstract Using `send(...)` instead of `json(..)` because of [this warning](https://docs.nestjs.com/exception-filters#arguments-host:~:text=of%20the%20exception.-,WARNING,-If%20you%20are)
     */
    response.status(statusCode).send(body);
  }
}

import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { LoggerService } from 'src/modules/logger/logger.service';

type ResponseObjType = {
  statusCode: number;
  timeStamp: string;
  path: string;
  response: string | object;
};

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  constructor(private readonly logger: LoggerService) {
    super();
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const responseObj: ResponseObjType = {
      statusCode: 500,
      timeStamp: new Date().toISOString(),
      path: request.url,
      response: '',
    };

    if (exception instanceof HttpException) {
      responseObj.statusCode = exception.getStatus();
      responseObj.response = exception.getResponse();
    } else {
      responseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      responseObj.response = 'Internal Server Error';
    }

    response.status(responseObj.statusCode).json(responseObj);

    this.logger.error(responseObj.response, AllExceptionFilter.name);

    super.catch(exception, host);
  }
}

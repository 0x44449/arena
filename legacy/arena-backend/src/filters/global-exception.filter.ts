import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiResultDto } from 'src/dtos/api-result.dto';
import { WellKnownException } from 'src/exceptions/well-known-exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.OK;
    let errorCode = 'INTERNAL_ERROR';

    if (exception instanceof WellKnownException) {
      errorCode = exception.errorCode ?? 'UNKNOWN_ERROR';
      this.logger.warn(exception.message);
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      errorCode = this.httpStatusToErrorCode(statusCode);
      this.logger.warn(`HttpException: ${exception.message}`);
      this.logger.warn(
        `HttpException cause:`,
        exception.cause,
        ' stack:',
        exception.stack,
      );
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      this.logUnknownException(exception);
    }

    const payload: ApiResultDto = {
      success: false,
      errorCode,
    };

    response.status(statusCode).json(payload);
  }

  private httpStatusToErrorCode(status: number): string {
    switch (status) {
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      case HttpStatus.CONFLICT:
        return 'CONFLICT';
      default:
        return 'HTTP_ERROR';
    }
  }

  private logUnknownException(exception: unknown) {
    if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
    } else {
      this.logger.error(`Unknown exception: ${JSON.stringify(exception)}`);
    }
  }
}

import { ArgumentsHost, Catch, ExceptionFilter, Logger } from "@nestjs/common";
import type { Response } from "express";
import { ApiResultDto } from "src/dtos/api-result.dto";
import { WellKnownException } from "src/exceptions/well-known-exception";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let errorCode = "INTERNAL_ERROR";

    if (exception instanceof WellKnownException) {
      errorCode = exception.errorCode ?? "UNKNOWN_ERROR";
      this.logger.warn(exception.message);
    } else {
      this.logUnknownException(exception);
    }

    const payload: ApiResultDto = {
      success: false,
      errorCode,
    };

    response.status(200).json(payload);
  }

  private logUnknownException(exception: unknown) {
    if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
    } else {
      this.logger.error(`Unknown exception: ${JSON.stringify(exception)}`);
    }
  }
}

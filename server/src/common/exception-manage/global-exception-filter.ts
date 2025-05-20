import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { WellKnownError } from "./well-known-error";
import { Response } from 'express';
import { ApiResult } from "@/dto/api-result.dto";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (!(exception instanceof WellKnownError)) {
      throw exception;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { message, errorCode } = exception;
    response.status(200).json(new ApiResult({
      success: false,
      errorMessage: message,
      errorCode: errorCode,
    }));
  }
}
import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { WellKnownError } from "./well-known-error";
import { Response } from 'express';
import { ApiResult } from "@/dtos/api-result.dto";

@Catch(WellKnownError)
export class WellKnownExceptionFilter implements ExceptionFilter {
  catch(exception: WellKnownError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { message, errorCode, statusCode } = exception;
    response.status(statusCode ?? 200).json(new ApiResult({
      success: false,
      errorMessage: message,
      errorCode: errorCode,
    }));
  }
}
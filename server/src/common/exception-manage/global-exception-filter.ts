import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { WellKnownError } from "./well-known-error";
import { Response } from 'express';
import { ApiResult } from "@/dto/api-result.dto";
import { UnauthorizedError } from "./unauthorized-error";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof WellKnownError) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();

      const { message, errorCode, statusCode } = exception;
      response.status(statusCode ?? 200).json(new ApiResult({
        success: false,
        errorMessage: message,
        errorCode: errorCode,
      }));
    } else if (exception instanceof UnauthorizedError) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();

      response.status(401).json(new ApiResult({
        success: false,
        errorMessage: 'Unauthorized',
        errorCode: '401',
      }));
    } else {
      throw exception;
    }
  }
}
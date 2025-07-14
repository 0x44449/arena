import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from 'express';
import { UnauthorizedError } from "./unauthorized-error";
import { ApiResult } from "@/dtos/api-result.dto";

@Catch(UnauthorizedError)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(401).json(new ApiResult({
      success: false,
      errorMessage: 'Unauthorized',
      errorCode: '401',
    }));
  }
}
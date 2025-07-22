import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from 'express';
import { UnauthorizedError } from "./unauthorized-error";
import { ApiResultDto } from "@/dtos/api-result.dto";

@Catch(UnauthorizedError)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(401).json(new ApiResultDto({
      success: false,
      errorMessage: 'Unauthorized',
      errorCode: '401',
    }));
  }
}
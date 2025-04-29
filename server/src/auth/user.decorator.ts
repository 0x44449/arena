import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ArenaRequest } from './arena-request';

export const User = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<ArenaRequest>();
    return request.user;
  },
);
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ArenaSocket } from './arena-socket';

export const WsUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const client = ctx.switchToWs().getClient<ArenaSocket>();
    return client.user;
  },
);
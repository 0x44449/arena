import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ArenaSocket } from './arena-socket';

export const FromWsCredential = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const client = ctx.switchToWs().getClient<ArenaSocket>();
    return client.credential;
  },
);
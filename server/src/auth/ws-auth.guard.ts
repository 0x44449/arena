import { UserService } from '@/user/user.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ArenaSocket } from './arena-socket';
import { AuthService } from './auth.service';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<ArenaSocket>();
    const token: string | undefined = typeof client.handshake.auth?.token === 'string'
      ? client.handshake.auth.token
      : typeof client.handshake.headers.authorization === 'string'
        ? client.handshake.headers.authorization.split(' ')[1]
        : undefined;

    if (!token) {
      return false;
    }

    const payload = this.authService.verifyToken(token);
    if (!payload) {
      return false;
    }

    client.credential = {
      userId: payload.userId,
    };
    return true;
  }
}
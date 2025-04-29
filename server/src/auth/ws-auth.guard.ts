import { UserService } from '@/user/user.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ArenaSocket } from './arena-socket';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<ArenaSocket>();
    const token: string | undefined = typeof client.handshake.auth?.token === 'string'
      ? client.handshake.auth.token
      : typeof client.handshake.headers.authorization === 'string'
        ? client.handshake.headers.authorization.split(' ')[1]
        : undefined;

    if (!token) {
      return false;
    }

    // (실제 JWT 디코딩 로직은 생략)
    const userId = 'mock-user-id'; // 예시

    const user = await this.userService.getUserByUserId('admin');

    if (!user) {
      return false;
    }

    // ✅ socket 객체에 user 정보 저장
    client.user = user;

    return true;
  }
}
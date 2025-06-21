import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ArenaRequest } from './arena-request';
import { UserService } from '@/user/user.service';
import { AuthService } from './auth.service';
import { UnauthorizedError } from '@/common/exception-manage/unauthorized-error';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<ArenaRequest>();
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return false;

    const payload = this.authService.verifyToken(token);
    if (!payload) {
      throw new UnauthorizedError('Invalid or expired token');
    }

    req.credential = {
      userId: payload.userId
    };
    return true;
  }
}
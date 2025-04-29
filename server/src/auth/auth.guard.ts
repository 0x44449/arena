import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ArenaRequest } from './arena-request';
import { UserService } from '@/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<ArenaRequest>();
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return false;

    req.user = await this.userService.getUserByUserId('admin') || undefined;

    return true;
  }
}
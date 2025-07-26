import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ArenaRequest } from '@/commons/arena-request';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/entities/user.entity';
import { Repository } from 'typeorm';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@/decorators/allow-public.decorator';
import { UnauthorizedError } from '@/commons/exceptions/unauthorized-error';
import { AuthService } from '@/modules/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  async verifyByToken(request: ArenaRequest, token: string): Promise<boolean> {
    const user = await this.authService.verifyArenaTokenStrict(token);

    request.credential = { user: user };
    return true;
  }

  async verifyByCookie(request: ArenaRequest, cookie: string): Promise<boolean> {
    const user = await this.authService.verifyArenaTokenStrict(cookie);

    request.credential = { user: user };
    return true;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<ArenaRequest>();

    if (!request.headers.authorization) {
      const cookieToken = request.cookies['arena_session'];

      if (cookieToken) {
        return await this.verifyByCookie(request, cookieToken);
      } else {
        throw new UnauthorizedError({
          message: 'No authentication token or session cookie provided',
          errorCode: 'NO_AUTH_TOKEN',
        });
      }
    } else {
      const authHeader = request.headers.authorization;
      const [, token] = authHeader.split('Bearer ');

      if (token) {
        return await this.verifyByToken(request, token);
      } else {
        throw new UnauthorizedError({
          message: 'No ID token provided in authorization header',
          errorCode: 'NO_AUTH_TOKEN',
        });
      }
    }
  }
}
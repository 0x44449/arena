import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ArenaRequest } from '@/commons/arena-request';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/entities/user.entity';
import { Repository } from 'typeorm';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@/decorators/allow-public.decorator';
import { UnauthorizedError } from '@/commons/exceptions/unauthorized-error';
import { WellKnownError } from '@/commons/exceptions/well-known-error';
import { AuthService } from '@/modules/auth/auth.service';
import { ArenaAuthTokenPayloadDto } from '@/dtos/arena-auth-token-payload';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  async verifyByToken(request: ArenaRequest, token: string): Promise<boolean> {
    let decoded: ArenaAuthTokenPayloadDto | null = null;
    try {
      decoded = await this.authService.verifyArenaToken(token);
    } catch {
      throw new UnauthorizedError('Invalid ID token');
    }

    if (!decoded) {
      throw new UnauthorizedError('Token verification failed');
    }

    console.log(`Decoded userId: ${decoded.userId}`);
    const userEntity = await this.userRepository.findOne({ where: { userId: decoded.userId } });
    if (!userEntity) {
      throw new WellKnownError({
        message: 'User not found',
        errorCode: 'USER_NOT_FOUND',
      });
    }

    request.credential = { user: userEntity };
    return true;
  }

  async verifyByCookie(request: ArenaRequest, cookie: string): Promise<boolean> {
    let decoded: ArenaAuthTokenPayloadDto | null = null;
    try {
      decoded = await this.authService.verifyArenaToken(cookie);
    } catch {
      throw new UnauthorizedError('Invalid session cookie');
    }

    if (!decoded) {
      throw new UnauthorizedError('Session cookie verification failed');
    }

    const userEntity = await this.userRepository.findOne({ where: { userId: decoded.userId } });
    if (!userEntity) {
      throw new WellKnownError({
        message: 'User not found',
        errorCode: 'USER_NOT_FOUND',
      });
    }

    request.credential = { user: userEntity };
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
        throw new UnauthorizedError('No authentication token or session cookie provided');
      }
    } else {
      const authHeader = request.headers.authorization;
      const [, token] = authHeader.split('Bearer ');

      if (token) {
        return await this.verifyByToken(request, token);
      } else {
        throw new UnauthorizedError('No ID token provided in authorization header');
      }
    }

    // const authHeader = request.headers.authorization || '';
    // const [, idToken] = authHeader.split('Bearer ');
    // const sessionCookie = request.cookies?.arena_session || '';

    // console.log(`idToken: ${idToken}`);
    // console.log(`sessionCookie: ${sessionCookie}`);

    // if (idToken) {
    //   return await this.verifyByToken(request, idToken);
    // } else if (sessionCookie) {
    //   return await this.verifyByCookie(request, sessionCookie);
    // } else {
    //   throw new UnauthorizedError('No authentication token or session cookie provided');
    // }

    // if (!idToken) {
    //   throw new UnauthorizedError('No ID token provided');
    // }

    // let decoded: DecodedIdToken | null = null;
    // try {
    //   decoded = await firebaseAdmin.auth().verifyIdToken(idToken);
    // } catch {
    //   throw new UnauthorizedError('Invalid ID token');
    // }

    // if (!decoded) {
    //   throw new UnauthorizedError('Token verification failed');
    // }

    // const userEntity = await this.userRepository.findOne({ where: { uid: decoded.uid } });
    // if (!userEntity) {
    //   // throw new UnauthorizedError('User not found');
    //   throw new WellKnownError({
    //     message: 'User not found',
    //     errorCode: 'USER_NOT_FOUND',
    //   });
    // }

    // request.credential = { user: userEntity };
    // return true;
  }
}